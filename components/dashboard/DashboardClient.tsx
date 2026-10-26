"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, RefreshCw, Repeat2, TriangleAlert, WalletCards } from "lucide-react";
import { moneda } from "@/components/dashboard/TransactionTicket";
import DailyEvolutionChart, { type SerieDiaria } from "@/components/dashboard/DailyEvolutionChart";
import { toast } from "sonner";

type Analiticas = {
    resumen: { gasto_total: number | string; transacciones: number };
    diario: { fecha: string; total: number | string; gastos_bcp: number | string; gastos_interbank: number | string; yape: number | string; transferencias_bancarias: number | string; otros_origenes: number | string; transacciones: number }[];
    comercios_recurrentes: { establecimiento: string; transacciones: number; total: number | string }[];
};

type Sincronizacion = { modo: string; correos_escaneados: number; gastos_nuevos_guardados: number };
type AlertaPresupuesto = { categoria: string; limite_mensual: number | string; gasto_actual: number | string; porcentaje_consumido: number | string };

const API_URL = "/api/backend";

function numero(valor: number | string) {
    const resultado = Number(valor);
    return Number.isFinite(resultado) ? resultado : 0;
}

export default function DashboardClient({ userName }: { userName: string }) {
    const [analiticas, setAnaliticas] = useState<Analiticas | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [mensajeSync, setMensajeSync] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [alertas, setAlertas] = useState<AlertaPresupuesto[]>([]);
    const alertasNotificadas = useRef(new Set<string>());

    const cargarAnaliticas = useCallback(async (signal?: AbortSignal) => {
        try {
            const response = await fetch(`${API_URL}/gastos/analiticas`, { signal });
            if (!response.ok) throw new Error(`El servidor respondió con ${response.status}.`);
            setAnaliticas(await response.json() as Analiticas);
        } catch (caughtError) {
            if (caughtError instanceof DOMException && caughtError.name === "AbortError") return;
            console.error("Error al cargar las analíticas:", caughtError);
            setError("No se pudieron cargar las analíticas. Verifica FastAPI y Supabase.");
        } finally {
            if (!signal?.aborted) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => void cargarAnaliticas(controller.signal), 0);
        return () => {
            window.clearTimeout(timeoutId);
            controller.abort();
        };
    }, [cargarAnaliticas]);

    useEffect(() => {
        const controller = new AbortController();
        void fetch(`${API_URL}/alertas`, { signal: controller.signal })
            .then(async (response) => response.ok ? response.json() as Promise<{ alertas: AlertaPresupuesto[] }> : { alertas: [] })
            .then((data) => setAlertas(data.alertas ?? []))
            .catch((caughtError: unknown) => {
                if (!(caughtError instanceof DOMException && caughtError.name === "AbortError")) console.error("No se pudieron cargar los presupuestos:", caughtError);
            });
        return () => controller.abort();
    }, []);

    useEffect(() => {
        alertas.forEach((alerta) => {
            const porcentaje = numero(alerta.porcentaje_consumido);
            const clave = `${alerta.categoria}-${porcentaje}`;
            if (porcentaje < 90 || alertasNotificadas.current.has(clave)) return;
            alertasNotificadas.current.add(clave);
            const mensaje = `${alerta.categoria}: ${porcentaje.toFixed(0)}% de ${moneda.format(numero(alerta.limite_mensual))}.`;
            if (porcentaje >= 100) toast.error("Presupuesto excedido", { description: mensaje });
            else toast.warning("Presupuesto por agotarse", { description: mensaje });
        });
    }, [alertas]);

    async function sincronizarGastos() {
        setIsSyncing(true);
        setError(null);
        setMensajeSync(null);
        try {
            const response = await fetch(`${API_URL}/sincronizar`, { method: "POST" });
            const data: unknown = await response.json();
            if (!response.ok) {
                const detalle = typeof data === "object" && data && "detail" in data ? String(data.detail) : "No se pudo sincronizar Gmail.";
                throw new Error(detalle);
            }
            const sincronizacion = data as Sincronizacion;
            setMensajeSync(`Sincronización ${sincronizacion.modo}: ${sincronizacion.gastos_nuevos_guardados} gasto(s) nuevo(s) de ${sincronizacion.correos_escaneados} correo(s) revisados.`);
            await cargarAnaliticas();
        } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : "No se pudo sincronizar Gmail.");
        } finally {
            setIsSyncing(false);
        }
    }

    const serieDiaria: SerieDiaria[] = useMemo(() => (analiticas?.diario ?? []).map((dato) => ({
        fecha: new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(new Date(`${dato.fecha}T12:00:00`)),
        bcp: numero(dato.gastos_bcp),
        interbank: numero(dato.gastos_interbank),
        yape: numero(dato.yape),
        transferenciasBancarias: numero(dato.transferencias_bancarias),
        otrosOrigenes: numero(dato.otros_origenes),
    })), [analiticas]);

    const resumen = analiticas?.resumen ?? { gasto_total: 0, transacciones: 0 };
    const maximoComercio = analiticas?.comercios_recurrentes[0];
    const tarjetas = [
        { titulo: "Gasto total", valor: moneda.format(numero(resumen.gasto_total)), detalle: "En el período seleccionado", icono: WalletCards, tono: "text-blue-300" },
        { titulo: "Transacciones", valor: String(resumen.transacciones), detalle: "Movimientos registrados", icono: CalendarDays, tono: "text-violet-300" },
        { titulo: "Comercio recurrente", valor: maximoComercio?.establecimiento || "—", detalle: maximoComercio ? `${maximoComercio.transacciones} consumos · ${moneda.format(numero(maximoComercio.total))}` : "Aún no hay repeticiones", icono: Repeat2, tono: "text-emerald-300" },
    ];
    const resumenPorOrigen = [
        { titulo: "Gastos BCP", detalle: "Consumos y pagos BCP", valor: serieDiaria.reduce((total, dato) => total + dato.bcp, 0), punto: "bg-blue-400", borde: "border-blue-400/20" },
        { titulo: "Pagos Interbank", detalle: "Consumos y pagos Interbank", valor: serieDiaria.reduce((total, dato) => total + dato.interbank, 0), punto: "bg-emerald-400", borde: "border-emerald-400/20" },
        { titulo: "Yape", detalle: "Yapeos enviados", valor: serieDiaria.reduce((total, dato) => total + dato.yape, 0), punto: "bg-violet-400", borde: "border-violet-400/20" },
        { titulo: "Transferencias", detalle: "Transferencias bancarias", valor: serieDiaria.reduce((total, dato) => total + dato.transferenciasBancarias, 0), punto: "bg-fuchsia-400", borde: "border-fuchsia-400/20" },
        { titulo: "Otros orígenes", detalle: "Movimientos identificados", valor: serieDiaria.reduce((total, dato) => total + dato.otrosOrigenes, 0), punto: "bg-slate-400", borde: "border-slate-400/20" },
    ];

    return (
        <main className="relative min-h-full overflow-hidden bg-transparent p-6 text-white md:p-9">
            <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
            <div className="absolute -right-[10%] -bottom-[10%] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
            <div className="relative z-10 mx-auto max-w-6xl">
                <header className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div><p className="mb-2 text-sm text-slate-400">{userName ? `Hola, ${userName}` : "Tu espacio financiero"}</p><h1 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-4xl font-extrabold text-transparent">Panel de gastos</h1></div>
                    <motion.button type="button" onClick={() => void sincronizarGastos()} disabled={isSyncing} whileHover={isSyncing ? undefined : { scale: 1.03, y: -1 }} whileTap={isSyncing ? undefined : { scale: 0.97 }} className="group inline-flex min-w-44 items-center justify-center gap-3 overflow-hidden rounded-xl border border-blue-300/30 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-5 py-3 font-semibold shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition disabled:cursor-not-allowed disabled:opacity-70"><span className="relative grid h-5 w-5 place-items-center"><span className={isSyncing ? "absolute h-5 w-5 animate-ping rounded-full bg-white/45" : "absolute h-2 w-2 rounded-full bg-blue-100/80 transition group-hover:scale-150"} /><RefreshCw className="relative h-4 w-4" style={{ animation: isSyncing ? "spin 1s linear infinite" : undefined }} /></span><span>{isSyncing ? "Actualizando datos…" : "Sincronizar ahora"}</span></motion.button>
                </header>

                {mensajeSync && <p className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-100">{mensajeSync}</p>}
                {error && <p className="mb-6 flex gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-red-100"><TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />{error}</p>}
                {isLoading && <p className="mb-6 text-slate-400">Cargando el panel…</p>}

                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">{tarjetas.map((tarjeta, index) => { const Icono = tarjeta.icono; return <motion.div key={tarjeta.titulo} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl"><div className="flex items-start justify-between"><p className="text-sm text-slate-400">{tarjeta.titulo}</p><Icono className={`h-5 w-5 ${tarjeta.tono}`} /></div><p className="mt-5 truncate text-2xl font-bold tracking-tight">{tarjeta.valor}</p><p className="mt-2 truncate text-xs text-slate-500">{tarjeta.detalle}</p></motion.div>; })}</section>

                <section className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl md:p-6"><div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm text-slate-400">Origen de los movimientos</p><h2 className="mt-1 text-xl font-bold">¿Desde dónde se movió tu dinero?</h2></div><Link href="/dashboard/transactions" className="text-sm font-semibold text-blue-300 hover:text-blue-200">Ver movimientos</Link></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">{resumenPorOrigen.map((origen) => <div key={origen.titulo} className={`min-w-0 rounded-xl border ${origen.borde} bg-black/15 p-4`}><div className="flex items-center gap-2"><i className={`h-2.5 w-2.5 shrink-0 rounded-full ${origen.punto}`} /><p className="truncate text-sm font-semibold">{origen.titulo}</p></div><p className="mt-3 truncate text-xl font-bold text-white">{moneda.format(origen.valor)}</p><p className="mt-1 truncate text-xs text-slate-500">{origen.detalle}</p></div>)}</div></section>

                {alertas.length > 0 && <section className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl md:p-6"><div className="mb-5"><p className="text-sm text-slate-400">Presupuesto mensual</p><h2 className="mt-1 text-xl font-bold">Controla tus límites por categoría</h2></div><div className="grid gap-4 md:grid-cols-2">{alertas.map((alerta) => { const porcentaje = numero(alerta.porcentaje_consumido); const ancho = Math.min(porcentaje, 100); const tono = porcentaje >= 100 ? "bg-rose-500" : porcentaje >= 80 ? "bg-amber-400" : "bg-emerald-400"; const texto = porcentaje >= 100 ? "text-rose-300" : porcentaje >= 80 ? "text-amber-300" : "text-emerald-300"; return <div key={alerta.categoria} className="rounded-xl border border-white/[0.06] bg-black/15 p-4"><div className="flex justify-between gap-3 text-sm"><p className="font-semibold">{alerta.categoria}</p><p className={`font-bold ${texto}`}>{porcentaje.toFixed(0)}%</p></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]"><motion.div className={`h-full rounded-full ${tono}`} initial={{ width: 0 }} animate={{ width: `${ancho}%` }} transition={{ duration: 0.7, ease: "easeOut" }} /></div><p className="mt-3 text-xs text-slate-400">{moneda.format(numero(alerta.gasto_actual))} de {moneda.format(numero(alerta.limite_mensual))}</p></div>; })}</div></section>}

                <DailyEvolutionChart data={serieDiaria} />

                <section className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl md:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="text-sm text-slate-400">Control por comercio</p><h2 className="mt-1 text-xl font-bold">¿A quién pagaste más de una vez?</h2></div><Link href="/dashboard/transactions" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-300 hover:text-blue-200">Explorar <ArrowRight className="h-4 w-4" /></Link></div>{analiticas?.comercios_recurrentes.length ? <div className="grid gap-3 md:grid-cols-2">{analiticas.comercios_recurrentes.map((comercio) => <div key={comercio.establecimiento} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-black/15 p-4"><div className="min-w-0"><p className="truncate font-semibold">{comercio.establecimiento}</p><p className="mt-1 text-xs text-slate-500">{comercio.transacciones} pagos registrados</p></div><p className="whitespace-nowrap font-bold text-emerald-300">{moneda.format(numero(comercio.total))}</p></div>)}</div> : <p className="rounded-xl border border-white/[0.06] bg-black/15 p-5 text-sm text-slate-400">Cuando un comercio tenga dos o más pagos, aparecerá aquí para que puedas detectar consumos recurrentes.</p>}</section>
            </div>
        </main>
    );
}
