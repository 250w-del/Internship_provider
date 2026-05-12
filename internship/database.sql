-- ============================================================
-- Internship Provider — Rwanda TVET Board
-- Database Schema + Seed Data
-- ============================================================

CREATE DATABASE IF NOT EXISTS internship_provider;
USE internship_provider;

-- ── Tables ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admins (
    admin_id    INT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(100)  NOT NULL UNIQUE,
    email       VARCHAR(255)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    full_name   VARCHAR(255)  NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS companies (
    company_id   INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255)  NOT NULL,
    email        VARCHAR(255)  NOT NULL UNIQUE,
    phone        VARCHAR(20),
    location     VARCHAR(255),
    description  TEXT,
    password     VARCHAR(255)  NOT NULL,
    is_admin     BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    student_id  INT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(255)          NOT NULL,
    email       VARCHAR(255)          NOT NULL UNIQUE,
    phone       VARCHAR(20),
    trade       VARCHAR(100)          NOT NULL,
    level       ENUM('L3','L4','L5')  NOT NULL,
    school      VARCHAR(255),
    password    VARCHAR(255)          NOT NULL,
    cv_file     VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internships (
    internship_id  INT AUTO_INCREMENT PRIMARY KEY,
    company_id     INT NOT NULL,
    title          VARCHAR(255) NOT NULL,
    description    TEXT,
    requirements   TEXT,
    trade          VARCHAR(100) NOT NULL,
    level_required ENUM('L3','L4','L5','Any') DEFAULT 'Any',
    location       VARCHAR(255),
    duration       VARCHAR(100),
    deadline       DATE,
    status         ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
    application_id   INT AUTO_INCREMENT PRIMARY KEY,
    student_id       INT NOT NULL,
    internship_id    INT NOT NULL,
    notes            TEXT,
    status           ENUM('pending','accepted','rejected') DEFAULT 'pending',
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id)    REFERENCES students(student_id)    ON DELETE CASCADE,
    FOREIGN KEY (internship_id) REFERENCES internships(internship_id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (student_id, internship_id)
);

-- ── Admin company account (password: Admin@1234) ─────────────
INSERT INTO companies (company_name, email, phone, location, description, password, is_admin)
VALUES ('Rwanda TVET Board', 'admin@internshipprovider.rw', '+250788000000', 'Kigali, Rwanda',
        'Rwanda Technical and Vocational Education and Training Board — official internship placement authority.',
        '$2a$10$lUC/WJ7nVUZoyTjg9rLSm.6OcDYaWhAef7GKL.0cOBcdHXUnwKNBa', TRUE)
ON DUPLICATE KEY UPDATE company_id = company_id;

-- ── Sample partner companies ─────────────────────────────────
INSERT INTO companies (company_name, email, phone, location, description, password, is_admin) VALUES
('MTN Rwanda',          'hr@mtn.rw',          '+250788100000', 'Kigali',       'Leading telecom company in Rwanda.',                                '$2a$10$lUC/WJ7nVUZoyTjg9rLSm.6OcDYaWhAef7GKL.0cOBcdHXUnwKNBa', FALSE),
('Bank of Kigali',      'hr@bk.rw',           '+250788200000', 'Kigali',       'Rwanda\'s largest commercial bank.',                                '$2a$10$lUC/WJ7nVUZoyTjg9rLSm.6OcDYaWhAef7GKL.0cOBcdHXUnwKNBa', FALSE),
('Kigali Heights',      'hr@kigaliheights.rw', '+250788300000', 'Kigali',       'Premier real estate and construction company.',                     '$2a$10$lUC/WJ7nVUZoyTjg9rLSm.6OcDYaWhAef7GKL.0cOBcdHXUnwKNBa', FALSE),
('RwandAir',            'hr@rwandair.com',     '+250788400000', 'Kigali',       'Rwanda\'s national airline.',                                       '$2a$10$lUC/WJ7nVUZoyTjg9rLSm.6OcDYaWhAef7GKL.0cOBcdHXUnwKNBa', FALSE),
('Marriott Kigali',     'hr@marriott.rw',      '+250788500000', 'Kigali',       'Five-star hotel and hospitality group.',                            '$2a$10$lUC/WJ7nVUZoyTjg9rLSm.6OcDYaWhAef7GKL.0cOBcdHXUnwKNBa', FALSE),
('Andela Rwanda',       'hr@andela.rw',        '+250788600000', 'Kigali',       'Global tech talent company.',                                       '$2a$10$lUC/WJ7nVUZoyTjg9rLSm.6OcDYaWhAef7GKL.0cOBcdHXUnwKNBa', FALSE),
('Rwanda Broadcasting', 'hr@rba.rw',           '+250788700000', 'Kigali',       'National public broadcaster — TV, radio and digital media.',        '$2a$10$lUC/WJ7nVUZoyTjg9rLSm.6OcDYaWhAef7GKL.0cOBcdHXUnwKNBa', FALSE),
('Volkswagen Rwanda',   'hr@vw.rw',            '+250788800000', 'Kigali',       'Automotive assembly and service centre.',                           '$2a$10$lUC/WJ7nVUZoyTjg9rLSm.6OcDYaWhAef7GKL.0cOBcdHXUnwKNBa', FALSE),
('Inzuki Designs',      'hr@inzuki.rw',        '+250788900000', 'Kigali',       'Rwandan fashion and textile design house.',                         '$2a$10$lUC/WJ7nVUZoyTjg9rLSm.6OcDYaWhAef7GKL.0cOBcdHXUnwKNBa', FALSE),
('REG Rwanda',          'hr@reg.rw',           '+250789000000', 'Kigali',       'Rwanda Energy Group — electricity generation and distribution.',    '$2a$10$lUC/WJ7nVUZoyTjg9rLSm.6OcDYaWhAef7GKL.0cOBcdHXUnwKNBa', FALSE)
ON DUPLICATE KEY UPDATE company_id = company_id;

-- ── Internship posts for every trade × every level ───────────
-- Using DATE_ADD so deadlines are always in the future

INSERT INTO internships (company_id, title, description, requirements, trade, level_required, location, duration, deadline, status) VALUES

-- ── NIT: Networking and Internet Technology ──────────────────
(2, 'Network Support Technician Intern',
 'Assist in installing and maintaining LAN/WAN networks across MTN offices.',
 'Basic knowledge of TCP/IP, network cabling, and router configuration.',
 'NIT', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),

(2, 'Network Administrator Intern',
 'Manage and monitor network infrastructure, configure switches and firewalls.',
 'CCNA or equivalent, experience with Cisco IOS, firewall management.',
 'NIT', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),

(2, 'Senior Network Engineer Intern',
 'Design and implement enterprise-grade network solutions for large-scale deployments.',
 'CCNP level, network design, BGP/OSPF routing protocols, SD-WAN experience.',
 'NIT', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),

-- ── SOD: Software Development ────────────────────────────────
(7, 'Junior Web Developer Intern',
 'Build and maintain web pages using HTML, CSS and JavaScript for client projects.',
 'HTML, CSS, JavaScript basics, understanding of responsive design.',
 'SOD', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 65 DAY), 'approved'),

