"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { moneda } from "./TransactionTicket";

export type SerieDiaria = {
    fecha: string;
    bcp: number;
    interbank: number;
    yape: number;
    transferenciasBancarias: number;
    otrosOrigenes: number;
};

const series = [
    { key: "bcp", label: "Gastos BCP", color: "#60a5fa", gradient: "serieBcp" },
    { key: "interbank", label: "Pagos Interbank", color: "#34d399", gradient: "serieInterbank" },
    { key: "yape", label: "Yape", color: "#facc15", gradient: "serieYape" },
    { key: "transferenciasBancarias", label: "Transferencias bancarias", color: "#c084fc", gradient: "serieTransferencias" },
    { key: "otrosOrigenes", label: "Otros orígenes", color: "#fb7185", gradient: "serieOtros" },
] as const;

export default function DailyEvolutionChart({ data }: { data: SerieDiaria[] }) {
    const datos = data.length ? data : [{ fecha: "Hoy", bcp: 0, interbank: 0, yape: 0, transferenciasBancarias: 0, otrosOrigenes: 0 }];
    return <section className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl md:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div><p className="text-sm text-slate-400">Evolución diaria</p><h2 className="mt-1 text-xl font-bold">¿De dónde salieron tus movimientos?</h2></div>
            <div className="flex max-w-2xl flex-wrap gap-x-4 gap-y-2 text-xs">{series.map((serie) => <span key={serie.key} className="inline-flex items-center gap-2 text-slate-200"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: serie.color }} />{serie.label}</span>)}</div>
            <TrendingUp className="h-5 w-5 shrink-0 text-blue-400" />
        </div>
        <div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={datos} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
            <defs>{series.map((serie) => <linearGradient key={serie.gradient} id={serie.gradient} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={serie.color} stopOpacity={0.75} /><stop offset="100%" stopColor={serie.color} stopOpacity={0.1} /></linearGradient>)}</defs>
            <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.12)" strokeDasharray="3 5" />
            <XAxis dataKey="fecha" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(valor) => "S/ " + valor} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.25)", borderRadius: "12px" }} labelStyle={{ color: "#cbd5e1" }} formatter={(valor, nombre) => [moneda.format(Number(valor)), nombre]} />
            {series.map((serie) => <Area key={serie.key} name={serie.label} type="monotone" dataKey={serie.key} stackId="movimientos" stroke={serie.color} strokeWidth={2} fill={`url(#${serie.gradient})`} />)}
        </AreaChart></ResponsiveContainer></div>
    </section>;
}
