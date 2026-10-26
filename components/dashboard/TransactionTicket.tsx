"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Receipt, X } from "lucide-react";
import { useEffect, useState } from "react";

const API_URL = "/api/backend";
const categoriasPredeterminadas = ["Alimentación", "Transporte", "Transferencias", "Entretenimiento", "Salud", "Servicios", "Otros"];

export type Gasto = {
    id: string | number;
    gmail_msg_id: string | null;
    establecimiento: string | null;
    monto: number | string | null;
    categoria: string | null;
    categoria_gasto: string | null;
    categoria_consumo: string | null;
    es_modificacion_manual?: boolean;
    es_transferencia_propia?: boolean;
    banco: string | null;
    tipo_movimiento: string | null;
    fecha_transaccion: string | null;
    tipo_operacion: string | null;
    numero_operacion: string | null;
    tarjeta_enmascarada: string | null;
    resumen_original: string | null;
};

export const moneda = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

export function montoNumerico(monto: Gasto["monto"]) {
    const numero = typeof monto === "number" ? monto : Number(monto);
    return Number.isFinite(numero) ? numero : 0;
}

export function formatearFecha(fecha: string | null, incluirHora = true) {
    if (!fecha) return "Fecha no identificada";
    const fechaConvertida = new Date(fecha);
    if (Number.isNaN(fechaConvertida.getTime())) return "Fecha no identificada";
    return new Intl.DateTimeFormat("es-PE", {
        dateStyle: "medium",
        ...(incluirHora ? { timeStyle: "short" } : {}),
    }).format(fechaConvertida);
}

