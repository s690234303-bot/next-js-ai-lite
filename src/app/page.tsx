'use client';
import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

// 🔴 วาง Config จาก Firebase Console ตรงนี้ (หากยังไม่ได้เชื่อม สามารถใช้ทดสอบหน้าเว็บก่อนได้)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

interface FloodReport {
  id: string;
  title: string;
  district: string;
  level: 'วิกฤต (ท่วมสูง)' | 'เฝ้าระวัง' | 'ปกติ';
  lat: number;
  lng: number;
  detail: string;
  createdAt?: any;
}

// ข้อมูลสถานีวัดระดับน้ำแม่น้ำหลักในนครสวรรค์ (สไตล์ Faonam)
const WATER_STATIONS = [
  {
    id: 'C.2',
    name: 'สถานี C.2 ปากน้ำโพ',
    river: 'แม่น้ำเจ้าพระยา (อ.เมือง)',
    flow: '2,450 ลบ.ม./วินาที',
    capacityPercent: 92,
    status: 'วิกฤต',
    color: '#ef4444',
  },
  {
    id: 'N.67',
    name: 'สถานี N.67 บรรพตพิสัย',
    river: 'แม่น้ำปิง (อ.บรรพตพิสัย)',
    flow: '1,120 ลบ.ม./วินาที',
    capacityPercent: 78,
    status: 'เฝ้าระวัง',
    color: '#eab308',
  },
  {
    id: 'N.1',
    name: 'สถานี N.1 ชุมแสง',
    river: 'แม่น้ำน่าน (อ.ชุมแสง)',
    flow: '850 ลบ.ม./วินาที',
    capacityPercent: 55,
    status: 'ปกติ',
    color: '#22c55e',
  },
];

