"use client"

import type { ReactNode } from "react"
import { CopyTextButton } from "@/components/CopyTextButton"
import {
  buildUtmUrl,
  UTM_PRESETS,
} from "@/lib/marketingKit"
import { getLifepack365Url, LIFEPACK365_NAME, SITE_NAME, getSiteUrl } from "@/lib/siteConfig"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const copy = {
  en: {
    internal: "Internal",
    pageTitle: "Marketing kit",
    pageIntroBeforeSite: "UTM patterns, ready-to-edit copy, landing section outline, and tracking notes for",
    pageIntroAfterSite:
      "Not indexed in search — share this URL with collaborators. Replace",
    pageIntroBeforeOrigin: "with",
    pageIntroEnd: "in snippets.",
    utmParameterReference: "UTM parameter reference",
    presetLinksTitle: "Preset links (click copy)",
    copyBankHeadlines: "Copy bank — headlines",
    copyBankSubheads: "Copy bank — subheads",
    copyBankCtas: "Copy bank — CTAs",
    socialSnippetsTitle: "Social snippets",
    emailSubjectLines: "Email subject lines",
    landingSectionOutlineTitle: "Landing page section outline",
    trackingChecklistTitle: "Tracking & analytics checklist",
    lifepackCrossPromo: "LifePack365 cross-promo (sister product)",
    lifepackPublicUrl: "Public URL:",
    lifepackSeparateUtms:
      "Use separate UTMs on the LifePack365 site when you drive traffic from TM365 emails or banners.",
    lifepackExampleOutLink: "Example out-link with UTMs:",
    lifepackSetEnvVar: "Set",
    lifepackNotConfiguredBefore: "when the sister site is live. Until then, home and footer do not link to",
    lifepackNotConfiguredAfter: "(no default domain).",
    copy: "Copy",
    copySnippet: "Copy snippet",
    copyExampleLink: "Copy example LP link",
    utmFieldHelp: [
      { param: "utm_source", use: "Where traffic comes from (google, meta, newsletter, partner_name)." },
      { param: "utm_medium", use: "Channel type: cpc, paid_social, email, organic_social, referral." },
      { param: "utm_campaign", use: "Campaign name: spring_launch, brand_search, creator_tools_q2." },
      { param: "utm_content", use: "Differentiate creatives: hook_video_a, carousel_blue, text_ad_short." },
      { param: "utm_term", use: "Paid search keywords (optional); keep PII out." },
    ],
    utmPresetLabels: {
      "google-brand-search": "Google Ads — brand search → home",
      "google-tools-nonbrand": "Google Ads — non-brand → /home",
      "meta-prospecting": "Meta — prospecting → /pricing",
      "linkedin-sponsored": "LinkedIn — sponsored → /compare",
      "email-newsletter": "Email — newsletter CTA → /home",
      "twitter-organic": "X / Twitter — organic post → /",
      "lifepack-cross": "Cross-promo — LifePack365",
    },
    utmPresetNotes: {
      "google-brand-search": "Use for exact / phrase match on ToolMarket365 and related brand terms.",
      "google-tools-nonbrand": "Pair with landing page message that matches ad headline.",
      "meta-prospecting": "Rotate utm_content per creative for creative reporting.",
      "linkedin-sponsored": "Good for founder / operator audiences comparing stacks.",
      "email-newsletter": "Change utm_campaign per issue date or slug.",
      "twitter-organic": "Optional for organic; helps separate from paid if you boost the same link.",
      "lifepack-cross": "Point href to LifePack365 domain with its own UTMs when linking out from TM365 emails.",
    },
    headlines: [
      "One tab. 120+ tools. Built for creators who are tired of tab soup.",
      "Stop duct-taping ten SaaS products together — ToolMarket365 is the toolkit layer.",
      "Invoices, hooks, CRM lite, and SEO helpers — without another $200/mo subscription stack.",
      "Ship content, get paid, and stay organized — micro-tools that actually load.",
    ],
    subheads: [
      "Micro-SaaS utilities for content, money, clients, and integrations — pick a tool, run it, move on.",
      "From invoice reminders to thread composers: built for solo creators and small teams.",
      "No enterprise bloat — fast pages, clear outputs, credit-friendly pricing when you scale.",
    ],
    ctas: [
      "Browse all tools",
      "See plans & credits",
      "Compare vs. point tools",
      "Open the free tools on /home",
    ],
    socialSnippets: [
      {
        platform: "X (Twitter)",
        text: 'If your "stack" is 14 browser tabs of half-broken free tools, same. I\'ve been using ToolMarket365 as one place for hooks, invoices, and dumb little utilities that should exist. {{BASE}}',
      },
      {
        platform: "LinkedIn",
        text: "Creators run a business, not just a channel. ToolMarket365 bundles the boring ops (invoicing, reminders, CRM-lite) with the creative layer (hooks, schedulers, repurposing helpers). Worth a scroll: {{BASE}}/home",
      },
      {
        platform: "Short ad primary text",
        text: "120+ creator + freelancer tools in one marketplace. Try a tool in seconds — {{BASE}}/home",
      },
    ],
    emailSubjects: [
      "Tools for the week: invoice nudges + hook ideas (ToolMarket365)",
      "Your creator ops stack is probably too expensive — here's one alternative",
      "New in the kit: life tools + integrations (if you missed them)",
    ],
    landingSectionOutline: [
      "Hero: headline + subhead + primary CTA (Try tools / View pricing) + trust line (tools load, no sketchy downloads).",
      "Proof strip: number of tools, categories (creators, finance, life tools), optional testimonial placeholder.",
      "How it works: 1) Pick a tool 2) Run in-browser 3) Save outputs — three bullets.",
      "Category grid: link to /home sections or /categories — match ad promise to section above the fold.",
      "Objections: pricing clarity, what needs API keys, what runs offline vs server.",
      "Footer CTA: repeat primary CTA + LifePack365 sister link if relevant.",
    ],
    trackingChecklist: [
      "Set **NEXT_PUBLIC_SITE_URL** in Vercel Production + Preview so links, OG, and sitemap use the right host.",
      "In **Google Analytics / Plausible / etc.**, mark conversions: signup_started, checkout_started, trial_started (match your real events).",
      "Use **one utm_campaign per initiative**; change only utm_content per creative so reports stay clean.",
      "Add **exclude IP** (office / VPN) in ad platforms to avoid skewing conversion data.",
      "After launch, run a **URL inspection** in Search Console for `/` and `/home`.",
      "Keep a **spreadsheet**: Campaign | utm | spend | landing | CPA — sync weekly.",
      "For **LifePack365** outbound links, use separate UTMs on that domain so attribution does not collide with TM365.",
    ],
  },
  es: {
    internal: "Interno",
    pageTitle: "Kit de marketing",
    pageIntroBeforeSite:
      "Patrones UTM, textos listos para editar, esquema de secciones de landing y notas de seguimiento para",
    pageIntroAfterSite:
      "No indexado en buscadores — comparte esta URL con colaboradores. Reemplaza",
    pageIntroBeforeOrigin: "con",
    pageIntroEnd: "en los fragmentos.",
    utmParameterReference: "Referencia de parámetros UTM",
    presetLinksTitle: "Enlaces predefinidos (clic para copiar)",
    copyBankHeadlines: "Banco de textos — titulares",
    copyBankSubheads: "Banco de textos — subtítulos",
    copyBankCtas: "Banco de textos — CTAs",
    socialSnippetsTitle: "Fragmentos para redes sociales",
    emailSubjectLines: "Líneas de asunto para email",
    landingSectionOutlineTitle: "Esquema de secciones de landing",
    trackingChecklistTitle: "Lista de seguimiento y analítica",
    lifepackCrossPromo: "Cross-promo LifePack365 (producto hermano)",
    lifepackPublicUrl: "URL pública:",
    lifepackSeparateUtms:
      "Usa UTMs separados en el sitio LifePack365 cuando envíes tráfico desde emails o banners de TM365.",
    lifepackExampleOutLink: "Ejemplo de enlace saliente con UTMs:",
    lifepackSetEnvVar: "Configura",
    lifepackNotConfiguredBefore: "cuando el sitio hermano esté en vivo. Hasta entonces, inicio y pie de página no enlazan a",
    lifepackNotConfiguredAfter: "(sin dominio predeterminado).",
    copy: "Copiar",
    copySnippet: "Copiar fragmento",
    copyExampleLink: "Copiar enlace LP de ejemplo",
    utmFieldHelp: [
      { param: "utm_source", use: "De dónde viene el tráfico (google, meta, newsletter, partner_name)." },
      { param: "utm_medium", use: "Tipo de canal: cpc, paid_social, email, organic_social, referral." },
      { param: "utm_campaign", use: "Nombre de campaña: spring_launch, brand_search, creator_tools_q2." },
      { param: "utm_content", use: "Diferenciar creativos: hook_video_a, carousel_blue, text_ad_short." },
      { param: "utm_term", use: "Palabras clave de búsqueda de pago (opcional); no incluir datos personales." },
    ],
    utmPresetLabels: {
      "google-brand-search": "Google Ads — búsqueda de marca → inicio",
      "google-tools-nonbrand": "Google Ads — no marca → /home",
      "meta-prospecting": "Meta — prospección → /pricing",
      "linkedin-sponsored": "LinkedIn — patrocinado → /compare",
      "email-newsletter": "Email — CTA newsletter → /home",
      "twitter-organic": "X / Twitter — publicación orgánica → /",
      "lifepack-cross": "Cross-promo — LifePack365",
    },
    utmPresetNotes: {
      "google-brand-search": "Usar para coincidencia exacta / frase en ToolMarket365 y términos de marca relacionados.",
      "google-tools-nonbrand": "Combinar con mensaje de landing que coincida con el titular del anuncio.",
      "meta-prospecting": "Rotar utm_content por creativo para informes de creativos.",
      "linkedin-sponsored": "Bueno para audiencias de fundadores / operadores que comparan stacks.",
      "email-newsletter": "Cambiar utm_campaign por fecha o slug de cada edición.",
      "twitter-organic": "Opcional para orgánico; ayuda a separar de pago si impulsas el mismo enlace.",
      "lifepack-cross": "Apunta href al dominio LifePack365 con sus propios UTMs al enlazar desde emails de TM365.",
    },
    headlines: [
      "Una pestaña. Más de 120 herramientas. Para creadores cansados del caos de pestañas.",
      "Deja de pegar diez SaaS con cinta adhesiva — ToolMarket365 es la capa de toolkit.",
      "Facturas, hooks, CRM lite y ayudas SEO — sin otro stack de suscripciones de $200/mes.",
      "Publica contenido, cobra y mantente organizado — micro-herramientas que sí cargan.",
    ],
    subheads: [
      "Utilidades micro-SaaS para contenido, dinero, clientes e integraciones — elige una herramienta, úsala y sigue.",
      "Desde recordatorios de facturas hasta compositores de hilos: hecho para creadores solos y equipos pequeños.",
      "Sin bloat empresarial — páginas rápidas, resultados claros, precios amigables con créditos al escalar.",
    ],
    ctas: [
      "Ver todas las herramientas",
      "Ver planes y créditos",
      "Comparar vs. herramientas puntuales",
      "Abrir las herramientas gratis en /home",
    ],
    socialSnippets: [
      {
        platform: "X (Twitter)",
        text: 'Si tu "stack" son 14 pestañas de herramientas gratis a medias, igual. Uso ToolMarket365 como un solo lugar para hooks, facturas y utilidades pequeñas que deberían existir. {{BASE}}',
      },
      {
        platform: "LinkedIn",
        text: "Los creadores manejan un negocio, no solo un canal. ToolMarket365 junta las ops aburridas (facturación, recordatorios, CRM-lite) con la capa creativa (hooks, schedulers, ayudas de repurposing). Vale la pena echar un vistazo: {{BASE}}/home",
      },
      {
        platform: "Texto principal de anuncio corto",
        text: "Más de 120 herramientas para creadores y freelancers en un marketplace. Prueba una en segundos — {{BASE}}/home",
      },
    ],
    emailSubjects: [
      "Herramientas de la semana: recordatorios de facturas + ideas de hooks (ToolMarket365)",
      "Tu stack de ops de creador probablemente cuesta demasiado — aquí hay una alternativa",
      "Nuevo en el kit: life tools + integraciones (por si te lo perdiste)",
    ],
    landingSectionOutline: [
      "Hero: titular + subtítulo + CTA principal (Probar herramientas / Ver precios) + línea de confianza (las herramientas cargan, sin descargas sospechosas).",
      "Franja de prueba: número de herramientas, categorías (creadores, finanzas, life tools), testimonial opcional.",
      "Cómo funciona: 1) Elige una herramienta 2) Ejecuta en el navegador 3) Guarda resultados — tres viñetas.",
      "Grid de categorías: enlace a secciones de /home o /categories — coincide la promesa del anuncio con la sección above the fold.",
      "Objeciones: claridad de precios, qué necesita API keys, qué corre offline vs servidor.",
      "CTA de pie: repetir CTA principal + enlace hermano LifePack365 si aplica.",
    ],
    trackingChecklist: [
      "Configura **NEXT_PUBLIC_SITE_URL** en Vercel Production + Preview para que enlaces, OG y sitemap usen el host correcto.",
      "En **Google Analytics / Plausible / etc.**, marca conversiones: signup_started, checkout_started, trial_started (ajusta a tus eventos reales).",
      "Usa **un utm_campaign por iniciativa**; cambia solo utm_content por creativo para mantener informes limpios.",
      "Añade **exclusión de IP** (oficina / VPN) en plataformas de anuncios para no distorsionar datos de conversión.",
      "Tras el lanzamiento, ejecuta **inspección de URL** en Search Console para `/` y `/home`.",
      "Mantén una **hoja de cálculo**: Campaña | utm | gasto | landing | CPA — sincroniza semanalmente.",
      "Para enlaces salientes de **LifePack365**, usa UTMs separados en ese dominio para que la atribución no colisione con TM365.",
    ],
  },
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12 rounded-xl border border-mono-200 dark:border-mono-700 bg-white dark:bg-mono-900 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{title}</h2>
      {children}
    </section>
  )
}

