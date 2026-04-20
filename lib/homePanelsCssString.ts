/** Injected in root layout so / and /home marketing styles are not dropped by the CSS pipeline. */
export const HOME_PANELS_CSS = `
body:has(main.tm-home) {
  background-color: #f6f8fb;
  color: #111827;
}

.tm-home {
  position: relative;
  flex: 1;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  overflow-y: visible;
  background: #f6f8fb;
  color: #111827;
  font-family: ui-sans-serif, system-ui, sans-serif;
}

.tm-home__glow {
  display: none;
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
  padding: 2.5rem 1rem 2rem;
  text-align: left;
  overflow: visible;
}

@media (min-width: 640px) {
  .tm-home__inner {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

.tm-home__badge {
  margin: 0 0 0.75rem;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #4b5563;
  text-transform: uppercase;
}

.tm-home__title {
  margin: 0 0 0.75rem;
  font-size: 2rem;
  line-height: 1.15;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

@media (min-width: 640px) {
  .tm-home__title {
    font-size: 3rem;
  }
}

.tm-home__tagline {
  margin: 0;
  max-width: 56rem;
  font-size: 1.02rem;
  line-height: 1.5;
  color: #374151;
}

@media (min-width: 640px) {
  .tm-home__tagline {
    font-size: 1.125rem;
  }
}

.tm-home__auth {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.tm-home__auth-primary,
.tm-home__auth-secondary,
.tm-home__auth-link {
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;
}

.tm-home__auth-primary {
  border-radius: 0.5rem;
  border: 1px solid #1d4ed8;
  background: #1d4ed8;
  color: #ffffff;
  padding: 0.46rem 0.85rem;
}

.tm-home__auth-primary:hover {
  background: #1e40af;
  border-color: #1e40af;
}

.tm-home__auth-secondary {
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #1f2937;
  padding: 0.46rem 0.85rem;
}

.tm-home__auth-secondary:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}

.tm-home__auth-link {
  color: #1d4ed8;
  padding: 0.46rem 0.25rem;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.tm-home__auth-link:hover {
  color: #1e3a8a;
}

.tm-home__share {
  margin-top: 1.1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}

.tm-home__share-label {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6b7280;
}

.tm-home__share-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.45rem;
}

.tm-home__share-btn {
  border-radius: 0.5rem;
  border: 1px solid #cfd7e3;
  background: #ffffff;
  padding: 0.45rem 0.78rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1f2937;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
}

.tm-home__share-btn:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #0f172a;
}

.tm-home__sister {
  margin: 0.55rem 0 0;
  max-width: 40rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #4b5563;
}

.tm-home__sister-label {
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.6875rem;
  color: #6b7280;
}

.tm-home__sister-link {
  font-weight: 700;
  color: #1d4ed8;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.tm-home__sister-link:hover {
  color: #1e3a8a;
}

.tm-home__grid {
  margin-top: 1.5rem;
  display: grid;
  width: 100%;
  max-width: 88rem;
  grid-template-columns: 1fr;
  gap: 0.85rem;
  align-self: stretch;
  text-align: left;
  overflow: visible;
}

@media (min-width: 768px) {
  .tm-home__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.9rem;
  }
}

@media (min-width: 1280px) {
  .tm-home__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }
}

.tm-home__card {
  min-width: 0;
  overflow: visible;
  border-radius: 0.65rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  box-shadow: 0 1px 1px rgba(16, 24, 40, 0.02);
  padding: 0.8rem 0.95rem;
  text-align: left;
  display: flex;
  flex-direction: column;
}

@media (min-width: 640px) {
  .tm-home__card {
    padding: 1rem;
  }
}

.tm-home__card-head {
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.35;
  color: #111827;
}

@media (min-width: 640px) {
  .tm-home__card-head {
    font-size: 1rem;
  }
}

.tm-home__card-head p {
  margin: 0;
  overflow-wrap: anywhere;
}

.tm-home__card-head p + p {
  margin-top: 0.22rem;
  font-size: 0.68rem;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tm-home__list {
  margin: 0.68rem 0 0;
  padding: 0;
  list-style: none;
}

.tm-home__list li {
  margin: 0 0 0.32rem;
  font-size: 0.82rem;
  font-weight: 500;
  color: #374151;
}

@media (min-width: 640px) {
  .tm-home__list li {
    font-size: 0.75rem;
  }
}

@media (min-width: 1280px) {
  .tm-home__list li {
    font-size: 0.8rem;
  }
}

.tm-home__link {
  color: #1f2937;
  text-decoration: none;
}

.tm-home__link:hover {
  color: #1d4ed8;
  text-decoration: underline;
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
  top: calc(100% + 0.2rem);
  z-index: 60;
  width: max-content;
  max-width: min(18.5rem, 92vw);
  padding: 0.48rem 0.62rem;
  font-size: 0.72rem;
  font-weight: 500;
  line-height: 1.35;
  color: #0f172a;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
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
`.trim()
