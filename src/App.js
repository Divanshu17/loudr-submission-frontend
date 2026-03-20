import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const cn = (...c) => c.filter(Boolean).join(" ");

/* ─────────────────────────────────────────────
   BACKGROUND  — stark grid + ink bleed corners
───────────────────────────────────────────── */
const Background = () => (
  <>
    <div className="bg-root" aria-hidden="true">
      <div className="bg-grid" />
      <div className="bg-bleed bl" />
      <div className="bg-bleed br" />
      <div className="bg-bleed tl" />
      <div className="scan-line" />
    </div>
    <style>{`
      .bg-root {
        position: fixed; inset: 0; z-index: 0;
        background: #0c0c0f;
        pointer-events: none; overflow: hidden;
      }
      .bg-grid {
        position: absolute; inset: 0;
        background-image:
          linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px);
        background-size: 48px 48px;
        mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
      }
      .bg-bleed {
        position: absolute; width: 520px; height: 520px;
        border-radius: 50%; filter: blur(130px); opacity: 0.14;
      }
      .bl { bottom: -160px; left: -120px;
        background: radial-gradient(circle, #e8ff47 0%, #c6f135 50%, transparent 100%); }
      .br { bottom: -80px; right: -120px;
        background: radial-gradient(circle, #ff4d6d 0%, #c9184a 50%, transparent 100%); opacity: 0.1; }
      .tl { top: -200px; left: 20%;
        background: radial-gradient(circle, #ffffff 0%, transparent 70%); opacity: 0.04; }
      .scan-line {
        position: absolute; inset: 0;
        background: repeating-linear-gradient(
          0deg, transparent, transparent 3px,
          rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 4px
        );
        pointer-events: none;
      }
    `}</style>
  </>
);

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const Navbar = () => (
  <motion.nav
    className="navbar"
    initial={{ opacity: 0, y: -16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="nav-left">
      <span className="nav-logo">✦ LOUDER</span>
      <span className="nav-slash">/</span>
      <span className="nav-product">Event Concierge</span>
    </div>
    <div className="nav-right">
      <div className="nav-author">
        <span className="nav-by">by</span>
        <span className="nav-name">Divanshu Kachhawa</span>
        <a href="mailto:divanshu1704@gmail.com" className="nav-mail" title="divanshu1704@gmail.com">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:13,height:13}}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </a>
      </div>
      <span className="nav-tag">LOUDER</span>
    </div>
    <style>{`
      .navbar {
        position: fixed; top: 0; left: 0; right: 0; z-index: 50;
        display: flex; align-items: center; justify-content: space-between;
        padding: 16px 40px;
        border-bottom: 1px solid rgba(255,255,255,0.07);
        background: rgba(12,12,15,0.92);
        backdrop-filter: blur(20px);
        font-family: 'Syne', sans-serif;
      }
      .nav-left { display: flex; align-items: center; gap: 10px; }
      .nav-logo { font-weight: 800; font-size: 15px; color: #e8ff47; letter-spacing: 0.12em; }
      .nav-slash { color: rgba(255,255,255,0.18); font-size: 18px; }
      .nav-product { font-size: 13px; color: rgba(255,255,255,0.5); letter-spacing: 0.04em; }
      .nav-right { display: flex; align-items: center; gap: 14px; }
      .nav-author { display: flex; align-items: center; gap: 7px; }
      .nav-by { font-size: 11px; color: rgba(255,255,255,0.3); }
      .nav-name { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9); letter-spacing: 0.01em; }
      .nav-mail {
        display: flex; align-items: center;
        color: rgba(255,255,255,0.3); text-decoration: none;
        transition: color 0.2s;
      }
      .nav-mail:hover { color: #e8ff47; }
      .nav-tag {
        font-size: 10px; font-weight: 700; letter-spacing: 0.18em;
        color: #0c0c0f; background: #e8ff47;
        padding: 3px 9px; border-radius: 3px;
      }
      @media (max-width: 600px) { .navbar { padding: 13px 18px; } .nav-product { display: none; } }
      @media (max-width: 420px) { .nav-by { display: none; } }
    `}</style>
  </motion.nav>
);

