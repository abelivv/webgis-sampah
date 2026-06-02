import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

const injectLoginStyles = () => {
  if (document.getElementById("login-floral-styles")) return;
  const style = document.createElement("style");
  style.id = "login-floral-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=Lato:wght@300;400;700&display=swap');

    @keyframes bloomUp {
      0%   { opacity: 0; transform: translateY(28px) scale(0.96); }
      100% { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes petalDrift {
      0%   { transform: translateY(0) rotate(0deg)   scale(1);   opacity: 0.15; }
      50%  { transform: translateY(-30px) rotate(15deg) scale(1.1); opacity: 0.28; }
      100% { transform: translateY(0) rotate(0deg)   scale(1);   opacity: 0.15; }
    }
    @keyframes inputFocus {
      0%   { box-shadow: 0 0 0 0 rgba(212,133,154,0); }
      100% { box-shadow: 0 0 0 4px rgba(212,133,154,0.18); }
    }
    @keyframes shimmerLine {
      0%   { background-position: -300px 0; }
      100% { background-position: 300px 0;  }
    }

    .login-bg {
      min-height: 100vh;
      background: linear-gradient(135deg, #fdf9f4 0%, #fdf0f3 40%, #f5ddd4 70%, #f0e6d6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Lato', sans-serif;
      position: relative;
      overflow: hidden;
    }

    /* Decorative petal blobs */
    .login-blob {
      position: absolute;
      border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
      pointer-events: none;
      animation: petalDrift ease-in-out infinite;
    }

    .login-card {
      background: rgba(253,249,244,0.92);
      backdrop-filter: blur(20px);
      border: 1.5px solid #e0cdb8;
      border-radius: 24px;
      padding: 44px 44px 38px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 40px rgba(212,133,154,0.13), 0 2px 12px rgba(160,96,80,0.07);
      animation: bloomUp 0.6s cubic-bezier(0.34,1.2,0.64,1) both;
      position: relative;
      z-index: 1;
    }

    /* Decorative top stripe */
    .login-card::before {
      content: "";
      display: block;
      height: 4px;
      border-radius: 24px 24px 0 0;
      background: linear-gradient(90deg, #f2c4ce, #f5ddd4, #e8a0b0, #f2c4ce);
      background-size: 300px 100%;
      animation: shimmerLine 3s linear infinite;
      position: absolute;
      top: 0; left: 0; right: 0;
    }

    .login-flower {
      text-align: center;
      font-size: 32px;
      margin-bottom: 6px;
      line-height: 1;
    }
    .login-title {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 700;
      color: #c0607a;
      text-align: center;
      margin-bottom: 4px;
      letter-spacing: 0.3px;
    }
    .login-subtitle {
      text-align: center;
      font-size: 13px;
      color: #b09080;
      margin-bottom: 28px;
      font-weight: 300;
    }

    .login-label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #8a6070;
      margin-bottom: 6px;
    }
    .login-input {
      width: 100%;
      padding: 12px 16px;
      border: 1.5px solid #e0cdb8;
      border-radius: 12px;
      background: rgba(253,246,242,0.8);
      color: #5a3a42;
      font-size: 14px;
      font-family: 'Lato', sans-serif;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      margin-bottom: 18px;
      box-sizing: border-box;
    }
    .login-input:focus {
      border-color: #d4859a;
      box-shadow: 0 0 0 4px rgba(212,133,154,0.15);
      background: #fffaf8;
    }
    .login-input::placeholder {
      color: #c0a0a8;
    }

    .login-btn {
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
      margin-top: 4px;
    }
    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 7px 24px rgba(192,96,122,0.36);
      filter: brightness(1.04);
    }
    .login-btn:active {
      transform: translateY(0);
    }

    .login-footer {
      text-align: center;
      margin-top: 20px;
      font-size: 13px;
      color: #b09080;
    }
    .login-footer a {
      color: #c0607a;
      font-weight: 700;
      text-decoration: none;
      border-bottom: 1.5px solid rgba(192,96,122,0.3);
      transition: border-color 0.2s;
    }
    .login-footer a:hover {
      border-color: #c0607a;
    }

    .login-divider {
      width: 40px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #e8a0b0, transparent);
      margin: 0 auto 24px;
      border-radius: 2px;
    }
  `;
  document.head.appendChild(style);
};

const LOGIN_BLOBS = [
  { w: 120, h: 90,  left: "-5%",  top: "10%", delay: 0,   dur: 8,  color: "#f2c4ce" },
  { w: 80,  h: 60,  left: "80%",  top: "5%",  delay: 1.5, dur: 10, color: "#f5ddd4" },
  { w: 150, h: 110, left: "70%",  top: "65%", delay: 0.8, dur: 12, color: "#fce8ee" },
  { w: 70,  h: 55,  left: "5%",   top: "72%", delay: 2,   dur: 9,  color: "#f2c4ce" },
  { w: 55,  h: 40,  left: "45%",  top: "-4%", delay: 0.4, dur: 7,  color: "#e8d8c0" },
];

export default function Login() {
  injectLoginStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
    else window.location.href = "/";
  };

  return (
    <div className="login-bg">
      {/* Petal blobs */}
      {LOGIN_BLOBS.map((b, i) => (
        <div
          key={i}
          className="login-blob"
          style={{
            width: b.w,
            height: b.h,
            left: b.left,
            top: b.top,
            background: b.color,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
            opacity: 0.22,
          }}
        />
      ))}

      <div className="login-card">
        <div className="login-flower">✿</div>
        <h2 className="login-title">Selamat Datang</h2>
        <div className="login-divider" />
        <p className="login-subtitle">Masuk ke akun Anda</p>

        <label className="login-label">Email</label>
        <input
          className="login-input"
          placeholder="nama@email.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="login-label">Password</label>
        <input
          className="login-input"
          type="password"
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={login}>
          Masuk
        </button>

        <p className="login-footer">
          Belum punya akun?{" "}
          <Link to="/register">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}