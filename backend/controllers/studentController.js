exports.getAllStudents = async (req, res) => {
    try {
        const [rows] = await req.db.query('SELECT * FROM students ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const [rows] = await req.db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Student not found" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const { student_id, first_name, last_name, date_of_birth, gender, email, phone, address } = req.body;
        const [result] = await req.db.query(
            'INSERT INTO students (student_id, first_name, last_name, date_of_birth, gender, email, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [student_id, first_name, last_name, date_of_birth, gender, email, phone, address]
        );
        res.status(201).json({ message: "Student created", id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Student ID or Email already exists" });
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const { first_name, last_name, date_of_birth, gender, email, phone, address } = req.body;
        const [result] = await req.db.query(
            'UPDATE students SET first_name=?, last_name=?, date_of_birth=?, gender=?, email=?, phone=?, address=? WHERE id=?',
            [first_name, last_name, date_of_birth, gender, email, phone, address, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student updated" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const [result] = await req.db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};