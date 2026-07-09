'use client';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type TravelType = 'flight' | 'train' | 'bus' | 'cruise';

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  from: string;
  to: string;
  fromCity?: string;
  toCity?: string;
  travelType: TravelType;
  date: string;
  returnDate?: string;
  passengers: number;
  classType: string;
  status: BookingStatus;
  amount: number;
  agentId?: string;
  createdAt: string;
  notes?: string;
}

export interface City {
  id: string;
  name: string;
  code: string;
  state: string;
  country: string;
  type: 'airport' | 'railway' | 'bus_stand' | 'port';
  isPopular: boolean;
}

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalCustomers: number;
  newCustomers: number;
  cancelledRate: number;
}

// ─── Local Cities Database ────────────────────────────────────────
export const LOCAL_CITIES: City[] = [
  { id: '1', name: 'Indore', code: 'IDR', state: 'Madhya Pradesh', country: 'India', type: 'airport', isPopular: true },
  { id: '2', name: 'Mumbai', code: 'BOM', state: 'Maharashtra', country: 'India', type: 'airport', isPopular: true },
  { id: '3', name: 'Delhi', code: 'DEL', state: 'Delhi', country: 'India', type: 'airport', isPopular: true },
  { id: '4', name: 'Bangalore', code: 'BLR', state: 'Karnataka', country: 'India', type: 'airport', isPopular: true },
  { id: '5', name: 'Hyderabad', code: 'HYD', state: 'Telangana', country: 'India', type: 'airport', isPopular: true },
  { id: '6', name: 'Chennai', code: 'MAA', state: 'Tamil Nadu', country: 'India', type: 'airport', isPopular: true },
  { id: '7', name: 'Kolkata', code: 'CCU', state: 'West Bengal', country: 'India', type: 'airport', isPopular: true },
  { id: '8', name: 'Pune', code: 'PNQ', state: 'Maharashtra', country: 'India', type: 'airport', isPopular: true },
  { id: '9', name: 'Ahmedabad', code: 'AMD', state: 'Gujarat', country: 'India', type: 'airport', isPopular: true },
  { id: '10', name: 'Jaipur', code: 'JAI', state: 'Rajasthan', country: 'India', type: 'airport', isPopular: true },
  { id: '11', name: 'Varanasi', code: 'VNS', state: 'Uttar Pradesh', country: 'India', type: 'airport', isPopular: true },
  { id: '12', name: 'Goa', code: 'GOI', state: 'Goa', country: 'India', type: 'airport', isPopular: true },
  { id: '13', name: 'Bhopal', code: 'BHO', state: 'Madhya Pradesh', country: 'India', type: 'railway', isPopular: true },
  { id: '14', name: 'Ujjain', code: 'UJN', state: 'Madhya Pradesh', country: 'India', type: 'railway', isPopular: false },
  { id: '15', name: 'Kedarnath', code: 'KDN', state: 'Uttarakhand', country: 'India', type: 'bus_stand', isPopular: true },
  { id: '16', name: 'Rishikesh', code: 'RSK', state: 'Uttarakhand', country: 'India', type: 'bus_stand', isPopular: true },
  { id: '17', name: 'Haridwar', code: 'HDW', state: 'Uttarakhand', country: 'India', type: 'railway', isPopular: true },
  { id: '18', name: 'Leh', code: 'IXL', state: 'Ladakh', country: 'India', type: 'airport', isPopular: true },
  { id: '19', name: 'Srinagar', code: 'SXR', state: 'Jammu & Kashmir', country: 'India', type: 'airport', isPopular: true },
  { id: '20', name: 'Amritsar', code: 'ATQ', state: 'Punjab', country: 'India', type: 'airport', isPopular: true },
  { id: '21', name: 'Kochi', code: 'COK', state: 'Kerala', country: 'India', type: 'airport', isPopular: true },
  { id: '22', name: 'Mangalore', code: 'IXE', state: 'Karnataka', country: 'India', type: 'airport', isPopular: false },
  { id: '23', name: 'Nagpur', code: 'NAG', state: 'Maharashtra', country: 'India', type: 'airport', isPopular: false },
  { id: '24', name: 'Patna', code: 'PAT', state: 'Bihar', country: 'India', type: 'airport', isPopular: false },
  { id: '25', name: 'Lucknow', code: 'LKO', state: 'Uttar Pradesh', country: 'India', type: 'airport', isPopular: false },
  { id: '26', name: 'Agra', code: 'AGR', state: 'Uttar Pradesh', country: 'India', type: 'railway', isPopular: true },
  { id: '27', name: 'Udaipur', code: 'UDR', state: 'Rajasthan', country: 'India', type: 'airport', isPopular: true },
  { id: '28', name: 'Jodhpur', code: 'JDH', state: 'Rajasthan', country: 'India', type: 'airport', isPopular: false },
  { id: '29', name: 'Mysore', code: 'MYS', state: 'Karnataka', country: 'India', type: 'railway', isPopular: false },
  { id: '30', name: 'Visakhapatnam', code: 'VTZ', state: 'Andhra Pradesh', country: 'India', type: 'airport', isPopular: false },
];

