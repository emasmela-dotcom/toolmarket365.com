"use client";

import { useCallback, useState } from "react";
import { buildProposalText, type ProposalInput } from "@/lib/simpleProposal";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function SimpleProposalBuilderPage() {
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
      <h1 className="text-2xl font-bold print:hidden">Simple Proposal Builder</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3 print:hidden">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Enter client and project details, then generate a proposal preview.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>Use Print / Export PDF to open the browser print dialog and save as PDF.</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 space-y-4 print:hidden">
          <h2 className="text-xl font-bold">Build your proposal</h2>

          <input
            placeholder="Client Name"
            className={inputClass}
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />

          <input
            placeholder="Project Title"
            className={inputClass}
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />

          <textarea
            placeholder="Scope of Work"
            className={`${inputClass} min-h-[120px]`}
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          />

          <input
            placeholder="Price ($)"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <textarea
            placeholder="Additional Notes"
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
              Generate
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-mono-300 dark:border-mono-600 px-4 py-2 font-semibold text-mono-950 dark:text-mono-50"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 space-y-4 print:border-0">
          <h2 className="text-xl font-bold print:hidden">Preview</h2>

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
                Print / Export PDF
              </button>
            </>
          ) : (
            <p className="text-mono-600 dark:text-mono-400 print:hidden">
              Fill out the form and click Generate
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
