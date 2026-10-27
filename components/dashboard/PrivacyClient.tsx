"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { AlertTriangle, MailX as MailOff, ShieldCheck, Trash2 } from "lucide-react";

const API_URL = "/api/backend";

export default function PrivacyClient() {
    const [confirmacion, setConfirmacion] = useState<"gmail" | "cuenta" | null>(null);
    const [texto, setTexto] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    async function ejecutar() {
        if (!confirmacion || texto !== (confirmacion === "cuenta" ? "ELIMINAR" : "DESCONECTAR")) return;
        setCargando(true); setError(null);
        try {
            const respuesta = await fetch(`${API_URL}/privacidad/${confirmacion === "cuenta" ? "cuenta" : "gmail/desconectar"}`, { method: confirmacion === "cuenta" ? "DELETE" : "POST" });
            const dato: unknown = await respuesta.json();
            if (!respuesta.ok) throw new Error(typeof dato === "object" && dato && "detail" in dato ? String(dato.detail) : "No se pudo completar la acción.");
            await signOut({ callbackUrl: "/" });
        } catch (causa) { setError(causa instanceof Error ? causa.message : "No se pudo completar la acción."); setCargando(false); }
    }
    return <main className="min-h-full p-6 text-white md:p-9"><div className="mx-auto max-w-4xl"><p className="text-sm text-slate-400">Control de datos</p><h1 className="mt-1 text-4xl font-extrabold">Privacidad y acceso</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">Fluxo procesa únicamente comprobantes financieros compatibles para extraer comercio, importe, fecha, banco y referencia. No conserva el cuerpo completo de tus correos.</p><section className="mt-8 grid gap-5"><article className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5"><div className="flex gap-3"><ShieldCheck className="h-5 w-5 text-emerald-300" /><div><h2 className="font-bold">Retención anual</h2><p className="mt-1 text-sm text-slate-400">Se conservan los movimientos del año vigente. Durante enero puedes consultar y exportar el año anterior; desde febrero se purga con auditoría.</p></div></div></article><article className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><MailOff className="h-5 w-5 shrink-0 text-amber-300" /><div><h2 className="font-bold">Desconectar Gmail</h2><p className="mt-1 text-sm text-slate-400">Detiene futuras sincronizaciones. Tus datos ya guardados permanecen disponibles.</p></div></div><button type="button" onClick={() => { setConfirmacion("gmail"); setTexto(""); }} className="rounded-xl border border-amber-300/30 px-4 py-2 text-sm font-bold text-amber-100 hover:bg-amber-300/10">Desconectar</button></div></article><article className="rounded-2xl border border-rose-400/25 bg-rose-400/[0.05] p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><Trash2 className="h-5 w-5 shrink-0 text-rose-300" /><div><h2 className="font-bold">Eliminar cuenta y datos</h2><p className="mt-1 text-sm text-slate-400">Elimina comprobantes, categorías, reglas, presupuestos y configuración. Esta acción es irreversible.</p></div></div><button type="button" onClick={() => { setConfirmacion("cuenta"); setTexto(""); }} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-bold text-white hover:bg-rose-400">Eliminar cuenta</button></div></article></section></div>{confirmacion && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"><section role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121827] p-6 shadow-2xl"><AlertTriangle className="h-7 w-7 text-rose-300" /><h2 className="mt-4 text-xl font-bold">Confirma esta acción</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">{confirmacion === "cuenta" ? "Escribe ELIMINAR para borrar tu cuenta y todos los datos asociados." : "Escribe DESCONECTAR para detener el acceso de Gmail y cerrar tu sesión."}</p><input autoFocus value={texto} onChange={(evento) => setTexto(evento.target.value.toUpperCase())} className="mt-4 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-rose-300" /><div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setConfirmacion(null)} className="rounded-lg px-3 py-2 text-sm text-slate-300">Cancelar</button><button type="button" disabled={cargando || texto !== (confirmacion === "cuenta" ? "ELIMINAR" : "DESCONECTAR")} onClick={() => void ejecutar()} className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-bold disabled:opacity-50">{cargando ? "Procesando…" : "Confirmar"}</button></div>{error && <p className="mt-3 text-sm text-rose-300">{error}</p>}</section></div>}</main>;
}
