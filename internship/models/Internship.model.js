const { promisePool } = require('../config/database');

class InternshipModel {
    static async create(internshipData) {
        const { company_id, title, description, requirements, trade, level_required, location, duration, deadline, status } = internshipData;
        const [result] = await promisePool.execute(
            'INSERT INTO internships (company_id, title, description, requirements, trade, level_required, location, duration, deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [company_id, title, description, requirements, trade, level_required || 'Any', location, duration, deadline, status || 'pending']
        );
        return result.insertId;
    }

    static async findById(internshipId) {
        const [rows] = await promisePool.execute(
            `SELECT i.*, c.company_name, c.location as company_location 
             FROM internships i 
             JOIN companies c ON i.company_id = c.company_id 
             WHERE i.internship_id = ?`,
            [internshipId]
        );
        return rows[0];
    }

    static async findByCompany(companyId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [rows] = await promisePool.execute(
            `SELECT i.*, 
                    (SELECT COUNT(*) FROM applications WHERE internship_id = i.internship_id) as applications_count
             FROM internships i 
             WHERE i.company_id = ? 
             ORDER BY i.created_at DESC 
             LIMIT ? OFFSET ?`,
            [companyId, limit, offset]
        );
        const [countResult] = await promisePool.execute(
            'SELECT COUNT(*) as total FROM internships WHERE company_id = ?',
            [companyId]
        );
        return { internships: rows, total: countResult[0].total };
    }

    static async getAllAvailable(studentTrade = null, studentLevel = null, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        let query = `SELECT i.*, c.company_name, c.location as company_location 
                     FROM internships i 
                     JOIN companies c ON i.company_id = c.company_id 
                     WHERE i.status = 'approved' AND i.deadline >= CURDATE()`;
        const params = [];

        if (studentTrade) {
            query += ` AND i.trade = ?`;
            params.push(studentTrade);
        }

        if (studentLevel) {
            query += ` AND (i.level_required = ? OR i.level_required = 'Any')`;
            params.push(studentLevel);
        }

        query += ` ORDER BY i.deadline ASC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [rows] = await promisePool.execute(query, params);

        let countQuery = `SELECT COUNT(*) as total FROM internships i WHERE i.status = 'approved' AND i.deadline >= CURDATE()`;
        const countParams = [];
        if (studentTrade) {
            countQuery += ` AND i.trade = ?`;
            countParams.push(studentTrade);
        }
        if (studentLevel) {
            countQuery += ` AND (i.level_required = ? OR i.level_required = 'Any')`;
            countParams.push(studentLevel);
        }

        const [countResult] = await promisePool.execute(countQuery, countParams);
        return { internships: rows, total: countResult[0].total };
    }

    static async getPublicInternships(trade = null, level = null, page = 1, limit = 12) {
        const offset = (page - 1) * limit;
        let query = `SELECT i.*, c.company_name, c.location as company_location 
                     FROM internships i 
                     JOIN companies c ON i.company_id = c.company_id 
                     WHERE i.status = 'approved' AND i.deadline >= CURDATE()`;
        const params = [];

        if (trade) {
            query += ` AND i.trade = ?`;
            params.push(trade);
        }
        if (level) {
            query += ` AND (i.level_required = ? OR i.level_required = 'Any')`;
            params.push(level);
        }

        query += ` ORDER BY i.created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [rows] = await promisePool.execute(query, params);

        let countQuery = `SELECT COUNT(*) as total FROM internships i WHERE i.status = 'approved' AND i.deadline >= CURDATE()`;
        const countParams = [];
        if (trade) { countQuery += ` AND i.trade = ?`; countParams.push(trade); }
        if (level) { countQuery += ` AND (i.level_required = ? OR i.level_required = 'Any')`; countParams.push(level); }

        const [countResult] = await promisePool.execute(countQuery, countParams);
        return { internships: rows, total: countResult[0].total };
    }

    static async update(internshipId, updateData) {
        const fields = [];
        const values = [];
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });
        if (fields.length === 0) return 0;
        values.push(internshipId);
        const [result] = await promisePool.execute(
            `UPDATE internships SET ${fields.join(', ')} WHERE internship_id = ?`,
            values
        );
        return result.affectedRows;
    }

    static async updateStatus(internshipId, status) {
        const [result] = await promisePool.execute(
            'UPDATE internships SET status = ? WHERE internship_id = ?',
            [status, internshipId]
        );
        return result.affectedRows;
    }

    static async delete(internshipId) {
        const [result] = await promisePool.execute('DELETE FROM internships WHERE internship_id = ?', [internshipId]);
        return result.affectedRows;
    }

    static async getPending(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [rows] = await promisePool.execute(
            `SELECT i.*, c.company_name 
             FROM internships i 
             JOIN companies c ON i.company_id = c.company_id 
             WHERE i.status = 'pending' 
             ORDER BY i.created_at ASC 
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        const [countResult] = await promisePool.execute(
            'SELECT COUNT(*) as total FROM internships WHERE status = "pending"'
        );
        return { internships: rows, total: countResult[0].total };
    }

    static async getStats() {
        const [result] = await promisePool.execute(
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
             FROM internships`
        );
        return result[0];
    }
}

module.exports = InternshipModel;
