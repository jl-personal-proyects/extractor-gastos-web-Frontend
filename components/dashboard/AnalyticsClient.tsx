"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, CalendarDays, ReceiptText, TrendingUp, WalletCards } from "lucide-react";
import { moneda } from "@/components/dashboard/TransactionTicket";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const coloresGasto = ["#60a5fa", "#34d399", "#c084fc", "#fbbf24", "#fb7185", "#94a3b8"];
const coloresConsumo = ["#38bdf8", "#a78bfa", "#2dd4bf", "#fb923c", "#f472b6", "#94a3b8"];

type Dato = { categoria: string; total: number | string };
type Banco = { banco: string; total: number | string; transacciones: number };
type Comercio = { establecimiento: string; total: number | string; transacciones: number };
type Alerta = { categoria: string; limite_mensual: number | string; gasto_actual: number | string; porcentaje_consumido: number | string };
type Analiticas = {
    mes_anio: string;
    resumen: { total_mes: number | string; transacciones: number; promedio_diario: number | string; transaccion_mayor: number | string; variacion_porcentual: number | string; dias_periodo: number };
    diario: { fecha: string; total: number | string }[];
    por_categoria_gasto: Dato[];
    por_categoria_consumo: Dato[];
    por_banco: Banco[];
    top_comercios: Comercio[];
};

function numero(valor: number | string) {
    const resultado = Number(valor);
    return Number.isFinite(resultado) ? resultado : 0;
}

function tonoPresupuesto(porcentaje: number) {
    return porcentaje >= 100 ? "bg-rose-500" : porcentaje >= 80 ? "bg-amber-400" : "bg-emerald-400";
}

function Dona({ titulo, datos, colores }: { titulo: string; datos: Dato[]; colores: string[] }) {
    const normalizados = datos.map((dato) => ({ ...dato, total: numero(dato.total) }));
    return <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl"><h2 className="text-base font-bold">{titulo}</h2>{normalizados.length ? <><div className="mt-3 h-60"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={normalizados} dataKey="total" nameKey="categoria" innerRadius={58} outerRadius={88} paddingAngle={3}>{normalizados.map((dato, index) => <Cell key={dato.categoria} fill={colores[index % colores.length]} />)}</Pie><Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.25)", borderRadius: "12px" }} formatter={(valor) => moneda.format(numero(valor as number | string))} /></PieChart></ResponsiveContainer></div><div className="grid gap-2 sm:grid-cols-2">{normalizados.slice(0, 6).map((dato, index) => <div key={dato.categoria} className="flex min-w-0 items-center justify-between gap-2 text-xs"><span className="flex min-w-0 items-center gap-2 text-slate-300"><i className="h-2 w-2 shrink-0 rounded-full" style={{ background: colores[index % colores.length] }} /><span className="truncate">{dato.categoria}</span></span><span className="shrink-0 text-slate-500">{moneda.format(dato.total)}</span></div>)}</div></> : <p className="mt-8 rounded-xl bg-black/15 p-5 text-center text-sm text-slate-500">Sin movimientos en este período.</p>}</section>;
}

