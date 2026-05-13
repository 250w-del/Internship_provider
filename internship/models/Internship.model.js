const { promisePool } = require('../config/database');

// Helper: use query() for LIMIT/OFFSET (MySQL 8 prepared stmt compatibility)
const q = (sql, params) => promisePool.query(sql, params);
const e = (sql, params) => promisePool.execute(sql, params);

class InternshipModel {
    static async create(data) {
        const { company_id, title, description, requirements, trade, level_required, location, duration, deadline, status } = data;
        const [result] = await e(
            'INSERT INTO internships (company_id,title,description,requirements,trade,level_required,location,duration,deadline,status) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [company_id, title, description||null, requirements||null, trade, level_required||'Any', location||null, duration||null, deadline, status||'pending']
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await e(
            `SELECT i.*, c.company_name, c.location as company_location, c.phone as company_phone
             FROM internships i JOIN companies c ON i.company_id=c.company_id
             WHERE i.internship_id=?`, [id]
        );
        return rows[0];
    }

    static async findByCompany(companyId, page=1, limit=10) {
        const offset = (page-1)*limit;
        const [rows] = await q(
            `SELECT i.*, (SELECT COUNT(*) FROM applications WHERE internship_id=i.internship_id) as applications_count
             FROM internships i WHERE i.company_id=? ORDER BY i.created_at DESC LIMIT ${+limit} OFFSET ${+offset}`,
            [companyId]
        );
        const [cnt] = await e('SELECT COUNT(*) as total FROM internships WHERE company_id=?', [companyId]);
        return { internships: rows, total: cnt[0].total };
    }

    static async getAllAvailable(studentTrade=null, studentLevel=null, page=1, limit=10) {
        const offset = (page-1)*limit;
        let sql = `SELECT i.*, c.company_name, c.location as company_location, c.phone as company_phone
                   FROM internships i JOIN companies c ON i.company_id=c.company_id
                   WHERE i.status='approved' AND i.deadline>=CURDATE()`;
        const params = [];
        if (studentTrade) { sql += ` AND i.trade=?`; params.push(studentTrade); }
        if (studentLevel) { sql += ` AND (i.level_required=? OR i.level_required='Any')`; params.push(studentLevel); }
        sql += ` ORDER BY i.deadline ASC LIMIT ${+limit} OFFSET ${+offset}`;
        const [rows] = await q(sql, params);

        let csql = `SELECT COUNT(*) as total FROM internships i WHERE i.status='approved' AND i.deadline>=CURDATE()`;
        const cp = [];
        if (studentTrade) { csql += ` AND i.trade=?`; cp.push(studentTrade); }
        if (studentLevel) { csql += ` AND (i.level_required=? OR i.level_required='Any')`; cp.push(studentLevel); }
        const [cnt] = await q(csql, cp);
        return { internships: rows, total: cnt[0].total };
    }

    static async getPublicInternships(trade=null, level=null, page=1, limit=12) {
        const offset = (page-1)*limit;
        let sql = `SELECT i.*, c.company_name, c.location as company_location, c.phone as company_phone
                   FROM internships i JOIN companies c ON i.company_id=c.company_id
                   WHERE i.status='approved' AND i.deadline>=CURDATE()`;
        const params = [];
        if (trade) { sql += ` AND i.trade=?`; params.push(trade); }
        if (level) { sql += ` AND (i.level_required=? OR i.level_required='Any')`; params.push(level); }
        sql += ` ORDER BY i.created_at DESC LIMIT ${+limit} OFFSET ${+offset}`;
        const [rows] = await q(sql, params);

        let csql = `SELECT COUNT(*) as total FROM internships i WHERE i.status='approved' AND i.deadline>=CURDATE()`;
        const cp = [];
        if (trade) { csql += ` AND i.trade=?`; cp.push(trade); }
        if (level) { csql += ` AND (i.level_required=? OR i.level_required='Any')`; cp.push(level); }
        const [cnt] = await q(csql, cp);
        return { internships: rows, total: cnt[0].total };
    }

    static async update(id, data) {
        const fields = [], values = [];
        Object.keys(data).forEach(k => { if (data[k]!==undefined) { fields.push(`${k}=?`); values.push(data[k]); } });
        if (!fields.length) return 0;
        values.push(id);
        const [r] = await e(`UPDATE internships SET ${fields.join(',')} WHERE internship_id=?`, values);
        return r.affectedRows;
    }

    static async updateStatus(id, status) {
        const [r] = await e('UPDATE internships SET status=? WHERE internship_id=?', [status, id]);
        return r.affectedRows;
    }

    static async delete(id) {
        const [r] = await e('DELETE FROM internships WHERE internship_id=?', [id]);
        return r.affectedRows;
    }

    static async getPending(page=1, limit=10) {
        const offset = (page-1)*limit;
        const [rows] = await q(
            `SELECT i.*, c.company_name, c.phone as company_phone
             FROM internships i JOIN companies c ON i.company_id=c.company_id
             WHERE i.status='pending' ORDER BY i.created_at ASC LIMIT ${+limit} OFFSET ${+offset}`,
            []
        );
        const [cnt] = await e('SELECT COUNT(*) as total FROM internships WHERE status="pending"');
        return { internships: rows, total: cnt[0].total };
    }

    static async getStats() {
        const [r] = await e(
            `SELECT COUNT(*) as total,
             SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
             SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) as approved,
             SUM(CASE WHEN status='rejected' THEN 1 ELSE 0 END) as rejected
             FROM internships`
        );
        return r[0];
    }
}

module.exports = InternshipModel;
