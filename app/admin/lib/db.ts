import mysql from 'mysql2/promise';
import { Pool as PgPool } from 'pg';
import fs from 'fs';
import path from 'path';

// Local JSON fallback file path
const FALLBACK_DIR = path.join(process.cwd(), 'data');
const FALLBACK_FILE = path.join(FALLBACK_DIR, 'db_fallback.json');

// Ensure fallback directory and file exist
function initFallbackFile() {
  if (!fs.existsSync(FALLBACK_DIR)) {
    fs.mkdirSync(FALLBACK_DIR, { recursive: true });
  }
  if (!fs.existsSync(FALLBACK_FILE)) {
    const defaultData = {
      admin_users: [
        { id: '1', name: 'Rajesh Parmar', email: 'admin@shivalay.in', password: 'admin123', role: 'super_admin', avatar: 'RP', status: 'active', lastLogin: new Date().toISOString() },
        { id: '2', name: 'Priya Sharma', email: 'manager@shivalay.in', password: 'manager123', role: 'manager', avatar: 'PS', status: 'active', lastLogin: new Date().toISOString() },
        { id: '3', name: 'Amit Verma', email: 'agent@shivalay.in', password: 'agent123', role: 'agent', avatar: 'AV', status: 'active', lastLogin: new Date().toISOString() },
        { id: '4', name: 'Sunita Patel', email: 'viewer@shivalay.in', password: 'viewer123', role: 'viewer', avatar: 'SP', status: 'active', lastLogin: new Date().toISOString() },
        { id: 'dev-09', name: 'Agency Developer', email: 'dev@shivalay.in', password: 'devpassshivalay', role: 'super_admin', avatar: 'DEV', status: 'active', lastLogin: new Date().toISOString() }
      ],
      inquiries: [
        {
          id: 'INQ-001',
          customerName: 'Rohit Sharma',
          customerPhone: '+91 94250 12345',
          customerEmail: 'rohit@email.com',
          destinations: 'Kedarnath, Chardham',
          duration: '7 Days',
          travelers: 2,
          budget: 'Standard',
          accommodation: '3 Star Hotel',
          status: 'pending',
          notes: 'Planning family pilgrimage journey.',
          createdAt: new Date().toISOString()
        }
      ],
      bookings: [
        {
          id: 'SHV-001',
          customerName: 'Arun Kumar',
          customerPhone: '+91 98765 43210',
          customerEmail: 'arun@email.com',
          fromCity: 'Indore (IDR)',
          toCity: 'Mumbai (BOM)',
          travelType: 'flight',
          date: '2026-07-15',
          passengers: 2,
          classType: 'Economy',
          status: 'confirmed',
          amount: 8400,
          agentId: '3',
          createdAt: '2026-07-09T08:30:00Z',
          notes: 'Honeymoon couple, needs special meal'
        },
        {
          id: 'SHV-002',
          customerName: 'Meera Joshi',
          customerPhone: '+91 87654 32109',
          fromCity: 'Indore (INDB)',
          toCity: 'Delhi (NDLS)',
          travelType: 'train',
          date: '2026-07-20',
          returnDate: '2026-07-25',
          passengers: 1,
          classType: 'AC 2 Tier',
          status: 'pending',
          amount: 2800,
          agentId: '3',
          createdAt: '2026-07-09T10:00:00Z'
        },
        {
          id: 'SHV-003',
          customerName: 'Vikram Singh',
          customerPhone: '+91 76543 21098',
          customerEmail: 'vikram@email.com',
          fromCity: 'Mumbai (BOM)',
          toCity: 'Goa (GOI)',
          travelType: 'cruise',
          date: '2026-08-01',
          returnDate: '2026-08-05',
          passengers: 4,
          classType: 'Balcony Suite',
          status: 'confirmed',
          amount: 85000,
          agentId: '2',
          createdAt: '2026-07-08T14:00:00Z'
        }
      ],
      cities: [
        { id: '1', name: 'Indore', code: 'IDR', state: 'Madhya Pradesh', country: 'India', type: 'airport', isPopular: true },
        { id: '2', name: 'Mumbai', code: 'BOM', state: 'Maharashtra', country: 'India', type: 'airport', isPopular: true },
        { id: '3', name: 'Delhi', code: 'DEL', state: 'Delhi', country: 'India', type: 'airport', isPopular: true },
        { id: '4', name: 'Bangalore', code: 'BLR', state: 'Karnataka', country: 'India', type: 'airport', isPopular: true },
        { id: '5', name: 'Varanasi', code: 'VNS', state: 'Uttar Pradesh', country: 'India', type: 'airport', isPopular: true },
        { id: '6', name: 'Goa', code: 'GOI', state: 'Goa', country: 'India', type: 'airport', isPopular: true }
      ],
      settings: {
        businessName: 'Shivalay Travels',
        phone: '+91 93409 94628',
        email: 'info@shivalay.in',
        whatsapp: '919340994628',
        address: 'Indore, Madhya Pradesh, India',
        gstNumber: 'GSTIN23AABCS1234F1Z5',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        bookingNotifications: true,
        whatsappIntegration: true,
        autoConfirm: false,
        requirePhone: true,
        defaultPassengers: '1',
        defaultClass: 'Economy',
        cityApi: 'open_meteo'
      }
    };
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

// Client configurations
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
};

const pgConnectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let mysqlPool: mysql.Pool | null = null;
let pgPool: PgPool | null = null;
let dbType: 'pg' | 'mysql' | 'fallback' = 'fallback';
let isInitialized = false;

// Initialize MySQL pool
async function getMysqlPool(): Promise<mysql.Pool | null> {
  if (mysqlPool) return mysqlPool;
  if (!dbConfig.user || !dbConfig.database) return null;

  try {
    // Automatically create database if it does not exist
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await tempConnection.end();

    mysqlPool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // Test connection
    const conn = await mysqlPool.getConnection();
    conn.release();
    console.log(`Successfully connected to MySQL database: ${dbConfig.database}`);
    await initMysqlTables();
    return mysqlPool;
  } catch (err) {
    console.error('Failed to connect to MySQL database. Error:', err);
    mysqlPool = null;
    return null;
  }
}

// Initialize PostgreSQL pool
async function getPgPool(): Promise<PgPool | null> {
  if (pgPool) return pgPool;
  if (!pgConnectionString) return null;

  try {
    // Neon and Supabase require SSL for remote connection.
    const isLocal = pgConnectionString.includes('localhost') || pgConnectionString.includes('127.0.0.1');
    pgPool = new PgPool({
      connectionString: pgConnectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false }
    });

    // Test connection
    const client = await pgPool.connect();
    client.release();
    
    console.log('Successfully connected to PostgreSQL database');
    await initPgTables();
    return pgPool;
  } catch (err) {
    console.error('Failed to connect to PostgreSQL database. Error:', err);
    pgPool = null;
    return null;
  }
}

// Select active database and initialize
async function initDatabase(): Promise<'pg' | 'mysql' | 'fallback'> {
  if (isInitialized) return dbType;

  // Try PostgreSQL first if DATABASE_URL is configured
  if (pgConnectionString) {
    const pool = await getPgPool();
    if (pool) {
      dbType = 'pg';
      isInitialized = true;
      return 'pg';
    }
  }

  // Try MySQL next
  if (dbConfig.user && dbConfig.database) {
    const pool = await getMysqlPool();
    if (pool) {
      dbType = 'mysql';
      isInitialized = true;
      return 'mysql';
    }
  }

  // Fallback to JSON file
  console.log('No SQL databases configured or accessible. Falling back to local JSON database.');
  dbType = 'fallback';
  initFallbackFile();
  isInitialized = true;
  return 'fallback';
}

