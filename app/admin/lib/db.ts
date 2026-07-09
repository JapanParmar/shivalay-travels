import mysql from 'mysql2/promise';
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
        { id: '4', name: 'Sunita Patel', email: 'viewer@shivalay.in', password: 'viewer123', role: 'viewer', avatar: 'SP', status: 'active', lastLogin: new Date().toISOString() }
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
        defaultClass: 'Economy'
      }
    };
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

// Get client configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
};

let pool: mysql.Pool | null = null;
let useFallback = false;

// Initialize MySQL pool
async function getPool(): Promise<mysql.Pool | null> {
  if (useFallback) return null;
  if (pool) return pool;

  // If no user or database configured, automatically use JSON fallback
  if (!dbConfig.user || !dbConfig.database) {
    console.log('MySQL not configured in environment variables. Falling back to local JSON database.');
    useFallback = true;
    initFallbackFile();
    return null;
  }

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

    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    // Test connection
    const conn = await pool.getConnection();
    conn.release();
    console.log(`Successfully connected to MySQL database: ${dbConfig.database}`);
    await initDbTables();
    return pool;
  } catch (err) {
    console.error('Failed to connect to MySQL database. Falling back to JSON database. Error:', err);
    useFallback = true;
    initFallbackFile();
    return null;
  }
}

// Initialize tables if they do not exist
async function initDbTables() {
  if (!pool) return;
  try {
    await pool.query(`
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

    await pool.query(`
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

    await pool.query(`
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

    await pool.query(`
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
        defaultClass VARCHAR(50) NOT NULL DEFAULT 'Economy'
      )
    `);

    // Insert default user if table is empty
    const [rows]: any = await pool.query('SELECT COUNT(*) as count FROM admin_users');
    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO admin_users (id, name, email, password, role, avatar, status, lastLogin) VALUES
        ('1', 'Rajesh Parmar', 'admin@shivalay.in', 'admin123', 'super_admin', 'RP', 'active', NULL),
        ('2', 'Priya Sharma', 'manager@shivalay.in', 'manager123', 'manager', 'PS', 'active', NULL),
        ('3', 'Amit Verma', 'agent@shivalay.in', 'agent123', 'agent', 'AV', 'active', NULL),
        ('4', 'Sunita Patel', 'viewer@shivalay.in', 'viewer123', 'viewer', 'SP', 'active', NULL)
      `);
    }

    // Insert default cities if table is empty
    const [cityCount]: any = await pool.query('SELECT COUNT(*) as count FROM cities');
    if (cityCount[0].count === 0) {
      await pool.query(`
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
    const [settingsCount]: any = await pool.query('SELECT COUNT(*) as count FROM settings');
    if (settingsCount[0].count === 0) {
      await pool.query(`
        INSERT INTO settings (id, businessName, phone, email, whatsapp, address, gstNumber, currency, timezone, bookingNotifications, whatsappIntegration, autoConfirm, requirePhone, defaultPassengers, defaultClass) VALUES
        ('main', 'Shivalay Travels', '+91 93409 94628', 'info@shivalay.in', '919340994628', 'Indore, Madhya Pradesh, India', 'GSTIN23AABCS1234F1Z5', 'INR', 'Asia/Kolkata', 1, 1, 0, 1, '1', 'Economy')
      `);
    }
  } catch (err) {
    console.error('Error initializing database tables:', err);
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
  const myPool = await getPool();
  if (myPool) {
    const [results] = await myPool.query(sql, params);
    return results;
  }

  // Fallback JSON handling
  console.log('Querying JSON Fallback Database with SQL:', sql);
  const data = readFallbackData();
  
  // Simple simulation of SELECT queries
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
    const myPool = await getPool();
    if (myPool) {
      const [rows] = await myPool.query('SELECT * FROM admin_users');
      return rows;
    }
    return readFallbackData().admin_users || [];
  },

  async saveUser(user: any) {
    const myPool = await getPool();
    if (myPool) {
      await myPool.query(
        `INSERT INTO admin_users (id, name, email, password, role, avatar, status, lastLogin)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=?, email=?, role=?, avatar=?, status=?, lastLogin=?`,
        [user.id, user.name, user.email, user.password || 'password123', user.role, user.avatar, user.status, user.lastLogin,
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
    const myPool = await getPool();
    if (myPool) {
      await myPool.query('DELETE FROM admin_users WHERE id = ?', [id]);
      return;
    }
    const data = readFallbackData();
    data.admin_users = data.admin_users.filter((u: any) => u.id !== id);
    writeFallbackData(data);
  },

  // Bookings
  async getBookings() {
    const myPool = await getPool();
    if (myPool) {
      const [rows] = await myPool.query('SELECT * FROM bookings ORDER BY createdAt DESC');
      return rows;
    }
    return readFallbackData().bookings || [];
  },

  async saveBooking(booking: any) {
    const myPool = await getPool();
    if (myPool) {
      await myPool.query(
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
    const myPool = await getPool();
    if (myPool) {
      await myPool.query('DELETE FROM bookings WHERE id = ?', [id]);
      return;
    }
    const data = readFallbackData();
    data.bookings = data.bookings.filter((b: any) => b.id !== id);
    writeFallbackData(data);
  },

  // Cities
  async getCities() {
    const myPool = await getPool();
    if (myPool) {
      const [rows] = await myPool.query('SELECT * FROM cities');
      return rows;
    }
    return readFallbackData().cities || [];
  },

  async saveCity(city: any) {
    const myPool = await getPool();
    if (myPool) {
      await myPool.query(
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
    const myPool = await getPool();
    if (myPool) {
      await myPool.query('DELETE FROM cities WHERE id = ?', [id]);
      return;
    }
    const data = readFallbackData();
    data.cities = data.cities.filter((c: any) => c.id !== id);
    writeFallbackData(data);
  },

  // Settings
  async getSettings() {
    const myPool = await getPool();
    if (myPool) {
      const [rows]: any = await myPool.query('SELECT * FROM settings WHERE id = "main"');
      return rows[0] || null;
    }
    return readFallbackData().settings || null;
  },

  async saveSettings(settings: any) {
    const myPool = await getPool();
    if (myPool) {
      await myPool.query(
        `INSERT INTO settings (id, businessName, phone, email, whatsapp, address, gstNumber, currency, timezone, bookingNotifications, whatsappIntegration, autoConfirm, requirePhone, defaultPassengers, defaultClass)
         VALUES ("main", ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE businessName=?, phone=?, email=?, whatsapp=?, address=?, gstNumber=?, currency=?, timezone=?, bookingNotifications=?, whatsappIntegration=?, autoConfirm=?, requirePhone=?, defaultPassengers=?, defaultClass=?`,
        [
          settings.businessName, settings.phone, settings.email, settings.whatsapp, settings.address, settings.gstNumber, settings.currency, settings.timezone, settings.bookingNotifications ? 1 : 0, settings.whatsappIntegration ? 1 : 0, settings.autoConfirm ? 1 : 0, settings.requirePhone ? 1 : 0, settings.defaultPassengers, settings.defaultClass,
          settings.businessName, settings.phone, settings.email, settings.whatsapp, settings.address, settings.gstNumber, settings.currency, settings.timezone, settings.bookingNotifications ? 1 : 0, settings.whatsappIntegration ? 1 : 0, settings.autoConfirm ? 1 : 0, settings.requirePhone ? 1 : 0, settings.defaultPassengers, settings.defaultClass
        ]
      );
      return;
    }
    const data = readFallbackData();
    data.settings = { ...data.settings, ...settings };
    writeFallbackData(data);
  }
};
