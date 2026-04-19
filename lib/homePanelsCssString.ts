/** Injected in root layout so / and /home marketing styles are not dropped by the CSS pipeline. */
export const HOME_PANELS_CSS = `
body:has(main.tm-home) {
  background-color: #000000;
  color: #ffffff;
}

.tm-home {
  position: relative;
  flex: 1;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  overflow-y: visible;
  background: #000000;
  color: #ffffff;
  font-family: ui-sans-serif, system-ui, sans-serif;
}

.tm-home__glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at top,
    rgba(59, 130, 246, 0.22),
    transparent 55%
  );
}

.tm-home__inner {
  position: relative;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  max-width: 100rem;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 3.5rem 1rem 2rem;
  text-align: center;
  overflow: visible;
}

@media (min-width: 640px) {
  .tm-home__inner {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

.tm-home__badge {
  margin-bottom: 1.25rem;
  border-radius: 9999px;
  border: 1px solid rgba(59, 130, 246, 0.4);
  background: rgba(59, 130, 246, 0.1);
  padding: 0.25rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: #93c5fd;
}

.tm-home__title {
  margin: 0 0 1rem;
  font-size: 3rem;
  line-height: 1.1;
  font-weight: 800;
  background: linear-gradient(to right, #ffffff, #bfdbfe, #ffffff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@media (min-width: 640px) {
  .tm-home__title {
    font-size: 4.5rem;
  }
}

.tm-home__tagline {
  margin: 0;
  max-width: 48rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #d1d5db;
}

@media (min-width: 640px) {
  .tm-home__tagline {
    font-size: 1.125rem;
  }
}

.tm-home__share {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.tm-home__share-label {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9ca3af;
}

.tm-home__share-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.tm-home__share-btn {
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.08);
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #ffffff;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
}

.tm-home__share-btn:hover {
  background: rgba(59, 130, 246, 0.28);
  border-color: rgba(147, 197, 253, 0.65);
  color: #ffffff;
}

.tm-home__sister {
  margin: 0.75rem 0 0;
  max-width: 40rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #d1d5db;
}

.tm-home__sister-label {
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.6875rem;
  color: #9ca3af;
}

.tm-home__sister-link {
  font-weight: 700;
  color: #93c5fd;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.tm-home__sister-link:hover {
  color: #bfdbfe;
}

.tm-home__grid {
  margin-top: 2rem;
  display: grid;
  width: 100%;
  max-width: 100rem;
  grid-template-columns: 1fr;
  gap: 1rem;
  align-self: stretch;
  text-align: left;
  overflow: visible;
}

@media (min-width: 768px) {
  .tm-home__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media (min-width: 1280px) {
  .tm-home__grid {
    gap: 1.5rem;
  }
}

.tm-home__card {
  min-width: 0;
  overflow: visible;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.32);
  background: transparent;
  box-shadow: none;
  padding: 0.75rem 1rem;
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
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
  color: #ffffff;
}

@media (min-width: 640px) {
  .tm-home__card-head {
    font-size: 1.125rem;
  }
}

@media (min-width: 1024px) {
  .tm-home__card-head {
    font-size: 1rem;
  }
}

@media (min-width: 1280px) {
  .tm-home__card-head {
    font-size: 1.25rem;
  }
}

.tm-home__card-head p {
  margin: 0;
  overflow-wrap: anywhere;
}

.tm-home__card-head p + p {
  margin-top: 0.35rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #f3f4f6;
  letter-spacing: normal;
  text-transform: none;
}

.tm-home__list {
  margin: 0.875rem 0 0;
  padding: 0;
  list-style: none;
}

.tm-home__list li {
  margin: 0 0 0.35rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #e5e7eb;
}

@media (min-width: 640px) {
  .tm-home__list li {
    font-size: 0.875rem;
    margin-bottom: 0.4rem;
  }
}

@media (min-width: 1024px) {
  .tm-home__list li {
    font-size: 0.75rem;
  }
}

@media (min-width: 1280px) {
  .tm-home__list li {
    font-size: 0.875rem;
  }
}

.tm-home__link {
  color: inherit;
  text-decoration: none;
}

.tm-home__link:hover {
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
  padding: 0.5rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.35;
  color: #f9fafb;
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 0.375rem;
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(0, 0, 0, 0.2);
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
