"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Filter, Receipt, Search, TriangleAlert } from "lucide-react";
import { Gasto, formatearFecha, moneda, montoNumerico, TransactionTicket } from "@/components/dashboard/TransactionTicket";

type ResultadoPaginado = {
    items: Gasto[];
    pagination: { page: number; page_size: number; total: number; total_pages: number };
};

type Filtros = { fechaDesde: string; fechaHasta: string; categoria: string; comercio: string; banco: string; tipoMovimiento: string; incluirPropias: boolean };
const API_URL = "/api/backend";
const filtrosIniciales: Filtros = { fechaDesde: "", fechaHasta: "", categoria: "", comercio: "", banco: "", tipoMovimiento: "", incluirPropias: false };
const categorias = ["Alimentación", "Transporte", "Transferencias", "Entretenimiento", "Salud", "Servicios", "Otros"];

// Función auxiliar para los colores de las entidades bancarias
function estiloBanco(banco?: string | null, tipoMovimiento?: string | null) {
    const nombre = banco?.toUpperCase();

    if (nombre === "BCP") {
        return "bg-gradient-to-r from-blue-700 to-orange-500 text-white shadow-sm border-y border-y-white/10 border-l-[3px] border-l-orange-500 border-r-[3px] border-r-blue-700";
    }

    if (nombre === "INTERBANK") {
        return "bg-gradient-to-r from-blue-800 to-emerald-500 text-white shadow-sm border-y border-y-white/10 border-l-[3px] border-l-emerald-500 border-r-[3px] border-r-blue-800";
    }

    // Estilos por defecto con bordes laterales sólidos
    return tipoMovimiento === "TRANSFERENCIA"
        ? "bg-violet-400/10 text-violet-200 border-y border-y-transparent border-l-[3px] border-l-violet-500 border-r-[3px] border-r-violet-500"
        : "bg-emerald-400/10 text-emerald-200 border-y border-y-transparent border-l-[3px] border-l-emerald-500 border-r-[3px] border-r-emerald-500";
}