(7, 'Full Stack Developer Intern',
 'Develop full-stack web applications using React and Node.js with REST APIs.',
 'React, Node.js, MySQL or MongoDB, REST API design, Git.',
 'SOD', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 65 DAY), 'approved'),

(7, 'Software Engineer Intern',
 'Lead development of complex software systems, mentor junior developers.',
 'Advanced JavaScript/Python, system design, microservices, CI/CD pipelines.',
 'SOD', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 65 DAY), 'approved'),

-- ── BDC: Building and Construction ──────────────────────────
(4, 'Construction Site Assistant Intern',
 'Support site supervisors with daily construction activities and material tracking.',
 'Basic knowledge of construction materials, safety standards, site operations.',
 'BDC', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 70 DAY), 'approved'),

(4, 'Building Technician Intern',
 'Assist in reading architectural drawings, supervising masonry and plumbing works.',
 'AutoCAD basics, construction drawings, masonry and plumbing knowledge.',
 'BDC', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 70 DAY), 'approved'),

(4, 'Civil Engineering Intern',
 'Manage construction projects, prepare BOQs and ensure quality compliance.',
 'Structural analysis, project management, AutoCAD, BOQ preparation.',
 'BDC', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 70 DAY), 'approved'),

-- ── CSA: Computer System and Architecture ────────────────────
(1, 'IT Support Technician Intern',
 'Provide hardware and software support, troubleshoot computer systems.',
 'PC assembly, OS installation, basic networking, troubleshooting skills.',
 'CSA', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 55 DAY), 'approved'),

