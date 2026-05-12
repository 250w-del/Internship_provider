const { promisePool } = require('../config/database');

class StudentModel {
    static async create(studentData) {
        const { full_name, email, phone, trade, level, school, password } = studentData;
        const [result] = await promisePool.execute(
            'INSERT INTO students (full_name, email, phone, trade, level, school, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [full_name, email, phone || null, trade, level, school || null, password]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await promisePool.execute('SELECT * FROM students WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(studentId) {
        const [rows] = await promisePool.execute(
            'SELECT student_id, full_name, email, phone, trade, level, school, cv_file, created_at FROM students WHERE student_id = ?',
            [studentId]
        );
        return rows[0];
    }

    static async update(studentId, updateData) {
        const fields = [];
        const values = [];
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });
        if (fields.length === 0) return 0;
        values.push(studentId);
        const [result] = await promisePool.execute(
            `UPDATE students SET ${fields.join(', ')} WHERE student_id = ?`,
            values
        );
        return result.affectedRows;
    }

    static async updateCV(studentId, cvFile) {
        const [result] = await promisePool.execute(
            'UPDATE students SET cv_file = ? WHERE student_id = ?',
            [cvFile, studentId]
        );
        return result.affectedRows;
    }

    static async getAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [rows] = await promisePool.execute(
            'SELECT student_id, full_name, email, phone, trade, level, school, created_at FROM students LIMIT ? OFFSET ?',
            [limit, offset]
        );
        const [countResult] = await promisePool.execute('SELECT COUNT(*) as total FROM students');
        return { students: rows, total: countResult[0].total };
    }

    static async delete(studentId) {
        const [result] = await promisePool.execute('DELETE FROM students WHERE student_id = ?', [studentId]);
        return result.affectedRows;
    }
}

module.exports = StudentModel;
