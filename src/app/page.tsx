'use client';
import { useState, useEffect, useRef } from 'react';

interface FloodReport {
  id: number;
  title: string;
  district: string;
  level: 'วิกฤต (ท่วมสูง)' | 'เฝ้าระวัง' | 'ปกติ';
  lat: number;
  lng: number;
  detail: string;
  time: string;
}

export default function NakhonSawanFloodApp() {
  // ข้อมูลจำลองจุดน้ำท่วม/เฝ้าระวังในจังหวัดนครสวรรค์
  const [reports, setReports] = useState<FloodReport[]>([
    {
      id: 1,
      title: 'น้ำเอ่อล้นตลิ่ง บริเวณตลาดปากน้ำโพ',
      district: 'อ.เมืองนครสวรรค์',
      level: 'วิกฤต (ท่วมสูง)',
      lat: 15.7023,
      lng: 100.1372,
      detail: 'ระดับน้ำเจ้าพระยาสูงขึ้น เอ่อเข้าท่วมพื้นที่ริมน้ำ ระดับน้ำ 30-40 ซม.',
      time: '15 นาทีที่แล้ว',
    },
    {
      id: 2,
      title: 'เฝ้าระวังระดับน้ำแม่น้ำน่าน ตลาดชุมแสง',
      district: 'อ.ชุมแสง',
      level: 'เฝ้าระวัง',
      lat: 15.8921,
      lng: 100.3015,
      detail: 'น้ำในแม่น้ำน่านทรงตัว มีการเตรียมกระสอบทรายกั้นริมตลิ่ง',
      time: '1 ชั่วโมงที่แล้ว',
    },
    {
      id: 3,
      title: 'น้ำท่วมขังพื้นที่เกษตรกรรม ริมแม่น้ำปิง',
      district: 'อ.บรรพตพิสัย',
      level: 'วิกฤต (ท่วมสูง)',
      lat: 15.9382,
      lng: 99.9812,
      detail: 'น้ำปิงไหลหลากเข้าท่วมนาข้าวและเส้นทางสัญจรในหมู่บ้าน',
      time: '2 ชั่วโมงที่แล้ว',
    },
  ]);

  // ฟอร์มรับแจ้งเหตุ
  const [title, setTitle] = useState('');
  const [district, setDistrict] = useState('อ.เมืองนครสวรรค์');
  const [level, setLevel] = useState<'วิกฤต (ท่วมสูง)' | 'เฝ้าระวัง' | 'ปกติ'>('เฝ้าระวัง');
  const [detail, setDetail] = useState('');
  const [lat, setLat] = useState('15.7023');
  const [lng, setLng] = useState('100.1372');
  const [loadingGps, setLoadingGps] = useState(false);

  // ดึงพิกัด GPS นครสวรรค์
  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert('อุปกรณ์ไม่รองรับ GPS');
    setLoadingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(4));
        setLng(pos.coords.longitude.toFixed(4));
        setLoadingGps(false);
      },
      () => {
        alert('ไม่สามารถดึงตำแหน่งได้');
        setLoadingGps(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert('กรุณากรอกหัวข้อแจ้งเหตุ');

    const newReport: FloodReport = {
      id: Date.now(),
      title,
      district,
      level,
      lat: parseFloat(lat) || 15.7023,
      lng: parseFloat(lng) || 100.1372,
      detail,
      time: 'เพิ่งแจ้งเมื่อครู่',
    };

    setReports([newReport, ...reports]);
    setTitle('');
    setDetail('');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '25px', padding: '20px', background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: 'white', borderRadius: '16px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '26px' }}>🌊 ศูนย์อัปเดตสถานการณ์น้ำท่วม จ.นครสวรรค์</h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>ติดตามระดับน้ำแม่น้ำเจ้าพระยา-ปิง-น่าน และแจ้งเหตุช่วยเหลือชาวนครสวรรค์ Real-time</p>
      </header>

      {/* สรุปสถานการณ์น้ำในแม่น้ำหลักนครสวรรค์ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ padding: '15px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px' }}>
          <span style={{ fontSize: '12px', color: '#991b1b', fontWeight: 'bold' }}>สถานี C.2 ปากน้ำโพ (แม่น้ำเจ้าพระยา)</span>
          <h3 style={{ margin: '5px 0', color: '#dc2626' }}>🔴 วิกฤต (ล้นตลิ่ง)</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#7f1d1d' }}>อัตราการไหล: 2,450 ลบ.ม./วินาที</p>
        </div>
        <div style={{ padding: '15px', background: '#fffbe3', border: '1px solid #fde047', borderRadius: '12px' }}>
          <span style={{ fontSize: '12px', color: '#854d0e', fontWeight: 'bold' }}>สถานี N.67 บรรพตพิสัย (แม่น้ำปิง)</span>
          <h3 style={{ margin: '5px 0', color: '#ca8a04' }}>🟡 เฝ้าระวัง</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#713f12' }}>ระดับน้ำต่ำกว่าตลิ่ง 0.85 เมตร</p>
        </div>
        <div style={{ padding: '15px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px' }}>
          <span style={{ fontSize: '12px', color: '#166534', fontWeight: 'bold' }}>สถานี N.1 ชุมแสง (แม่น้ำน่าน)</span>
          <h3 style={{ margin: '5px 0', color: '#16a34a' }}>🟢 ปกติ</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#14532d' }}>ระดับน้ำต่ำกว่าตลิ่ง 1.40 เมตร</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* ฝั่งซ้าย: ฟอร์มแจ้งเหตุน้ำท่วม */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#1e293b' }}>📢 แจ้งเหตุน้ำท่วม / ขอความช่วยเหลือ</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>อำเภอ:</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value="อ.เมืองนครสวรรค์">อ.เมืองนครสวรรค์</option>
                <option value="อ.ชุมแสง">อ.ชุมแสง</option>
                <option value="อ.บรรพตพิสัย">อ.บรรพตพิสัย</option>
                <option value="อ.พยุหะคีรี">อ.พยุหะคีรี</option>
                <option value="อ.ลาดยาว">อ.ลาดยาว</option>
                <option value="อ.ตาคลี">อ.ตาคลี</option>
                <option value="อ.เก้าเลี้ยว">อ.เก้าเลี้ยว</option>
                <option value="อ.โกรกพระ">อ.โกรกพระ</option>
                <option value="อ.หนองบัว">อ.หนองบัว</option>
                <option value="อ.ไพศาลี">อ.ไพศาลี</option>
                <option value="อ.ตากฟ้า">อ.ตากฟ้า</option>
                <option value="อ.แม่วงก์">อ.แม่วงก์</option>
                <option value="อ.แม่เปิน">อ.แม่เปิน</option>
                <option value="อ.ชุมตาบง">อ.ชุมตาบง</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>ระดับความรุนแรง:</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value="วิกฤต (ท่วมสูง)">🔴 วิกฤต (ท่วมสูง / ตัดขาด)</option>
                <option value="เฝ้าระวัง">🟡 เฝ้าระวัง (น้ำเอ่อตลิ่ง)</option>
                <option value="ปกติ">🟢 ปกติ (น้ำแห้งลงแล้ว)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>หัวข้อ / จุดที่เกิดเหตุ:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น น้ำท่วมถนนเส้นหลัก, ต้องการกระสอบทราย"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
                  พิกัด (Lat, Lng):
                </label>
                <input
                  type="text"
                  value={`${lat}, ${lng}`}
                  readOnly
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', boxSizing: 'border-box' }}
                />
              </div>
              <button
                type="button"
                onClick={handleGetLocation}
                style={{ alignSelf: 'flex-end', padding: '8px 12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
              >
                {loadingGps ? '⌛...' : '📍 ดึง GPS'}
              </button>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>รายละเอียดเพิ่มเติม / ช่องทางติดต่อ:</label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={2}
                placeholder="เช่น ระดับน้ำสูงเท่าเอว ต้องการเรือด่วน เบอร์โทร 08X-XXX-XXXX"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{ padding: '10px', background: '#dc2626', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              🚨 ส่งข้อมูลแจ้งเหตุน้ำท่วม
            </button>
          </form>
        </div>

        {/* ฝั่งขวา: รายการแจ้งเหตุสดในจังหวัดนครสวรรค์ */}
        <div>
          <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#1e293b' }}>📌 รายงานสถานการณ์ล่าสุดในพื้นที่</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reports.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '15px',
                  borderRadius: '10px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  borderLeft: `5px solid ${
                    item.level === 'วิกฤต (ท่วมสูง)' ? '#ef4444' : item.level === 'เฝ้าระวัง' ? '#eab308' : '#22c55e'
                  }`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '10px' }}>
                    {item.district}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.time}</span>
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#0f172a' }}>{item.title}</h3>
                <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#475569' }}>{item.detail}</p>
                <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', gap: '10px' }}>
                  <span>📍 พิกัด: {item.lat}, {item.lng}</span>
                  <span style={{ fontWeight: 'bold', color: item.level === 'วิกฤต (ท่วมสูง)' ? '#dc2626' : '#ca8a04' }}>
                    [{item.level}]
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}