import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const injectRegisterStyles = () => {
  if (document.getElementById("register-floral-styles")) return;
  const style = document.createElement("style");
  style.id = "register-floral-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=Lato:wght@300;400;700&display=swap');

    @keyframes bloomUp {
      0%   { opacity: 0; transform: translateY(28px) scale(0.96); }
      100% { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes petalDrift {
      0%   { transform: translateY(0)    rotate(0deg)  scale(1);    opacity: 0.15; }
      50%  { transform: translateY(-28px) rotate(14deg) scale(1.09); opacity: 0.28; }
      100% { transform: translateY(0)    rotate(0deg)  scale(1);    opacity: 0.15; }
    }
    @keyframes shimmerLine {
      0%   { background-position: -300px 0; }
      100% { background-position: 300px 0;  }
    }

    .register-bg {
      min-height: 100vh;
      background: linear-gradient(135deg, #fdf9f4 0%, #fdf0f3 40%, #f5ddd4 70%, #f0e6d6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Lato', sans-serif;
      position: relative;
      overflow: hidden;
      padding: 32px 16px;
    }

    .register-blob {
      position: absolute;
      border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
      pointer-events: none;
      animation: petalDrift ease-in-out infinite;
    }

    .register-card {
      background: rgba(253,249,244,0.93);
      backdrop-filter: blur(20px);
      border: 1.5px solid #e0cdb8;
      border-radius: 24px;
      padding: 44px 44px 38px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 8px 40px rgba(212,133,154,0.13), 0 2px 12px rgba(160,96,80,0.07);
      animation: bloomUp 0.6s cubic-bezier(0.34,1.2,0.64,1) both;
      position: relative;
      z-index: 1;
    }

    .register-card::before {
      content: "";
      display: block;
      height: 4px;
      border-radius: 24px 24px 0 0;
      background: linear-gradient(90deg, #f5ddd4, #f2c4ce, #e8a0b0, #f5ddd4);
      background-size: 300px 100%;
      animation: shimmerLine 3.5s linear infinite;
      position: absolute;
      top: 0; left: 0; right: 0;
    }

    .register-flower {
      text-align: center;
      font-size: 30px;
      margin-bottom: 6px;
      line-height: 1;
    }
    .register-title {
      font-family: 'Playfair Display', serif;
      font-size: 25px;
      font-weight: 700;
      color: #c0607a;
      text-align: center;
      margin-bottom: 4px;
    }
    .register-subtitle {
      text-align: center;
      font-size: 13px;
      color: #b09080;
      margin-bottom: 24px;
      font-weight: 300;
    }
    .register-divider {
      width: 40px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #e8a0b0, transparent);
      margin: 0 auto 20px;
      border-radius: 2px;
    }

    .register-label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #8a6070;
      margin-bottom: 6px;
    }
    .register-input,
    .register-select {
      width: 100%;
      padding: 12px 16px;
      border: 1.5px solid #e0cdb8;
      border-radius: 12px;
      background: rgba(253,246,242,0.8);
      color: #5a3a42;
      font-size: 14px;
      font-family: 'Lato', sans-serif;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
      margin-bottom: 16px;
      box-sizing: border-box;
      appearance: none;
      -webkit-appearance: none;
    }
    .register-input:focus,
    .register-select:focus {
      border-color: #d4859a;
      box-shadow: 0 0 0 4px rgba(212,133,154,0.15);
      background: #fffaf8;
    }
    .register-input::placeholder {
      color: #c0a0a8;
    }

    /* Custom select arrow */
    .register-select-wrap {
      position: relative;
      margin-bottom: 0;
    }
    .register-select-wrap::after {
      content: "❧";
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #d4859a;
      pointer-events: none;
      font-size: 14px;
    }
    .register-select-wrap .register-select {
      margin-bottom: 0;
      padding-right: 36px;
      cursor: pointer;
    }

    .register-field-group {
      margin-bottom: 16px;
    }

    .register-btn {
      width: 100%;
      padding: 13px;
      background: linear-gradient(135deg, #c0607a 0%, #d4859a 100%);
      color: #fffaf8;
      border: none;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;
      font-family: 'Lato', sans-serif;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: transform 0.18s, box-shadow 0.18s, filter 0.18s;
      box-shadow: 0 4px 18px rgba(192,96,122,0.28);
      margin-top: 20px;
    }
    .register-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 7px 24px rgba(192,96,122,0.36);
      filter: brightness(1.04);
    }
    .register-btn:active {
      transform: translateY(0);
    }

    .register-footer {
      text-align: center;
      margin-top: 20px;
      font-size: 13px;
      color: #b09080;
    }
    .register-footer a {
      color: #c0607a;
      font-weight: 700;
      text-decoration: none;
      border-bottom: 1.5px solid rgba(192,96,122,0.3);
      transition: border-color 0.2s;
    }
    .register-footer a:hover {
      border-color: #c0607a;
    }
  `;
  document.head.appendChild(style);
};

const REG_BLOBS = [
  { w: 130, h: 95,  left: "-6%",  top: "8%",  delay: 0,   dur: 9,  color: "#fce8ee" },
  { w: 75,  h: 58,  left: "82%",  top: "4%",  delay: 1.3, dur: 11, color: "#f5ddd4" },
  { w: 140, h: 105, left: "72%",  top: "68%", delay: 0.6, dur: 12, color: "#f2c4ce" },
  { w: 65,  h: 50,  left: "4%",   top: "75%", delay: 2.2, dur: 8,  color: "#e8d8c0" },
];

export default function Register() {
  injectRegisterStyles();

  const [form, setForm] = useState({ nama: "", email: "", password: "", role: "warga" });
  const navigate = useNavigate();

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (error) return alert(error.message);

    const { error: pError } = await supabase.from("profiles").insert([{ id: data.user.id, nama: form.nama, role: form.role }]);
    if (pError) return alert("Gagal simpan profil");

    alert("Berhasil! Silakan Login.");
    navigate("/login");
  };

  return (
    <div className="register-bg">
      {REG_BLOBS.map((b, i) => (
        <div
          key={i}
          className="register-blob"
          style={{
            width: b.w, height: b.h,
            left: b.left, top: b.top,
            background: b.color,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
            opacity: 0.22,
          }}
        />
      ))}

      <div className="register-card">
        <div className="register-flower">❀</div>
        <h2 className="register-title">Daftar Akun</h2>
        <div className="register-divider" />
        <p className="register-subtitle">Buat akun baru untuk memulai</p>

        <div className="register-field-group">
          <label className="register-label">Nama Lengkap</label>
          <input
            className="register-input"
            placeholder="Nama Anda"
            onChange={e => setForm({ ...form, nama: e.target.value })}
          />
        </div>

        <div className="register-field-group">
          <label className="register-label">Email</label>
          <input
            className="register-input"
            placeholder="nama@email.com"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="register-field-group">
          <label className="register-label">Password</label>
          <input
            className="register-input"
            type="password"
            placeholder="••••••••"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="register-field-group">
          <label className="register-label">Role</label>
          <div className="register-select-wrap">
            <select
              className="register-select"
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="warga">Warga</option>
              <option value="transporter">Transporter</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <button className="register-btn" onClick={handleRegister}>
          Daftar Sekarang
        </button>

        <p className="register-footer">
          Sudah punya akun?{" "}
          <a href="/login">Masuk di sini</a>
        </p>
      </div>
    </div>
  );
}