/* ─────────────────────────────────────────────
   SHIMMER SKELETON
───────────────────────────────────────────── */
const ShimmerCard = () => (
  <div className="sk-card">
    <div className="sk-tag" />
    <div className="sk-h" />
    <div className="sk-row">
      <div className="sk-pill" />
      <div className="sk-pill short" />
    </div>
    <div className="sk-body" />
    <div className="sk-body medium" />
    <style>{`
      .sk-card {
        background: rgba(255,255,255,0.025);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 4px; padding: 36px;
        display: flex; flex-direction: column; gap: 18px;
      }
      .sk-tag  { height: 11px; width: 90px; border-radius: 2px; }
      .sk-h    { height: 34px; width: 55%; border-radius: 3px; }
      .sk-row  { display: flex; gap: 12px; }
      .sk-pill { height: 13px; width: 130px; border-radius: 20px; }
      .sk-pill.short { width: 90px; }
      .sk-body { height: 13px; width: 90%; border-radius: 2px; }
      .sk-body.medium { width: 70%; }
      .sk-tag,.sk-h,.sk-pill,.sk-body {
        background: linear-gradient(90deg,
          rgba(255,255,255,0.04) 0%,
          rgba(255,255,255,0.1) 40%,
          rgba(255,255,255,0.04) 80%
        );
        background-size: 400% 100%;
        animation: sk-shimmer 1.8s ease infinite;
      }
      @keyframes sk-shimmer {
        0%   { background-position: 100% 0; }
        100% { background-position: -100% 0; }
      }
    `}</style>
  </div>
);

/* ─────────────────────────────────────────────
   LOADING STATE
───────────────────────────────────────────── */
const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -14 }}
    transition={{ duration: 0.35 }}
    style={{ width: "100%" }}
  >
    <div className="ld-banner">
      <div className="ld-pulse"><span /><span /><span /></div>
      <p className="ld-text">AI is planning your perfect event<span className="ld-ellipsis" /></p>
    </div>
    <ShimmerCard />
    <style>{`
      .ld-banner {
        display: flex; align-items: center; gap: 14px; margin-bottom: 16px;
        padding: 13px 18px;
        border: 1px solid rgba(232,255,71,0.2);
        border-left: 3px solid #e8ff47;
        background: rgba(232,255,71,0.04);
        border-radius: 2px;
      }
      .ld-text {
        color: rgba(255,255,255,0.6); font-size: 13px;
        font-family: 'Syne', sans-serif; letter-spacing: 0.05em;
      }
      .ld-pulse { display: flex; gap: 5px; }
      .ld-pulse span {
        width: 7px; height: 7px; border-radius: 50%; background: #e8ff47;
        animation: ld-bounce 1.1s ease-in-out infinite;
      }
      .ld-pulse span:nth-child(2) { animation-delay: 0.18s; }
      .ld-pulse span:nth-child(3) { animation-delay: 0.36s; }
      @keyframes ld-bounce {
        0%,80%,100% { transform: translateY(0); opacity: 0.35; }
        40% { transform: translateY(-5px); opacity: 1; }
      }
      .ld-ellipsis::after {
        content: ''; animation: ld-dots 1.4s steps(4, end) infinite;
      }
      @keyframes ld-dots {
        0%  { content: ''; }
        25% { content: '.'; }
        50% { content: '..'; }
        75% { content: '...'; }
      }
    `}</style>
  </motion.div>
);

