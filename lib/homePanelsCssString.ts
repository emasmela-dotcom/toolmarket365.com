/** Injected in root layout so / and /home marketing styles are not dropped by the CSS pipeline. */
export const HOME_PANELS_CSS = `
body:has(main.tm-home) {
  background-color: #0b1220;
  color: #e8eef7;
}

.tm-home {
  --tm-ink: #07111f;
  --tm-paper: #f4f7fb;
  --tm-muted: #9db0c7;
  --tm-accent: #2dd4bf;
  --tm-accent-deep: #0f766e;
  --tm-warm: #fbbf24;
  position: relative;
  flex: 1;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  overflow-y: visible;
  background:
    radial-gradient(1200px 600px at 12% -10%, rgba(45, 212, 191, 0.22), transparent 55%),
    radial-gradient(900px 500px at 90% 8%, rgba(56, 189, 248, 0.18), transparent 50%),
    radial-gradient(700px 420px at 50% 100%, rgba(251, 191, 36, 0.08), transparent 55%),
    linear-gradient(165deg, #07111f 0%, #0f1c33 42%, #12243d 100%);
  color: #e8eef7;
  font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
}

.tm-home__glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 20%, transparent 75%);
  opacity: 0.55;
  animation: tm-home-grid-drift 28s linear infinite;
}

@keyframes tm-home-grid-drift {
  from { transform: translateY(0); }
  to { transform: translateY(48px); }
}

@keyframes tm-home-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tm-home__inner {
  position: relative;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  max-width: 88rem;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 2rem 1rem 3rem;
  text-align: left;
  overflow: visible;
  z-index: 1;
}

@media (min-width: 640px) {
  .tm-home__inner {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 2.5rem;
  }
}

.tm-home__hero {
  position: relative;
  margin: 0 0 1.75rem;
  padding: 1.75rem 1.25rem 1.85rem;
  border-radius: 1.35rem;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.2)),
    radial-gradient(800px 280px at 15% 20%, rgba(45, 212, 191, 0.2), transparent 60%);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
  animation: tm-home-rise 0.7s ease both;
}

.tm-home__hero::before {
  content: "";
  position: absolute;
  inset: auto -20% -40% 40%;
  height: 220px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.28), transparent 65%);
  filter: blur(8px);
  pointer-events: none;
}

.tm-home__badge {
  position: relative;
  display: inline-flex;
  margin: 0 0 0.9rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(45, 212, 191, 0.45);
  background: rgba(45, 212, 191, 0.12);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #99f6e4;
  text-transform: uppercase;
}

.tm-home__title {
  position: relative;
  margin: 0 0 0.85rem;
  font-size: clamp(2.4rem, 7vw, 4.4rem);
  line-height: 0.98;
  font-weight: 800;
  color: #f8fafc;
  letter-spacing: -0.045em;
  text-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
}

.tm-home__tagline {
  position: relative;
  margin: 0;
  max-width: 40rem;
  font-size: 1.05rem;
  line-height: 1.55;
  color: #cbd5e1;
}

@media (min-width: 640px) {
  .tm-home__tagline {
    font-size: 1.2rem;
  }
}

.tm-home__auth {
  position: relative;
  margin-top: 1.35rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
}

.tm-home__auth-primary,
.tm-home__auth-secondary,
.tm-home__auth-link {
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.tm-home__auth-primary {
  border-radius: 999px;
  border: 1px solid #2dd4bf;
  background: linear-gradient(180deg, #2dd4bf 0%, #14b8a6 100%);
  color: #042f2e;
  padding: 0.62rem 1.15rem;
  box-shadow: 0 10px 24px rgba(45, 212, 191, 0.28);
}

.tm-home__auth-primary:hover {
  transform: translateY(-1px);
  background: linear-gradient(180deg, #5eead4 0%, #2dd4bf 100%);
  border-color: #5eead4;
  text-decoration: none;
}

.tm-home__auth-secondary {
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.35);
  background: rgba(15, 23, 42, 0.55);
  color: #f1f5f9;
  padding: 0.62rem 1.05rem;
}

.tm-home__auth-secondary:hover {
  border-color: rgba(148, 163, 184, 0.7);
  background: rgba(30, 41, 59, 0.85);
  text-decoration: none;
}

.tm-home__auth-link {
  color: #99f6e4;
  padding: 0.5rem 0.35rem;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.tm-home__auth-link:hover {
  color: #ccfbf1;
}

.tm-home__share {
  position: relative;
  margin-top: 1.25rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
}

.tm-home__share-label {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #94a3b8;
}

.tm-home__share-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.45rem;
}

.tm-home__share-btn {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.55);
  padding: 0.45rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #e2e8f0;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
}

.tm-home__share-btn:hover {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(45, 212, 191, 0.55);
  color: #f8fafc;
  transform: translateY(-1px);
  text-decoration: none;
}

.tm-home__sister {
  position: relative;
  margin: 1rem 0 0;
  max-width: 40rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #94a3b8;
}

.tm-home__sister-label {
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.6875rem;
  color: #64748b;
}

.tm-home__sister-link {
  font-weight: 700;
  color: #5eead4;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.tm-home__sister-link:hover {
  color: #99f6e4;
}

.tm-home__grid {
  margin-top: 0.25rem;
  display: grid;
  width: 100%;
  max-width: 88rem;
  grid-template-columns: 1fr;
  gap: 1rem;
  align-self: stretch;
  text-align: left;
  overflow: visible;
  animation: tm-home-rise 0.85s ease 0.08s both;
}

@media (min-width: 768px) {
  .tm-home__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.05rem;
  }
}

@media (min-width: 1280px) {
  .tm-home__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.15rem;
  }
}

.tm-home__card {
  --tm-card-accent: #2dd4bf;
  min-width: 0;
  overflow: visible;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.03)),
    rgba(15, 23, 42, 0.72);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.22);
  padding: 1rem 1.05rem 1.05rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  border-top: 3px solid var(--tm-card-accent);
  backdrop-filter: blur(8px);
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.tm-home__card:hover {
  transform: translateY(-3px);
  border-color: rgba(45, 212, 191, 0.35);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.32);
}

.tm-home__card:nth-child(8n + 1) { --tm-card-accent: #2dd4bf; }
.tm-home__card:nth-child(8n + 2) { --tm-card-accent: #38bdf8; }
.tm-home__card:nth-child(8n + 3) { --tm-card-accent: #f59e0b; }
.tm-home__card:nth-child(8n + 4) { --tm-card-accent: #fbbf24; }
.tm-home__card:nth-child(8n + 5) { --tm-card-accent: #fb7185; }
.tm-home__card:nth-child(8n + 6) { --tm-card-accent: #34d399; }
.tm-home__card:nth-child(8n + 7) { --tm-card-accent: #60a5fa; }
.tm-home__card:nth-child(8n + 8) { --tm-card-accent: #f472b6; }

@media (min-width: 640px) {
  .tm-home__card {
    padding: 1.15rem 1.2rem 1.2rem;
  }
}

.tm-home__card-head {
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.3;
  color: #f8fafc;
  letter-spacing: -0.02em;
}

@media (min-width: 640px) {
  .tm-home__card-head {
    font-size: 1.08rem;
  }
}

.tm-home__card-head p {
  margin: 0;
  overflow-wrap: anywhere;
}

.tm-home__card-head p + p {
  margin-top: 0.28rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.tm-home__list {
  margin: 0.8rem 0 0;
  padding: 0;
  list-style: none;
}

.tm-home__list li {
  margin: 0 0 0.38rem;
  font-size: 0.86rem;
  font-weight: 500;
  color: #cbd5e1;
}

@media (min-width: 640px) {
  .tm-home__list li {
    font-size: 0.8rem;
  }
}

@media (min-width: 1280px) {
  .tm-home__list li {
    font-size: 0.84rem;
  }
}

.tm-home__link {
  display: inline-flex;
  max-width: 100%;
  color: #e2e8f0;
  text-decoration: none;
  border-radius: 0.45rem;
  padding: 0.15rem 0.2rem;
  transition: color 0.15s ease, background 0.15s ease;
}

.tm-home__link:hover {
  color: #99f6e4;
  background: rgba(45, 212, 191, 0.1);
  text-decoration: none;
}

.tm-home__link--legal {
  display: block;
  padding: 0.4rem 0.25rem;
  line-height: 1.35;
}

.tm-home__link--legal:hover .tm-home__link-title {
  text-decoration: none;
  color: #99f6e4;
}

.tm-home__link-title {
  display: block;
  font-weight: 700;
  color: #f1f5f9;
}

.tm-home__link-desc {
  display: block;
  margin-top: 0.2rem;
  font-size: 0.72rem;
  font-weight: 400;
  color: #94a3b8;
  line-height: 1.4;
}

.tm-home__list--legal li {
  margin-bottom: 0.35rem;
}

.tm-home-tooltip-wrap {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.tm-home-tooltip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: calc(100% + 0.35rem);
  z-index: 60;
  width: max-content;
  max-width: min(18.5rem, 92vw);
  padding: 0.55rem 0.7rem;
  font-size: 0.74rem;
  font-weight: 500;
  line-height: 1.4;
  color: #0f172a;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0.55rem;
  box-shadow: 0 16px 30px rgba(2, 6, 23, 0.35);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.14s ease,
    visibility 0.14s ease;
  text-align: left;
  text-decoration: none;
}

.tm-home-tooltip-wrap:hover .tm-home-tooltip,
.tm-home-tooltip-wrap:focus-within .tm-home-tooltip {
  opacity: 1;
  visibility: visible;
}

@media (prefers-reduced-motion: reduce) {
  .tm-home__glow,
  .tm-home__hero,
  .tm-home__grid,
  .tm-home__card {
    animation: none !important;
    transition: none !important;
  }
}
`.trim()