export default function MarketingKitClient() {
  const { language } = useLanguage()
  const c = copy[language]
  const origin = getSiteUrl()
  const lifepack = getLifepack365Url()

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
        <header className="mb-10">
          <p className="text-sm font-medium text-accent-600 dark:text-accent-400 mb-2">{c.internal}</p>
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-2">{c.pageTitle}</h1>
          <p className="text-mono-600 dark:text-mono-400">
            {c.pageIntroBeforeSite} {SITE_NAME}. {c.pageIntroAfterSite}{" "}
            <code className="text-sm bg-mono-100 dark:bg-mono-800 px-1 rounded">{"{{BASE}}"}</code> {c.pageIntroBeforeOrigin}{" "}
            <strong className="text-mono-800 dark:text-mono-200">{origin}</strong> {c.pageIntroEnd}
          </p>
        </header>

        <Block title={c.utmParameterReference}>
          <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300 mb-6">
            {c.utmFieldHelp.map((row) => (
              <li key={row.param}>
                <code className="text-accent-700 dark:text-accent-300">{row.param}</code> — {row.use}
              </li>
            ))}
          </ul>
          <h3 className="font-semibold text-mono-900 dark:text-mono-100 mb-2">{c.presetLinksTitle}</h3>
          <ul className="space-y-4">
            {UTM_PRESETS.map((p) => {
              const url = buildUtmUrl(origin, p.path, p.params)
              const label = c.utmPresetLabels[p.id as keyof typeof c.utmPresetLabels]
              const note = c.utmPresetNotes[p.id as keyof typeof c.utmPresetNotes]
              return (
                <li
                  key={p.id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-t border-mono-100 dark:border-mono-800 pt-4 first:border-0 first:pt-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-mono-900 dark:text-mono-100">{label}</p>
                    <p className="text-xs text-mono-500 mb-1">{note}</p>
                    <pre className="text-xs break-all whitespace-pre-wrap bg-mono-100 dark:bg-mono-950 p-2 rounded text-mono-800 dark:text-mono-200">
                      {url}
                    </pre>
                  </div>
                  <CopyTextButton text={url} label={c.copy} />
                </li>
              )
            })}
          </ul>
        </Block>

        <Block title={c.copyBankHeadlines}>
          <ul className="space-y-3">
            {c.headlines.map((h, i) => (
              <li key={i} className="flex gap-2 items-start justify-between">
                <p className="text-mono-800 dark:text-mono-200 text-sm flex-1">{h}</p>
                <CopyTextButton text={h} label={c.copy} />
              </li>
            ))}
          </ul>
        </Block>

        <Block title={c.copyBankSubheads}>
          <ul className="space-y-3">
            {c.subheads.map((h, i) => (
              <li key={i} className="flex gap-2 items-start justify-between">
                <p className="text-mono-800 dark:text-mono-200 text-sm flex-1">{h}</p>
                <CopyTextButton text={h} label={c.copy} />
              </li>
            ))}
          </ul>
        </Block>

        <Block title={c.copyBankCtas}>
          <ul className="space-y-3">
            {c.ctas.map((h, i) => (
              <li key={i} className="flex gap-2 items-start justify-between">
                <p className="text-mono-800 dark:text-mono-200 text-sm flex-1">{h}</p>
                <CopyTextButton text={h} label={c.copy} />
              </li>
            ))}
          </ul>
        </Block>

        <Block title={c.socialSnippetsTitle}>
          <ul className="space-y-4">
            {c.socialSnippets.map((s, i) => {
              const filled = s.text.replace(/\{\{BASE\}\}/g, origin)
              return (
                <li key={i} className="border border-mono-200 dark:border-mono-700 rounded-lg p-4">
                  <p className="text-xs font-semibold text-mono-500 mb-2">{s.platform}</p>
                  <p className="text-sm text-mono-800 dark:text-mono-200 whitespace-pre-wrap mb-2">{filled}</p>
                  <CopyTextButton text={filled} label={c.copySnippet} />
                </li>
              )
            })}
          </ul>
        </Block>

        <Block title={c.emailSubjectLines}>
          <ul className="space-y-3">
            {c.emailSubjects.map((h, i) => (
              <li key={i} className="flex gap-2 items-start justify-between">
                <p className="text-mono-800 dark:text-mono-200 text-sm flex-1">{h}</p>
                <CopyTextButton text={h} label={c.copy} />
              </li>
            ))}
          </ul>
        </Block>

        <Block title={c.landingSectionOutlineTitle}>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-mono-700 dark:text-mono-300">
            {c.landingSectionOutline.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </Block>

        <Block title={c.trackingChecklistTitle}>
          <ul className="list-disc pl-5 space-y-2 text-sm text-mono-700 dark:text-mono-300">
            {c.trackingChecklist.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </Block>

        <Block title={c.lifepackCrossPromo}>
          {lifepack ? (
            <>
              <p className="text-sm text-mono-700 dark:text-mono-300 mb-2">
                {c.lifepackPublicUrl}{" "}
                <a className="text-accent-600 hover:underline font-medium" href={lifepack}>
                  {lifepack}
                </a>{" "}
                ({LIFEPACK365_NAME})
              </p>
              <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                <li>{c.lifepackSeparateUtms}</li>
                <li>{c.lifepackExampleOutLink}</li>
              </ul>
              <pre className="mt-2 text-xs break-all bg-mono-100 dark:bg-mono-950 p-3 rounded text-mono-800 dark:text-mono-200">
                {`${lifepack}/?utm_source=toolmarket365&utm_medium=referral&utm_campaign=sister_footer`}
              </pre>
              <div className="mt-2">
                <CopyTextButton
                  text={`${lifepack}/?utm_source=toolmarket365&utm_medium=referral&utm_campaign=sister_footer`}
                  label={c.copyExampleLink}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-mono-700 dark:text-mono-300">
              {c.lifepackSetEnvVar}{" "}
              <code className="text-xs bg-mono-100 dark:bg-mono-800 px-1 rounded">NEXT_PUBLIC_LIFEPACK365_URL</code>{" "}
              {c.lifepackNotConfiguredBefore} {LIFEPACK365_NAME} {c.lifepackNotConfiguredAfter}
            </p>
          )}
        </Block>
      </main>
    </div>
  )
}