export function TransactionTicket({ gasto, onClose, onUpdated }: { gasto: Gasto; onClose: () => void; onUpdated: (gasto: Gasto) => void }) {
    const barras = `${gasto.id}${gasto.gmail_msg_id ?? ""}`.split("").slice(0, 32);
    const [categoriaGasto, setCategoriaGasto] = useState(gasto.categoria_gasto || gasto.categoria || "Otros");
    const [categoriasGasto, setCategoriasGasto] = useState(categoriasPredeterminadas);
    const [isSavingCategory, setIsSavingCategory] = useState(false);
    const [categoryError, setCategoryError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        void fetch(`${API_URL}/categorias`, { signal: controller.signal })
            .then(async (response) => {
                if (!response.ok) throw new Error("No se pudieron cargar las categorías.");
                return response.json() as Promise<{ predeterminadas: string[]; personalizadas: Array<{ nombre: string }> }>;
            })
            .then((data) => {
                const opciones = [...data.predeterminadas, ...data.personalizadas.map((item) => item.nombre)];
                setCategoriasGasto(Array.from(new Set([...opciones, categoriaGasto])));
            })
            .catch(() => undefined);
        return () => controller.abort();
    }, [categoriaGasto]);

    async function guardarCategoria() {
        setIsSavingCategory(true);
        setCategoryError(null);
        try {
            const response = await fetch(`${API_URL}/gastos/${gasto.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ categoria_gasto: categoriaGasto }) });
            const data: unknown = await response.json();
            if (!response.ok) throw new Error(typeof data === "object" && data && "detail" in data ? String(data.detail) : "No se pudo guardar la categoría.");
            const actualizado = data as Pick<Gasto, "categoria" | "categoria_gasto" | "categoria_consumo" | "es_modificacion_manual">;
            onUpdated({ ...gasto, ...actualizado });
            onClose();
        } catch (caughtError) {
            setCategoryError(caughtError instanceof Error ? caughtError.message : "No se pudo guardar la categoría.");
        } finally {
            setIsSavingCategory(false);
        }
    }

    return (
        <AnimatePresence>
            <motion.button key="ticket-backdrop" type="button" aria-label="Cerrar detalle de compra" className="fixed inset-0 z-40 cursor-default bg-black/65 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
            <motion.aside key={`ticket-${gasto.id}`} role="dialog" aria-modal="true" aria-label="Ticket de compra" className="fixed top-0 right-0 z-50 h-dvh w-full max-w-md overflow-y-auto overscroll-contain bg-[#f6f1e6] p-5 text-slate-900 shadow-2xl sm:p-7" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }}>
                <div className="sticky top-0 z-10 -mx-5 -mt-5 mb-5 border-b border-slate-200 bg-[#f6f1e6]/95 px-5 pt-5 pb-4 font-sans backdrop-blur sm:-mx-7 sm:-mt-7 sm:px-7 sm:pt-7"><div className="flex items-center justify-between"><p className="text-xs font-semibold tracking-[0.25em] text-slate-500">DETALLE DEL CONSUMO</p><button type="button" onClick={onClose} className="rounded-full p-2 text-slate-600 transition hover:bg-slate-900/10" aria-label="Cerrar ticket"><X className="h-5 w-5" /></button></div><div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3"><label className="block text-[10px] font-bold tracking-[0.14em] text-blue-800" htmlFor="categoria-gasto">CATEGORÍA DE GASTO<select id="categoria-gasto" value={categoriaGasto} onChange={(event) => setCategoriaGasto(event.target.value)} disabled={isSavingCategory} className="mt-1 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500">{categoriasGasto.map((categoria) => <option key={categoria}>{categoria}</option>)}</select></label><div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-blue-700">La categoría de consumo se conserva automáticamente.</span><button type="button" onClick={() => void guardarCategoria()} disabled={isSavingCategory || categoriaGasto === (gasto.categoria_gasto || gasto.categoria)} className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-45">{isSavingCategory ? "Guardando…" : "Guardar"}</button></div>{categoryError && <p className="mt-2 text-xs text-rose-600">{categoryError}</p>}</div></div>
                <div className="ticket-edge relative overflow-hidden bg-[#fffdf7] px-7 py-9 font-mono shadow-[0_12px_40px_rgba(15,23,42,0.16)]">
                    <div className="mb-7 text-center"><Receipt className="mx-auto mb-3 h-8 w-8 text-slate-800" /><p className="text-xs font-bold tracking-[0.3em]">COMPROBANTE DIGITAL</p><p className="mt-2 text-[10px] text-slate-500">{gasto.banco || "BANCO NO IDENTIFICADO"} · REGISTRO AUTOMÁTICO</p></div>
                    <div className="border-y border-dashed border-slate-300 py-5 text-center"><p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Total del consumo</p><p className="mt-2 text-4xl font-bold tracking-tighter">{moneda.format(montoNumerico(gasto.monto))}</p></div>
                    <dl className="my-6 space-y-4 text-xs leading-relaxed">
                        <div className="flex justify-between gap-5 border-b border-dashed border-slate-200 pb-3"><dt className="text-slate-500">COMERCIO</dt><dd className="max-w-[60%] text-right font-bold">{gasto.establecimiento || "NO IDENTIFICADO"}</dd></div>
                        <div className="flex justify-between gap-5 border-b border-dashed border-slate-200 pb-3"><dt className="text-slate-500">CATEGORÍA GASTO</dt><dd className="text-right">{gasto.categoria_gasto || gasto.categoria || "Otros"}</dd></div>
                        <div className="flex justify-between gap-5 border-b border-dashed border-slate-200 pb-3"><dt className="text-slate-500">CATEGORÍA CONSUMO</dt><dd className="max-w-[60%] text-right">{gasto.categoria_consumo || "Consumo General"}</dd></div>
                        <div className="flex justify-between gap-5 border-b border-dashed border-slate-200 pb-3"><dt className="text-slate-500">MOVIMIENTO</dt><dd className="text-right font-bold">{gasto.tipo_movimiento || "PAGO"}</dd></div>
                        {gasto.es_transferencia_propia && <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-center text-[10px] font-bold text-amber-800">TRANSFERENCIA ENTRE CUENTAS PROPIAS · EXCLUIDA DEL ANÁLISIS</div>}
                        <div className="flex justify-between gap-5 border-b border-dashed border-slate-200 pb-3"><dt className="text-slate-500">OPERACIÓN</dt><dd className="max-w-[60%] text-right font-bold">{gasto.tipo_operacion || "CONSUMO"}</dd></div>
                        <div className="flex justify-between gap-5 border-b border-dashed border-slate-200 pb-3"><dt className="text-slate-500">FECHA</dt><dd className="max-w-[60%] text-right">{formatearFecha(gasto.fecha_transaccion)}</dd></div>
                        <div className="flex justify-between gap-5 border-b border-dashed border-slate-200 pb-3"><dt className="text-slate-500">TARJETA</dt><dd className="text-right">{gasto.tarjeta_enmascarada || "NO REGISTRADA"}</dd></div>
                        <div className="flex justify-between gap-5 border-b border-dashed border-slate-200 pb-3"><dt className="text-slate-500">N.° OPERACIÓN</dt><dd className="text-right">{gasto.numero_operacion || "NO REGISTRADO"}</dd></div>
                    </dl>
                    <div className="border-t border-dashed border-slate-300 pt-5"><p className="text-[10px] text-slate-500">ID DE TRANSACCIÓN GMAIL</p><p className="mt-1 break-all text-[10px] leading-relaxed">{gasto.gmail_msg_id || `LOCAL-${gasto.id}`}</p></div>
                    <div className="mt-7 flex h-14 items-stretch justify-center gap-px" aria-label="Código de barras simulado">{barras.map((barra, index) => <span key={`${barra}-${index}`} className="bg-slate-950" style={{ width: `${2 + ((barra.charCodeAt(0) + index) % 4)}px` }} />)}</div>
                    <p className="mt-2 text-center text-[9px] tracking-[0.24em] text-slate-500">{String(gasto.id).padStart(10, "0")}</p>
                </div>
                <p className="mt-auto pt-6 text-center font-mono text-[10px] leading-relaxed text-slate-500">DOCUMENTO INFORMATIVO · CONSERVA ESTE COMPROBANTE</p>
            </motion.aside>
        </AnimatePresence>
    );
}
