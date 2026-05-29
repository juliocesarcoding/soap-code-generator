"use client";

import { useEffect, useState } from "react";
import { generateCode, GenerateMode } from "../lib/codeGenerator";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});
export function SoapGeneratorForm() {
  const [mode, setMode] = useState<GenerateMode>("request");
  const [xml, setXml] = useState("");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [totalRuns, setTotalRuns] = useState<number>(0);

  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    if (isGenerating || !xml.trim()) return;

    setIsGenerating(true);

    try {
      setCode(generateCode(xml, mode));

      await fetch("/api/supabase", {
        method: "POST",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => setCopied(false), 1800);
  }
  useEffect(() => {
    async function loadCounter() {
      const response = await fetch("/api/supabase", {
        method: "GET",
      });
      const data = await response.json();

      setTotalRuns(data.total);
    }

    loadCounter();
  }, []);


  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute bottom-[-15%] left-[30%] h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

      <section className="relative mx-auto max-w-7xl px-6 py-10">
        <header className="mb-16 text-center">
          <div className={` ${spaceGrotesk.className} mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 p-[1px]`}>
            <div className="flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2">
              <span className="text-lg">⚡</span>

              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-sm font-semibold text-transparent">
                SOAP Code Generator
              </span>
              <div className="text-zinc-400 text-sm">
                {totalRuns != 0 && (
                  <span>
                    | {totalRuns.toLocaleString()} codes generations
                  </span>
                )}
              </div>
            </div>
          </div>

          <h1
            className={`${spaceGrotesk.className} text-5xl md:text-7xl font-bold tracking-tight`}
          >
            Create JavaScript code from your SOAP XML
          </h1>

          <p className={`${spaceGrotesk.className} mx-auto mt-4 max-w-2xl text-zinc-400`}>
            Paste your SOAP XML and get ready-to-use JavaScript code for your Node.js service. Perfect for APIs, and old integrations
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">XML </h2>

              <div className="rounded-xl bg-zinc-950 p-1">
                <button
                  onClick={() => setMode("request")}
                  className={`rounded-lg px-4 py-2 text-sm transition-all ${mode === "request"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-zinc-400 hover:text-white"
                    }`}
                >
                  Request
                </button>

                <button
                  onClick={() => setMode("response")}
                  className={`rounded-lg px-4 py-2 text-sm transition-all ${mode === "response"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-zinc-400 hover:text-white"
                    }`}
                >
                  Response
                </button>
              </div>
            </div>

            <textarea
              value={xml}
              onChange={(e) => setXml(e.target.value)}
              placeholder="Paste your SOAP XML here..."
              className="h-[460px] w-full resize-none rounded-xl border border-zinc-800 bg-black/60 p-4 font-mono text-sm text-zinc-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:scale-[1.01] hover:shadow-blue-600/40 active:scale-[0.99]"
            >
              {isGenerating ? "Generating..." : "Run!"}
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <div >
                <h2 className={`${spaceGrotesk.className} text-lg font-semibold`}>Generated code</h2>
                <p className={` ${spaceGrotesk.className} mt-1 text-sm text-zinc-500`}>
                  Ready to copy and paste into your project
                </p>
              </div>

              {code && (
                <button
                  onClick={handleCopy}
                  className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-300 transition hover:border-blue-500 hover:text-white"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>

            <div className="relative h-[540px] overflow-hidden rounded-xl border border-zinc-800 bg-black">
              <div className="flex gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>

              {code ? (
                <SyntaxHighlighter
                  language="typescript"
                  style={vscDarkPlus}
                  customStyle={{
                    height: "100%",
                    margin: 0,
                    padding: "1rem",
                    background: "transparent",
                    fontSize: "0.875rem",
                  }}
                  wrapLongLines
                >
                  {code}
                </SyntaxHighlighter>
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center text-zinc-500">
                  The generated code will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="mt-24">
        <div className={` ${spaceGrotesk.className} mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900/60 p-10 text-center backdrop-blur`}>
          <h3 className="mb-3 text-2xl font-bold">
            Did this tool save you time?
          </h3>

          <p className="mb-6 text-zinc-400">
            If this tool helped you, consider supporting its development.
          </p>

          <a
            href="https://buymeacoffee.com/juliowisnio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            ☕ Buy Me a Coffee
          </a>
        </div>
      </section>
      <footer className={`${spaceGrotesk.className} mt-16 border-t border-zinc-800 py-10`}>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-zinc-500">
            Built by Julio Cesar for developers working with SOAP integrations.
          </p>

          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} SOAP Code Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}