export default function AnalyticsClient() {
    const [analiticas, setAnaliticas] = useState<Analiticas | null>(null);
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        void Promise.all([fetch(`${API_URL}/gastos/analiticas/detalladas`, { signal: controller.signal }), fetch(`${API_URL}/alertas`, { signal: controller.signal })])
            .then(async ([respuestaAnaliticas, respuestaAlertas]) => {
                if (!respuestaAnaliticas.ok) throw new Error("No se pudieron obtener las analíticas.");
                const datos = await respuestaAnaliticas.json() as Analiticas;
                const presupuestos = respuestaAlertas.ok ? await respuestaAlertas.json() as { alertas: Alerta[] } : { alertas: [] };
                setAnaliticas(datos); setAlertas(presupuestos.alertas ?? []);
            })
            .catch((caughtError: unknown) => {
                if (!(caughtError instanceof DOMException && caughtError.name === "AbortError")) setError(caughtError instanceof Error ? caughtError.message : "No se pudieron cargar las analíticas.");
            });
        return () => controller.abort();
    }, []);

    const diario = useMemo(() => (analiticas?.diario ?? []).map((dato) => ({ fecha: new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(new Date(`${dato.fecha}T12:00:00`)), total: numero(dato.total) })), [analiticas]);
    const resumen = analiticas?.resumen;
    const variacion = numero(resumen?.variacion_porcentual ?? 0);
    const maximoComercio = Math.max(...(analiticas?.top_comercios.map((comercio) => numero(comercio.total)) ?? [1]), 1);

    const kpis = [
        { titulo: "Total del mes", valor: moneda.format(numero(resumen?.total_mes ?? 0)), detalle: `${resumen?.transacciones ?? 0} movimiento(s) consolidados`, icono: WalletCards, tono: "text-blue-300" },
        { titulo: "Promedio diario", valor: moneda.format(numero(resumen?.promedio_diario ?? 0)), detalle: `Sobre ${resumen?.dias_periodo ?? 0} día(s) del período`, icono: CalendarDays, tono: "text-emerald-300" },
        { titulo: "Mayor transacción", valor: moneda.format(numero(resumen?.transaccion_mayor ?? 0)), detalle: "Valor máximo del período", icono: ReceiptText, tono: "text-violet-300" },
        { titulo: "Vs. mes anterior", valor: `${variacion >= 0 ? "+" : ""}${variacion.toFixed(1)}%`, detalle: variacion >= 0 ? "Variación al alza" : "Variación a la baja", icono: variacion >= 0 ? ArrowUpRight : ArrowDownRight, tono: variacion >= 0 ? "text-rose-300" : "text-emerald-300" },
    ];

    return <main className="relative min-h-full overflow-hidden p-6 text-white md:p-9"><div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" /><div className="relative z-10 mx-auto max-w-7xl"><header className="mb-8"><p className="text-sm text-slate-400">Inteligencia financiera</p><h1 className="mt-1 text-4xl font-extrabold">Análisis mensual</h1><p className="mt-2 text-sm text-slate-500">{analiticas ? new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric" }).format(new Date(`${analiticas.mes_anio}T12:00:00`)) : "Cargando período…"}</p></header>{error && <p className="mb-6 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-rose-100">{error}</p>}<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpis.map((kpi, index) => { const Icono = kpi.icono; return <motion.div key={kpi.titulo} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl"><div className="flex items-center justify-between"><p className="text-sm text-slate-400">{kpi.titulo}</p><Icono className={`h-5 w-5 ${kpi.tono}`} /></div><p className="mt-5 text-2xl font-bold">{kpi.valor}</p><p className="mt-2 text-xs text-slate-500">{kpi.detalle}</p></motion.div>; })}</section><section className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl md:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="text-sm text-slate-400">Evolución del gasto</p><h2 className="mt-1 text-xl font-bold">Picos de consumo del mes</h2></div><TrendingUp className="h-5 w-5 text-blue-300" /></div><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={diario.length ? diario : [{ fecha: "Sin datos", total: 0 }]} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}><defs><linearGradient id="analisisGasto" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#60a5fa" stopOpacity={0.7} /><stop offset="100%" stopColor="#60a5fa" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="rgba(148,163,184,0.12)" strokeDasharray="3 5" /><XAxis dataKey="fecha" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(valor) => `S/ ${valor}`} /><Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.25)", borderRadius: "12px" }} formatter={(valor) => [moneda.format(numero(valor as number | string)), "Gasto"]} /><Area type="monotone" dataKey="total" stroke="#60a5fa" strokeWidth={3} fill="url(#analisisGasto)" /></AreaChart></ResponsiveContainer></div></section><section className="mt-6 grid gap-6 xl:grid-cols-2"><Dona titulo="Por categoría de gasto" datos={analiticas?.por_categoria_gasto ?? []} colores={coloresGasto} /><Dona titulo="Por categoría de consumo" datos={analiticas?.por_categoria_consumo ?? []} colores={coloresConsumo} /></section><section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]"><section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl"><h2 className="text-base font-bold">Comparativa bancaria</h2><p className="mt-1 text-sm text-slate-500">Volumen operado por banco.</p><div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={(analiticas?.por_banco ?? []).map((dato) => ({ ...dato, total: numero(dato.total) }))} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}><CartesianGrid vertical={false} stroke="rgba(148,163,184,0.12)" strokeDasharray="3 5" /><XAxis dataKey="banco" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(valor) => `S/ ${valor}`} /><Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.25)", borderRadius: "12px" }} formatter={(valor) => [moneda.format(numero(valor as number | string)), "Volumen"]} /><Bar dataKey="total" radius={[8, 8, 0, 0]}>{(analiticas?.por_banco ?? []).map((dato) => <Cell key={dato.banco} fill={dato.banco === "BCP" ? "#60a5fa" : "#34d399"} />)}</Bar></BarChart></ResponsiveContainer></div></section><section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl"><h2 className="text-base font-bold">Top 5 comercios</h2><p className="mt-1 text-sm text-slate-500">Dónde se concentra el mayor gasto.</p><div className="mt-5 space-y-4">{analiticas?.top_comercios.length ? analiticas.top_comercios.map((comercio, index) => <div key={comercio.establecimiento}><div className="flex justify-between gap-3 text-sm"><p className="min-w-0 truncate"><span className="mr-2 text-slate-500">{index + 1}.</span>{comercio.establecimiento}</p><p className="shrink-0 font-semibold text-emerald-300">{moneda.format(numero(comercio.total))}</p></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.08]"><motion.div initial={{ width: 0 }} animate={{ width: `${numero(comercio.total) / maximoComercio * 100}%` }} transition={{ duration: 0.6, delay: index * 0.06 }} className="h-full rounded-full bg-blue-400" /></div><p className="mt-1 text-xs text-slate-500">{comercio.transacciones} movimiento(s)</p></div>) : <p className="rounded-xl bg-black/15 p-5 text-center text-sm text-slate-500">Sin comercios en este período.</p>}</div></section></section><section className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl md:p-6"><h2 className="text-base font-bold">Monitoreo de presupuestos</h2><p className="mt-1 text-sm text-slate-500">Límites mensuales por categoría de gasto.</p><div className="mt-5 grid gap-4 md:grid-cols-2">{alertas.length ? alertas.map((alerta) => { const porcentaje = numero(alerta.porcentaje_consumido); return <div key={alerta.categoria} className="rounded-xl bg-black/15 p-4"><div className="flex justify-between gap-3 text-sm"><span className="font-semibold">{alerta.categoria}</span><span className="font-bold">{porcentaje.toFixed(0)}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]"><motion.div className={`h-full rounded-full ${tonoPresupuesto(porcentaje)}`} initial={{ width: 0 }} animate={{ width: `${Math.min(porcentaje, 100)}%` }} transition={{ duration: 0.7 }} /></div><p className="mt-3 text-xs text-slate-400">{moneda.format(numero(alerta.gasto_actual))} de {moneda.format(numero(alerta.limite_mensual))}</p></div>; }) : <p className="rounded-xl bg-black/15 p-5 text-sm text-slate-500">Define tus límites desde Ajustes para monitorearlos aquí.</p>}</div></section></div></main>;
}
