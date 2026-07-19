import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            Stride<span className="text-emerald-400">Rx</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Biomechanical running shoe recommendations — built on peer-reviewed research, not marketing.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 mb-8 backdrop-blur">
          <h2 className="text-lg font-semibold mb-3 text-zinc-200">How it works</h2>
          <ol className="space-y-2 text-zinc-400 text-sm">
            <li><b className="text-zinc-200">1. Connect Strava</b> — pull your training load, pace, elevation</li>
            <li><b className="text-zinc-200">2. Enter your biomechanics</b> — foot strike, alignment, injury history, body mass</li>
            <li><b className="text-zinc-200">3. Set preferences</b> — brands, stack, drop, cushioning, price</li>
            <li><b className="text-zinc-200">4. Get 5 shoes ranked for YOU</b> — with clinical rationale for each pick</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/profile" className="px-7 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl transition text-center">
            Start — Find My Shoes →
          </Link>
          <a href="https://docs.google.com/document/d/1i_IJXWTfpWhB7ZoaOo7KC3n7p3H3E0SKtPh7qZ0Quco/edit?usp=sharing" target="_blank" className="px-7 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-xl transition text-center">
            Read the Research
          </a>
        </div>

        <div className="mt-16 text-xs text-zinc-500 text-center max-w-2xl mx-auto space-y-4">
          <p>
            Based on 5 peer-reviewed papers covering footwear biomechanics in ultramarathon running, stack height effects, carbon plate mechanics, running economy, and shoe characteristic → physiology mapping. Not medical advice — consult a qualified PT for clinical shoe prescription.
          </p>
          <div className="text-[11px] text-zinc-600 space-y-1 max-w-xl mx-auto text-left">
            <p className="text-zinc-500 text-center mb-2">Research papers:</p>
            <p>1. <a href="https://www.semanticscholar.org/paper/155b5cec06f13aae2b3dae1f9bb8356ab7f49e66" target="_blank" className="underline hover:text-zinc-400">Waśkiewicz et al (2025)</a> — Footwear technology and biomechanical adaptations in ultramarathon running — <em>Front Bioeng Biotechnol</em></p>
            <p>2. <a href="https://www.semanticscholar.org/paper/8466ecc7d3ee132e16111be784e7765b564d7d94" target="_blank" className="underline hover:text-zinc-400">Kettner, Stetter &amp; Stein (2025)</a> — Effects of running shoe stack height on running style and stability</p>
            <p>3. <a href="https://www.semanticscholar.org/paper/c3421a5275bdb7e0926b631d48a96382a6691aba" target="_blank" className="underline hover:text-zinc-400">Song et al (2024)</a> — Curved carbon-plated shoe may further reduce forefoot loads — <em>Sci Rep</em></p>
            <p>4. <a href="https://www.semanticscholar.org/paper/1598626dcb4531584af9608ab3bcc6ea40a9ed01" target="_blank" className="underline hover:text-zinc-400">Hébert-Losier &amp; Pamment (2022)</a> — Advancements in running shoe technology and their effects on running economy</p>
            <p>5. <a href="https://www.semanticscholar.org/paper/05da1f4a7dc6125713a843e4880cf2ad0796fa07" target="_blank" className="underline hover:text-zinc-400">Rodrigo Carranza (2023)</a> — Running footwear matters: decoding shoe characteristics → physiology, biomechanics, performance</p>
          </div>
        </div>
      </div>
    </main>
  );
}
