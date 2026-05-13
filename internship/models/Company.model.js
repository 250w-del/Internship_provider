const { promisePool } = require('../config/database');
const q = (sql, params) => promisePool.query(sql, params);
const e = (sql, params) => promisePool.execute(sql, params);

class CompanyModel {
    static async create(data) {
        const { company_name, email, phone, location, description, password } = data;
        const [r] = await e(
            'INSERT INTO companies (company_name,email,phone,location,description,password) VALUES (?,?,?,?,?,?)',
            [company_name, email, phone||null, location||null, description||null, password]
        );
        return r.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await e('SELECT * FROM companies WHERE email=?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await e(
            'SELECT company_id,company_name,email,phone,location,description,is_admin,created_at FROM companies WHERE company_id=?',
            [id]
        );
        return rows[0];
    }

    static async update(id, data) {
        const fields = [], values = [];
        Object.keys(data).forEach(k => { if (data[k]!==undefined) { fields.push(`${k}=?`); values.push(data[k]); } });
        if (!fields.length) return 0;
        values.push(id);
        const [r] = await e(`UPDATE companies SET ${fields.join(',')} WHERE company_id=?`, values);
        return r.affectedRows;
    }

    static async getAll(page=1, limit=10) {
        const offset = (page-1)*limit;
        const [rows] = await q(
            `SELECT company_id,company_name,email,phone,location,is_admin,created_at FROM companies LIMIT ${+limit} OFFSET ${+offset}`,
            []
        );
        const [cnt] = await e('SELECT COUNT(*) as total FROM companies');
        return { companies: rows, total: cnt[0].total };
    }

    static async delete(id) {
        const [r] = await e('DELETE FROM companies WHERE company_id=?', [id]);
        return r.affectedRows;
    }
}

module.exports = CompanyModel;