/* ─────────────────────────────────────────────
   SEARCH INPUT
───────────────────────────────────────────── */
const SearchInput = ({ value, onChange, onSubmit, loading }) => {
  const [focused, setFocused] = useState(false);
  const [ripples, setRipples] = useState([]);

  const fireRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="si-wrap"
    >
      <div className={cn("si-box", focused && "si-box--on")}>
        <div className="si-corner tl" /><div className="si-corner tr" />
        <div className="si-corner bl" /><div className="si-corner br" />
        <input
          type="text"
          placeholder="Describe your event — party, retreat, conference, wedding…"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => e.key === "Enter" && onSubmit()}
          className="si-input"
          disabled={loading}
        />
        <motion.button
          className="si-btn"
          onClick={fireRipple}
          disabled={loading || !value.trim()}
          whileTap={{ scale: 0.95 }}
        >
          <span className="si-btn-inner">
            {loading
              ? <span className="si-spinner" />
              : <>
                  <span>Generate</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14}}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
            }
          </span>
          {ripples.map(r => (
            <span key={r.id} className="si-ripple" style={{ left: r.x, top: r.y }} />
          ))}
        </motion.button>
      </div>
      <p className="si-hint">Try: "rooftop birthday for 30", "team offsite in the mountains", "intimate wedding ceremony"</p>
      <style>{`
        .si-wrap { width: 100%; }
        .si-box {
          position: relative;
          display: flex; align-items: center; gap: 0;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .si-box--on {
          border-color: rgba(232,255,71,0.5);
          box-shadow: 0 0 0 3px rgba(232,255,71,0.07), 0 8px 40px rgba(0,0,0,0.4);
        }
        .si-corner {
          position: absolute; width: 8px; height: 8px;
          border-color: rgba(232,255,71,0); border-style: solid;
          transition: border-color 0.25s;
        }
        .si-box--on .si-corner { border-color: #e8ff47; }
        .si-corner.tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
        .si-corner.tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
        .si-corner.bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
        .si-corner.br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

        .si-input {
          flex: 1; background: transparent; border: none; outline: none;
          padding: 20px 20px;
          color: #fff; font-size: 16px;
          font-family: 'Syne', sans-serif; letter-spacing: 0.01em;
        }
        .si-input::placeholder { color: rgba(255,255,255,0.22); }
        .si-input:disabled { opacity: 0.4; cursor: not-allowed; }

        .si-btn {
          position: relative; overflow: hidden; flex-shrink: 0;
          margin: 6px; padding: 14px 28px;
          background: #e8ff47; color: #0c0c0f;
          border: none; border-radius: 3px; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 0 0 rgba(232,255,71,0);
        }
        .si-btn:not(:disabled):hover {
          background: #f0ff6e;
          box-shadow: 0 0 24px rgba(232,255,71,0.35);
        }
        .si-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .si-btn-inner { display: flex; align-items: center; gap: 8px; position: relative; z-index: 1; }
        .si-ripple {
          position: absolute; width: 8px; height: 8px; border-radius: 50%;
          background: rgba(0,0,0,0.25); transform: translate(-50%,-50%) scale(0);
          animation: si-rip 0.65s ease-out forwards; pointer-events: none;
        }
        @keyframes si-rip { to { transform: translate(-50%,-50%) scale(18); opacity: 0; } }
        .si-spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(0,0,0,0.2); border-top-color: #0c0c0f;
          border-radius: 50%; animation: si-spin 0.7s linear infinite;
        }
        @keyframes si-spin { to { transform: rotate(360deg); } }
        .si-hint {
          margin-top: 10px; padding-left: 4px;
          font-family: 'Syne', sans-serif; font-size: 11.5px;
          color: rgba(255,255,255,0.2); letter-spacing: 0.02em;
          line-height: 1.5;
        }
      `}</style>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   RESULT CARD
