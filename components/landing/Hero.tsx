
"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import GoogleSignInButton from "../ui/GoogleSignInButton";

export default function Hero() {
    return (
        <section
            id="inicio"
            className="relative mx-auto max-w-7xl px-5 pb-12 pt-20 md:pt-28"
        >
            <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />
            <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 mx-auto max-w-4xl text-center"
            >
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-300">
                    <Sparkles size={16} />
                    Tus finanzas, en piloto automático
                </div>

                <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
                    Tu dinero.
                    <br />
                    <span className="gradient-text">
            Bajo control.
          </span>
                </h1>

                <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
                    Organiza tus gastos sin registrar cada compra manualmente.
                    Conecta tu correo y convierte tus comprobantes bancarios
                    en información clara para tomar mejores decisiones.
                </p>

                <div id="comenzar" className="mt-10">
                    <GoogleSignInButton />
                </div>

                <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-blue-400" />
            Configuración sencilla
          </span>
                    <span className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-blue-400" />
            Control de movimientos
          </span>
                    <span className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-blue-400" />
            Reportes visuales
          </span>
                </div>
            </motion.div>
        </section>
    );
}
