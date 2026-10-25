import Link from "next/link";
import { FileText, LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";

export function LegalShell({ children, seccion }: { children: ReactNode; seccion: "terminos" | "privacidad" }) {
    return <main className="relative min-h-screen overflow-hidden bg-[#050816] text-slate-200">
        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-600/15 blur-[110px]" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-72 w-72 rounded-full bg-violet-600/10 blur-[110px]" />
        <Navbar />
        <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-10 md:pt-12">
            <div className="mb-7 flex flex-wrap items-center gap-2 text-sm"><span className="mr-2 hidden text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:inline">Información</span><Link href="/terminos" className={seccion === "terminos" ? "rounded-full bg-blue-500/15 px-4 py-2 font-semibold text-blue-200" : "rounded-full px-4 py-2 text-slate-400 hover:text-white"}><FileText className="mr-2 inline h-4 w-4" />Términos</Link><Link href="/privacidad" className={seccion === "privacidad" ? "rounded-full bg-emerald-500/15 px-4 py-2 font-semibold text-emerald-200" : "rounded-full px-4 py-2 text-slate-400 hover:text-white"}><LockKeyhole className="mr-2 inline h-4 w-4" />Privacidad y seguridad</Link></div>
            {children}
        </section>
        <footer className="relative z-10 border-t border-white/10 px-5 py-7 text-center text-xs text-slate-500">Fluxo · Control personal de tus movimientos financieros</footer>
    </main>;
}
