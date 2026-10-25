
"use client";

import { motion } from "framer-motion";
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    CreditCard,
    LayoutDashboard,
    WalletCards,
} from "lucide-react";
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const categories = [
    { name: "Alimentación", value: 850, color: "#477cff" },
    { name: "Transporte", value: 420, color: "#a78bfa" },
    { name: "Servicios", value: 310, color: "#22d3ee" },
    { name: "Compras", value: 570, color: "#34d399" },
];

const transactions = [
    { name: "Supermercado", category: "Alimentación", amount: -185.9 },
    { name: "Taxi", category: "Transporte", amount: -24.5 },
    { name: "Servicio de internet", category: "Servicios", amount: -99.9 },
];

const money = (value: number) =>
    new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
    }).format(value);

export default function DashboardPreview() {
    return (
        <section className="relative mx-auto max-w-6xl px-5 pb-24">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass glow-blue overflow-hidden rounded-3xl shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <WalletCards className="text-blue-400" />
                        <span className="font-bold text-white">Fluxo</span>
                        <span className="hidden text-sm text-slate-500 sm:inline">
              / Vista general
            </span>
                    </div>
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
            Vista de demostración
          </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[190px_1fr]">
                    <aside className="hidden border-r border-white/10 p-5 md:block">
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 rounded-xl bg-blue-500/15 p-3 text-blue-300">
                                <LayoutDashboard size={18} />
                                Resumen
                            </div>
                            <div className="flex items-center gap-3 p-3 text-slate-400">
                                <CreditCard size={18} />
                                Movimientos
                            </div>
                            <div className="flex items-center gap-3 p-3 text-slate-400">
                                <BarChart3 size={18} />
                                Análisis
                            </div>
                        </div>
                    </aside>

                    <div className="min-w-0 p-5 md:p-8">
                        <div className="mb-7">
                            <h2 className="text-2xl font-bold">Resumen financiero</h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Así podrías visualizar tus movimientos.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {[
                                {
                                    label: "Ingresos",
                                    amount: 5200,
                                    icon: ArrowUpRight,
                                    color: "text-emerald-400",
                                },
                                {
                                    label: "Gastos",
                                    amount: 2150,
                                    icon: ArrowDownRight,
                                    color: "text-rose-400",
                                },
                                {
                                    label: "Balance",
                                    amount: 3050,
                                    icon: WalletCards,
                                    color: "text-blue-400",
                                },
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                                    >
                                        <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        {item.label}
                      </span>
                                            <Icon size={19} className={item.color} />
                                        </div>
                                        <p className="mt-4 text-2xl font-bold">
                                            {money(item.amount)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-5 grid gap-5 lg:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                                <h3 className="font-semibold">Gastos por categoría</h3>
                                <div className="h-56 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categories}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={58}
                                                outerRadius={83}
                                                paddingAngle={4}
                                                stroke="none"
                                            >
                                                {categories.map((category) => (
                                                    <Cell
                                                        key={category.name}
                                                        fill={category.color}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) =>
                                                    typeof value === "number" ? money(value) : money(Number(value ?? 0))
                                                }
                                                contentStyle={{
                                                    backgroundColor: "#111a2d",
                                                    border: "1px solid #334155",
                                                    borderRadius: "12px",
                                                    color: "#ffffff",
                                                }}
                                            />

                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {categories.map((category) => (
                                        <div
                                            key={category.name}
                                            className="flex items-center gap-2 text-xs text-slate-400"
                                        >
                      <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: category.color }}
                      />
                                            {category.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                                <h3 className="mb-5 font-semibold">
                                    Últimos movimientos
                                </h3>
                                <div className="space-y-5">
                                    {transactions.map((transaction) => (
                                        <div
                                            key={transaction.name}
                                            className="flex items-center justify-between gap-3"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="rounded-xl bg-white/5 p-3">
                                                    <CreditCard
                                                        size={18}
                                                        className="text-blue-300"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">
                                                        {transaction.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {transaction.category}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="whitespace-nowrap text-sm font-medium text-rose-300">
                        {money(transaction.amount)}
                      </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