// ─── Mock Bookings Data ───────────────────────────────────────────
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'SHV-001',
    customerName: 'Arun Kumar',
    customerPhone: '+91 98765 43210',
    customerEmail: 'arun@email.com',
    from: 'Indore (IDR)',
    to: 'Mumbai (BOM)',
    travelType: 'flight',
    date: '2026-07-15',
    passengers: 2,
    classType: 'Economy',
    status: 'confirmed',
    amount: 8400,
    agentId: '3',
    createdAt: '2026-07-09T08:30:00Z',
    notes: 'Honeymoon couple, needs special meal',
  },
  {
    id: 'SHV-002',
    customerName: 'Meera Joshi',
    customerPhone: '+91 87654 32109',
    from: 'Indore (INDB)',
    to: 'Delhi (NDLS)',
    travelType: 'train',
    date: '2026-07-20',
    returnDate: '2026-07-25',
    passengers: 1,
    classType: 'AC 2 Tier',
    status: 'pending',
    amount: 2800,
    agentId: '3',
    createdAt: '2026-07-09T10:00:00Z',
  },
  {
    id: 'SHV-003',
    customerName: 'Vikram Singh',
    customerPhone: '+91 76543 21098',
    customerEmail: 'vikram@email.com',
    from: 'Mumbai (BOM)',
    to: 'Goa (GOI)',
    travelType: 'cruise',
    date: '2026-08-01',
    returnDate: '2026-08-05',
    passengers: 4,
    classType: 'Balcony Suite',
    status: 'confirmed',
    amount: 85000,
    agentId: '2',
    createdAt: '2026-07-08T14:00:00Z',
  },
  {
    id: 'SHV-004',
    customerName: 'Priya Nair',
    customerPhone: '+91 65432 10987',
    from: 'Indore (IND)',
    to: 'Bhopal (BPL)',
    travelType: 'bus',
    date: '2026-07-12',
    passengers: 3,
    classType: 'AC Sleeper',
    status: 'completed',
    amount: 1350,
    agentId: '3',
    createdAt: '2026-07-07T09:00:00Z',
  },
  {
    id: 'SHV-005',
    customerName: 'Rahul Gupta',
    customerPhone: '+91 54321 09876',
    from: 'Delhi (DEL)',
    to: 'Srinagar (SXR)',
    travelType: 'flight',
    date: '2026-07-18',
    returnDate: '2026-07-22',
    passengers: 2,
    classType: 'Business',
    status: 'pending',
    amount: 42000,
    agentId: '2',
    createdAt: '2026-07-09T12:00:00Z',
  },
  {
    id: 'SHV-006',
    customerName: 'Sunita Sharma',
    customerPhone: '+91 43210 98765',
    from: 'Varanasi (BSB)',
    to: 'Mumbai (MMCT)',
    travelType: 'train',
    date: '2026-07-14',
    passengers: 5,
    classType: 'Sleeper Class',
    status: 'cancelled',
    amount: 4500,
    agentId: '3',
    createdAt: '2026-07-06T11:00:00Z',
    notes: 'Cancelled due to emergency',
  },
  {
    id: 'SHV-007',
    customerName: 'Deepak Mehta',
    customerPhone: '+91 32109 87654',
    from: 'Indore (IDR)',
    to: 'Kedarnath (KDN)',
    travelType: 'bus',
    date: '2026-07-25',
    passengers: 8,
    classType: 'AC Seater',
    status: 'confirmed',
    amount: 12800,
    agentId: '3',
    createdAt: '2026-07-09T15:00:00Z',
    notes: 'Pilgrimage group, need temple permits',
  },
  {
    id: 'SHV-008',
    customerName: 'Anita Reddy',
    customerPhone: '+91 21098 76543',
    customerEmail: 'anita@email.com',
    from: 'Hyderabad (HYD)',
    to: 'Leh (IXL)',
    travelType: 'flight',
    date: '2026-08-10',
    returnDate: '2026-08-17',
    passengers: 2,
    classType: 'Economy',
    status: 'confirmed',
    amount: 28000,
    agentId: '2',
    createdAt: '2026-07-08T16:00:00Z',
  },
];

