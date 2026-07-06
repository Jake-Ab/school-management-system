const PDFDocument = require('pdfkit');

exports.enrollStudent = async (req, res) => {
    try {
        const { student_id, course_id, semester, year } = req.body;
        const s_id = student_id || req.body.studentId;
        const c_id = course_id || req.body.courseId;

        const [result] = await req.db.query(
            'INSERT INTO enrollments (student_id, course_id, semester, year) VALUES (?, ?, ?, ?)',
            [s_id, c_id, semester, year]
        );
        res.status(201).json({ message: "Student enrolled", enrollmentId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Student is already enrolled in this course for this semester" });
        res.status(500).json({ message: "Server error" });
    }
};

exports.recordGrade = async (req, res) => {
    try {
        const { enrollment_id, grade_value, letter_grade, remarks } = req.body;
        const e_id = enrollment_id || req.body.enrollmentId;

        const [result] = await req.db.query(
            `INSERT INTO grades (enrollment_id, grade_value, letter_grade, remarks) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE grade_value=VALUES(grade_value), letter_grade=VALUES(letter_grade), remarks=VALUES(remarks)`,
            [e_id, grade_value, letter_grade, remarks]
        );
        res.json({ message: "Grade recorded successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getStudentReport = async (req, res) => {
    try {
        const { id } = req.params; // student_id
        
        // Fetch Student Info
        const [studentRows] = await req.db.query('SELECT * FROM students WHERE id = ?', [id]);
        if (studentRows.length === 0) return res.status(404).json({ message: "Student not found" });
        
        // Fetch Enrollments + Grades + Course info
        const query = `
            SELECT e.id as enrollment_id, e.semester, e.year, 
                   c.course_code, c.course_name, c.credits, 
                   g.grade_value, g.letter_grade, g.remarks
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            LEFT JOIN grades g ON e.id = g.enrollment_id
            WHERE e.student_id = ?
            ORDER BY e.year DESC, e.semester DESC
        `;
        const [academics] = await req.db.query(query, [id]);
        
        res.json({
            student: studentRows[0],
            records: academics
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.downloadStudentReportPDF = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Fetch Student Info
        const [studentRows] = await req.db.query('SELECT * FROM students WHERE id = ?', [id]);
        if (studentRows.length === 0) return res.status(404).json({ message: "Student not found" });
        const student = studentRows[0];
        
        // Fetch Records
        const query = `
            SELECT e.semester, e.year, 
                   c.course_code, c.course_name, c.credits, 
                   g.grade_value, g.letter_grade
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            LEFT JOIN grades g ON e.id = g.enrollment_id
            WHERE e.student_id = ?
            ORDER BY e.year DESC, e.semester DESC
        `;
        const [records] = await req.db.query(query, [id]);

        // Create PDF
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers for PDF download
        res.setHeader('Content-disposition', `attachment; filename=transcript_${student.student_id}.pdf`);
        res.setHeader('Content-type', 'application/pdf');

        // Pipe directly to response
        doc.pipe(res);

        // Header
        doc.fontSize(20).text('Student Academic Report', { align: 'center' });
        doc.moveDown();

        // Student Info
        doc.fontSize(12).text(`Name: ${student.first_name} ${student.last_name}`);
        doc.text(`Student ID: ${student.student_id}`);
        doc.text(`Email: ${student.email}`);
        doc.text(`Date of Birth: ${new Date(student.dob).toLocaleDateString()}`);
        doc.moveDown(2);

        // Academic Records Table
        if (records.length === 0) {
            doc.text('No academic records found.');
        } else {
            // Draw simple table headers
            const tableTop = doc.y;
            const coursesX = 50;
            const termX = 250;
            const creditsX = 350;
            const gradeX = 420;

            doc.font('Helvetica-Bold');
            doc.text('Course', coursesX, tableTop);
            doc.text('Term', termX, tableTop);
            doc.text('Credits', creditsX, tableTop);
            doc.text('Grade', gradeX, tableTop);
            
            // Draw a line
            doc.moveTo(50, doc.y + 5).lineTo(500, doc.y + 5).stroke();
            doc.font('Helvetica');

            let y = doc.y + 15;
            records.forEach(rc => {
                // If nearing bottom of page, add new page
                if (y > 700) {
                    doc.addPage();
                    y = 50;
                }
                const courseName = `${rc.course_code} - ${rc.course_name}`;
                // Constrain length if needed
                doc.text(courseName.substring(0, 30), coursesX, y);
                doc.text(`${rc.semester} ${rc.year}`, termX, y);
                doc.text(rc.credits ? rc.credits.toString() : '-', creditsX, y);
                doc.text(rc.letter_grade ? `${rc.letter_grade} (${rc.grade_value})` : 'In Progress', gradeX, y);
                
                y += 20;
            });
        }

        // Finalize
        doc.end();

    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error generating PDF report" });
        }
    }
};

exports.getAllEnrollments = async (req, res) => {
    try {
        const query = `
            SELECT e.id as enrollment_id, s.id as student_id, s.first_name, s.last_name, s.student_id as student_code,
                   c.id as course_id, c.course_code, c.course_name, e.semester, e.year,
                   g.grade_value, g.letter_grade
            FROM enrollments e
            JOIN students s ON e.student_id = s.id
            JOIN courses c ON e.course_id = c.id
            LEFT JOIN grades g ON e.id = g.enrollment_id
        `;
        const [rows] = await req.db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};