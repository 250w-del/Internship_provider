const { promisePool } = require('../config/database');

class ApplicationModel {
    static async create(applicationData) {
        const { student_id, internship_id, notes } = applicationData;
        const [result] = await promisePool.execute(
            'INSERT INTO applications (student_id, internship_id, notes) VALUES (?, ?, ?)',
            [student_id, internship_id, notes || null]
        );
        return result.insertId;
    }

    static async findByStudent(studentId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [rows] = await promisePool.execute(
            `SELECT a.*, i.title, i.description, i.deadline, c.company_name 
             FROM applications a 
             JOIN internships i ON a.internship_id = i.internship_id 
             JOIN companies c ON i.company_id = c.company_id 
             WHERE a.student_id = ? 
             ORDER BY a.application_date DESC 
             LIMIT ? OFFSET ?`,
            [studentId, limit, offset]
        );
        const [countResult] = await promisePool.execute(
            'SELECT COUNT(*) as total FROM applications WHERE student_id = ?',
            [studentId]
        );
        return { applications: rows, total: countResult[0].total };
    }

    static async findByInternship(internshipId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [rows] = await promisePool.execute(
            `SELECT a.*, s.full_name as student_name, s.email, s.phone, s.trade, s.level, s.school, s.cv_file 
             FROM applications a 
             JOIN students s ON a.student_id = s.student_id 
             WHERE a.internship_id = ? 
             ORDER BY a.application_date DESC 
             LIMIT ? OFFSET ?`,
            [internshipId, limit, offset]
        );
        const [countResult] = await promisePool.execute(
            'SELECT COUNT(*) as total FROM applications WHERE internship_id = ?',
            [internshipId]
        );
        return { applications: rows, total: countResult[0].total };
    }

    static async updateStatus(applicationId, status) {
        const [result] = await promisePool.execute(
            'UPDATE applications SET status = ? WHERE application_id = ?',
            [status, applicationId]
        );
        return result.affectedRows;
    }

    static async checkExisting(studentId, internshipId) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM applications WHERE student_id = ? AND internship_id = ?',
            [studentId, internshipId]
        );
        return rows[0];
    }

    static async getStats() {
        const [result] = await promisePool.execute(
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
             FROM applications`
        );
        return result[0];
    }

    static async getRecentPlacements(limit = 10) {
        const [rows] = await promisePool.execute(
            `SELECT a.*, s.full_name as student_name, i.title 
             FROM applications a 
             JOIN students s ON a.student_id = s.student_id 
             JOIN internships i ON a.internship_id = i.internship_id 
             WHERE a.status = 'accepted' 
             ORDER BY a.application_date DESC 
             LIMIT ?`,
            [limit]
        );
        return rows;
    }
}

module.exports = ApplicationModel;