"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Platform = "twitter" | "instagram" | "linkedin" | "email";
type Tone = "casual" | "professional" | "friendly" | "direct";

const copy = {
  en: {
    title: "Cold DM Personalizer",
    instructions: "Instructions",
    instructionsBody:
      "Enter niche, target, platform, tone, and goal, then click Generate DMs.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody:
      "You get several personalized cold DM drafts ready to edit and send.",
    nichePlaceholder: "Niche (e.g. content creation)",
    targetPlaceholder: "Target (e.g. small creators)",
    goalPlaceholder: "Goal (e.g. get reply, book a call)",
    platform: {
      instagram: "Instagram",
      twitter: "Twitter / X",
      linkedin: "LinkedIn",
      email: "Email",
    },
    tone: {
      friendly: "Friendly",
      casual: "Casual",
      professional: "Professional",
      direct: "Direct",
    },
    generate: "Generate DMs",
  },
  es: {
    title: "Personalizador de DM en frío",
    instructions: "Instrucciones",
    instructionsBody:
      "Ingresa nicho, objetivo, plataforma, tono y meta, luego haz clic en Generar DMs.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Obtienes varios borradores de DM en frío personalizados listos para editar y enviar.",
    nichePlaceholder: "Nicho (ej. creación de contenido)",
    targetPlaceholder: "Objetivo (ej. creadores pequeños)",
    goalPlaceholder: "Meta (ej. conseguir respuesta, agendar llamada)",
    platform: {
      instagram: "Instagram",
      twitter: "Twitter / X",
      linkedin: "LinkedIn",
      email: "Correo",
    },
    tone: {
      friendly: "Amigable",
      casual: "Casual",
      professional: "Profesional",
      direct: "Directo",
    },
    generate: "Generar DMs",
  },
};

export default function ColdDMPersonalizer() {
  const { language } = useLanguage();
  const c = copy[language];

  const [niche, setNiche] = useState("");
  const [target, setTarget] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [tone, setTone] = useState<Tone>("friendly");
  const [goal, setGoal] = useState("");
  const [dms, setDms] = useState<string[]>([]);

  const run = async () => {
    const res = await fetch("/api/cold-dm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, target, platform, tone, goal }),
    });

    const data = await res.json();
    setDms(data.dms ?? []);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">{c.title}</h1>

      <section className="mb-6 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">{c.instructions}</h2>
          <p>{c.instructionsBody}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">{c.expectedOutcome}</h2>
          <p>{c.expectedOutcomeBody}</p>
        </div>
      </section>

      <input
        className="border p-2 w-full mb-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        placeholder={c.nichePlaceholder}
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        placeholder={c.targetPlaceholder}
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        value={platform}
        onChange={(e) => setPlatform(e.target.value as Platform)}
      >
        <option value="instagram">{c.platform.instagram}</option>
        <option value="twitter">{c.platform.twitter}</option>
        <option value="linkedin">{c.platform.linkedin}</option>
        <option value="email">{c.platform.email}</option>
      </select>

      <select
        className="border p-2 w-full mb-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        value={tone}
        onChange={(e) => setTone(e.target.value as Tone)}
      >
        <option value="friendly">{c.tone.friendly}</option>
        <option value="casual">{c.tone.casual}</option>
        <option value="professional">{c.tone.professional}</option>
        <option value="direct">{c.tone.direct}</option>
      </select>

      <input
        className="border p-2 w-full mb-4 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        placeholder={c.goalPlaceholder}
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <button
        type="button"
        onClick={run}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded w-full"
      >
        {c.generate}
      </button>

      <div className="mt-6 space-y-4">
        {dms.map((dm, i) => (
          <div
            key={i}
            className="border border-mono-200 dark:border-mono-700 p-3 rounded text-sm whitespace-pre-wrap"
          >
            {dm}
          </div>
        ))}
      </div>
    </div>
  );
}
