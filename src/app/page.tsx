'use client';
import { useState } from 'react';

interface Incident {
  id: number;
  title: string;
  category: string;
  location: string;
  detail: string;
  time: string;
}

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 1,
      title: 'รถติดหนักมาก หน้ามหาลัย',
      category: '🚗 จราจร',
      location: 'ถนนสายหลัก หน้าประตู 1 (15.1234, 100.1234)',
      detail: 'มีรถเสียเลนขวา ท้ายสะสม 2 กิโลเมตร',
      time: '10 นาทีที่แล้ว',
    },
    {
      id: 2,
      title: 'น้ำท่วมขังรอการระบาย',
      category: '🌊 น้ำท่วม',
      location: 'ซอยสุขสันต์ 4',
      detail: 'ระดับน้ำสูงประมาณ 15-20 ซม. รถเล็กควรหลีกเลี่ยง',
      time: '25 นาทีที่แล้ว',
    },
  ]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('🚗 จราจร');
  const [location, setLocation] = useState('');
  const [detail, setDetail] = useState('');
  const [loadingGps, setLoadingGps] = useState(false);

  // ฟังก์ชันดึงพิกัด GPS จริงจากอุปกรณ์
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('อุปกรณ์ของคุณไม่รองรับการดึงพิกัด GPS');
      return;
    }
    setLoadingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lng = position.coords.longitude.toFixed(5);
        setLocation(`พิกัดปัจจุบัน (${lat}, ${lng})`);
        setLoadingGps(false);
      },
      () => {
        alert('ไม่สามารถดึงตำแหน่งได้ กรุณาเปิดอนุญาตการใช้ Location บนเบราว์เซอร์');
        setLoadingGps(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return alert('กรุณากรอกหัวข้อและสถานที่ครับ');

    const newIncident: Incident = {
      id: Date.now(),
      title,
      category,
      location,
      detail,
      time: 'เพิ่งแจ้งเมื่อครู่',
    };

    setIncidents([newIncident, ...incidents]);
    setTitle('');
    setLocation('');
    setDetail('');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>
        <h1 style={{ color: '#d97706', fontSize: '26px', marginBottom: '8px' }}>
          🚨 ระบบแจ้งเหตุและรายงานสถานการณ์ Real-time
        </h1>
        <p style={{ color: '#4b5563', margin: 0 }}>รายงานอุบัติเหตุ สภาพจราจร และภัยพิบัติรอบตัวคุณ</p>
      </header>

      <div style={{ display: 'grid', gap: '20px' }}>
        {/* ฟอร์มแจ้งเหตุ */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#1e293b' }}>➕ แจ้งเหตุการณ์ใหม่</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>หัวข้อเหตุการณ์:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น รถชนกัน, ไฟดับ, น้ำท่วมขัง"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>หมวดหมู่:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                >
                  <option value="🚗 จราจร">🚗 จราจร</option>
                  <option value="⚠️ อุบัติเหตุ">⚠️ อุบัติเหตุ</option>
                  <option value="🌊 น้ำท่วม">🌊 น้ำท่วม</option>
                  <option value="🔥 อัคคีภัย">🔥 อัคคีภัย</option>
                  <option value="📢 อื่นๆ">📢 อื่นๆ</option>
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>สถานที่ / พิกัด:</label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    style={{
                      fontSize: '12px',
                      color: '#2563eb',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0
                    }}
                  >
                    {loadingGps ? '⌛ กำลังดึงพิกัด...' : '📍 ดึงตำแหน่งปัจจุบัน (GPS)'}
                  </button>
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="เช่น สี่แยกไฟแดง หรือกดดึงพิกัด GPS"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>รายละเอียดเพิ่มเติม:</label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={2}
                placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              🚀 ส่งรายงานเหตุการณ์
            </button>
          </form>
        </div>

        {/* รายการเหตุการณ์ */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#1e293b' }}>📍 เหตุการณ์ล่าสุดที่ได้รับแจ้ง</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {incidents.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span
                    style={{
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.category}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.time}</span>
                </div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#0f172a' }}>{item.title}</h3>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#334155' }}>📍 {item.location}</p>
                {item.detail && <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{item.detail}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}