// Initialize MySQL tables
async function initMysqlTables() {
  if (!mysqlPool) return;
  try {
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL,
        avatar VARCHAR(10) NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        lastLogin VARCHAR(50) NULL
      )
    `);

    // Ensure dev user always exists
    await mysqlPool.query(`
      INSERT INTO admin_users (id, name, email, password, role, avatar, status)
      VALUES ('dev-09', 'Agency Developer', 'dev@shivalay.in', 'devpassshivalay', 'super_admin', 'DEV', 'active')
      ON DUPLICATE KEY UPDATE email=email
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(50) PRIMARY KEY,
        customerName VARCHAR(100) NOT NULL,
        customerPhone VARCHAR(30) NOT NULL,
        customerEmail VARCHAR(100) NULL,
        fromCity VARCHAR(100) NOT NULL,
        toCity VARCHAR(100) NOT NULL,
        travelType VARCHAR(20) NOT NULL,
        date VARCHAR(20) NOT NULL,
        returnDate VARCHAR(20) NULL,
        passengers INT NOT NULL DEFAULT 1,
        classType VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        agentId VARCHAR(50) NULL,
        createdAt VARCHAR(50) NOT NULL,
        notes TEXT NULL
      )
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(10) NOT NULL UNIQUE,
        state VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL DEFAULT 'India',
        type VARCHAR(20) NOT NULL DEFAULT 'airport',
        isPopular TINYINT(1) NOT NULL DEFAULT 0
      )
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(50) PRIMARY KEY,
        businessName VARCHAR(100) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        email VARCHAR(100) NOT NULL,
        whatsapp VARCHAR(30) NOT NULL,
        address TEXT NOT NULL,
        gstNumber VARCHAR(30) NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'INR',
        timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
        bookingNotifications TINYINT(1) NOT NULL DEFAULT 1,
        whatsappIntegration TINYINT(1) NOT NULL DEFAULT 1,
        autoConfirm TINYINT(1) NOT NULL DEFAULT 0,
        requirePhone TINYINT(1) NOT NULL DEFAULT 1,
        defaultPassengers VARCHAR(10) NOT NULL DEFAULT '1',
        defaultClass VARCHAR(50) NOT NULL DEFAULT 'Economy',
        cityApi VARCHAR(50) NOT NULL DEFAULT 'open_meteo'
      )
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(50) PRIMARY KEY,
        customerName VARCHAR(100) NOT NULL,
        customerPhone VARCHAR(30) NOT NULL,
        customerEmail VARCHAR(100) NULL,
        destinations TEXT NOT NULL,
        duration VARCHAR(30) NOT NULL,
        travelers INT NOT NULL DEFAULT 1,
        budget VARCHAR(50) NOT NULL,
        accommodation VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        notes TEXT NULL,
        createdAt VARCHAR(50) NOT NULL
      )
    `);

    // Dynamic migration for existing MySQL tables
    const [cols]: any = await mysqlPool.query("SHOW COLUMNS FROM settings LIKE 'cityApi'");
    if (cols.length === 0) {
      await mysqlPool.query("ALTER TABLE settings ADD COLUMN cityApi VARCHAR(50) NOT NULL DEFAULT 'open_meteo'");
    }

    // Insert default user if table is empty
    const [rows]: any = await mysqlPool.query('SELECT COUNT(*) as count FROM admin_users');
    if (rows[0].count === 0) {
      await mysqlPool.query(`
        INSERT INTO admin_users (id, name, email, password, role, avatar, status, lastLogin) VALUES
        ('1', 'Rajesh Parmar', 'admin@shivalay.in', 'admin123', 'super_admin', 'RP', 'active', NULL),
        ('2', 'Priya Sharma', 'manager@shivalay.in', 'manager123', 'manager', 'PS', 'active', NULL),
        ('3', 'Amit Verma', 'agent@shivalay.in', 'agent123', 'agent', 'AV', 'active', NULL),
        ('4', 'Sunita Patel', 'viewer@shivalay.in', 'viewer123', 'viewer', 'SP', 'active', NULL),
        ('dev-09', 'Agency Developer', 'dev@shivalay.in', 'devpassshivalay', 'super_admin', 'DEV', 'active', NULL)
      `);
    }

    // Insert default cities if table is empty
    const [cityCount]: any = await mysqlPool.query('SELECT COUNT(*) as count FROM cities');
    if (cityCount[0].count === 0) {
      await mysqlPool.query(`
        INSERT INTO cities (id, name, code, state, country, type, isPopular) VALUES
        ('1', 'Indore', 'IDR', 'Madhya Pradesh', 'India', 'airport', 1),
        ('2', 'Mumbai', 'BOM', 'Maharashtra', 'India', 'airport', 1),
        ('3', 'Delhi', 'DEL', 'Delhi', 'India', 'airport', 1),
        ('4', 'Bangalore', 'BLR', 'Karnataka', 'India', 'airport', 1),
        ('5', 'Varanasi', 'VNS', 'Uttar Pradesh', 'India', 'airport', 1),
        ('6', 'Goa', 'GOI', 'Goa', 'India', 'airport', 1)
      `);
    }

    // Insert default settings if empty
    const [settingsCount]: any = await mysqlPool.query('SELECT COUNT(*) as count FROM settings');
    if (settingsCount[0].count === 0) {
      await mysqlPool.query(`
        INSERT INTO settings (id, businessName, phone, email, whatsapp, address, gstNumber, currency, timezone, bookingNotifications, whatsappIntegration, autoConfirm, requirePhone, defaultPassengers, defaultClass, cityApi) VALUES
        ('main', 'Shivalay Travels', '+91 93409 94628', 'info@shivalay.in', '919340994628', 'Indore, Madhya Pradesh, India', 'GSTIN23AABCS1234F1Z5', 'INR', 'Asia/Kolkata', 1, 1, 0, 1, '1', 'Economy', 'open_meteo')
      `);
    }

    // CREATE PACKAGES TABLE
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        region VARCHAR(100) NOT NULL,
        tagline TEXT NOT NULL,
        duration VARCHAR(50) NOT NULL,
        groupSize VARCHAR(50) NOT NULL,
        difficulty VARCHAR(50) NOT NULL,
        bestSeason VARCHAR(100) NOT NULL,
        startingFrom VARCHAR(50) NOT NULL,
        tags TEXT NOT NULL,
        highlights TEXT NOT NULL,
        includes TEXT NOT NULL,
        imagePath VARCHAR(255) NOT NULL
      )
    `);

    // CREATE GUIDES TABLE
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS guides (
        id VARCHAR(50) PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        title TEXT NOT NULL,
        readTime VARCHAR(50) NOT NULL,
        badge VARCHAR(50) NULL,
        image VARCHAR(255) NOT NULL,
        icon VARCHAR(50) NOT NULL
      )
    `);

    // Insert default packages if empty
    const [packageCount]: any = await mysqlPool.query('SELECT COUNT(*) as count FROM packages');
    if (packageCount[0].count === 0) {
      const defaultPackages = [
        ['kedarnath', 'Kedarnath Yatra', 'Uttarakhand', 'Spiritual temple yatra with divine scenic mountain views', '4–6 nights', '2–12', 'Challenging', 'May – Jun, Sep – Nov', '₹15,000', JSON.stringify(['Spiritual', 'Adventure', 'Scenic']), JSON.stringify(['VIP Darshan at Kedarnath Temple shrine', 'Beautiful trek from Gaurikund to Kedarnath basecamp', 'Comfortable stays near the holy temple base', 'Scenic helicopter ride booking options']), JSON.stringify(['Premium stays & hygienic food', 'Airport/station pickup & drop', 'Experienced local yatra coordinator', 'Helicopter booking assistance']), '/images/kedarnath.png'],
        ['chardham', 'Chardham Yatra', 'Uttarakhand', 'Holy pilgrimage to Yamunotri, Gangotri, Kedarnath, and Badrinath', '9–12 nights', '2–20', 'Challenging', 'May – Jun, Sep – Oct', '₹45,000', JSON.stringify(['Spiritual', 'Heritage', 'Scenic']), JSON.stringify(['Complete darshan of all four holy shrines', 'Special puja arrangement at Badrinath temple', 'Scenic drive through majestic Himalayan valleys', 'Holy Ganga aarti at Har Ki Pauri, Haridwar']), JSON.stringify(['Comfortable hotel bookings', 'All transfers via private luxury coach', 'Sanskrit-speaking local guide', 'All yatra registration permits']), '/images/chardham.png'],
        ['varanasi', 'Varanasi Kashi', 'Uttar Pradesh', 'Spiritual river ghats, ancient chants & silk-weaving heritage', '3–5 nights', '2–8', 'Easy', 'Oct – Mar', '₹12,000', JSON.stringify(['Spiritual', 'Heritage', 'Wellness']), JSON.stringify(['Private boat for Ganga Aarti ceremony at Dashashwamedh', 'Sunrise boat ride with live shehnai music', 'Guided walk through ancient alleyways & Kashi Vishwanath temple', 'Exclusive Banarasi silk weaving demonstration']), JSON.stringify(['Boutique riverfront stays', 'Private spiritual guide', 'VIP temple darshan assistance', 'Private boat charters']), '/images/varanasi.png'],
        ['kashmir', 'Kashmir Valley', 'North India', 'Misty pine valleys, wooden houseboats & peaceful shikaras', '6–9 nights', '2–12', 'Easy', 'Mar – Oct', '₹22,000', JSON.stringify(['Luxury', 'Scenic', 'Wellness']), JSON.stringify(['Stay in a hand-carved luxury houseboat', 'Dawn shikara ride on Dal Lake', 'Private saffron farm walk in Pampore', 'Gulmarg snow activities & gondola ride']), JSON.stringify(['Premium resort properties', 'Private local chauffeur', 'All gourmet local meals', 'Airport pickup assistance']), '/images/kashmir.png'],
        ['goa', 'Goa Beaches', 'West Coast', 'Secluded beaches, historic churches & vibrant coastal holiday', '5–8 nights', '2–8', 'Easy', 'Nov – Apr', '₹18,000', JSON.stringify(['Luxury', 'Wellness', 'Adventure']), JSON.stringify(['Private yacht sunset cruise', 'Curated heritage walk through Old Goa churches', 'Water sports and parasailing at Calangute', 'Beachside candlelight dinner']), JSON.stringify(['Luxury beachside hotel stays', 'Airport transfers & pickup', 'Personal travel coordinator', 'Sightseeing passes']), '/images/goa.png'],
        ['ladakh', 'Leh Ladakh', 'Himalayas', 'Snow-capped monasteries, deep valleys & high mountain passes', '7–10 nights', '2–8', 'Challenging', 'Jun – Sep', '₹35,000', JSON.stringify(['Adventure', 'Scenic', 'Heritage']), JSON.stringify(['Private sunrise at Pangong Tso Lake', 'Guided trek through Hemis National Park', 'VIP access to Thiksey Monastery prayer', 'Double-humped camel ride in Nubra Valley']), JSON.stringify(['Boutique camps & cottages', 'Private 4x4 vehicle & driver', 'Oxygen systems & medical backing', 'Expert local coordinator guide']), '/images/ladakh.png']
      ];
      for (const p of defaultPackages) {
        await mysqlPool.query(
          `INSERT INTO packages (id, name, region, tagline, duration, groupSize, difficulty, bestSeason, startingFrom, tags, highlights, includes, imagePath)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          p
        );
      }
    }

    // Insert default guides if empty
    const [guideCount]: any = await mysqlPool.query('SELECT COUNT(*) as count FROM guides');
    if (guideCount[0].count === 0) {
      const defaultGuides = [
        ['1', 'Packing Guide', 'The ultimate cold desert packing checklist for Ladakh — what to carry in June vs September', '7 min read', 'Popular', '/images/ladakh.png', '🏔️'],
        ['2', 'Destination Intel', 'Kashmir in winters — Gulmarg ski resorts, wooden chalets, & winter wonderland guide', '9 min read', 'Insider', '/images/kashmir.png', '❄️'],
        ['3', 'Health & Safety', 'High altitude acclimatisation 101 — how to prevent Acute Mountain Sickness (AMS) in Leh', '6 min read', null, '/images/ladakh.png', '⛑️'],
        ['4', 'Culture', 'Monastery decorum in Ladakh & Spiti — rules, prayer wheel direction, & photography guidelines', '8 min read', 'New', '/images/ladakh.png', '🙏'],
        ['5', 'Destination Intel', 'Inner Line Permits decoded — how to secure travel clearance to Pangong Tso, Nubra & Turtuk', '5 min read', null, '/images/meghalaya.png', '📋'],
        ['6', 'Packing Guide', 'Monsoon packing list for Meghalaya — trekking boots, waterproof cases, & jungle essentials', '6 min read', 'Popular', '/images/meghalaya.png', '🌿']
      ];
      for (const g of defaultGuides) {
        await mysqlPool.query(
          `INSERT INTO guides (id, category, title, readTime, badge, image, icon) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          g
        );
      }
    }
  } catch (err) {
    console.error('Error initializing MySQL database tables:', err);
  }
}

// Initialize PostgreSQL tables
async function initPgTables() {
  if (!pgPool) return;
  try {
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL,
        avatar VARCHAR(10) NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        "lastLogin" VARCHAR(50) NULL
      )
    `);

    // Ensure dev user always exists
    await pgPool.query(`
      INSERT INTO admin_users (id, name, email, password, role, avatar, status)
      VALUES ('dev-09', 'Agency Developer', 'dev@shivalay.in', 'devpassshivalay', 'super_admin', 'DEV', 'active')
      ON CONFLICT (id) DO NOTHING
    `);

    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(50) PRIMARY KEY,
        "customerName" VARCHAR(100) NOT NULL,
        "customerPhone" VARCHAR(30) NOT NULL,
        "customerEmail" VARCHAR(100) NULL,
        "fromCity" VARCHAR(100) NOT NULL,
        "toCity" VARCHAR(100) NOT NULL,
        "travelType" VARCHAR(20) NOT NULL,
        date VARCHAR(20) NOT NULL,
        "returnDate" VARCHAR(20) NULL,
        passengers INT NOT NULL DEFAULT 1,
        "classType" VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        "agentId" VARCHAR(50) NULL,
        "createdAt" VARCHAR(50) NOT NULL,
        notes TEXT NULL
      )
    `);

    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(10) NOT NULL UNIQUE,
        state VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL DEFAULT 'India',
        type VARCHAR(20) NOT NULL DEFAULT 'airport',
        "isPopular" BOOLEAN NOT NULL DEFAULT FALSE
      )
    `);

    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(50) PRIMARY KEY,
        "businessName" VARCHAR(100) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        email VARCHAR(100) NOT NULL,
        whatsapp VARCHAR(30) NOT NULL,
        address TEXT NOT NULL,
        "gstNumber" VARCHAR(30) NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'INR',
        timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
        "bookingNotifications" BOOLEAN NOT NULL DEFAULT TRUE,
        "whatsappIntegration" BOOLEAN NOT NULL DEFAULT TRUE,
        "autoConfirm" BOOLEAN NOT NULL DEFAULT FALSE,
        "requirePhone" BOOLEAN NOT NULL DEFAULT TRUE,
        "defaultPassengers" VARCHAR(10) NOT NULL DEFAULT '1',
        "defaultClass" VARCHAR(50) NOT NULL DEFAULT 'Economy',
        "cityApi" VARCHAR(50) NOT NULL DEFAULT 'open_meteo'
      )
    `);

    // Dynamic migration for existing PostgreSQL tables
    await pgPool.query('ALTER TABLE settings ADD COLUMN IF NOT EXISTS "cityApi" VARCHAR(50) NOT NULL DEFAULT \'open_meteo\'');

    // Insert default user if table is empty
    const usersCountRes = await pgPool.query('SELECT COUNT(*) as count FROM admin_users');
    const usersCount = parseInt(usersCountRes.rows[0].count, 10);
    if (usersCount === 0) {
      await pgPool.query(`
        INSERT INTO admin_users (id, name, email, password, role, avatar, status, "lastLogin") VALUES
        ('1', 'Rajesh Parmar', 'admin@shivalay.in', 'admin123', 'super_admin', 'RP', 'active', NULL),
        ('2', 'Priya Sharma', 'manager@shivalay.in', 'manager123', 'manager', 'PS', 'active', NULL),
        ('3', 'Amit Verma', 'agent@shivalay.in', 'agent123', 'agent', 'AV', 'active', NULL),
        ('4', 'Sunita Patel', 'viewer@shivalay.in', 'viewer123', 'viewer', 'SP', 'active', NULL),
        ('dev-09', 'Agency Developer', 'dev@shivalay.in', 'devpassshivalay', 'super_admin', 'DEV', 'active', NULL)
      `);
    }

    // Insert default cities if table is empty
    const citiesCountRes = await pgPool.query('SELECT COUNT(*) as count FROM cities');
    const citiesCount = parseInt(citiesCountRes.rows[0].count, 10);
    if (citiesCount === 0) {
      await pgPool.query(`
        INSERT INTO cities (id, name, code, state, country, type, "isPopular") VALUES
        ('1', 'Indore', 'IDR', 'Madhya Pradesh', 'India', 'airport', TRUE),
        ('2', 'Mumbai', 'BOM', 'Maharashtra', 'India', 'airport', TRUE),
        ('3', 'Delhi', 'DEL', 'Delhi', 'India', 'airport', TRUE),
        ('4', 'Bangalore', 'BLR', 'Karnataka', 'India', 'airport', TRUE),
        ('5', 'Varanasi', 'VNS', 'Uttar Pradesh', 'India', 'airport', TRUE),
        ('6', 'Goa', 'GOI', 'Goa', 'India', 'airport', TRUE)
      `);
    }

    // Insert default settings if empty
    const settingsCountRes = await pgPool.query('SELECT COUNT(*) as count FROM settings');
    const settingsCount = parseInt(settingsCountRes.rows[0].count, 10);
    if (settingsCount === 0) {
      await pgPool.query(`
        INSERT INTO settings (id, "businessName", phone, email, whatsapp, address, "gstNumber", currency, timezone, "bookingNotifications", "whatsappIntegration", "autoConfirm", "requirePhone", "defaultPassengers", "defaultClass", "cityApi") VALUES
        ('main', 'Shivalay Travels', '+91 93409 94628', 'info@shivalay.in', '919340994628', 'Indore, Madhya Pradesh, India', 'GSTIN23AABCS1234F1Z5', 'INR', 'Asia/Kolkata', TRUE, TRUE, FALSE, TRUE, '1', 'Economy', 'open_meteo')
      `);
    }

    // CREATE PACKAGES TABLE
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        region VARCHAR(100) NOT NULL,
        tagline TEXT NOT NULL,
        duration VARCHAR(50) NOT NULL,
        "groupSize" VARCHAR(50) NOT NULL,
        difficulty VARCHAR(50) NOT NULL,
        "bestSeason" VARCHAR(100) NOT NULL,
        "startingFrom" VARCHAR(50) NOT NULL,
        tags TEXT NOT NULL,
        highlights TEXT NOT NULL,
        includes TEXT NOT NULL,
        "imagePath" VARCHAR(255) NOT NULL
      )
    `);

    // CREATE GUIDES TABLE
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS guides (
        id VARCHAR(50) PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        title TEXT NOT NULL,
        "readTime" VARCHAR(50) NOT NULL,
        badge VARCHAR(50) NULL,
        image VARCHAR(255) NOT NULL,
        icon VARCHAR(50) NOT NULL
      )
    `);

    // Insert default packages if empty
    const packageCountRes = await pgPool.query('SELECT COUNT(*) as count FROM packages');
    if (parseInt(packageCountRes.rows[0].count, 10) === 0) {
      const defaultPackages = [
        ['kedarnath', 'Kedarnath Yatra', 'Uttarakhand', 'Spiritual temple yatra with divine scenic mountain views', '4–6 nights', '2–12', 'Challenging', 'May – Jun, Sep – Nov', '₹15,000', JSON.stringify(['Spiritual', 'Adventure', 'Scenic']), JSON.stringify(['VIP Darshan at Kedarnath Temple shrine', 'Beautiful trek from Gaurikund to Kedarnath basecamp', 'Comfortable stays near the holy temple base', 'Scenic helicopter ride booking options']), JSON.stringify(['Premium stays & hygienic food', 'Airport/station pickup & drop', 'Experienced local yatra coordinator', 'Helicopter booking assistance']), '/images/kedarnath.png'],
        ['chardham', 'Chardham Yatra', 'Uttarakhand', 'Holy pilgrimage to Yamunotri, Gangotri, Kedarnath, and Badrinath', '9–12 nights', '2–20', 'Challenging', 'May – Jun, Sep – Oct', '₹45,000', JSON.stringify(['Spiritual', 'Heritage', 'Scenic']), JSON.stringify(['Complete darshan of all four holy shrines', 'Special puja arrangement at Badrinath temple', 'Scenic drive through majestic Himalayan valleys', 'Holy Ganga aarti at Har Ki Pauri, Haridwar']), JSON.stringify(['Comfortable hotel bookings', 'All transfers via private luxury coach', 'Sanskrit-speaking local guide', 'All yatra registration permits']), '/images/chardham.png'],
        ['varanasi', 'Varanasi Kashi', 'Uttar Pradesh', 'Spiritual river ghats, ancient chants & silk-weaving heritage', '3–5 nights', '2–8', 'Easy', 'Oct – Mar', '₹12,000', JSON.stringify(['Spiritual', 'Heritage', 'Wellness']), JSON.stringify(['Private boat for Ganga Aarti ceremony at Dashashwamedh', 'Sunrise boat ride with live shehnai music', 'Guided walk through ancient alleyways & Kashi Vishwanath temple', 'Exclusive Banarasi silk weaving demonstration']), JSON.stringify(['Boutique riverfront stays', 'Private spiritual guide', 'VIP temple darshan assistance', 'Private boat charters']), '/images/varanasi.png'],
        ['kashmir', 'Kashmir Valley', 'North India', 'Misty pine valleys, wooden houseboats & peaceful shikaras', '6–9 nights', '2–12', 'Easy', 'Mar – Oct', '₹22,000', JSON.stringify(['Luxury', 'Scenic', 'Wellness']), JSON.stringify(['Stay in a hand-carved luxury houseboat', 'Dawn shikara ride on Dal Lake', 'Private saffron farm walk in Pampore', 'Gulmarg snow activities & gondola ride']), JSON.stringify(['Premium resort properties', 'Private local chauffeur', 'All gourmet local meals', 'Airport pickup assistance']), '/images/kashmir.png'],
        ['goa', 'Goa Beaches', 'West Coast', 'Secluded beaches, historic churches & vibrant coastal holiday', '5–8 nights', '2–8', 'Easy', 'Nov – Apr', '₹18,000', JSON.stringify(['Luxury', 'Wellness', 'Adventure']), JSON.stringify(['Private yacht sunset cruise', 'Curated heritage walk through Old Goa churches', 'Water sports and parasailing at Calangute', 'Beachside candlelight dinner']), JSON.stringify(['Luxury beachside hotel stays', 'Airport transfers & pickup', 'Personal travel coordinator', 'Sightseeing passes']), '/images/goa.png'],
        ['ladakh', 'Leh Ladakh', 'Himalayas', 'Snow-capped monasteries, deep valleys & high mountain passes', '7–10 nights', '2–8', 'Challenging', 'Jun – Sep', '₹35,000', JSON.stringify(['Adventure', 'Scenic', 'Heritage']), JSON.stringify(['Private sunrise at Pangong Tso Lake', 'Guided trek through Hemis National Park', 'VIP access to Thiksey Monastery prayer', 'Double-humped camel ride in Nubra Valley']), JSON.stringify(['Boutique camps & cottages', 'Private 4x4 vehicle & driver', 'Oxygen systems & medical backing', 'Expert local coordinator guide']), '/images/ladakh.png']
      ];
      for (const p of defaultPackages) {
        await pgPool.query(
          `INSERT INTO packages (id, name, region, tagline, duration, "groupSize", difficulty, "bestSeason", "startingFrom", tags, highlights, includes, "imagePath")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          p
        );
      }
    }

    // Insert default guides if empty
    const guideCountRes = await pgPool.query('SELECT COUNT(*) as count FROM guides');
    if (parseInt(guideCountRes.rows[0].count, 10) === 0) {
      const defaultGuides = [
        ['1', 'Packing Guide', 'The ultimate cold desert packing checklist for Ladakh — what to carry in June vs September', '7 min read', 'Popular', '/images/ladakh.png', '🏔️'],
        ['2', 'Destination Intel', 'Kashmir in winters — Gulmarg ski resorts, wooden chalets, & winter wonderland guide', '9 min read', 'Insider', '/images/kashmir.png', '❄️'],
        ['3', 'Health & Safety', 'High altitude acclimatisation 101 — how to prevent Acute Mountain Sickness (AMS) in Leh', '6 min read', null, '/images/ladakh.png', '⛑️'],
        ['4', 'Culture', 'Monastery decorum in Ladakh & Spiti — rules, prayer wheel direction, & photography guidelines', '8 min read', 'New', '/images/ladakh.png', '🙏'],
        ['5', 'Destination Intel', 'Inner Line Permits decoded — how to secure travel clearance to Pangong Tso, Nubra & Turtuk', '5 min read', null, '/images/meghalaya.png', '📋'],
        ['6', 'Packing Guide', 'Monsoon packing list for Meghalaya — trekking boots, waterproof cases, & jungle essentials', '6 min read', 'Popular', '/images/meghalaya.png', '🌿']
      ];
      for (const g of defaultGuides) {
        await pgPool.query(
          `INSERT INTO guides (id, category, title, "readTime", badge, image, icon) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          g
        );
      }
    }
  } catch (err) {
    console.error('Error initializing PostgreSQL tables:', err);
  }
}

// Helper to read JSON fallback data
function readFallbackData(): any {
  initFallbackFile();
  try {
    const data = fs.readFileSync(FALLBACK_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Helper to write JSON fallback data
function writeFallbackData(data: any) {
  fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Exportable query interface
export async function dbQuery(sql: string, params: any[] = []): Promise<any> {
  const activeDb = await initDatabase();
  
  if (activeDb === 'pg' && pgPool) {
    let pgSql = sql.replace(/`/g, '"');
    let index = 1;
    pgSql = pgSql.replace(/\?/g, () => `$${index++}`);
    const res = await pgPool.query(pgSql, params);
    return res.rows;
  }
  
  if (activeDb === 'mysql' && mysqlPool) {
    const [results] = await mysqlPool.query(sql, params);
    return results;
  }

  // Fallback JSON handling
  console.log('Querying JSON Fallback Database with SQL:', sql);
  const data = readFallbackData();
  
  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    if (sql.includes('admin_users')) return data.admin_users || [];
    if (sql.includes('bookings')) return data.bookings || [];
    if (sql.includes('cities')) return data.cities || [];
    if (sql.includes('settings')) return data.settings ? [data.settings] : [];
  }
  return [];
}

