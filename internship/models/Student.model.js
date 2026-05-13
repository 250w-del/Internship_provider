const { promisePool } = require('../config/database');
const q = (sql, params) => promisePool.query(sql, params);
const e = (sql, params) => promisePool.execute(sql, params);

class StudentModel {
    static async create(data) {
        const { full_name, email, phone, trade, level, school, password } = data;
        const [r] = await e(
            'INSERT INTO students (full_name,email,phone,trade,level,school,password) VALUES (?,?,?,?,?,?,?)',
            [full_name, email, phone||null, trade, level, school||null, password]
        );
        return r.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await e('SELECT * FROM students WHERE email=?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await e(
            'SELECT student_id,full_name,email,phone,trade,level,school,cv_file,created_at FROM students WHERE student_id=?',
            [id]
        );
        return rows[0];
    }

    static async update(id, data) {
        const fields = [], values = [];
        Object.keys(data).forEach(k => { if (data[k]!==undefined) { fields.push(`${k}=?`); values.push(data[k]); } });
        if (!fields.length) return 0;
        values.push(id);
        const [r] = await e(`UPDATE students SET ${fields.join(',')} WHERE student_id=?`, values);
        return r.affectedRows;
    }

    static async updateCV(id, cvFile) {
        const [r] = await e('UPDATE students SET cv_file=? WHERE student_id=?', [cvFile, id]);
        return r.affectedRows;
    }

    static async getAll(page=1, limit=10) {
        const offset = (page-1)*limit;
        const [rows] = await q(
            `SELECT student_id,full_name,email,phone,trade,level,school,created_at FROM students LIMIT ${+limit} OFFSET ${+offset}`,
            []
        );
        const [cnt] = await e('SELECT COUNT(*) as total FROM students');
        return { students: rows, total: cnt[0].total };
    }

    static async delete(id) {
        const [r] = await e('DELETE FROM students WHERE student_id=?', [id]);
        return r.affectedRows;
    }
}

module.exports = StudentModel;