(1, 'Systems Analyst Intern',
 'Analyse existing IT systems, recommend improvements and document processes.',
 'Systems analysis, database management, IT infrastructure knowledge.',
 'CSA', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 55 DAY), 'approved'),

(1, 'IT Infrastructure Architect Intern',
 'Design scalable IT infrastructure solutions for enterprise environments.',
 'Cloud platforms (AWS/Azure), virtualisation, enterprise architecture.',
 'CSA', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 55 DAY), 'approved'),

-- ── FBO: Food and Beverage Operations ────────────────────────
(6, 'Food Service Assistant Intern',
 'Assist in food preparation, table service and maintaining kitchen hygiene standards.',
 'Basic food hygiene certificate, customer service skills, teamwork.',
 'FBO', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 75 DAY), 'approved'),

(6, 'Restaurant Supervisor Intern',
 'Supervise food and beverage service, manage reservations and guest satisfaction.',
 'F&B service management, HACCP knowledge, team leadership.',
 'FBO', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 75 DAY), 'approved'),

(6, 'F&B Operations Manager Intern',
 'Oversee full restaurant operations, menu planning, cost control and staff training.',
 'Advanced F&B management, budgeting, menu engineering, staff supervision.',
 'FBO', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 75 DAY), 'approved'),

-- ── MMP: Multimedia and Production ───────────────────────────
(8, 'Media Production Assistant Intern',
 'Assist in video shooting, basic editing and social media content creation.',
 'Basic video editing (CapCut/iMovie), photography, social media skills.',
 'MMP', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 80 DAY), 'approved'),

(8, 'Graphic Designer & Video Editor Intern',
 'Create visual content, edit promotional videos and design marketing materials.',
 'Adobe Premiere Pro, Photoshop, Illustrator, motion graphics basics.',
 'MMP', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 80 DAY), 'approved'),

(8, 'Creative Director Intern',
 'Lead multimedia campaigns, direct video productions and manage creative teams.',
 'Advanced Adobe Suite, 3D animation, brand strategy, team leadership.',
 'MMP', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 80 DAY), 'approved'),

-- ── ACC: Accounting ───────────────────────────────────────────
(3, 'Accounts Assistant Intern',
 'Support daily bookkeeping, data entry and preparation of financial records.',
 'Basic accounting principles, Excel, data entry accuracy.',
 'ACC', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),

(3, 'Financial Analyst Intern',
 'Analyse financial statements, prepare reports and assist in budget planning.',
 'Financial analysis, Excel advanced, accounting software (QuickBooks/Sage).',
 'ACC', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),

(3, 'Senior Accountant Intern',
 'Manage full accounting cycle, tax compliance, auditing and financial reporting.',
 'IFRS knowledge, tax law, auditing standards, advanced Excel, CPA progress.',
 'ACC', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),

-- ── ETE: Electronics and Telecommunication ───────────────────
(2, 'Electronics Technician Intern',
 'Repair and maintain electronic equipment, circuit boards and consumer devices.',
 'Basic electronics, soldering, circuit board repair, multimeter use.',
 'ETE', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 65 DAY), 'approved'),

