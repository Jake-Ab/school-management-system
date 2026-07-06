exports.getAllCourses = async (req, res) => {
    try {
        const [rows] = await req.db.query('SELECT * FROM courses ORDER BY course_name ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const [rows] = await req.db.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Course not found" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const { course_code, course_name, credits, description } = req.body;
        const [result] = await req.db.query(
            'INSERT INTO courses (course_code, course_name, credits, description) VALUES (?, ?, ?, ?)',
            [course_code, course_name, credits, description]
        );
        res.status(201).json({ message: "Course created", id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Course Code already exists" });
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { course_name, credits, description } = req.body;
        const [result] = await req.db.query(
            'UPDATE courses SET course_name=?, credits=?, description=? WHERE id=?',
            [course_name, credits, description, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Course not found" });
        res.json({ message: "Course updated" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const [result] = await req.db.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Course not found" });
        res.json({ message: "Course deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};