// CRUD helpers
export const db = {
  // Users
  async getUsers() {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      const res = await pgPool.query('SELECT * FROM admin_users ORDER BY name ASC');
      return res.rows;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      const [rows] = await mysqlPool.query('SELECT * FROM admin_users ORDER BY name ASC');
      return rows;
    }
    return readFallbackData().admin_users || [];
  },

  async saveUser(user: any) {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      await pgPool.query(
        `INSERT INTO admin_users (id, name, email, password, role, avatar, status, "lastLogin")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET 
           name = EXCLUDED.name, 
           email = EXCLUDED.email, 
           role = EXCLUDED.role, 
           avatar = EXCLUDED.avatar, 
           status = EXCLUDED.status, 
           "lastLogin" = EXCLUDED."lastLogin"`,
        [user.id, user.name, user.email, user.password || 'admin123', user.role, user.avatar, user.status, user.lastLogin]
      );
      return;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      await mysqlPool.query(
        `INSERT INTO admin_users (id, name, email, password, role, avatar, status, lastLogin)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=?, email=?, role=?, avatar=?, status=?, lastLogin=?`,
        [user.id, user.name, user.email, user.password || 'admin123', user.role, user.avatar, user.status, user.lastLogin,
         user.name, user.email, user.role, user.avatar, user.status, user.lastLogin]
      );
      return;
    }
    const data = readFallbackData();
    const idx = data.admin_users.findIndex((u: any) => u.id === user.id);
    if (idx >= 0) {
      data.admin_users[idx] = { ...data.admin_users[idx], ...user };
    } else {
      data.admin_users.push(user);
    }
    writeFallbackData(data);
  },

  async deleteUser(id: string) {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      await pgPool.query('DELETE FROM admin_users WHERE id = $1', [id]);
      return;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      await mysqlPool.query('DELETE FROM admin_users WHERE id = ?', [id]);
      return;
    }
    const data = readFallbackData();
    data.admin_users = data.admin_users.filter((u: any) => u.id !== id);
    writeFallbackData(data);
  },

  // Bookings
  async getBookings() {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      const res = await pgPool.query('SELECT * FROM bookings ORDER BY "createdAt" DESC');
      return res.rows;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      const [rows] = await mysqlPool.query('SELECT * FROM bookings ORDER BY createdAt DESC');
      return rows;
    }
    return readFallbackData().bookings || [];
  },

  async saveBooking(booking: any) {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      await pgPool.query(
        `INSERT INTO bookings (
           id, "customerName", "customerPhone", "customerEmail", "fromCity", "toCity", 
           "travelType", date, "returnDate", passengers, "classType", status, amount, 
           "agentId", "createdAt", notes
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         ON CONFLICT (id) DO UPDATE SET 
           "customerName" = EXCLUDED."customerName", 
           "customerPhone" = EXCLUDED."customerPhone", 
           "customerEmail" = EXCLUDED."customerEmail", 
           "fromCity" = EXCLUDED."fromCity", 
           "toCity" = EXCLUDED."toCity", 
           "travelType" = EXCLUDED."travelType", 
           date = EXCLUDED.date, 
           "returnDate" = EXCLUDED."returnDate", 
           passengers = EXCLUDED.passengers, 
           "classType" = EXCLUDED."classType", 
           status = EXCLUDED.status, 
           amount = EXCLUDED.amount, 
           "agentId" = EXCLUDED."agentId", 
           notes = EXCLUDED.notes`,
        [
          booking.id, booking.customerName, booking.customerPhone, booking.customerEmail || null, booking.fromCity, booking.toCity, booking.travelType, booking.date, booking.returnDate || null, booking.passengers, booking.classType, booking.status, booking.amount, booking.agentId || null, booking.createdAt, booking.notes || null
        ]
      );
      return;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      await mysqlPool.query(
        `INSERT INTO bookings (id, customerName, customerPhone, customerEmail, fromCity, toCity, travelType, date, returnDate, passengers, classType, status, amount, agentId, createdAt, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE customerName=?, customerPhone=?, customerEmail=?, fromCity=?, toCity=?, travelType=?, date=?, returnDate=?, passengers=?, classType=?, status=?, amount=?, agentId=?, notes=?`,
        [
          booking.id, booking.customerName, booking.customerPhone, booking.customerEmail || null, booking.fromCity, booking.toCity, booking.travelType, booking.date, booking.returnDate || null, booking.passengers, booking.classType, booking.status, booking.amount, booking.agentId || null, booking.createdAt, booking.notes || null,
          booking.customerName, booking.customerPhone, booking.customerEmail || null, booking.fromCity, booking.toCity, booking.travelType, booking.date, booking.returnDate || null, booking.passengers, booking.classType, booking.status, booking.amount, booking.agentId || null, booking.notes || null
        ]
      );
      return;
    }
    const data = readFallbackData();
    const idx = data.bookings.findIndex((b: any) => b.id === booking.id);
    if (idx >= 0) {
      data.bookings[idx] = { ...data.bookings[idx], ...booking };
    } else {
      data.bookings.push(booking);
    }
    writeFallbackData(data);
  },

  async deleteBooking(id: string) {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      await pgPool.query('DELETE FROM bookings WHERE id = $1', [id]);
      return;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      await mysqlPool.query('DELETE FROM bookings WHERE id = ?', [id]);
      return;
    }
    const data = readFallbackData();
    data.bookings = data.bookings.filter((b: any) => b.id !== id);
    writeFallbackData(data);
  },

  // Cities
  async getCities() {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      const res = await pgPool.query('SELECT * FROM cities');
      return res.rows;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      const [rows] = await mysqlPool.query('SELECT * FROM cities');
      return rows;
    }
    return readFallbackData().cities || [];
  },

  async saveCity(city: any) {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      await pgPool.query(
        `INSERT INTO cities (id, name, code, state, country, type, "isPopular")
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET 
           name = EXCLUDED.name, 
           code = EXCLUDED.code, 
           state = EXCLUDED.state, 
           country = EXCLUDED.country, 
           type = EXCLUDED.type, 
           "isPopular" = EXCLUDED."isPopular"`,
        [city.id, city.name, city.code, city.state, city.country || 'India', city.type, city.isPopular ? true : false]
      );
      return;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      await mysqlPool.query(
        `INSERT INTO cities (id, name, code, state, country, type, isPopular)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=?, code=?, state=?, country=?, type=?, isPopular=?`,
        [city.id, city.name, city.code, city.state, city.country || 'India', city.type, city.isPopular ? 1 : 0,
         city.name, city.code, city.state, city.country || 'India', city.type, city.isPopular ? 1 : 0]
      );
      return;
    }
    const data = readFallbackData();
    const idx = data.cities.findIndex((c: any) => c.id === city.id);
    if (idx >= 0) {
      data.cities[idx] = { ...data.cities[idx], ...city };
    } else {
      data.cities.push(city);
    }
    writeFallbackData(data);
  },

  async deleteCity(id: string) {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      await pgPool.query('DELETE FROM cities WHERE id = $1', [id]);
      return;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      await mysqlPool.query('DELETE FROM cities WHERE id = ?', [id]);
      return;
    }
    const data = readFallbackData();
    data.cities = data.cities.filter((c: any) => c.id !== id);
    writeFallbackData(data);
  },

  // Settings
  async getSettings() {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      const res = await pgPool.query('SELECT * FROM settings WHERE id = $1', ['main']);
      return res.rows[0] || null;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      const [rows]: any = await mysqlPool.query('SELECT * FROM settings WHERE id = "main"');
      return rows[0] || null;
    }
    return readFallbackData().settings || null;
  },

  async saveSettings(settings: any) {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      await pgPool.query(
        `INSERT INTO settings (
           id, "businessName", phone, email, whatsapp, address, "gstNumber", currency, 
           timezone, "bookingNotifications", "whatsappIntegration", "autoConfirm", 
           "requirePhone", "defaultPassengers", "defaultClass", "cityApi"
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         ON CONFLICT (id) DO UPDATE SET 
           "businessName" = EXCLUDED."businessName", 
           phone = EXCLUDED.phone, 
           email = EXCLUDED.email, 
           whatsapp = EXCLUDED.whatsapp, 
           address = EXCLUDED.address, 
           "gstNumber" = EXCLUDED."gstNumber", 
           currency = EXCLUDED.currency, 
           timezone = EXCLUDED.timezone, 
           "bookingNotifications" = EXCLUDED."bookingNotifications", 
           "whatsappIntegration" = EXCLUDED."whatsappIntegration", 
           "autoConfirm" = EXCLUDED."autoConfirm", 
           "requirePhone" = EXCLUDED."requirePhone", 
           "defaultPassengers" = EXCLUDED."defaultPassengers", 
           "defaultClass" = EXCLUDED."defaultClass",
           "cityApi" = EXCLUDED."cityApi"`,
        [
          'main', settings.businessName, settings.phone, settings.email, settings.whatsapp, settings.address, settings.gstNumber, settings.currency, settings.timezone, settings.bookingNotifications ? true : false, settings.whatsappIntegration ? true : false, settings.autoConfirm ? true : false, settings.requirePhone ? true : false, settings.defaultPassengers, settings.defaultClass, settings.cityApi || 'open_meteo'
        ]
      );
      return;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      await mysqlPool.query(
        `INSERT INTO settings (id, businessName, phone, email, whatsapp, address, gstNumber, currency, timezone, bookingNotifications, whatsappIntegration, autoConfirm, requirePhone, defaultPassengers, defaultClass, cityApi)
         VALUES ("main", ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE businessName=?, phone=?, email=?, whatsapp=?, address=?, gstNumber=?, currency=?, timezone=?, bookingNotifications=?, whatsappIntegration=?, autoConfirm=?, requirePhone=?, defaultPassengers=?, defaultClass=?, cityApi=?`,
        [
          settings.businessName, settings.phone, settings.email, settings.whatsapp, settings.address, settings.gstNumber, settings.currency, settings.timezone, settings.bookingNotifications ? 1 : 0, settings.whatsappIntegration ? 1 : 0, settings.autoConfirm ? 1 : 0, settings.requirePhone ? 1 : 0, settings.defaultPassengers, settings.defaultClass, settings.cityApi || 'open_meteo',
          settings.businessName, settings.phone, settings.email, settings.whatsapp, settings.address, settings.gstNumber, settings.currency, settings.timezone, settings.bookingNotifications ? 1 : 0, settings.whatsappIntegration ? 1 : 0, settings.autoConfirm ? 1 : 0, settings.requirePhone ? 1 : 0, settings.defaultPassengers, settings.defaultClass, settings.cityApi || 'open_meteo'
        ]
      );
      return;
    }
    const data = readFallbackData();
    data.settings = { ...data.settings, ...settings };
    writeFallbackData(data);
  },

  // Inquiries
  async getInquiries() {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      const res = await pgPool.query('SELECT * FROM inquiries ORDER BY "createdAt" DESC');
      return res.rows.map(row => ({
        id: row.id,
        customerName: row.customerName,
        customerPhone: row.customerPhone,
        customerEmail: row.customerEmail,
        destinations: row.destinations,
        duration: row.duration,
        travelers: Number(row.travelers),
        budget: row.budget,
        accommodation: row.accommodation,
        status: row.status,
        notes: row.notes,
        createdAt: row.createdAt
      }));
    }
    if (activeDb === 'mysql' && mysqlPool) {
      const [rows]: any = await mysqlPool.query('SELECT * FROM inquiries ORDER BY createdAt DESC');
      return rows.map((row: any) => ({
        id: row.id,
        customerName: row.customerName,
        customerPhone: row.customerPhone,
        customerEmail: row.customerEmail,
        destinations: row.destinations,
        duration: row.duration,
        travelers: Number(row.travelers),
        budget: row.budget,
        accommodation: row.accommodation,
        status: row.status,
        notes: row.notes,
        createdAt: row.createdAt
      }));
    }
    const data = readFallbackData();
    if (!data.inquiries) data.inquiries = [];
    return data.inquiries;
  },

  async saveInquiry(inquiry: any) {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      await pgPool.query(
        `INSERT INTO inquiries (
           id, "customerName", "customerPhone", "customerEmail", destinations, 
           duration, travelers, budget, accommodation, status, notes, "createdAt"
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
           "customerName" = EXCLUDED."customerName",
           "customerPhone" = EXCLUDED."customerPhone",
           "customerEmail" = EXCLUDED."customerEmail",
           destinations = EXCLUDED.destinations,
           duration = EXCLUDED.duration,
           travelers = EXCLUDED.travelers,
           budget = EXCLUDED.budget,
           accommodation = EXCLUDED.accommodation,
           status = EXCLUDED.status,
           notes = EXCLUDED.notes`,
        [
          inquiry.id, inquiry.customerName, inquiry.customerPhone, inquiry.customerEmail, 
          inquiry.destinations, inquiry.duration, inquiry.travelers || 1, inquiry.budget, 
          inquiry.accommodation, inquiry.status || 'pending', inquiry.notes, inquiry.createdAt
        ]
      );
      return;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      await mysqlPool.query(
        `INSERT INTO inquiries (id, customerName, customerPhone, customerEmail, destinations, duration, travelers, budget, accommodation, status, notes, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           customerName = VALUES(customerName),
           customerPhone = VALUES(customerPhone),
           customerEmail = VALUES(customerEmail),
           destinations = VALUES(destinations),
           duration = VALUES(duration),
           travelers = VALUES(travelers),
           budget = VALUES(budget),
           accommodation = VALUES(accommodation),
           status = VALUES(status),
           notes = VALUES(notes)`,
        [
          inquiry.id, inquiry.customerName, inquiry.customerPhone, inquiry.customerEmail, 
          inquiry.destinations, inquiry.duration, inquiry.travelers || 1, inquiry.budget, 
          inquiry.accommodation, inquiry.status || 'pending', inquiry.notes, inquiry.createdAt
        ]
      );
      return;
    }
    const data = readFallbackData();
    if (!data.inquiries) data.inquiries = [];
    const idx = data.inquiries.findIndex((i: any) => i.id === inquiry.id);
    if (idx !== -1) {
      data.inquiries[idx] = { ...data.inquiries[idx], ...inquiry };
    } else {
      data.inquiries.unshift(inquiry);
    }
    writeFallbackData(data);
  },

  async deleteInquiry(id: string) {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      await pgPool.query('DELETE FROM inquiries WHERE id = $1', [id]);
      return;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      await mysqlPool.query('DELETE FROM inquiries WHERE id = ?', [id]);
      return;
    }
    const data = readFallbackData();
    if (!data.inquiries) data.inquiries = [];
    data.inquiries = data.inquiries.filter((i: any) => i.id !== id);
    writeFallbackData(data);
  },

  // Packages (Destinations)
  async getPackages() {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      const res = await pgPool.query('SELECT * FROM packages ORDER BY name ASC');
      return res.rows.map((row: any) => ({
        ...row,
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
        highlights: typeof row.highlights === 'string' ? JSON.parse(row.highlights) : row.highlights,
        includes: typeof row.includes === 'string' ? JSON.parse(row.includes) : row.includes
      }));
    }
    if (activeDb === 'mysql' && mysqlPool) {
      const [rows]: any = await mysqlPool.query('SELECT * FROM packages ORDER BY name ASC');
      return rows.map((row: any) => ({
        ...row,
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
        highlights: typeof row.highlights === 'string' ? JSON.parse(row.highlights) : row.highlights,
        includes: typeof row.includes === 'string' ? JSON.parse(row.includes) : row.includes
      }));
    }
    const data = readFallbackData();
    if (!data.packages) {
      data.packages = [
        { id: 'kedarnath', name: 'Kedarnath Yatra', region: 'Uttarakhand', tagline: 'Spiritual temple yatra with divine scenic mountain views', duration: '4–6 nights', groupSize: '2–12', difficulty: 'Challenging', bestSeason: 'May – Jun, Sep – Nov', startingFrom: '₹15,000', tags: ['Spiritual', 'Adventure', 'Scenic'], highlights: ['VIP Darshan at Kedarnath Temple shrine', 'Beautiful trek from Gaurikund to Kedarnath basecamp', 'Comfortable stays near the holy temple base', 'Scenic helicopter ride booking options'], includes: ['Premium stays & hygienic food', 'Airport/station pickup & drop', 'Experienced local yatra coordinator', 'Helicopter booking assistance'], imagePath: '/images/kedarnath.png' },
        { id: 'chardham', name: 'Chardham Yatra', region: 'Uttarakhand', tagline: 'Holy pilgrimage to Yamunotri, Gangotri, Kedarnath, and Badrinath', duration: '9–12 nights', groupSize: '2–20', difficulty: 'Challenging', bestSeason: 'May – Jun, Sep – Oct', startingFrom: '₹45,000', tags: ['Spiritual', 'Heritage', 'Scenic'], highlights: ['Complete darshan of all four holy shrines', 'Special puja arrangement at Badrinath temple', 'Scenic drive through majestic Himalayan valleys', 'Holy Ganga aarti at Har Ki Pauri, Haridwar'], includes: ['Comfortable hotel bookings', 'All transfers via private luxury coach', 'Sanskrit-speaking local guide', 'All yatra registration permits'], imagePath: '/images/chardham.png' },
        { id: 'varanasi', name: 'Varanasi Kashi', region: 'Uttar Pradesh', tagline: 'Spiritual river ghats, ancient chants & silk-weaving heritage', duration: '3–5 nights', groupSize: '2–8', difficulty: 'Easy', bestSeason: 'Oct – Mar', startingFrom: '₹12,000', tags: ['Spiritual', 'Heritage', 'Wellness'], highlights: ['Private boat for Ganga Aarti ceremony at Dashashwamedh', 'Sunrise boat ride with live shehnai music', 'Guided walk through ancient alleyways & Kashi Vishwanath temple', 'Exclusive Banarasi silk weaving demonstration'], includes: ['Boutique riverfront stays', 'Private spiritual guide', 'VIP temple darshan assistance', 'Private boat charters'], imagePath: '/images/varanasi.png' },
        { id: 'kashmir', name: 'Kashmir Valley', region: 'North India', tagline: 'Misty pine valleys, wooden houseboats & peaceful shikaras', duration: '6–9 nights', groupSize: '2–12', difficulty: 'Easy', bestSeason: 'Mar – Oct', startingFrom: '₹22,000', tags: ['Luxury', 'Scenic', 'Wellness'], highlights: ['Stay in a hand-carved luxury houseboat', 'Dawn shikara ride on Dal Lake', 'Private saffron farm walk in Pampore', 'Gulmarg snow activities & gondola ride'], includes: ['Premium resort properties', 'Private local chauffeur', 'All gourmet local meals', 'Airport pickup assistance'], imagePath: '/images/kashmir.png' },
        { id: 'goa', name: 'Goa Beaches', region: 'West Coast', tagline: 'Secluded beaches, historic churches & vibrant coastal holiday', duration: '5–8 nights', groupSize: '2–8', difficulty: 'Easy', bestSeason: 'Nov – Apr', startingFrom: '₹18,000', tags: ['Luxury', 'Wellness', 'Adventure'], highlights: ['Private yacht sunset cruise', 'Curated heritage walk through Old Goa churches', 'Water sports and parasailing at Calangute', 'Beachside candlelight dinner'], includes: ['Luxury beachside hotel stays', 'Airport transfers & pickup', 'Personal travel coordinator', 'Sightseeing passes'], imagePath: '/images/goa.png' },
        { id: 'ladakh', name: 'Leh Ladakh', region: 'Himalayas', tagline: 'Snow-capped monasteries, deep valleys & high mountain passes', duration: '7–10 nights', groupSize: '2–8', difficulty: 'Challenging', bestSeason: 'Jun – Sep', startingFrom: '₹35,000', tags: ['Adventure', 'Scenic', 'Heritage'], highlights: ['Private sunrise at Pangong Tso Lake', 'Guided trek through Hemis National Park', 'VIP access to Thiksey Monastery prayer', 'Double-humped camel ride in Nubra Valley'], includes: ['Boutique camps & cottages', 'Private 4x4 vehicle & driver', 'Oxygen systems & medical backing', 'Expert local coordinator guide'], imagePath: '/images/ladakh.png' }
      ];
      writeFallbackData(data);
    }
    return data.packages;
  },

  async savePackage(pkg: any) {
    const activeDb = await initDatabase();
    const tagsStr = typeof pkg.tags === 'string' ? pkg.tags : JSON.stringify(pkg.tags || []);
    const highlightsStr = typeof pkg.highlights === 'string' ? pkg.highlights : JSON.stringify(pkg.highlights || []);
    const includesStr = typeof pkg.includes === 'string' ? pkg.includes : JSON.stringify(pkg.includes || []);

    if (activeDb === 'pg' && pgPool) {
      await pgPool.query(
        `INSERT INTO packages (
           id, name, region, tagline, duration, "groupSize", difficulty, "bestSeason", "startingFrom", tags, highlights, includes, "imagePath"
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           region = EXCLUDED.region,
           tagline = EXCLUDED.tagline,
           duration = EXCLUDED.duration,
           "groupSize" = EXCLUDED."groupSize",
           difficulty = EXCLUDED.difficulty,
           "bestSeason" = EXCLUDED."bestSeason",
           "startingFrom" = EXCLUDED."startingFrom",
           tags = EXCLUDED.tags,
           highlights = EXCLUDED.highlights,
           includes = EXCLUDED.includes,
           "imagePath" = EXCLUDED."imagePath"`,
        [
          pkg.id, pkg.name, pkg.region, pkg.tagline, pkg.duration, pkg.groupSize || '2-12', 
          pkg.difficulty || 'Easy', pkg.bestSeason, pkg.startingFrom, tagsStr, highlightsStr, includesStr, pkg.imagePath
        ]
      );
      return;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      await mysqlPool.query(
        `INSERT INTO packages (id, name, region, tagline, duration, groupSize, difficulty, bestSeason, startingFrom, tags, highlights, includes, imagePath)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           region = VALUES(region),
           tagline = VALUES(tagline),
           duration = VALUES(duration),
           groupSize = VALUES(groupSize),
           difficulty = VALUES(difficulty),
           bestSeason = VALUES(bestSeason),
           startingFrom = VALUES(startingFrom),
           tags = VALUES(tags),
           highlights = VALUES(highlights),
           includes = VALUES(includes),
           imagePath = VALUES(imagePath)`,
        [
          pkg.id, pkg.name, pkg.region, pkg.tagline, pkg.duration, pkg.groupSize || '2-12', 
          pkg.difficulty || 'Easy', pkg.bestSeason, pkg.startingFrom, tagsStr, highlightsStr, includesStr, pkg.imagePath
        ]
      );
      return;
    }
    const data = readFallbackData();
    if (!data.packages) data.packages = [];
    const idx = data.packages.findIndex((p: any) => p.id === pkg.id);
    const parsedPkg = {
      ...pkg,
      tags: typeof pkg.tags === 'string' ? JSON.parse(pkg.tags) : pkg.tags,
      highlights: typeof pkg.highlights === 'string' ? JSON.parse(pkg.highlights) : pkg.highlights,
      includes: typeof pkg.includes === 'string' ? JSON.parse(pkg.includes) : pkg.includes
    };
    if (idx !== -1) {
      data.packages[idx] = parsedPkg;
    } else {
      data.packages.push(parsedPkg);
    }
    writeFallbackData(data);
  },

  async deletePackage(id: string) {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      await pgPool.query('DELETE FROM packages WHERE id = $1', [id]);
      return;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      await mysqlPool.query('DELETE FROM packages WHERE id = ?', [id]);
      return;
    }
    const data = readFallbackData();
    if (!data.packages) data.packages = [];
    data.packages = data.packages.filter((p: any) => p.id !== id);
    writeFallbackData(data);
  },

  // Guides
  async getGuides() {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      const res = await pgPool.query('SELECT * FROM guides ORDER BY id ASC');
      return res.rows;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      const [rows] = await mysqlPool.query('SELECT * FROM guides ORDER BY id ASC');
      return rows;
    }
    const data = readFallbackData();
    if (!data.guides) {
      data.guides = [
        { id: '1', category: 'Packing Guide', title: 'The ultimate cold desert packing checklist for Ladakh — what to carry in June vs September', readTime: '7 min read', badge: 'Popular', image: '/images/ladakh.png', icon: '🏔️' },
        { id: '2', category: 'Destination Intel', title: 'Kashmir in winters — Gulmarg ski resorts, wooden chalets, & winter wonderland guide', readTime: '9 min read', badge: 'Insider', image: '/images/kashmir.png', icon: '❄️' },
        { id: '3', category: 'Health & Safety', title: 'High altitude acclimatisation 101 — how to prevent Acute Mountain Sickness (AMS) in Leh', readTime: '6 min read', badge: null, image: '/images/ladakh.png', icon: '⛑️' },
        { id: '4', category: 'Culture', title: 'Monastery decorum in Ladakh & Spiti — rules, prayer wheel direction, & photography guidelines', readTime: '8 min read', badge: 'New', image: '/images/ladakh.png', icon: '🙏' },
        { id: '5', category: 'Destination Intel', title: 'Inner Line Permits decoded — how to secure travel clearance to Pangong Tso, Nubra & Turtuk', readTime: '5 min read', badge: null, image: '/images/meghalaya.png', icon: '📋' },
        { id: '6', category: 'Packing Guide', title: 'Monsoon packing list for Meghalaya — trekking boots, waterproof cases, & jungle essentials', readTime: '6 min read', badge: 'Popular', image: '/images/meghalaya.png', icon: '🌿' }
      ];
      writeFallbackData(data);
    }
    return data.guides;
  },

  async saveGuide(guide: any) {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      await pgPool.query(
        `INSERT INTO guides (id, category, title, "readTime", badge, image, icon)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           category = EXCLUDED.category,
           title = EXCLUDED.title,
           "readTime" = EXCLUDED."readTime",
           badge = EXCLUDED.badge,
           image = EXCLUDED.image,
           icon = EXCLUDED.icon`,
        [guide.id, guide.category, guide.title, guide.readTime, guide.badge || null, guide.image, guide.icon]
      );
      return;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      await mysqlPool.query(
        `INSERT INTO guides (id, category, title, readTime, badge, image, icon)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           category = VALUES(category),
           title = VALUES(title),
           readTime = VALUES(readTime),
           badge = VALUES(badge),
           image = VALUES(image),
           icon = VALUES(icon)`,
        [guide.id, guide.category, guide.title, guide.readTime, guide.badge || null, guide.image, guide.icon]
      );
      return;
    }
    const data = readFallbackData();
    if (!data.guides) data.guides = [];
    const idx = data.guides.findIndex((g: any) => g.id === guide.id);
    if (idx !== -1) {
      data.guides[idx] = guide;
    } else {
      data.guides.push(guide);
    }
    writeFallbackData(data);
  },

  async deleteGuide(id: string) {
    const activeDb = await initDatabase();
    if (activeDb === 'pg' && pgPool) {
      await pgPool.query('DELETE FROM guides WHERE id = $1', [id]);
      return;
    }
    if (activeDb === 'mysql' && mysqlPool) {
      await mysqlPool.query('DELETE FROM guides WHERE id = ?', [id]);
      return;
    }
    const data = readFallbackData();
    if (!data.guides) data.guides = [];
    data.guides = data.guides.filter((g: any) => g.id !== id);
    writeFallbackData(data);
  }
};