(2, 'Telecom Engineer Intern',
 'Install and maintain telecom infrastructure including BTS, fibre and microwave links.',
 'RF engineering, fibre optics, BTS maintenance, telecom protocols.',
 'ETE', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 65 DAY), 'approved'),

(2, 'Senior Telecom Systems Engineer Intern',
 'Design and optimise telecom networks, manage large-scale infrastructure projects.',
 'Advanced RF, 4G/5G networks, network planning tools, project management.',
 'ETE', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 65 DAY), 'approved'),

-- ── MAT: Mechanics Automobile Technology ─────────────────────
(9, 'Auto Mechanic Intern',
 'Perform routine vehicle maintenance, oil changes, tyre rotation and basic repairs.',
 'Basic vehicle mechanics, hand tools, safety procedures.',
 'MAT', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 70 DAY), 'approved'),

(9, 'Automotive Technician Intern',
 'Diagnose and repair complex vehicle faults using diagnostic equipment.',
 'OBD diagnostics, engine overhaul, electrical systems, brake systems.',
 'MAT', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 70 DAY), 'approved'),

(9, 'Senior Automotive Engineer Intern',
 'Lead vehicle inspection programmes, manage workshop operations and quality control.',
 'Advanced diagnostics, workshop management, EV systems, team supervision.',
 'MAT', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 70 DAY), 'approved'),

-- ── FST: Fashion and Garment Technology ──────────────────────
(10, 'Sewing & Tailoring Intern',
 'Assist in garment production, cutting, sewing and quality finishing.',
 'Basic sewing machine operation, pattern cutting, fabric knowledge.',
 'FST', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 75 DAY), 'approved'),

(10, 'Fashion Designer Intern',
 'Create original garment designs, develop patterns and oversee sample production.',
 'Fashion design, pattern making, Adobe Illustrator for fashion, trend analysis.',
 'FST', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 75 DAY), 'approved'),

(10, 'Textile Production Manager Intern',
 'Manage garment production lines, quality control and supplier relationships.',
 'Production management, quality standards, costing, team leadership.',
 'FST', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 75 DAY), 'approved'),

-- ── ELT: Electricity ─────────────────────────────────────────
(11, 'Electrical Installation Intern',
 'Assist in domestic and commercial electrical wiring and installation.',
 'Basic electrical wiring, safety regulations, reading electrical diagrams.',
 'ELT', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),

(11, 'Electrical Technician Intern',
 'Install and maintain industrial electrical systems, panels and control circuits.',
 'Industrial wiring, PLC basics, electrical panel installation, safety standards.',
 'ELT', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),

(11, 'Power Systems Engineer Intern',
 'Design and manage power distribution systems, renewable energy installations.',
 'Power systems design, solar PV, HV/LV systems, AutoCAD Electrical.',
 'ELT', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'approved'),

-- ── TRH: Tourism and Hospitality ─────────────────────────────
(6, 'Front Desk & Guest Services Intern',
 'Welcome guests, manage check-in/check-out and handle guest inquiries.',
 'Communication skills, customer service, basic computer skills, English.',
 'TRH', 'L3', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 80 DAY), 'approved'),

(6, 'Tour Operations Coordinator Intern',
 'Plan and coordinate tour packages, liaise with clients and transport providers.',
 'Tour planning, geography of Rwanda, languages (English/French), MS Office.',
 'TRH', 'L4', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 80 DAY), 'approved'),

(6, 'Hotel Operations Manager Intern',
 'Oversee hotel departments, manage staff rosters, budgets and guest satisfaction.',
 'Hospitality management, revenue management, PMS software, team leadership.',
 'TRH', 'L5', 'Kigali', '3 months', DATE_ADD(CURDATE(), INTERVAL 80 DAY), 'approved');
