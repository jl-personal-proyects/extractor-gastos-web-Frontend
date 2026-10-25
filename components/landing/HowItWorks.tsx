
"use client";

import { motion } from "framer-motion";
import {
    LogIn,
    ShieldCheck,
    MailSearch,
    ChartNoAxesCombined,
    ArrowRight,
} from "lucide-react";

const steps = [
    {
        number: "01",
        icon: LogIn,
        title: "Conecta Google",
        description:
            "Inicia sesión de forma segura utilizando tu cuenta de Google.",
        color: "text-blue-400",
    },
    {
        number: "02",
        icon: ShieldCheck,
        title: "Autoriza los permisos",
        description:
            "Revisa qué datos solicita Fluxo y decide si deseas conceder acceso.",
        color: "text-violet-400",
    },
    {
        number: "03",
        icon: MailSearch,
        title: "Procesamiento automático",
        description:
            "Una vez habilitada la integración, Fluxo identifica comprobantes bancarios y extrae los movimientos.",
        color: "text-cyan-400",
    },
    {
        number: "04",
        icon: ChartNoAxesCombined,
        title: "Controla tus finanzas",
        description:
            "Consulta tus gastos, categorías y reportes desde un dashboard.",
        color: "text-emerald-400",
    },
];

export default function HowItWorks() {
    return (
        <section
            id="como-funciona"
            className="relative mx-auto max-w-7xl px-5 py-24"
        >
            <div className="mb-16 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
          Simple y transparente
        </span>

                <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
                    ¿Cómo funciona{" "}
                    <span className="gradient-text">Fluxo?</span>
                </h2>

                <p className="mx-auto mt-5 max-w-2xl text-slate-400">
                    Descubre cómo convertir tus comprobantes bancarios
                    en información financiera organizada.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.12 }}
                            className="glass relative rounded-2xl p-7"
                        >
                            <div className="mb-7 flex items-center justify-between">
                                <div className="rounded-xl bg-white/5 p-4">
                                    <Icon size={27} className={step.color} />
                                </div>

                                <span className="text-3xl font-bold text-white/10">
                  {step.number}
                </span>
                            </div>

                            <h3 className="mb-3 text-lg font-semibold text-white">
                                {step.title}
                            </h3>

                            <p className="text-sm leading-relaxed text-slate-400">
                                {step.description}
                            </p>

                            {index < steps.length - 1 && (
                                <ArrowRight
                                    size={17}
                                    className="absolute -right-3 top-1/2 z-10 hidden text-blue-400 lg:block"
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
