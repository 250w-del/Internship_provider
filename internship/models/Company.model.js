const { promisePool } = require('../config/database');

class CompanyModel {
    static async create(companyData) {
        const { company_name, email, phone, location, description, password } = companyData;
        const [result] = await promisePool.execute(
            'INSERT INTO companies (company_name, email, phone, location, description, password) VALUES (?, ?, ?, ?, ?, ?)',
            [company_name, email, phone, location, description || null, password]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await promisePool.execute('SELECT * FROM companies WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(companyId) {
        const [rows] = await promisePool.execute(
            'SELECT company_id, company_name, email, phone, location, description, is_admin, created_at FROM companies WHERE company_id = ?',
            [companyId]
        );
        return rows[0];
    }

    static async update(companyId, updateData) {
        const fields = [];
        const values = [];
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });
        if (fields.length === 0) return 0;
        values.push(companyId);
        const [result] = await promisePool.execute(
            `UPDATE companies SET ${fields.join(', ')} WHERE company_id = ?`,
            values
        );
        return result.affectedRows;
    }

    static async getAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [rows] = await promisePool.execute(
            'SELECT company_id, company_name, email, phone, location, is_admin, created_at FROM companies LIMIT ? OFFSET ?',
            [limit, offset]
        );
        const [countResult] = await promisePool.execute('SELECT COUNT(*) as total FROM companies');
        return { companies: rows, total: countResult[0].total };
    }

    static async delete(companyId) {
        const [result] = await promisePool.execute('DELETE FROM companies WHERE company_id = ?', [companyId]);
        return result.affectedRows;
    }
}

module.exports = CompanyModel;