export default function TransactionsClient() {
    const [borrador, setBorrador] = useState<Filtros>(filtrosIniciales);
    const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales);
    const [pagina, setPagina] = useState(1);
    const [resultado, setResultado] = useState<ResultadoPaginado | null>(null);
    const [seleccionado, setSeleccionado] = useState<Gasto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const cargarTransacciones = useCallback(async (signal?: AbortSignal) => {
        const parametros = new URLSearchParams({ page: String(pagina), page_size: "12" });
        if (filtros.fechaDesde) parametros.set("fecha_desde", filtros.fechaDesde);
        if (filtros.fechaHasta) parametros.set("fecha_hasta", filtros.fechaHasta);
        if (filtros.categoria) parametros.set("categoria", filtros.categoria);
        if (filtros.comercio) parametros.set("comercio", filtros.comercio);
        if (filtros.banco) parametros.set("banco", filtros.banco);
        if (filtros.tipoMovimiento) parametros.set("tipo_movimiento", filtros.tipoMovimiento);
        if (filtros.incluirPropias) parametros.set("incluir_transferencias_propias", "true");

        try {
            const response = await fetch(`${API_URL}/gastos?${parametros}`, { signal });
            if (!response.ok) throw new Error(`El servidor respondió con ${response.status}.`);
            setResultado(await response.json() as ResultadoPaginado);
            setError(null);
        } catch (caughtError) {
            if (caughtError instanceof DOMException && caughtError.name === "AbortError") return;
            setError("No se pudieron cargar las transacciones filtradas.");
        } finally {
            if (!signal?.aborted) setIsLoading(false);
        }
    }, [filtros, pagina]);

    useEffect(() => {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => void cargarTransacciones(controller.signal), 0);
        return () => { window.clearTimeout(timeoutId); controller.abort(); };
    }, [cargarTransacciones]);

    useEffect(() => {
        if (!seleccionado) return;
        const cerrarConEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSeleccionado(null); };
        window.addEventListener("keydown", cerrarConEscape);
        return () => window.removeEventListener("keydown", cerrarConEscape);
    }, [seleccionado]);

    function aplicarFiltros(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPagina(1);
        setFiltros(borrador);
    }

    function limpiarFiltros() {
        setBorrador(filtrosIniciales);
        setFiltros(filtrosIniciales);
        setPagina(1);
    }

    const items = resultado?.items ?? [];
    const paginacion = resultado?.pagination;

    return (
        <main className="relative min-h-full overflow-hidden bg-transparent p-6 text-white md:p-9">
            <div className="absolute -top-[10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
            <div className="relative z-10 mx-auto max-w-6xl">
                <header className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200"><ArrowLeft className="h-4 w-4" /> Panel de gastos</Link><p className="mt-5 text-sm text-slate-400">Historial completo</p><h1 className="mt-1 text-4xl font-extrabold">Últimas transacciones</h1></div><p className="text-sm text-slate-500">{paginacion ? `${paginacion.total} movimientos encontrados` : "Cargando…"}</p></header>

                <form onSubmit={aplicarFiltros} className="mb-8 grid gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_1.5fr_auto_auto]">
                    <label className="text-xs text-slate-400">Desde<input type="date" value={borrador.fechaDesde} onChange={(event) => setBorrador({ ...borrador, fechaDesde: event.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" /></label>
                    <label className="text-xs text-slate-400">Hasta<input type="date" value={borrador.fechaHasta} onChange={(event) => setBorrador({ ...borrador, fechaHasta: event.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-blue-400" /></label>
                    <label className="text-xs text-slate-400">Categoría<select value={borrador.categoria} onChange={(event) => setBorrador({ ...borrador, categoria: event.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"><option value="">Todas</option>{categorias.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}</select></label>
                    <label className="text-xs text-slate-400">Banco<select value={borrador.banco} onChange={(event) => setBorrador({ ...borrador, banco: event.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"><option value="">Todos</option><option value="BCP">BCP</option><option value="INTERBANK">Interbank</option><option value="YAPE">Yape</option></select></label>
                    <label className="text-xs text-slate-400">Tipo<select value={borrador.tipoMovimiento} onChange={(event) => setBorrador({ ...borrador, tipoMovimiento: event.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"><option value="">Todos</option><option value="PAGO">Pago</option><option value="TRANSFERENCIA">Transferencia</option></select></label>
                    <label className="text-xs text-slate-400">Comercio<div className="relative mt-1"><Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-slate-500" /><input value={borrador.comercio} onChange={(event) => setBorrador({ ...borrador, comercio: event.target.value })} placeholder="Ej. Uber, Plin…" className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pr-3 pl-9 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400" /></div></label>
                    <label className="flex items-center gap-2 self-end pb-2 text-xs text-slate-300"><input type="checkbox" checked={borrador.incluirPropias} onChange={(event) => setBorrador({ ...borrador, incluirPropias: event.target.checked })} className="h-4 w-4 rounded border-white/20 bg-black/20 accent-blue-500" />Incluir transferencias propias</label>
                    <button type="submit" className="self-end rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"><Filter className="mr-2 inline h-4 w-4" />Filtrar</button>
                    <button type="button" onClick={limpiarFiltros} className="self-end rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10">Limpiar</button>
                </form>

                {error && <p className="mb-6 flex gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-100"><TriangleAlert className="h-5 w-5 shrink-0" />{error}</p>}
                {isLoading && <p className="text-slate-400">Cargando transacciones…</p>}
                {!isLoading && !error && items.length === 0 && <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-10 text-center"><Receipt className="mx-auto mb-4 h-10 w-10 text-blue-400" /><h2 className="text-xl font-bold">No hay transacciones con estos filtros</h2><p className="mt-2 text-slate-400">Cambia la fecha, categoría o comercio para ampliar la búsqueda.</p></div>}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {items.map((gasto) => (
                        <motion.button
                            key={gasto.id}
                            type="button"
                            onClick={() => setSeleccionado(gasto)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left shadow-xl backdrop-blur-xl transition hover:border-blue-300/30 hover:bg-white/[0.06]"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="truncate font-bold">{gasto.establecimiento || "Establecimiento no identificado"}</p>
                                    <p className="mt-1 text-sm text-slate-400">{gasto.tipo_operacion || "Consumo"}</p>
                                </div>
                                <p className="whitespace-nowrap text-xl font-bold text-emerald-300">
                                    {moneda.format(montoNumerico(gasto.monto))}
                                </p>
                            </div>
                            <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-3 text-xs">
                                <div className="flex min-w-0 flex-wrap gap-2">
                                    <span className="truncate rounded-full bg-blue-400/10 px-2.5 py-1 font-semibold text-blue-200">
                                        {gasto.categoria_gasto || gasto.categoria || "Otros"}
                                    </span>
                                    <span className="truncate rounded-full bg-slate-400/10 px-2.5 py-1 font-semibold text-slate-300">
                                        {gasto.categoria_consumo || "Consumo General"}
                                    </span>
                                    <span className={`rounded-full px-2.5 py-1 font-semibold ${estiloBanco(gasto.banco, gasto.tipo_movimiento)}`}>
                                        {gasto.banco || "Banco"} · {gasto.tipo_movimiento || "PAGO"}
                                    </span>
                                </div>
                                <span className="shrink-0 text-slate-500">{formatearFecha(gasto.fecha_transaccion)}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {paginacion && paginacion.total_pages > 1 && <nav className="mt-8 flex items-center justify-center gap-4"><button type="button" disabled={paginacion.page === 1} onClick={() => setPagina((actual) => Math.max(1, actual - 1))} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Anterior</button><span className="text-sm text-slate-400">Página {paginacion.page} de {paginacion.total_pages}</span><button type="button" disabled={paginacion.page === paginacion.total_pages} onClick={() => setPagina((actual) => actual + 1)} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm disabled:opacity-40">Siguiente<ChevronRight className="h-4 w-4" /></button></nav>}
            </div>
            {seleccionado && <TransactionTicket key={seleccionado.id} gasto={seleccionado} onClose={() => setSeleccionado(null)} onUpdated={(actualizado) => {
                setSeleccionado(actualizado);
                setResultado((actual) => actual ? { ...actual, items: actual.items.map((gasto) => gasto.id === actualizado.id ? actualizado : gasto) } : actual);
            }} />}
        </main>
    );
}
