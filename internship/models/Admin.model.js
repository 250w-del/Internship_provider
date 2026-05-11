// models/Admin.model.js
const { promisePool } = require('../config/database');

class AdminModel {
    // Create a new admin
    static async create(adminData) {
        const { username, email, password, full_name } = adminData;
        const [result] = await promisePool.execute(
            'INSERT INTO admins (username, email, password, full_name) VALUES (?, ?, ?, ?)',
            [username, email, password, full_name]
        );
        return result.insertId;
    }

    // Find admin by email
    static async findByEmail(email) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM admins WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    // Find admin by username
    static async findByUsername(username) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        );
        return rows[0];
    }

    // Find admin by ID
    static async findById(adminId) {
        const [rows] = await promisePool.execute(
            'SELECT admin_id, username, email, full_name, created_at FROM admins WHERE admin_id = ?',
            [adminId]
        );
        return rows[0];
    }

    // Update admin profile
    static async update(adminId, updateData) {
        const fields = [];
        const values = [];
        
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });
        
        if (fields.length === 0) return 0;
        
        values.push(adminId);
        const [result] = await promisePool.execute(
            `UPDATE admins SET ${fields.join(', ')} WHERE admin_id = ?`,
            values
        );
        return result.affectedRows;
    }

    // Update admin password
    static async updatePassword(adminId, hashedPassword) {
        const [result] = await promisePool.execute(
            'UPDATE admins SET password = ? WHERE admin_id = ?',
            [hashedPassword, adminId]
        );
        return result.affectedRows;
    }

    // Get all admins (for super admin)
    static async getAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [rows] = await promisePool.execute(
            'SELECT admin_id, username, email, full_name, created_at FROM admins LIMIT ? OFFSET ?',
            [limit, offset]
        );
        const [countResult] = await promisePool.execute('SELECT COUNT(*) as total FROM admins');
        return { admins: rows, total: countResult[0].total };
    }

    // Delete admin
    static async delete(adminId) {
        const [result] = await promisePool.execute('DELETE FROM admins WHERE admin_id = ?', [adminId]);
        return result.affectedRows;
    }

    // Check if admin exists
    static async exists(email, username) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM admins WHERE email = ? OR username = ?',
            [email, username]
        );
        return rows.length > 0;
    }
}

module.exports = AdminModel;