// ─── Dashboard Stats ──────────────────────────────────────────────
export const DASHBOARD_STATS: DashboardStats = {
  totalBookings: 247,
  pendingBookings: 18,
  confirmedBookings: 189,
  totalRevenue: 4250000,
  monthlyRevenue: 620000,
  totalCustomers: 183,
  newCustomers: 24,
  cancelledRate: 4.2,
};

// ─── Revenue Chart Data (last 7 days) ────────────────────────────
export const REVENUE_DATA = [
  { day: 'Mon', revenue: 85000, bookings: 8 },
  { day: 'Tue', revenue: 102000, bookings: 12 },
  { day: 'Wed', revenue: 78000, bookings: 9 },
  { day: 'Thu', revenue: 145000, bookings: 15 },
  { day: 'Fri', revenue: 95000, bookings: 11 },
  { day: 'Sat', revenue: 168000, bookings: 19 },
  { day: 'Sun', revenue: 52000, bookings: 6 },
];

// ─── Travel Type Distribution ─────────────────────────────────────
export const TRAVEL_TYPE_STATS = [
  { type: 'Flight', count: 112, revenue: 2450000, color: '#ff0000' },
  { type: 'Train', count: 68, revenue: 890000, color: '#f59e0b' },
  { type: 'Bus', count: 47, revenue: 320000, color: '#3b82f6' },
  { type: 'Cruise', count: 20, revenue: 590000, color: '#8b5cf6' },
];

// ─── Search cities (local + API) ─────────────────────────────────
export async function searchCities(query: string): Promise<{ name: string; code: string; state: string }[]> {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return [];

  // First search local database
  const localResults = LOCAL_CITIES
    .filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map(c => ({ name: c.name, code: c.code, state: c.state }));

  // Then try free GeoDB Cities API (no auth needed for basic search)
  try {
    const response = await fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(query)}&countryIds=IN&limit=5`,
      {
        headers: {
          'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      const apiResults = (data.data || []).map((city: { name: string; regionCode: string; region: string }) => ({
        name: city.name,
        code: city.regionCode || city.name.slice(0, 3).toUpperCase(),
        state: city.region,
      }));
      // Merge local + API, deduplicate by name
      const merged = [...localResults];
      for (const r of apiResults) {
        if (!merged.find(m => m.name.toLowerCase() === r.name.toLowerCase())) {
          merged.push(r);
        }
      }
      return merged.slice(0, 8);
    }
  } catch {
    // API failed, use local only
  }

  return localResults;
}

// ─── Simplified free API using countrystatecity or open-meteo geo ─
export async function searchCitiesSimple(query: string): Promise<{ name: string; state: string; country: string }[]> {
  if (!query || query.length < 2) return [];

  // Use free Open-Meteo Geocoding API (no API key needed!)
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
    );
    if (response.ok) {
      const data = await response.json();
      return (data.results || [])
        .filter((r: { country_code: string }) => r.country_code === 'IN')
        .map((r: { name: string; admin1: string; country: string }) => ({
          name: r.name,
          state: r.admin1 || '',
          country: r.country,
        }));
    }
  } catch {
    // noop
  }

  // Fallback to local
  const q = query.toLowerCase();
  return LOCAL_CITIES
    .filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
    .slice(0, 8)
    .map(c => ({ name: c.name, state: c.state, country: c.country }));
}
