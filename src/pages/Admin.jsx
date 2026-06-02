import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Map from "../components/Map";

// ── Floral Soft Pink & Beige Design Tokens ──────────────────
const C = {
  blush:       "#f2c4ce",   // soft blush pink
  blushLight:  "#fdf0f3",   // near-white blush
  blushMid:    "#e8a0b0",   // medium blush
  blushDeep:   "#c0607a",   // deep rose (accents)
  peach:       "#f5ddd4",   // soft peach
  peachLight:  "#fdf6f2",   // near-white peach
  beige:       "#f0e6d6",   // warm beige
  beigeLight:  "#fdf9f4",   // near-white beige
  beigeMid:    "#e0cdb8",   // mid beige border
  petal:       "#fce8ee",   // petal pink bg
  rose:        "#d4859a",   // rose accent
  text:        "#5a3a42",   // primary text (dark rose-brown)
  textMid:     "#8a6070",   // secondary text
  textLight:   "#c0a0a8",   // muted text
  white:       "#fffaf8",
  green:       "#7ab89a",   // sage green
  greenLight:  "#eaf5ef",
  red:         "#d4607a",   // deep rose/red
  redLight:    "#fceaee",
};

// ── Keyframe CSS injected once ──────────────────────────────
const injectStyles = () => {
  if (document.getElementById("admin-floral-styles")) return;
  const style = document.createElement("style");
  style.id = "admin-floral-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

    @keyframes petalFloat {
      0%   { transform: translateY(0px) rotate(0deg) scale(1);   opacity: 0.18; }
      50%  { transform: translateY(-22px) rotate(12deg) scale(1.08); opacity: 0.28; }
      100% { transform: translateY(0px) rotate(0deg) scale(1);   opacity: 0.18; }
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
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0;  }
    }
    @keyframes pulseRose {
      0%, 100% { box-shadow: 0 0 0 0 rgba(212,133,154,0.18); }
      50%       { box-shadow: 0 0 0 6px rgba(212,133,154,0.06); }
    }

    .admin-page * {
      font-family: 'Lato', sans-serif;
      box-sizing: border-box;
    }
    .admin-page {
      animation: bloomIn 0.6s ease both;
    }

    /* Floating petals background */
    .petal-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    }
    .petal {
      position: absolute;
      border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
      animation: petalFloat linear infinite;
    }

    /* Topbar */
    .admin-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 32px;
      background: rgba(253,246,242,0.88);
      backdrop-filter: blur(18px);
      border-bottom: 1.5px solid ${C.beigeMid};
      position: sticky;
      top: 0;
      z-index: 50;
      animation: fadeSlide 0.5s ease both;
    }
    .admin-brand {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 700;
      color: ${C.blushDeep};
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .admin-brand::before {
      content: "✿";
      font-size: 20px;
      color: ${C.rose};
    }
    .btn-logout {
      padding: 8px 20px;
      background: ${C.redLight};
      color: ${C.red};
      border: 1.5px solid ${C.blushMid};
      border-radius: 24px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.4px;
      transition: all 0.2s ease;
    }
    .btn-logout:hover {
      background: ${C.red};
      color: ${C.white};
      border-color: ${C.red};
      transform: translateY(-1px);
    }

    /* Content */
    .admin-content {
      max-width: 1100px;
      margin: 0 auto;
      padding: 36px 24px;
      position: relative;
      z-index: 1;
    }

    /* Tab Bar */
    .tab-bar {
      display: flex;
      gap: 6px;
      margin-bottom: 28px;
      background: rgba(253,249,244,0.85);
      padding: 6px 8px;
      border-radius: 16px;
      border: 1.5px solid ${C.beigeMid};
      width: fit-content;
      box-shadow: 0 2px 12px rgba(212,133,154,0.08);
      animation: bloomIn 0.5s 0.1s ease both;
    }
    .tab-btn {
      padding: 9px 22px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      transition: all 0.22s ease;
      font-family: 'Lato', sans-serif;
    }
    .tab-btn.active {
      background: linear-gradient(135deg, ${C.blushDeep} 0%, ${C.rose} 100%);
      color: ${C.white};
      box-shadow: 0 3px 10px rgba(192,96,122,0.28);
    }
    .tab-btn:not(.active) {
      background: transparent;
      color: ${C.textMid};
    }
    .tab-btn:not(.active):hover {
      background: ${C.petal};
      color: ${C.blushDeep};
    }

    /* Filter Bar */
    .filter-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      animation: fadeSlide 0.4s 0.15s ease both;
    }
    .filter-btn {
      padding: 7px 18px;
      border-radius: 24px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      transition: all 0.2s ease;
      font-family: 'Lato', sans-serif;
    }
    .filter-btn.active {
      background: ${C.petal};
      border: 1.5px solid ${C.blushDeep};
      color: ${C.blushDeep};
    }
    .filter-btn:not(.active) {
      background: transparent;
      border: 1.5px solid ${C.beigeMid};
      color: ${C.textMid};
    }
    .filter-btn:not(.active):hover {
      background: ${C.beigeLight};
      border-color: ${C.rose};
      color: ${C.rose};
    }

    /* Table Wrapper */
    .table-wrap {
      background: rgba(253,249,244,0.92);
      border-radius: 18px;
      border: 1.5px solid ${C.beigeMid};
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(212,133,154,0.10);
      animation: bloomIn 0.45s ease both;
    }

    /* Table */
    .floral-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      table-layout: fixed;
    }
    .floral-table col {
      width: auto;
    }
    .floral-table thead {
      background: linear-gradient(90deg, ${C.petal} 0%, ${C.beige} 100%);
    }
    .floral-table th {
      padding: 14px 18px;
      text-align: center;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: ${C.blushDeep};
      border-bottom: 1.5px solid ${C.beigeMid};
    }
    .floral-table td {
      padding: 13px 18px;
      border-bottom: 1px solid rgba(224,205,184,0.5);
      color: ${C.text};
      vertical-align: middle;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .floral-table tbody tr {
      animation: rowReveal 0.35s ease both;
      transition: background 0.18s;
    }
    .floral-table tbody tr:hover {
      background: rgba(252,232,238,0.35);
    }
    .floral-table tbody tr:last-child td {
      border-bottom: none;
    }

    /* Action Buttons */
    .btn-verify {
      padding: 5px 14px;
      background: ${C.greenLight};
      color: ${C.green};
      border: 1.5px solid ${C.green};
      border-radius: 18px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      margin-right: 6px;
      transition: all 0.18s;
      font-family: 'Lato', sans-serif;
    }
    .btn-verify:hover {
      background: ${C.green};
      color: white;
      transform: translateY(-1px);
    }
    .btn-delete {
      padding: 5px 14px;
      background: ${C.redLight};
      color: ${C.red};
      border: 1.5px solid ${C.blushMid};
      border-radius: 18px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      transition: all 0.18s;
      font-family: 'Lato', sans-serif;
    }
    .btn-delete:hover {
      background: ${C.red};
      color: white;
      border-color: ${C.red};
      transform: translateY(-1px);
    }

    /* Status Badges */
    .badge {
      display: inline-block;
      padding: 4px 13px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .badge-sudah, .badge-selesai {
      background: ${C.greenLight};
      color: ${C.green};
    }
    .badge-belum {
      background: ${C.redLight};
      color: ${C.red};
    }
    .badge-proses {
      background: ${C.petal};
      color: ${C.blushDeep};
      animation: pulseRose 2s ease infinite;
    }

    /* Empty state */
    .empty-row td {
      text-align: center;
      color: ${C.textLight};
      padding: 32px !important;
      font-style: italic;
    }

    /* Divider floral */
    .floral-section {
      animation: bloomIn 0.4s ease both;
    }
  `;
  document.head.appendChild(style);
};

// ── Floating Petal Background ────────────────────────────────
const PETALS = [
  { w: 38, h: 28, left: "5%",  top: "12%", delay: 0,   dur: 7,  color: C.blush },
  { w: 22, h: 18, left: "18%", top: "35%", delay: 1.2, dur: 9,  color: C.peach },
  { w: 45, h: 32, left: "33%", top: "6%",  delay: 0.5, dur: 11, color: C.petal },
  { w: 18, h: 14, left: "55%", top: "20%", delay: 2,   dur: 8,  color: C.blushMid },
  { w: 30, h: 22, left: "70%", top: "50%", delay: 0.8, dur: 10, color: C.peach },
  { w: 25, h: 20, left: "85%", top: "10%", delay: 1.5, dur: 7.5,color: C.blush },
  { w: 20, h: 15, left: "90%", top: "70%", delay: 0.3, dur: 12, color: C.petal },
  { w: 35, h: 26, left: "12%", top: "75%", delay: 2.5, dur: 9,  color: C.beigeMid },
  { w: 16, h: 13, left: "46%", top: "85%", delay: 1,   dur: 8,  color: C.blushMid },
  { w: 28, h: 20, left: "62%", top: "88%", delay: 1.8, dur: 11, color: C.petal },
];

function PetalBackground() {
  return (
    <div className="petal-bg">
      {PETALS.map((p, i) => (
        <div
          key={i}
          className="petal"
          style={{
            width: p.w,
            height: p.h,
            left: p.left,
            top: p.top,
            background: p.color,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0.22,
          }}
        />
      ))}
    </div>
  );
}

// ── Badge helper ─────────────────────────────────────────────
function Badge({ status }) {
  const cls = ["sudah","selesai"].includes(status)
    ? "badge-sudah"
    : status === "belum"
    ? "badge-belum"
    : status === "proses"
    ? "badge-proses"
    : "badge-belum";
  return <span className={`badge ${cls}`}>{status}</span>;
}

export default function Admin() {
  injectStyles();

  const [tab, setTab]       = useState("peta");
  const [list, setList]     = useState({ warga: [], bayar: [], angkut: [] });
  const [filter, setFilter] = useState("semua");

  const fetchAll = async () => {
    const { data: w } = await supabase.from("warga").select("*, pembayaran(status)");
    const { data: b } = await supabase.from("pembayaran").select("*, warga(nama)");
    const { data: a } = await supabase.from("pengangkutan").select("*, warga(nama), profiles(nama)");
    setList({ warga: w || [], bayar: b || [], angkut: a || [] });
  };

  useEffect(() => { fetchAll(); }, []);

  const update = async (table, id, status) => {
    await supabase.from(table).update({ status }).eq("id", id);
    fetchAll();
  };

  const remove = async (table, id) => {
    if (confirm("Hapus data ini?")) {
      await supabase.from(table).delete().eq("id", id);
      fetchAll();
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.replace("/login");
  };

  const filteredWarga = list.warga.filter(w => {
    if (filter === "semua") return true;
    const isSudah = (w.pembayaran || []).some(p => p.status === "sudah");
    return filter === "sudah" ? isSudah : !isSudah;
  });

  const TABS = ["peta", "warga", "pembayaran", "pengangkutan"];

  return (
    <div
      className="admin-page"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(150deg, ${C.beigeLight} 0%, ${C.blushLight} 45%, ${C.peachLight} 75%, ${C.beige} 100%)`,
        color: C.text,
      }}
    >
      <PetalBackground />

      {/* Topbar */}
      <header className="admin-topbar">
        <div className="admin-brand">Admin Panel</div>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </header>

      <main className="admin-content">

        {/* Tab Bar */}
        <div className="tab-bar">
          {TABS.map(t => (
            <button
              key={t}
              className={`tab-btn${tab === t ? " active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── PETA TAB ── */}
        {tab === "peta" && (
          <div className="floral-section">
            <div className="filter-bar">
              {["semua", "sudah", "belum"].map(f => (
                <button
                  key={f}
                  className={`filter-btn${filter === f ? " active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <Map data={filteredWarga} />
          </div>
        )}

        {/* ── WARGA TAB ── */}
        {tab === "warga" && (
          <div className="table-wrap floral-section">
            <table className="floral-table">
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
                {list.warga.length === 0 && (
                  <tr className="empty-row"><td colSpan={3}>Belum ada data warga.</td></tr>
                )}
                {list.warga.map(w => (
                  <tr key={w.id}>
                    <td>{w.nama}</td>
                    <td>{w.alamat}</td>
                    <td>
                      <button className="btn-delete" onClick={() => remove("warga", w.id)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── PEMBAYARAN TAB ── */}
        {tab === "pembayaran" && (
          <div className="table-wrap floral-section">
            <table className="floral-table">
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
                {list.bayar.length === 0 && (
                  <tr className="empty-row"><td colSpan={3}>Belum ada data pembayaran.</td></tr>
                )}
                {list.bayar.map(p => (
                  <tr key={p.id}>
                    <td>{p.warga?.nama}</td>
                    <td><Badge status={p.status} /></td>
                    <td>
                      {p.status !== "sudah" && (
                        <button className="btn-verify" onClick={() => update("pembayaran", p.id, "sudah")}>Verifikasi</button>
                      )}
                      <button className="btn-delete" onClick={() => remove("pembayaran", p.id)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── PENGANGKUTAN TAB ── */}
        {tab === "pengangkutan" && (
          <div className="table-wrap floral-section">
            <table className="floral-table">
              <colgroup>
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Warga</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.angkut.length === 0 && (
                  <tr className="empty-row"><td colSpan={4}>Belum ada data pengangkutan.</td></tr>
                )}
                {list.angkut.map(a => (
                  <tr key={a.id}>
                    <td>{a.warga?.nama}</td>
                    <td>{a.profiles?.nama || "-"}</td>
                    <td><Badge status={a.status} /></td>
                    <td>
                      {a.status !== "selesai" && (
                        <button className="btn-verify" onClick={() => update("pengangkutan", a.id, "selesai")}>Selesai</button>
                      )}
                      <button className="btn-delete" onClick={() => remove("pengangkutan", a.id)}>Hapus</button>
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