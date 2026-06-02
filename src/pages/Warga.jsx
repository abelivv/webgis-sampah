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
  amber:      "#c8963c",
  amberLight: "#fdf3e3",
  purple:     "#9a72c0",
  purpleLight:"#f0eafa",
  red:        "#d4607a",
  redLight:   "#fceaee",
};

const injectStyles = () => {
  if (document.getElementById("warga-floral-styles")) return;
  const style = document.createElement("style");
  style.id = "warga-floral-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=Lato:wght@300;400;700&display=swap');

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
      0%   { opacity: 0; transform: translateY(6px); }
      100% { opacity: 1; transform: translateY(0);   }
    }
    @keyframes shimmerLine {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }

    .wg-page * { font-family: 'Lato', sans-serif; box-sizing: border-box; }
    .wg-page   { animation: bloomIn 0.6s ease both; }

    .wg-petal-bg { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
    .wg-petal    { position: absolute; border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; animation: petalFloat linear infinite; }

    /* Topbar */
    .wg-topbar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 32px;
      background: rgba(253,246,242,0.88); backdrop-filter: blur(18px);
      border-bottom: 1.5px solid #e0cdb8;
      position: sticky; top: 0; z-index: 50;
      animation: fadeSlide 0.5s ease both;
    }
    .wg-brand {
      font-family: 'Playfair Display', serif;
      font-size: 22px; font-weight: 700; color: #c0607a;
      letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;
    }
    .wg-brand::before { content: "✿"; font-size: 20px; color: #d4859a; }

    /* Content */
    .wg-content { max-width: 1100px; margin: 0 auto; padding: 36px 24px; position: relative; z-index: 1; }
    .wg-grid    { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media (max-width: 768px) { .wg-grid { grid-template-columns: 1fr; } }

    /* Card */
    .wg-card {
      background: rgba(253,249,244,0.92);
      border-radius: 18px; border: 1.5px solid #e0cdb8;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(212,133,154,0.10);
      animation: bloomIn 0.45s ease both;
    }
    .wg-card-header {
      padding: 16px 22px;
      background: linear-gradient(90deg, #fce8ee 0%, #f0e6d6 100%);
      border-bottom: 1.5px solid #e0cdb8;
      font-family: 'Playfair Display', serif;
      font-size: 16px; font-weight: 700; color: #c0607a;
      letter-spacing: 0.3px;
      display: flex; align-items: center; gap: 8px;
    }
    .wg-card-body { padding: 22px; }

    /* Section title */
    .wg-section-title {
      font-family: 'Playfair Display', serif;
      font-size: 15px; font-weight: 700; color: #c0607a;
      margin: 0 0 14px; letter-spacing: 0.3px;
      display: flex; align-items: center; gap: 6px;
    }
    .wg-section-title::before { content: "❀"; font-size: 13px; color: #d4859a; }

    /* Inputs */
    .wg-input {
      width: 100%; padding: 11px 16px;
      border: 1.5px solid #e0cdb8; border-radius: 12px;
      background: rgba(253,246,242,0.85); color: #5a3a42;
      font-size: 14px; font-family: 'Lato', sans-serif; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      margin-bottom: 12px;
    }
    .wg-input:focus {
      border-color: #d4859a;
      box-shadow: 0 0 0 4px rgba(212,133,154,0.15);
      background: #fffaf8;
    }
    .wg-input::placeholder { color: #c0a0a8; }

    /* Buttons */
    .wg-btn-logout {
      padding: 8px 20px; background: #fceaee; color: #d4607a;
      border: 1.5px solid #e8a0b0; border-radius: 24px;
      cursor: pointer; font-size: 13px; font-weight: 700;
      transition: all 0.2s; font-family: 'Lato', sans-serif;
    }
    .wg-btn-logout:hover { background: #d4607a; color: white; border-color: #d4607a; transform: translateY(-1px); }

    .wg-btn {
      width: 100%; padding: 12px;
      border: none; border-radius: 12px;
      cursor: pointer; font-size: 14px; font-weight: 700;
      font-family: 'Lato', sans-serif; letter-spacing: 0.3px;
      margin-bottom: 10px; transition: all 0.18s;
    }
    .wg-btn-rose {
      background: linear-gradient(135deg, #c0607a, #d4859a);
      color: white; box-shadow: 0 3px 12px rgba(192,96,122,0.25);
    }
    .wg-btn-rose:hover { transform: translateY(-2px); box-shadow: 0 5px 18px rgba(192,96,122,0.35); }

    .wg-btn-green {
      background: linear-gradient(135deg, #6aaa8a, #7ab89a);
      color: white; box-shadow: 0 3px 12px rgba(106,170,138,0.22);
    }
    .wg-btn-green:hover { transform: translateY(-2px); box-shadow: 0 5px 18px rgba(106,170,138,0.32); }

    .wg-btn-amber {
      background: linear-gradient(135deg, #b8863c, #c8963c);
      color: white; box-shadow: 0 3px 12px rgba(200,150,60,0.22);
    }
    .wg-btn-amber:hover { transform: translateY(-2px); box-shadow: 0 5px 18px rgba(200,150,60,0.32); }

    .wg-btn-purple {
      background: linear-gradient(135deg, #8a62b0, #9a72c0);
      color: white; box-shadow: 0 3px 12px rgba(154,114,192,0.22);
    }
    .wg-btn-purple:hover { transform: translateY(-2px); box-shadow: 0 5px 18px rgba(154,114,192,0.32); }

    /* History items */
    .wg-history-item {
      padding: 11px 14px;
      border-bottom: 1px solid rgba(224,205,184,0.5);
      font-size: 13px; color: #5a3a42;
      display: flex; justify-content: space-between; align-items: center;
      animation: rowReveal 0.3s ease both;
      transition: background 0.15s;
    }
    .wg-history-item:hover { background: rgba(252,232,238,0.3); }
    .wg-history-item:last-child { border-bottom: none; }
    .wg-history-date { font-size: 11px; color: #c0a0a8; font-weight: 700; }

    /* History status badge */
    .wg-badge {
      display: inline-block; padding: 3px 11px;
      border-radius: 20px; font-size: 11px; font-weight: 700;
    }
    .wg-badge-sudah    { background: #eaf5ef; color: #7ab89a; }
    .wg-badge-menunggu { background: #fce8ee; color: #c0607a; }
    .wg-badge-proses   { background: #f0eafa; color: #9a72c0; }
    .wg-badge-selesai  { background: #eaf5ef; color: #7ab89a; }

    .wg-empty { color: #c0a0a8; font-style: italic; font-size: 13px; padding: 12px 0; text-align: center; }

    .wg-divider {
      height: 1px; background: linear-gradient(90deg, transparent, #e0cdb8, transparent);
      margin: 16px 0;
    }
  `;
  document.head.appendChild(style);
};

const PETALS = [
  { w: 38, h: 28, left: "5%",  top: "12%", delay: 0,   dur: 7,  color: "#f2c4ce" },
  { w: 22, h: 18, left: "18%", top: "38%", delay: 1.2, dur: 9,  color: "#f5ddd4" },
  { w: 42, h: 30, left: "68%", top: "6%",  delay: 0.5, dur: 11, color: "#fce8ee" },
  { w: 18, h: 14, left: "84%", top: "28%", delay: 2,   dur: 8,  color: "#e8a0b0" },
  { w: 30, h: 22, left: "78%", top: "62%", delay: 0.8, dur: 10, color: "#f5ddd4" },
  { w: 25, h: 20, left: "10%", top: "72%", delay: 1.5, dur: 7.5,color: "#f2c4ce" },
  { w: 20, h: 15, left: "48%", top: "85%", delay: 0.3, dur: 12, color: "#fce8ee" },
];

function PetalBg() {
  return (
    <div className="wg-petal-bg">
      {PETALS.map((p, i) => (
        <div key={i} className="wg-petal" style={{
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

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const cls = s === "sudah" ? "wg-badge-sudah"
    : s === "selesai" ? "wg-badge-selesai"
    : s === "proses"  ? "wg-badge-proses"
    : "wg-badge-menunggu";
  return <span className={`wg-badge ${cls}`}>{status}</span>;
}

export default function Warga() {
  injectStyles();

  const [warga, setWarga]   = useState(null);
  const [latLng, setLatLng] = useState(null);
  const [form, setForm]     = useState({ nama: "", alamat: "", jenis: "", berat: "" });
  const [history, setHistory] = useState({ sampah: [], bayar: [], angkut: [] });

  const refresh = async (id) => {
    const s = await supabase.from("sampah").select("*").eq("warga_id", id);
    const b = await supabase.from("pembayaran").select("*").eq("warga_id", id);
    const a = await supabase.from("pengangkutan").select("*").eq("warga_id", id);
    setHistory({ sampah: s.data || [], bayar: b.data || [], angkut: a.data || [] });
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("warga").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
          if (data) {
            setWarga(data);
            setForm(f => ({ ...f, nama: data.nama, alamat: data.alamat }));
            refresh(data.id);
          }
        });
      }
    });
  }, []);

  const saveProfile = async () => {
    if (!latLng) return alert("Pilih lokasi di peta!");
    const user = (await supabase.auth.getUser()).data.user;
    const payload = { user_id: user.id, nama: form.nama, alamat: form.alamat, location: `POINT(${latLng.lng} ${latLng.lat})` };
    const { data } = warga
      ? await supabase.from("warga").update(payload).eq("id", warga.id).select().single()
      : await supabase.from("warga").insert(payload).select().single();
    if (data) { setWarga(data); alert("Profil disimpan!"); refresh(data.id); }
  };

  const addData = async (table, payload) => {
    if (!warga) return alert("Simpan profil dulu!");
    await supabase.from(table).insert({ warga_id: warga.id, ...payload });
    alert("Berhasil!"); refresh(warga.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.replace("/");
  };

  return (
    <div
      className="wg-page"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(150deg, #fdf9f4 0%, #fdf0f3 45%, #fdf6f2 75%, #f0e6d6 100%)",
      }}
    >
      <PetalBg />

      {/* Topbar */}
      <header className="wg-topbar">
        <div className="wg-brand">Portal Warga</div>
        <button className="wg-btn-logout" onClick={logout}>Logout</button>
      </header>

      <main className="wg-content">
        <div className="wg-grid">

          {/* ── Kolom Kiri: Profil + Aksi ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Profil & Lokasi */}
            <div className="wg-card">
              <div className="wg-card-header">❀ Profil &amp; Lokasi</div>
              <div className="wg-card-body">
                <input
                  className="wg-input"
                  placeholder="Nama lengkap"
                  value={form.nama}
                  onChange={e => setForm({ ...form, nama: e.target.value })}
                />
                <input
                  className="wg-input"
                  placeholder="Alamat"
                  value={form.alamat}
                  onChange={e => setForm({ ...form, alamat: e.target.value })}
                />
                <Map setLatLng={setLatLng} selectedMarker={latLng} />
                <button
                  className="wg-btn wg-btn-rose"
                  style={{ marginTop: 14 }}
                  onClick={saveProfile}
                >
                  Simpan Profil &amp; Lokasi
                </button>
              </div>
            </div>

            {/* Aksi */}
            <div className="wg-card">
              <div className="wg-card-header">✦ Aksi</div>
              <div className="wg-card-body">
                <p className="wg-section-title">Data Sampah</p>
                <input
                  className="wg-input"
                  placeholder="Jenis sampah"
                  onChange={e => setForm({ ...form, jenis: e.target.value })}
                />
                <input
                  className="wg-input"
                  placeholder="Berat (kg)"
                  type="number"
                  onChange={e => setForm({ ...form, berat: e.target.value })}
                />
                <button
                  className="wg-btn wg-btn-green"
                  onClick={() => addData("sampah", { jenis: form.jenis, berat: form.berat })}
                >
                  Kirim Data Sampah
                </button>

                <div className="wg-divider" />

                <button
                  className="wg-btn wg-btn-amber"
                  onClick={() => addData("pengangkutan", { status: "Menunggu" })}
                >
                  Request Pengangkutan
                </button>
                <button
                  className="wg-btn wg-btn-purple"
                  style={{ marginBottom: 0 }}
                  onClick={() => addData("pembayaran", { status: "sudah", tanggal: new Date() })}
                >
                  Bayar Iuran
                </button>
              </div>
            </div>

          </div>

          {/* ── Kolom Kanan: Riwayat ── */}
          <div className="wg-card" style={{ height: "fit-content" }}>
            <div className="wg-card-header">✿ Riwayat</div>
            <div className="wg-card-body">

              <p className="wg-section-title">Pengangkutan</p>
              {history.angkut.length === 0
                ? <div className="wg-empty">Belum ada riwayat pengangkutan.</div>
                : history.angkut.map(a => (
                  <div key={a.id} className="wg-history-item">
                    <span>{a.transporter_id ? "Ada Petugas" : "Menunggu Petugas"}</span>
                    <StatusBadge status={a.status} />
                  </div>
                ))
              }

              <div className="wg-divider" />

              <p className="wg-section-title">Pembayaran</p>
              {history.bayar.length === 0
                ? <div className="wg-empty">Belum ada riwayat pembayaran.</div>
                : history.bayar.map(b => (
                  <div key={b.id} className="wg-history-item">
                    <span className="wg-history-date">
                      {new Date(b.tanggal).toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" })}
                    </span>
                    <StatusBadge status={b.status} />
                  </div>
                ))
              }

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}