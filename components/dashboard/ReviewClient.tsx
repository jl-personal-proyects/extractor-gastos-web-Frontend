"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, ClipboardCheck } from "lucide-react";
import { Gasto, moneda, montoNumerico, TransactionTicket } from "@/components/dashboard/TransactionTicket";

type Resultado = { items: Gasto[]; pagination: { total: number } };
const API_URL = "/api/backend";

export default function ReviewClient() {
    const [resultado, setResultado] = useState<Resultado | null>(null);
    const [seleccionado, setSeleccionado] = useState<Gasto | null>(null);
    const [error, setError] = useState<string | null>(null);

    function cargar() {
        void fetch(`${API_URL}/gastos/pendientes?page_size=50`).then(async (respuesta) => {
            if (!respuesta.ok) throw new Error("No se pudo cargar la bandeja.");
            return respuesta.json() as Promise<Resultado>;
        }).then(setResultado).catch((causa: unknown) => setError(causa instanceof Error ? causa.message : "No se pudo cargar la bandeja."));
    }
    useEffect(cargar, []);
    const items = resultado?.items ?? [];
    return <main className="relative min-h-full p-6 text-white md:p-9"><div className="mx-auto max-w-6xl"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200"><ArrowLeft className="h-4 w-4" />Panel de gastos</Link><header className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm text-slate-400">Calidad de datos</p><h1 className="mt-1 text-4xl font-extrabold">Bandeja de revisión</h1><p className="mt-2 text-sm text-slate-500">Corrige, excluye o vincula operaciones antes de que afecten tu análisis.</p></div><span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-sm font-bold text-amber-100">{resultado?.pagination.total ?? "—"} pendientes</span></header>{error && <p className="mt-6 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-rose-100">{error}</p>}<section className="mt-7 space-y-3">{items.map((gasto) => <button type="button" key={gasto.id} onClick={() => setSeleccionado(gasto)} className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-left transition hover:border-amber-300/35 hover:bg-white/[0.06]"><div className="flex min-w-0 items-center gap-3"><AlertTriangle className="h-5 w-5 shrink-0 text-amber-300" /><div className="min-w-0"><p className="truncate font-bold">{gasto.establecimiento || "Comercio no identificado"}</p><p className="mt-1 truncate text-xs text-slate-500">{gasto.fecha_transaccion ? gasto.categoria_gasto || "Sin categoría" : "Fecha no identificada"} · confianza {Math.round(Number(gasto.confianza_extraccion ?? 0) * 100)}%</p></div></div><p className="shrink-0 font-bold text-emerald-300">{moneda.format(montoNumerico(gasto.monto))}</p></button>)}</section>{resultado && !items.length && <div className="mt-7 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-10 text-center"><CheckCircle2 className="mx-auto h-9 w-9 text-emerald-300" /><h2 className="mt-4 text-xl font-bold">No tienes revisiones pendientes</h2><p className="mt-2 text-sm text-slate-400">Los nuevos comprobantes con baja confianza aparecerán aquí.</p></div>}</div>{seleccionado && <TransactionTicket gasto={seleccionado} onClose={() => setSeleccionado(null)} onUpdated={(actualizado) => { setSeleccionado(null); setResultado((actual) => actual ? { ...actual, items: actual.items.filter((item) => item.id !== actualizado.id), pagination: { total: Math.max(0, actual.pagination.total - 1) } } : actual); }} />}</main>;
}