───────────────────────────────────────────── */
const ResultCard = ({ result }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [3, -3]);
  const rotateY = useTransform(x, [-60, 60], [-3, 3]);

  const onMove = (e) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left - r.width / 2);
    y.set(e.clientY - r.top - r.height / 2);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="rc-card"
      >
        <div className="rc-stripe" />

        <div className="rc-top">
          <div>
            <div className="rc-eyebrow">✦ AI RECOMMENDATION</div>
            <h2 className="rc-name">{result.venueName}</h2>
          </div>
          <div className="rc-badge">Top Pick</div>
        </div>

        <div className="rc-chips">
          <div className="rc-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:13,height:13,flexShrink:0}}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {result.location}
          </div>
          <div className="rc-chip accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:13,height:13,flexShrink:0}}>
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            {result.estimatedCost}
          </div>
        </div>

        <div className="rc-divider">
          <span className="rc-divider-label">WHY THIS VENUE</span>
          <div className="rc-divider-line" />
        </div>

        <p className="rc-reason">{result.reason}</p>

        {result.highlights && result.highlights.length > 0 && (
          <>
            <div className="rc-divider">
              <span className="rc-divider-label">HIGHLIGHTS</span>
              <div className="rc-divider-line" />
            </div>
            <motion.div
              className="rc-highlights"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            >
              {result.highlights.map((h, i) => (
                <motion.div
                  key={i}
                  className="rc-hl-item"
                  variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.35 } } }}
                >
                  <span className="rc-hl-dot" />
                  <span className="rc-hl-text">{h}</span>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        <style>{`
          .rc-card {
            position: relative;
            background: rgba(18,18,22,0.9);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 4px; overflow: hidden;
            transition: box-shadow 0.3s, border-color 0.3s;
            cursor: default;
          }
          .rc-card:hover {
            border-color: rgba(232,255,71,0.25);
            box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,255,71,0.1);
          }
          .rc-stripe {
            height: 3px;
            background: linear-gradient(90deg, #e8ff47 0%, #39ff14 40%, #00d4ff 100%);
          }
          .rc-top {
            display: flex; justify-content: space-between; align-items: flex-start;
            gap: 16px; padding: 28px 32px 20px;
          }
          .rc-eyebrow {
            font-family: 'Syne', sans-serif; font-size: 10px;
            letter-spacing: 0.2em; color: #e8ff47; margin-bottom: 10px;
          }
          .rc-name {
            font-family: 'Syne', sans-serif; font-weight: 800;
            font-size: clamp(24px, 4.5vw, 36px);
            color: #fff; line-height: 1.1; margin: 0;
          }
          .rc-badge {
            flex-shrink: 0;
            background: rgba(232,255,71,0.1);
            border: 1px solid rgba(232,255,71,0.3);
            color: #e8ff47; border-radius: 3px;
            padding: 6px 12px; font-size: 11px; font-weight: 700;
            letter-spacing: 0.08em; font-family: 'Syne', sans-serif;
            text-transform: uppercase;
          }
          .rc-chips { display: flex; flex-wrap: wrap; gap: 10px; padding: 0 32px 24px; }
          .rc-chip {
            display: flex; align-items: center; gap: 7px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.09);
            border-radius: 3px; padding: 8px 14px;
            font-family: 'Syne', sans-serif; font-size: 13px;
            color: rgba(255,255,255,0.6); white-space: nowrap;
          }
          .rc-chip.accent { color: #e8ff47; border-color: rgba(232,255,71,0.2); background: rgba(232,255,71,0.05); }
          .rc-divider {
            display: flex; align-items: center; gap: 14px;
            padding: 0 32px; margin-bottom: 18px;
          }
          .rc-divider-label {
            font-family: 'Syne', sans-serif; font-size: 9px;
            letter-spacing: 0.18em; color: rgba(255,255,255,0.25);
            white-space: nowrap;
          }
          .rc-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
          .rc-reason {
            padding: 0 32px 28px;
            font-family: 'Syne', sans-serif; font-size: 14.5px;
            color: rgba(255,255,255,0.55); line-height: 1.75;
          }
          .rc-highlights {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
            padding: 0 32px 32px;
          }
          .rc-hl-item {
            display: flex; align-items: flex-start; gap: 10px;
            background: rgba(232,255,71,0.04);
            border: 1px solid rgba(232,255,71,0.1);
            border-radius: 3px; padding: 11px 14px;
            transition: background 0.2s, border-color 0.2s;
          }
          .rc-hl-item:hover {
            background: rgba(232,255,71,0.08);
            border-color: rgba(232,255,71,0.22);
          }
          .rc-hl-dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: #e8ff47; flex-shrink: 0; margin-top: 5px;
            box-shadow: 0 0 6px rgba(232,255,71,0.6);
          }
          .rc-hl-text {
            font-family: 'Syne', sans-serif; font-size: 13px;
            color: rgba(255,255,255,0.7); line-height: 1.5; font-weight: 500;
          }
          @media (max-width: 500px) {
            .rc-top { flex-direction: column; padding: 22px 22px 16px; }
            .rc-chips { padding: 0 22px 20px; }
            .rc-divider { padding: 0 22px; }
            .rc-reason { padding: 0 22px 22px; }
            .rc-highlights { padding: 0 22px 24px; grid-template-columns: 1fr; }
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   HISTORY CARD
───────────────────────────────────────────── */
const HistoryCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.38, delay: index * 0.06 }}
    whileHover={{ y: -3 }}
    className="hc-card"
  >
    <div className="hc-num">#{String(index + 1).padStart(2, "0")}</div>
    <h3 className="hc-name">{item.venueName}</h3>
    <div className="hc-meta">
      <span>{item.location}</span>
      <span className="hc-sep">·</span>
      <span>{item.estimatedCost}</span>
    </div>
    <style>{`
      .hc-card {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 4px; padding: 20px 22px;
        cursor: default;
        transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
      }
      .hc-card:hover {
        border-color: rgba(232,255,71,0.2);
        background: rgba(232,255,71,0.03);
        box-shadow: 0 8px 28px rgba(0,0,0,0.3);
      }
      .hc-num {
        font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 700;
        letter-spacing: 0.14em; color: rgba(232,255,71,0.5);
        margin-bottom: 10px;
      }
      .hc-name {
        font-family: 'Syne', sans-serif; font-weight: 700;
        font-size: 15px; color: rgba(255,255,255,0.85);
        margin: 0 0 10px; line-height: 1.3;
      }
      .hc-meta {
        font-family: 'Syne', sans-serif; font-size: 12px;
        color: rgba(255,255,255,0.3); display: flex; gap: 8px;
        flex-wrap: wrap; align-items: center;
      }
      .hc-sep { opacity: 0.4; }
    `}</style>
  </motion.div>
);

/* ─────────────────────────────────────────────
   FOOTER — attribution
───────────────────────────────────────────── */
const Footer = () => (
  <motion.footer
    className="footer"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.1, duration: 0.8 }}
  >
    <div className="footer-inner">
      <div className="footer-left">
        <span className="footer-built">Built for</span>
        <span className="footer-loudr">✦ LOUDER</span>
        <span className="footer-built">by</span>
        <span className="footer-name">Divanshu Kachhawa</span>
      </div>
      <div className="footer-right">
        <a href="mailto:divanshu1704@gmail.com" className="footer-email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:13,height:13}}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          divanshu1704@gmail.com
        </a>
        <span className="footer-sep">·</span>
        <span className="footer-sub">Submission 2026</span>
      </div>
    </div>
    <style>{`
      .footer {
        position: relative; z-index: 1;
        border-top: 1px solid rgba(255,255,255,0.06);
        margin-top: 8px; padding: 28px 0 40px;
        width: 100%;
      }
      .footer-inner {
        display: flex; flex-wrap: wrap; gap: 16px;
        justify-content: space-between; align-items: center;
      }
      .footer-left, .footer-right {
        display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        font-family: 'Syne', sans-serif; font-size: 12px;
      }
      .footer-built { color: rgba(255,255,255,0.28); }
      .footer-loudr { color: #e8ff47; font-weight: 800; letter-spacing: 0.1em; font-size: 13px; }
      .footer-name { color: rgba(255,255,255,0.7); font-weight: 600; }
      .footer-email {
        display: flex; align-items: center; gap: 6px;
        color: rgba(255,255,255,0.35); text-decoration: none;
        transition: color 0.2s;
      }
      .footer-email:hover { color: #e8ff47; }
      .footer-sep { color: rgba(255,255,255,0.15); }
      .footer-sub { color: rgba(255,255,255,0.2); }
      @media (max-width: 500px) {
        .footer-inner { flex-direction: column; align-items: flex-start; gap: 12px; }
      }
    `}</style>
  </motion.footer>
);

/* ─────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────── */
export default function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/history`);
      setHistory(res.data);
    } catch {}
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleSubmit = async () => {
    if (!query.trim() || loading) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/generate-event`, { query });
      setResult(res.data);
      fetchHistory();
    } catch {
      setError("Couldn't reach the server. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />

      <Background />
      <Navbar />

      <div className="app">

        {/* ── HERO ── */}
        <motion.header
          className="hero"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div
            className="hero-index"
            variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.7 } } }}
          >
            01
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
          >
            <div className="hero-kicker">AI EVENT CONCIERGE</div>
            <h1 className="hero-title">
              Plan Your<br />
              <span className="hero-accent">Ideal Event.</span>
            </h1>
          </motion.div>

          <motion.p
            className="hero-sub"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.7 } } }}
          >
            Describe any event — big or small — and let AI curate the perfect
            venue, budget, and experience for you.
          </motion.p>

        </motion.header>

        {/* ── SEARCH ── */}
        <section className="section-search">
          <SearchInput value={query} onChange={setQuery} onSubmit={handleSubmit} loading={loading} />
        </section>

        {/* ── RESULT / LOADING ── */}
        <section className="section-result">
          <AnimatePresence mode="wait">
            {loading && <LoadingState key="loading" />}
            {!loading && result && <ResultCard key="result" result={result} />}
            {!loading && error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="err-box"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,flexShrink:0}}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── HISTORY ── */}
        {history.length > 0 && (
          <motion.section
            className="section-history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="sh-header">
              <span className="sh-label">RECENT SEARCHES</span>
              <div className="sh-line" />
              <span className="sh-count">{history.length}</span>
            </div>
            <div className="sh-grid">
              {history.map((item, i) => (
                <HistoryCard key={item._id || i} item={item} index={i} />
              ))}
            </div>
          </motion.section>
        )}

        <Footer />
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #0c0c0f; color: #fff; min-height: 100vh;
          font-family: 'Syne', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        .app {
          position: relative; z-index: 1;
          max-width: 820px; margin: 0 auto;
          padding: 120px 28px 60px;
          display: flex; flex-direction: column; gap: 56px;
        }

        /* HERO */
        .hero { position: relative; display: flex; flex-direction: column; gap: 28px; }
        .hero-index {
          position: absolute; top: -12px; right: 0;
          font-size: clamp(80px, 14vw, 140px); font-weight: 800;
          color: rgba(255,255,255,0.025); line-height: 1;
          pointer-events: none; user-select: none;
          font-family: 'Syne', sans-serif;
        }
        .hero-kicker {
          font-size: 11px; font-weight: 700; letter-spacing: 0.22em;
          color: #e8ff47; margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .hero-kicker::before {
          content: ''; display: inline-block;
          width: 28px; height: 1px; background: #e8ff47;
        }
        .hero-title {
          font-size: clamp(40px, 8vw, 72px); font-weight: 800;
          line-height: 1.05; color: #fff; letter-spacing: -0.02em;
        }
        .hero-accent { color: rgba(255,255,255,0.35); font-style: italic; }
        .hero-sub {
          max-width: 480px; font-size: 16px; line-height: 1.75;
          color: rgba(255,255,255,0.58); font-weight: 400;
        }

        /* SECTIONS */
        .section-search { width: 100%; }
        .section-result { width: 100%; min-height: 20px; }

        /* ERROR */
        .err-box {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,60,60,0.07); border: 1px solid rgba(255,60,60,0.2);
          border-left: 3px solid #ff4d6d;
          border-radius: 2px; padding: 14px 18px;
          font-size: 13px; color: rgba(255,150,150,0.85);
          font-family: 'Syne', sans-serif;
        }

        /* HISTORY */
        .section-history { width: 100%; }
        .sh-header {
          display: flex; align-items: center; gap: 14px; margin-bottom: 20px;
        }
        .sh-label {
          font-size: 13px; font-weight: 700; letter-spacing: 0.14em;
          color: rgba(255,255,255,0.55); white-space: nowrap;
        }
        .sh-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .sh-count {
          font-size: 11px; font-weight: 700; color: rgba(232,255,71,0.5);
          background: rgba(232,255,71,0.08); border: 1px solid rgba(232,255,71,0.15);
          border-radius: 3px; padding: 2px 8px;
        }
        .sh-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px;
        }

        @media (max-width: 540px) {
          .app { padding: 100px 18px 50px; gap: 44px; }
          .sh-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}