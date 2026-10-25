
import Link from "next/link";
import { LockKeyhole, WalletCards } from "lucide-react";

export default function Footer() {
    return (
        <footer
            id="seguridad"
            className="border-t border-white/10 bg-slate-950/70"
        >
            <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
                <div className="flex items-center gap-3">
                    <div><div className="flex items-center gap-3"><WalletCards className="text-blue-400" /><span className="text-lg font-bold">Fluxo</span></div><p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">Convierte comprobantes en una vista clara de tus finanzas, sin registrar cada movimiento manualmente.</p></div>
                </div>
                <div><p className="text-sm font-bold text-white">Transparencia</p><div className="mt-3 flex flex-col gap-2 text-sm text-slate-400"><Link href="/terminos" className="hover:text-blue-300">Términos y condiciones</Link><Link href="/privacidad" className="hover:text-blue-300">Política de privacidad y seguridad</Link><Link href={{ pathname: "/", hash: "como-funciona" }} className="hover:text-blue-300">Cómo funciona</Link></div></div>
                <div><p className="flex items-center gap-2 text-sm font-bold text-white"><LockKeyhole className="h-4 w-4 text-emerald-400" />Acceso con autorización</p><p className="mt-3 text-sm leading-relaxed text-slate-400">Google requiere tu consentimiento antes de leer los comprobantes necesarios para generar tus reportes.</p><Link href={{ pathname: "/", hash: "inicio" }} className="mt-4 inline-block text-sm font-semibold text-blue-300 hover:text-white">Volver arriba ↑</Link></div>
            </div>
        </footer>
    );
}