export default function FaonamNakhonSawan() {
  const [reports, setReports] = useState<FloodReport[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ทั้งหมด');
  const [showForm, setShowForm] = useState(false);

  // ฟอร์ม
  const [title, setTitle] = useState('');
  const [district, setDistrict] = useState('อ.เมืองนครสวรรค์');
  const [level, setLevel] = useState<'วิกฤต (ท่วมสูง)' | 'เฝ้าระวัง' | 'ปกติ'>('เฝ้าระวัง');
  const [detail, setDetail] = useState('');
  const [lat, setLat] = useState('15.7023');
  const [lng, setLng] = useState('100.1372');
  const [submitting, setSubmitting] = useState(false);

  // ดึงข้อมูล Real-time
  useEffect(() => {
    try {
      const q = query(collection(db, 'flood_reports'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: FloodReport[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as FloodReport);
        });
        setReports(list);
      });
      return () => unsubscribe();
    } catch (e) {
      console.log('Firebase not configured yet, running in preview mode');
    }
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert('อุปกรณ์ไม่รองรับ GPS');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(4));
        setLng(pos.coords.longitude.toFixed(4));
      },
      () => alert('ไม่สามารถดึง GPS ได้')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert('กรุณากรอกหัวข้อแจ้งเหตุ');

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'flood_reports'), {
        title,
        district,
        level,
        lat: parseFloat(lat) || 15.7023,
        lng: parseFloat(lng) || 100.1372,
        detail,
        createdAt: serverTimestamp(),
      });

      setTitle('');
      setDetail('');
      setShowForm(false);
      alert('บันทึกการแจ้งเหตุเรียบร้อยแล้ว!');
    } catch (error) {
      // Mock local fallback if DB key not replaced
      const mockNew: FloodReport = {
        id: Date.now().toString(),
        title,
        district,
        level,
        lat: parseFloat(lat) || 15.7023,
        lng: parseFloat(lng) || 100.1372,
        detail,
      };
      setReports([mockNew, ...reports]);
      setTitle('');
      setDetail('');
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = selectedDistrict === 'ทั้งหมด' 
    ? reports 
    : reports.filter(r => r.district === selectedDistrict);

  return (
    <div style={{ background: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '40px' }}>
      
      {/* Navbar สไตล์ Faonam */}
      <nav style={{ background: '#1e293b', padding: '15px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', sticky: 'top' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>💧</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>FAONAM • นครสวรรค์</h1>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>ระบบเฝ้าระวังและติดตามสถานการณ์น้ำ จ.นครสวรรค์</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
        >
          {showForm ? '✖ ปิดฟอร์ม' : '🚨 แจ้งเหตุน้ำท่วม'}
        </button>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
        
        {/* Banner สรุปภาพรวม */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
          <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>สถานะภาพรวมจังหวัด</span>
            <h2 style={{ margin: '5px 0 0 0', color: '#ef4444', fontSize: '20px' }}>🔴 เฝ้าระวังระดับสูง</h2>
          </div>
          <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #38bdf8' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>จุดแจ้งเหตุทั้งหมด</span>
            <h2 style={{ margin: '5px 0 0 0', color: '#38bdf8', fontSize: '20px' }}>{reports.length} จุด</h2>
          </div>
          <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #eab308' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>จุดวิกฤต (น้ำท่วมสูง)</span>
            <h2 style={{ margin: '5px 0 0 0', color: '#eab308', fontSize: '20px' }}>
              {reports.filter(r => r.level === 'วิกฤต (ท่วมสูง)').length} จุด
            </h2>
          </div>
        </div>

        {/* Section 1: เกจวัดระดับน้ำแม่น้ำหลัก (Faonam Water Station Gauges) */}
        <h2 style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          📊 สถานีตรวจวัดระดับน้ำหลัก (ปากน้ำโพ / ปิง / น่าน)
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          {WATER_STATIONS.map((station) => (
            <div key={station.id} style={{ background: '#1e293b', padding: '18px', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#cbd5e1' }}>{station.id}</span>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: `${station.color}22`, color: station.color, border: `1px solid ${station.color}` }}>
                  {station.status}
                </span>
              </div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#f8fafc' }}>{station.name}</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#94a3b8' }}>{station.river}</p>

              {/* Progress Bar แสดงระดับความจุตลิ่ง */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: '#94a3b8' }}>ระดับความจุตลิ่ง</span>
                  <span style={{ fontWeight: 'bold', color: station.color }}>{station.capacityPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${station.capacityPercent}%`, height: '100%', background: station.color, borderRadius: '4px' }} />
                </div>
              </div>

              <span style={{ fontSize: '11px', color: '#64748b' }}>อัตราการไหล: {station.flow}</span>
            </div>
          ))}
        </div>

        {/* Form โมดอล/กล่องแจ้งเหตุ (ซ่อน/แสดงได้) */}
        {showForm && (
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #38bdf8', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', color: '#38bdf8', marginBottom: '15px' }}>📢 รายงานสถานการณ์น้ำท่วม / ขอความช่วยเหลือ</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>อำเภอ:</label>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} style={{ width: '100%', padding: '8px', background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '6px' }}>
                  <option value="อ.เมืองนครสวรรค์">อ.เมืองนครสวรรค์</option>
                  <option value="อ.ชุมแสง">อ.ชุมแสง</option>
                  <option value="อ.บรรพตพิสัย">อ.บรรพตพิสัย</option>
                  <option value="อ.พยุหะคีรี">อ.พยุหะคีรี</option>
                  <option value="อ.ลาดยาว">อ.ลาดยาว</option>
                  <option value="อ.ตาคลี">อ.ตาคลี</option>
                  <option value="อ.เก้าเลี้ยว">อ.เก้าเลี้ยว</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>ระดับความรุนแรง:</label>
                <select value={level} onChange={(e) => setLevel(e.target.value as any)} style={{ width: '100%', padding: '8px', background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '6px' }}>
                  <option value="วิกฤต (ท่วมสูง)">🔴 วิกฤต (ท่วมสูง)</option>
                  <option value="เฝ้าระวัง">🟡 เฝ้าระวัง (น้ำเอ่อตลิ่ง)</option>
                  <option value="ปกติ">🟢 ปกติ (น้ำแห้งแล้ว)</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>หัวข้อ / จุดเกิดเหตุ:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="เช่น ถนนเลียบแม่น้ำเจ้าพระยาน้ำท่วมสูง 30 ซม." style={{ width: '100%', padding: '8px', background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>รายละเอียดเพิ่มเติม:</label>
                <textarea value={detail} onChange={(e) => setDetail(e.target.value)} rows={2} placeholder="ระบุเบอร์โทรติดต่อ หรือสิ่งที่ต้องการความช่วยเหลือ..." style={{ width: '100%', padding: '8px', background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button type="button" onClick={handleGetLocation} style={{ padding: '8px 12px', background: '#334155', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                  📍 ดึงพิกัด GPS ({lat}, {lng})
                </button>
              </div>

              <button type="submit" disabled={submitting} style={{ gridColumn: '1 / -1', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                {submitting ? 'กำลังบันทึก...' : '🚀 ส่งรายงานสถานการณ์'}
              </button>
            </form>
          </div>
        )}

        {/* Section 2: รายงานเหตุการณ์จากภาคประชาชน */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '16px', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
            📍 รายงานสถานการณ์สดจากประชาชนในพื้นที่
          </h2>
          
          {/*ตัวกรองแยกอำเภอ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>กรองอำเภอ:</span>
            <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} style={{ padding: '6px 12px', background: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '6px', fontSize: '12px' }}>
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="อ.เมืองนครสวรรค์">อ.เมืองนครสวรรค์</option>
              <option value="อ.ชุมแสง">อ.ชุมแสง</option>
              <option value="อ.บรรพตพิสัย">อ.บรรพตพิสัย</option>
              <option value="อ.พยุหะคีรี">อ.พยุหะคีรี</option>
            </select>
          </div>
        </div>

        {/* Feed การ์ดรายงาน */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '15px' }}>
          {filteredReports.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', background: '#1e293b', borderRadius: '12px', gridColumn: '1 / -1' }}>
              ยังไม่มีรายงานในพื้นที่นี้ กดปุ่ม "🚨 แจ้งเหตุน้ำท่วม" ด้านบนเพื่อเพิ่มข้อมูลได้เลย
            </div>
          ) : (
            filteredReports.map((item) => (
              <div key={item.id} style={{ background: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold' }}>{item.district}</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: item.level === 'วิกฤต (ท่วมสูง)' ? '#ef444422' : '#eab30822', color: item.level === 'วิกฤต (ท่วมสูง)' ? '#ef4444' : '#eab308' }}>
                    {item.level}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#f8fafc' }}>{item.title}</h3>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#94a3b8' }}>{item.detail || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  📍 พิกัด GPS: {item.lat}, {item.lng}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}