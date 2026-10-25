
"use client";

import { motion } from "framer-motion";
import {
    Mail,
    ShieldCheck,
    ChartNoAxesCombined,
    Clock3,
} from "lucide-react";

const features = [
    {
        title: "Lectura inteligente",
        description:
            "Identifica comprobantes y movimientos financieros recibidos en tu correo.",
        icon: Mail,
        color: "text-blue-400",
    },
    {
        title: "Control de acceso",
        description:
            "Diseñado para solicitar únicamente los permisos necesarios para procesar tus comprobantes.",
        icon: ShieldCheck,
        color: "text-emerald-400",
    },
    {
        title: "Reportes visuales",
        description:
            "Comprende en qué gastas mediante categorías, gráficos y resúmenes.",
        icon: ChartNoAxesCombined,
        color: "text-violet-400",
    },
    {
        title: "Menos trabajo manual",
        description:
            "Reduce el tiempo dedicado a registrar y organizar cada movimiento.",
        icon: Clock3,
        color: "text-cyan-400",
    },
];

export default function Features() {
    return (
        <section
            id="funciones"
            className="mx-auto max-w-7xl px-5 pb-28"
        >
            <div className="mb-12 text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                    Funcionalidades
                </p>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Menos registros. Más claridad.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-slate-400">
                    Todo lo que necesitas para entender mejor tus finanzas
                    personales desde un mismo lugar.
                </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => {
                    const Icon = feature.icon;

                    return (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -6 }}
                            className="glass rounded-2xl p-7 transition-colors hover:bg-white/[0.06]"
                        >
                            <div className="mb-6 inline-flex rounded-2xl bg-white/5 p-4">
                                <Icon size={27} className={feature.color} />
                            </div>
                            <h3 className="mb-3 text-lg font-semibold">
                                {feature.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-400">
                                {feature.description}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
