-- Internship Provider Database Schema
-- Rwanda TVET Board Internship Management System

CREATE DATABASE IF NOT EXISTS internship_provider;
USE internship_provider;

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    location VARCHAR(255),
    description TEXT,Failed to load resource: the server responded with a status of 500 (Internal Server Error)
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table (with trade and level)
CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    trade VARCHAR(100) NOT NULL,
    level ENUM('L3', 'L4', 'L5') NOT NULL,
    school VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    cv_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Internships table (with trade and level requirements)
CREATE TABLE IF NOT EXISTS internships (
    internship_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    trade VARCHAR(100) NOT NULL,
    level_required ENUM('L3', 'L4', 'L5', 'Any') DEFAULT 'Any',
    location VARCHAR(255),
    duration VARCHAR(100),
    deadline DATE,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    internship_id INT NOT NULL,
    notes TEXT,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (internship_id) REFERENCES internships(internship_id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (student_id, internship_id)
);

-- Insert default admin (password: Admin@1234)
INSERT INTO admins (username, email, password, full_name) VALUES 
('admin', 'admin@internshipprovider.rw', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator')
ON DUPLICATE KEY UPDATE admin_id = admin_id;

-- Insert admin as company too (for admin login via company portal)
INSERT INTO companies (company_name, email, phone, location, description, password, is_admin) VALUES 
('Rwanda TVET Board', 'admin@internshipprovider.rw', '+250788000000', 'Kigali, Rwanda', 'Rwanda Technical and Vocational Education and Training Board', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE)
ON DUPLICATE KEY UPDATE company_id = company_id;

-- Sample approved internships for each trade
INSERT INTO internships (company_id, title, description, requirements, trade, level_required, location, duration, deadline, status) VALUES
(1, 'Network Infrastructure Technician', 'Install and maintain network infrastructure for our offices across Rwanda', 'Knowledge of TCP/IP, LAN/WAN, Cisco equipment', 'NIT', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Network Systems Administrator', 'Manage and optimize network systems and security protocols', 'Advanced networking, firewall management, CCNA preferred', 'NIT', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Senior Network Engineer Intern', 'Design and implement enterprise network solutions', 'CCNP level knowledge, network design experience', 'NIT', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Software Developer Intern', 'Develop web and mobile applications for our clients', 'HTML, CSS, JavaScript, basic programming skills', 'SOD', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Full Stack Developer Intern', 'Build full-stack web applications using modern frameworks', 'React, Node.js, databases, REST APIs', 'SOD', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Senior Software Engineer Intern', 'Lead development of complex software systems', 'Advanced programming, system design, team leadership', 'SOD', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Finance & Banking Operations Intern', 'Support daily banking operations and customer service', 'Basic accounting, customer service skills', 'FBO', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Financial Analyst Intern', 'Analyze financial data and prepare reports', 'Financial analysis, Excel, accounting principles', 'FBO', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Computer Systems Analyst Intern', 'Analyze and improve computer systems efficiency', 'Systems analysis, database management, IT skills', 'CSA', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'IT Systems Consultant Intern', 'Consult on IT systems implementation and optimization', 'Advanced systems analysis, project management', 'CSA', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Electronics Technician Intern', 'Repair and maintain electronic equipment', 'Basic electronics, circuit boards, soldering', 'ETE', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Electrical & Electronics Engineer Intern', 'Design and test electronic systems', 'Advanced electronics, PCB design, testing equipment', 'ETE', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Business Development Intern', 'Support business growth strategies and market research', 'Business communication, market analysis basics', 'BDC', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Business Development Manager Intern', 'Lead business development initiatives and partnerships', 'Strategic planning, negotiation, advanced business skills', 'BDC', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Electrician Intern', 'Install and maintain electrical systems in buildings', 'Basic electrical wiring, safety standards', 'Electricity', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Electrical Installation Technician', 'Handle complex electrical installations and maintenance', 'Advanced electrical systems, industrial wiring', 'Electricity', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Tourism & Hospitality Intern', 'Assist in tourism operations and guest services', 'Customer service, communication, tourism basics', 'Tourism', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),
(1, 'Tourism Operations Coordinator', 'Coordinate tourism packages and client relations', 'Tour planning, hospitality management, languages', 'Tourism', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved');
