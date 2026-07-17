"use client";

import { useCallback, useState } from "react";
import { buildProposalText, type ProposalInput } from "@/lib/simpleProposal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Simple Proposal Builder",
    instructions: "Instructions",
    instructionsBody: "Enter client and project details, then generate a proposal preview.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody:
      "Use Print / Export PDF to open the browser print dialog and save as PDF.",
    buildHeading: "Build your proposal",
    clientPlaceholder: "Client Name",
    projectPlaceholder: "Project Title",
    scopePlaceholder: "Scope of Work",
    pricePlaceholder: "Price ($)",
    notesPlaceholder: "Additional Notes",
    generate: "Generate",
    reset: "Reset",
    preview: "Preview",
    printExport: "Print / Export PDF",
    emptyPreview: "Fill out the form and click Generate",
  },
  es: {
    title: "Constructor simple de propuestas",
    instructions: "Instrucciones",
    instructionsBody:
      "Ingresa los datos del cliente y del proyecto, luego genera una vista previa de la propuesta.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Usa Imprimir / Exportar PDF para abrir el diálogo de impresión del navegador y guardar como PDF.",
    buildHeading: "Arma tu propuesta",
    clientPlaceholder: "Nombre del cliente",
    projectPlaceholder: "Título del proyecto",
    scopePlaceholder: "Alcance del trabajo",
    pricePlaceholder: "Precio ($)",
    notesPlaceholder: "Notas adicionales",
    generate: "Generar",
    reset: "Reiniciar",
    preview: "Vista previa",
    printExport: "Imprimir / Exportar PDF",
    emptyPreview: "Completa el formulario y haz clic en Generar",
  },
};

export default function SimpleProposalBuilderPage() {
  const { language } = useLanguage();
  const c = copy[language];
  const [client, setClient] = useState("");
  const [project, setProject] = useState("");
  const [scope, setScope] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [generated, setGenerated] = useState(false);
  const [proposal, setProposal] = useState("");

  const handleGenerate = useCallback(() => {
    const input: ProposalInput = {
      client,
      project,
      scope,
      price,
      notes,
    };
    setProposal(buildProposalText(input));
    setGenerated(true);
  }, [client, project, scope, price, notes]);

  const handleReset = () => {
    setClient("");
    setProject("");
    setScope("");
    setPrice("");
    setNotes("");
    setProposal("");
    setGenerated(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 print:max-w-none">
      <h1 className="text-2xl font-bold print:hidden">{c.title}</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3 print:hidden">
        <div>
          <h2 className="font-semibold mb-1">{c.instructions}</h2>
          <p>{c.instructionsBody}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">{c.expectedOutcome}</h2>
          <p>{c.expectedOutcomeBody}</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 space-y-4 print:hidden">
          <h2 className="text-xl font-bold">{c.buildHeading}</h2>

          <input
            placeholder={c.clientPlaceholder}
            className={inputClass}
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />

          <input
            placeholder={c.projectPlaceholder}
            className={inputClass}
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />

          <textarea
            placeholder={c.scopePlaceholder}
            className={`${inputClass} min-h-[120px]`}
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          />

          <input
            placeholder={c.pricePlaceholder}
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <textarea
            placeholder={c.notesPlaceholder}
            className={`${inputClass} min-h-[80px]`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950"
            >
              {c.generate}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-mono-300 dark:border-mono-600 px-4 py-2 font-semibold text-mono-950 dark:text-mono-50"
            >
              {c.reset}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 space-y-4 print:border-0">
          <h2 className="text-xl font-bold print:hidden">{c.preview}</h2>

          {generated ? (
            <>
              <pre className="whitespace-pre-wrap text-sm rounded-lg bg-mono-100 dark:bg-mono-900 p-4 text-mono-950 dark:text-mono-50 print:bg-white print:text-black">
                {proposal}
              </pre>
              <button
                type="button"
                onClick={handlePrint}
                className="w-full rounded-lg bg-accent-600 px-4 py-2 font-semibold text-white hover:bg-accent-700 print:hidden"
              >
                {c.printExport}
              </button>
            </>
          ) : (
            <p className="text-mono-600 dark:text-mono-400 print:hidden">{c.emptyPreview}</p>
          )}
        </div>
      </div>
    </div>
  );
}
