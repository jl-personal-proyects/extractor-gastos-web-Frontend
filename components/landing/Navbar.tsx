"use client";

import Link from "next/link";
import { Menu, ShieldCheck, WalletCards, X } from "lucide-react";
import { useState } from "react";
import GoogleSignInButton from "../ui/GoogleSignInButton";

export default function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const cerrarMenu = () => setMenuAbierto(false);

    return (
        <header className="relative z-30 mx-auto max-w-7xl px-5 pt-5">
            <nav className="relative flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 shadow-2xl shadow-blue-950/30 backdrop-blur-2xl md:px-6">
                <Link href="/" onClick={cerrarMenu} className="flex items-center gap-3" aria-label="Fluxo, inicio">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-600/30">
                        <WalletCards className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-white">Flu<span className="text-blue-400">xo</span></span>
                </Link>

                <div className="hidden items-center gap-6 text-sm font-medium text-slate-300 lg:flex">
                    <Link href={{ pathname: "/", hash: "funciones" }} className="transition hover:text-white">Beneficios</Link>
                    <Link href={{ pathname: "/", hash: "como-funciona" }} className="transition hover:text-white">Cómo funciona</Link>
                    <Link href={{ pathname: "/", hash: "seguridad" }} className="transition hover:text-white">Seguridad</Link>
                </div>

                <div className="hidden items-center gap-3 sm:flex">
                    <span className="hidden items-center gap-1.5 text-xs text-slate-400 xl:flex"><ShieldCheck className="h-4 w-4 text-emerald-400" />Sin registrar gastos a mano</span>
                    <div className="scale-90 origin-right"><GoogleSignInButton /></div>
                </div>

                <button type="button" aria-label={menuAbierto ? "Cerrar navegación" : "Abrir navegación"} aria-expanded={menuAbierto} onClick={() => setMenuAbierto((abierto) => !abierto)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-200 transition hover:bg-white/10 sm:hidden">
                    {menuAbierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                {menuAbierto && <div className="absolute top-[calc(100%+0.6rem)] right-0 left-0 rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl sm:hidden">
                    <div className="flex flex-col gap-1">
                        <Link href={{ pathname: "/", hash: "funciones" }} onClick={cerrarMenu} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">Beneficios</Link>
                        <Link href={{ pathname: "/", hash: "como-funciona" }} onClick={cerrarMenu} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">Cómo funciona</Link>
                        <Link href={{ pathname: "/", hash: "seguridad" }} onClick={cerrarMenu} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">Seguridad</Link>
                    </div>
                    <Link href={{ pathname: "/", hash: "comenzar" }} onClick={cerrarMenu} className="mt-2 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white">Conectar con Google</Link>
                </div>}
            </nav>
        </header>
    );
}
