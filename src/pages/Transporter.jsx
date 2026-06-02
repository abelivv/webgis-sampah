import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Map from "../components/Map";

// ── Floral Soft Pink & Beige Design Tokens ──────────────────
const C = {
  blush:      "#f2c4ce",
  blushLight: "#fdf0f3",
  blushMid:   "#e8a0b0",
  blushDeep:  "#c0607a",
  peach:      "#f5ddd4",
  peachLight: "#fdf6f2",
  beige:      "#f0e6d6",
  beigeLight: "#fdf9f4",
  beigeMid:   "#e0cdb8",
  petal:      "#fce8ee",
  rose:       "#d4859a",
  text:       "#5a3a42",
  textMid:    "#8a6070",
  textLight:  "#c0a0a8",
  white:      "#fffaf8",
  green:      "#7ab89a",
  greenLight: "#eaf5ef",
  red:        "#d4607a",
  redLight:   "#fceaee",
  blue:       "#7aaed4",
  blueLight:  "#eaf2fa",
};

const injectStyles = () => {
  if (document.getElementById("transporter-floral-styles")) return;
  const style = document.createElement("style");
  style.id = "transporter-floral-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700&display=swap');

    @keyframes petalFloat {
      0%   { transform: translateY(0px) rotate(0deg) scale(1);      opacity: 0.18; }
      50%  { transform: translateY(-22px) rotate(12deg) scale(1.08); opacity: 0.28; }
      100% { transform: translateY(0px) rotate(0deg) scale(1);      opacity: 0.18; }
    }
    @keyframes bloomIn {
      0%   { opacity: 0; transform: translateY(18px) scale(0.97); }
      100% { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes fadeSlide {
      0%   { opacity: 0; transform: translateX(-12px); }
      100% { opacity: 1; transform: translateX(0);     }
    }
    @keyframes rowReveal {
      0%   { opacity: 0; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0);   }
    }
    @keyframes pulseRose {
      0%, 100% { box-shadow: 0 0 0 0 rgba(212,133,154,0.18); }
      50%       { box-shadow: 0 0 0 6px rgba(212,133,154,0.06); }
    }
    @keyframes shimmerLine {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }

    .tr-page * { font-family: 'Lato', sans-serif; box-sizing: border-box; }
    .tr-page   { animation: bloomIn 0.6s ease both; }

    .tr-petal-bg { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
    .tr-petal    { position: absolute; border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; animation: petalFloat linear infinite; }

    /* Topbar */
    .tr-topbar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 32px;
      background: rgba(253,246,242,0.88);
      backdrop-filter: blur(18px);
      border-bottom: 1.5px solid #e0cdb8;
      position: sticky; top: 0; z-index: 50;
      animation: fadeSlide 0.5s ease both;
    }
    .tr-brand {
      font-family: 'Playfair Display', serif;
      font-size: 22px; font-weight: 700; color: #c0607a;
      letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;
    }
    .tr-brand::before { content: "✿"; font-size: 20px; color: #d4859a; }

    /* Content */
    .tr-content { max-width: 1100px; margin: 0 auto; padding: 36px 24px; position: relative; z-index: 1; }

    /* Tab bar */
    .tr-tab-bar {
      display: flex; gap: 6px; margin-bottom: 28px;
      background: rgba(253,249,244,0.85); padding: 6px 8px;
      border-radius: 16px; border: 1.5px solid #e0cdb8;
      width: fit-content;
      box-shadow: 0 2px 12px rgba(212,133,154,0.08);
      animation: bloomIn 0.5s 0.1s ease both;
    }
    .tr-tab-btn {
      padding: 9px 22px; border-radius: 12px; border: none;
      cursor: pointer; font-size: 13px; font-weight: 700;
      letter-spacing: 0.5px; transition: all 0.22s ease;
      font-family: 'Lato', sans-serif;
    }
    .tr-tab-btn.active {
      background: linear-gradient(135deg, #c0607a 0%, #d4859a 100%);
      color: #fffaf8; box-shadow: 0 3px 10px rgba(192,96,122,0.28);
    }
    .tr-tab-btn:not(.active) { background: transparent; color: #8a6070; }
    .tr-tab-btn:not(.active):hover { background: #fce8ee; color: #c0607a; }

    /* Table */
    .tr-table-wrap {
      background: rgba(253,249,244,0.92); border-radius: 18px;
      border: 1.5px solid #e0cdb8; overflow: hidden;
      box-shadow: 0 4px 24px rgba(212,133,154,0.10);
      animation: bloomIn 0.45s ease both;
    }
    .tr-table { width: 100%; border-collapse: collapse; font-size: 14px; table-layout: fixed; }
    .tr-table thead { background: linear-gradient(90deg, #fce8ee 0%, #f0e6d6 100%); }
    .tr-table th {
      padding: 14px 18px; text-align: center;
      font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
      color: #c0607a; border-bottom: 1.5px solid #e0cdb8;
    }
    .tr-table td {
      padding: 13px 18px; text-align: center;
      border-bottom: 1px solid rgba(224,205,184,0.5);
      color: #5a3a42; vertical-align: middle;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .tr-table tbody tr { animation: rowReveal 0.35s ease both; transition: background 0.18s; }
    .tr-table tbody tr:hover { background: rgba(252,232,238,0.35); }
    .tr-table tbody tr:last-child td { border-bottom: none; }

    /* Buttons */
    .tr-btn-logout {
      padding: 8px 20px; background: #fceaee; color: #d4607a;
      border: 1.5px solid #e8a0b0; border-radius: 24px;
      cursor: pointer; font-size: 13px; font-weight: 700;
      transition: all 0.2s; font-family: 'Lato', sans-serif;
    }
    .tr-btn-logout:hover { background: #d4607a; color: white; border-color: #d4607a; transform: translateY(-1px); }

    .tr-btn-green {
      padding: 5px 14px; background: #eaf5ef; color: #7ab89a;
      border: 1.5px solid #7ab89a; border-radius: 18px;
      cursor: pointer; font-size: 12px; font-weight: 700;
      margin-right: 6px; transition: all 0.18s; font-family: 'Lato', sans-serif;
    }
    .tr-btn-green:hover { background: #7ab89a; color: white; transform: translateY(-1px); }

    .tr-btn-blue {
      padding: 5px 14px; background: #eaf2fa; color: #7aaed4;
      border: 1.5px solid #7aaed4; border-radius: 18px;
      cursor: pointer; font-size: 12px; font-weight: 700;
      transition: all 0.18s; font-family: 'Lato', sans-serif;
    }
    .tr-btn-blue:hover { background: #7aaed4; color: white; transform: translateY(-1px); }

    .tr-btn-rose {
      padding: 5px 14px;
      background: linear-gradient(135deg, #c0607a, #d4859a);
      color: white; border: none; border-radius: 18px;
      cursor: pointer; font-size: 12px; font-weight: 700;
      margin-right: 6px; transition: all 0.18s; font-family: 'Lato', sans-serif;
      box-shadow: 0 2px 8px rgba(192,96,122,0.22);
    }
    .tr-btn-rose:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(192,96,122,0.32); }

    /* Badge */
    .tr-badge {
      display: inline-block; padding: 4px 13px;
      border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
    }
    .tr-badge-selesai { background: #eaf5ef; color: #7ab89a; }
    .tr-badge-proses  { background: #fce8ee; color: #c0607a; animation: pulseRose 2s ease infinite; }
    .tr-badge-menunggu { background: #fdf6f2; color: #8a6070; }

    .tr-empty td { text-align: center !important; color: #c0a0a8; padding: 32px !important; font-style: italic; }

    .tr-section { animation: bloomIn 0.4s ease both; }
  `;
  document.head.appendChild(style);
};

const PETALS = [
  { w: 38, h: 28, left: "5%",  top: "12%", delay: 0,   dur: 7,  color: "#f2c4ce" },
  { w: 22, h: 18, left: "18%", top: "35%", delay: 1.2, dur: 9,  color: "#f5ddd4" },
  { w: 45, h: 32, left: "33%", top: "6%",  delay: 0.5, dur: 11, color: "#fce8ee" },
  { w: 18, h: 14, left: "55%", top: "20%", delay: 2,   dur: 8,  color: "#e8a0b0" },
  { w: 30, h: 22, left: "70%", top: "50%", delay: 0.8, dur: 10, color: "#f5ddd4" },
  { w: 25, h: 20, left: "85%", top: "10%", delay: 1.5, dur: 7.5,color: "#f2c4ce" },
  { w: 20, h: 15, left: "90%", top: "70%", delay: 0.3, dur: 12, color: "#fce8ee" },
  { w: 35, h: 26, left: "12%", top: "75%", delay: 2.5, dur: 9,  color: "#e0cdb8" },
];

function PetalBg() {
  return (
    <div className="tr-petal-bg">
      {PETALS.map((p, i) => (
        <div key={i} className="tr-petal" style={{
          width: p.w, height: p.h, left: p.left, top: p.top,
          background: p.color,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`,
          opacity: 0.22,
        }} />
      ))}
    </div>
  );
}

function Badge({ status }) {
  const s = (status || "").toLowerCase();
  const cls = s === "selesai" ? "tr-badge-selesai"
    : s === "proses" ? "tr-badge-proses"
    : "tr-badge-menunggu";
  return <span className={`tr-badge ${cls}`}>{status}</span>;
}

export default function Transporter() {
  injectStyles();

  const [tab, setTab] = useState("peta");
  const [data, setData] = useState({ warga: [], tugas: [] });
  const [myId, setMyId] = useState(null);

  const parseLocation = (loc) => {
    if (!loc) return null;
    try {
      if (typeof loc === "string") return JSON.parse(loc);
      return loc;
    } catch { return null; }
  };

  const fetchAll = async (tid) => {
    const transporterId = tid || myId;
    const { data: wargaData } = await supabase.from("warga").select("*");
    const { data: tugasData } = await supabase
      .from("pengangkutan")
      .select("*, warga (*)")
      .eq("transporter_id", transporterId);
    setData({ warga: wargaData || [], tugas: tugasData || [] });
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setMyId(user.id);
      fetchAll(user.id);
    });
  }, []);

  const handleAction = async (id, status) => {
    const { error } = await supabase.from("pengangkutan").update({ status }).eq("id", id);
    if (error) { alert(error.message); return; }
    fetchAll();
  };

  const ambilTugas = async (wargaId) => {
    const { error } = await supabase.from("pengangkutan").insert([{
      warga_id: wargaId, transporter_id: myId, status: "proses"
    }]);
    if (error) { alert(error.message); return; }
    fetchAll();
  };

  const openRoute = (loc) => {
    const p = parseLocation(loc);
    if (!p?.lat || !p?.lng) { alert("Lokasi tidak tersedia"); return; }
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`, "_blank");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const TABS = ["peta", "warga", "tugas"];

  return (
    <div
      className="tr-page"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(150deg, #fdf9f4 0%, #fdf0f3 45%, #fdf6f2 75%, #f0e6d6 100%)",
      }}
    >
      <PetalBg />

      {/* Topbar */}
      <header className="tr-topbar">
        <div className="tr-brand">Dashboard Driver</div>
        <button className="tr-btn-logout" onClick={logout}>Logout</button>
      </header>

      <main className="tr-content">

        {/* Tab Bar */}
        <div className="tr-tab-bar">
          {TABS.map(t => (
            <button
              key={t}
              className={`tr-tab-btn${tab === t ? " active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* PETA */}
        {tab === "peta" && (
          <div className="tr-section">
            <Map data={data.warga} />
          </div>
        )}

        {/* WARGA */}
        {tab === "warga" && (
          <div className="tr-table-wrap tr-section">
            <table className="tr-table">
              <colgroup>
                <col style={{ width: "33.3%" }} />
                <col style={{ width: "33.3%" }} />
                <col style={{ width: "33.3%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Alamat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.warga.length === 0 && (
                  <tr className="tr-empty"><td colSpan={3}>Belum ada data warga.</td></tr>
                )}
                {data.warga.map(w => (
                  <tr key={w.id}>
                    <td>{w.nama}</td>
                    <td>{w.alamat}</td>
                    <td>
                      <button className="tr-btn-rose" onClick={() => ambilTugas(w.id)}>Ambil</button>
                      <button className="tr-btn-blue" onClick={() => openRoute(w.location)}>Rute</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TUGAS */}
        {tab === "tugas" && (
          <div className="tr-table-wrap tr-section">
            <table className="tr-table">
              <colgroup>
                <col style={{ width: "33.3%" }} />
                <col style={{ width: "33.3%" }} />
                <col style={{ width: "33.3%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Warga</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.tugas.length === 0 && (
                  <tr className="tr-empty"><td colSpan={3}>Belum ada tugas.</td></tr>
                )}
                {data.tugas.map(t => (
                  <tr key={t.id}>
                    <td>{t.warga?.nama}</td>
                    <td><Badge status={t.status} /></td>
                    <td>
                      {t.status === "proses" && (
                        <button className="tr-btn-green" onClick={() => handleAction(t.id, "selesai")}>Selesai</button>
                      )}
                      <button className="tr-btn-blue" onClick={() => openRoute(t.warga?.location)}>Rute</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}