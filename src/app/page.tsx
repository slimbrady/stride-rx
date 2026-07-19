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
          <a href="https://docs.google.com/document/d/1i_IJXWTfpWhB7ZoaOo7KC3n7p3H3E0SKtPh7qZ0Quco/edit" target="_blank" className="px-7 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-xl transition text-center">
            Read the Research
          </a>
        </div>

        <div className="mt-16 text-xs text-zinc-500 text-center max-w-2xl mx-auto">
          Based on 5 peer-reviewed papers covering footwear biomechanics in ultramarathon running, stack height effects, carbon plate mechanics, running economy, and shoe characteristic → physiology mapping. Not medical advice — consult a qualified PT for clinical shoe prescription.
        </div>
      </div>
    </main>
  );
}
