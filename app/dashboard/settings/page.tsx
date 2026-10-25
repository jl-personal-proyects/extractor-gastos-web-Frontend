"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Database, Download, FolderSync, Landmark, Pencil, Plus, RefreshCw, Tags, Trash2, X } from "lucide-react";
import { toast } from "sonner";

const API_URL = "/api/backend";
const predeterminadas = ["Alimentación", "Transporte", "Transferencias", "Entretenimiento", "Salud", "Servicios", "Otros"];
const fechaLocal = new Date();
const mesActual = `${fechaLocal.getFullYear()}-${String(fechaLocal.getMonth() + 1).padStart(2, "0")}`;

type Sincronizacion = { correos_escaneados: number; gastos_nuevos_guardados: number };
type Cuenta = { id: number; alias: string; identificador: string };
type Presupuesto = { categoria: string; limite_mensual: string; mes_anio: string };
type CategoriaPersonalizada = { id: number; nombre: string };

async function respuestaJson<T>(url: string, opciones?: RequestInit): Promise<T> {
    const respuesta = await fetch(url, opciones);
    const dato: unknown = await respuesta.json();
    if (!respuesta.ok) throw new Error(typeof dato === "object" && dato && "detail" in dato ? String(dato.detail) : "No se pudo completar la operación.");
    return dato as T;
}

function EncabezadoSeccion({ icono: Icono, numero, titulo, descripcion, color = "text-blue-300" }: { icono: typeof Database; numero: string; titulo: string; descripcion: string; color?: string }) {
    return <div className="mb-6 flex gap-4"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] ${color}`}><Icono className="h-5 w-5" /></span><div><p className="text-[11px] font-bold tracking-[0.16em] text-slate-500">SECCIÓN {numero}</p><h2 className="mt-0.5 font-bold text-white">{titulo}</h2><p className="mt-1 text-sm leading-relaxed text-slate-400">{descripcion}</p></div></div>;
}

const inputClass = "h-10 w-full rounded-lg border border-white/10 bg-[#0a1020] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400";

export default function SettingsPage() {
    const [isResyncing, setIsResyncing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isSavingBudget, setIsSavingBudget] = useState(false);
    const [isSavingCategory, setIsSavingCategory] = useState(false);
    const [isSavingAccount, setIsSavingAccount] = useState(false);
    const [resultado, setResultado] = useState<string | null>(null);
    const [categoriasPersonalizadas, setCategoriasPersonalizadas] = useState<CategoriaPersonalizada[]>([]);
    const [categoria, setCategoria] = useState(predeterminadas[0]);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [categoriaEnEdicion, setCategoriaEnEdicion] = useState<number | null>(null);
    const [nombreEnEdicion, setNombreEnEdicion] = useState("");
    const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
    const [isDeletingCategory, setIsDeletingCategory] = useState<number | null>(null);
    const [limite, setLimite] = useState("");
    const [mesAnio, setMesAnio] = useState(mesActual);
    const [cuentas, setCuentas] = useState<Cuenta[]>([]);
    const [aliasCuenta, setAliasCuenta] = useState("");
    const [identificadorCuenta, setIdentificadorCuenta] = useState("");
    const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);

    useEffect(() => {
        void Promise.all([
            respuestaJson<{ predeterminadas: string[]; personalizadas: CategoriaPersonalizada[] }>(API_URL + "/categorias"),
            respuestaJson<{ cuentas: Cuenta[] }>(API_URL + "/cuentas-propias"),
        ]).then(([datosCategorias, datosCuentas]) => {
            setCategoriasPersonalizadas(datosCategorias.personalizadas);
            setCuentas(datosCuentas.cuentas);
        }).catch(() => toast.error("No se pudo cargar toda la configuración."));
    }, []);

    const categorias = useMemo(() => Array.from(new Set([...predeterminadas, ...categoriasPersonalizadas.map((item) => item.nombre)])), [categoriasPersonalizadas]);

    async function resincronizar() {
        setIsResyncing(true); setResultado(null);
        try {
            const sincronizacion = await respuestaJson<Sincronizacion>(API_URL + "/sincronizar/reconstruir", { method: "POST" });
            const mensaje = sincronizacion.correos_escaneados + " correos revisados; " + sincronizacion.gastos_nuevos_guardados + " movimientos nuevos.";
            setResultado(mensaje); toast.success("Recuperación terminada", { description: mensaje });
        } catch (error) { toast.error("No se pudo resincronizar", { description: error instanceof Error ? error.message : "Inténtalo otra vez." }); }
        finally { setIsResyncing(false); }
    }

    async function exportarExcel() {
        setIsExporting(true);
        try {
            const respuesta = await fetch(API_URL + "/exportar");
            if (!respuesta.ok) throw new Error("No se pudo generar el Excel.");
            const archivo = await respuesta.blob(); const url = URL.createObjectURL(archivo); const enlace = document.createElement("a");
            enlace.href = url; enlace.download = "consolidado-gastos.xlsx"; enlace.click(); URL.revokeObjectURL(url);
            toast.success("Excel descargado");
        } catch (error) { toast.error("No se pudo exportar", { description: error instanceof Error ? error.message : "Inténtalo otra vez." }); }
        finally { setIsExporting(false); }
    }

    async function crearCategoria(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); setIsSavingCategory(true);
        try {
            const creada = await respuestaJson<CategoriaPersonalizada>(API_URL + "/categorias", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre: nuevaCategoria }) });
            setCategoriasPersonalizadas((actuales) => [...actuales.filter((item) => item.id !== creada.id), creada]);
            setCategoria(creada.nombre); setNuevaCategoria(""); toast.success("Clasificación creada", { description: "Ya está disponible en los tickets." });
        } catch (error) { toast.error("No se pudo crear", { description: error instanceof Error ? error.message : "Inténtalo otra vez." }); }
        finally { setIsSavingCategory(false); }
    }

    async function editarCategoria(categoriaPersonalizada: CategoriaPersonalizada) {
        const nombre = nombreEnEdicion.trim();
        if (!nombre || nombre === categoriaPersonalizada.nombre) { setCategoriaEnEdicion(null); return; }
        setIsUpdatingCategory(true);
        try {
            const actualizada = await respuestaJson<CategoriaPersonalizada>(`${API_URL}/categorias/${categoriaPersonalizada.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre }) });
            setCategoriasPersonalizadas((actuales) => actuales.map((item) => item.id === actualizada.id ? actualizada : item));
            if (categoria === categoriaPersonalizada.nombre) setCategoria(actualizada.nombre);
            setCategoriaEnEdicion(null); toast.success("Clasificación actualizada");
        } catch (error) { toast.error("No se pudo editar", { description: error instanceof Error ? error.message : "Inténtalo otra vez." }); }
        finally { setIsUpdatingCategory(false); }
    }

    async function eliminarCategoria(categoriaPersonalizada: CategoriaPersonalizada) {
        if (!window.confirm(`¿Eliminar la clasificación «${categoriaPersonalizada.nombre}»? Solo es posible si no tiene comprobantes.`)) return;
        setIsDeletingCategory(categoriaPersonalizada.id);
        try {
            await respuestaJson<{ status: string }>(`${API_URL}/categorias/${categoriaPersonalizada.id}`, { method: "DELETE" });
            setCategoriasPersonalizadas((actuales) => actuales.filter((item) => item.id !== categoriaPersonalizada.id));
            if (categoria === categoriaPersonalizada.nombre) setCategoria(predeterminadas[0]);
            toast.success("Clasificación eliminada");
        } catch (error) { toast.error("No se puede eliminar", { description: error instanceof Error ? error.message : "Inténtalo otra vez." }); }
        finally { setIsDeletingCategory(null); }
    }

    async function guardarCuenta(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); setIsSavingAccount(true);
        try {
            const cuenta = await respuestaJson<Cuenta>(API_URL + "/cuentas-propias", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ alias: aliasCuenta, identificador: identificadorCuenta }) });
            setCuentas((actuales) => [cuenta, ...actuales.filter((actual) => actual.id !== cuenta.id)]);
            setAliasCuenta(""); setIdentificadorCuenta(""); toast.success("Destino propio guardado", { description: "Se excluirá del análisis financiero." });
        } catch (error) { toast.error("No se pudo guardar", { description: error instanceof Error ? error.message : "Inténtalo otra vez." }); }
        finally { setIsSavingAccount(false); }
    }

    async function guardarPresupuesto(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); setIsSavingBudget(true);
        try {
            const guardado = await respuestaJson<{ categoria: string; limite_mensual: string | number; mes_anio: string }>(API_URL + "/presupuestos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ categoria, limite_mensual: Number(limite), mes_anio: mesAnio }) });
            const nuevo = { categoria: guardado.categoria, limite_mensual: String(guardado.limite_mensual), mes_anio: String(guardado.mes_anio).slice(0, 7) };
            setPresupuestos((actuales) => [nuevo, ...actuales.filter((item) => !(item.categoria === nuevo.categoria && item.mes_anio === nuevo.mes_anio))]);
            setLimite(""); toast.success("Límite guardado", { description: nuevo.categoria + " · " + nuevo.mes_anio });
        } catch (error) { toast.error("No se pudo guardar", { description: error instanceof Error ? error.message : "Inténtalo otra vez." }); }
        finally { setIsSavingBudget(false); }
    }

    return <main className="min-h-full p-6 text-white md:p-9"><div className="mx-auto max-w-6xl">
        <header className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-400">Configuración, aprendizaje y recuperación</p><h1 className="mt-1 text-4xl font-extrabold tracking-tight">Ajustes</h1></div><p className="text-sm text-slate-500">Gestiona reglas y datos de tu cuenta</p></header>

        <div className="space-y-5">
            <section className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-6"><EncabezadoSeccion icono={FolderSync} numero="01" titulo="Sincronización y respaldo" descripcion="Recupera comprobantes o descarga una copia normalizada de tus movimientos." color="text-amber-300" />
                <div className="overflow-hidden rounded-xl border border-white/[0.08]"><table className="w-full text-left text-sm"><tbody><tr className="border-b border-white/[0.07]"><td className="px-4 py-4"><p className="font-semibold">Recuperar último mes</p><p className="mt-1 text-xs text-slate-400">Lee BCP, Interbank y Yape sin duplicar correos.</p></td><td className="w-40 px-4 py-4 text-right"><button type="button" disabled={isResyncing} onClick={() => void resincronizar()} className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-slate-950 disabled:opacity-60"><RefreshCw className={isResyncing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />{isResyncing ? "Leyendo…" : "Resincronizar"}</button></td></tr><tr><td className="px-4 py-4"><p className="font-semibold">Exportación contable</p><p className="mt-1 text-xs text-slate-400">Excel con detalle y resumen por comercio.</p></td><td className="w-40 px-4 py-4 text-right"><button type="button" disabled={isExporting} onClick={() => void exportarExcel()} className="inline-flex items-center gap-2 rounded-lg border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-200 disabled:opacity-60"><Download className="h-4 w-4" />{isExporting ? "Generando…" : "Descargar"}</button></td></tr></tbody></table></div>
                {resultado && <p className="mt-4 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">{resultado}</p>}
            </section>

            <section className="rounded-2xl border border-violet-400/20 bg-violet-400/[0.035] p-6"><EncabezadoSeccion icono={Tags} numero="02" titulo="Clasificaciones" descripcion="Crea categorías para tus gastos; al corregir un ticket se convierten en reglas por comercio." color="text-violet-300" />
                <form onSubmit={crearCategoria} className="overflow-hidden rounded-xl border border-white/[0.08]"><table className="w-full text-left text-sm"><thead className="bg-white/[0.035] text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3 font-semibold">Nueva clasificación</th><th className="w-32 px-4 py-3 text-right font-semibold">Acción</th></tr></thead><tbody><tr><td className="px-4 py-3"><input value={nuevaCategoria} onChange={(event) => setNuevaCategoria(event.target.value)} maxLength={40} required placeholder="Ej. Educación, Mascotas…" className={inputClass} /></td><td className="px-4 py-3 text-right"><button disabled={isSavingCategory} className="inline-flex items-center gap-1 rounded-lg bg-violet-500 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"><Plus className="h-4 w-4" />{isSavingCategory ? "Creando" : "Crear"}</button></td></tr></tbody></table></form>
                <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08]"><table className="w-full text-left text-xs"><thead className="bg-white/[0.035] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-2.5 font-semibold">Categoría</th><th className="px-4 py-2.5 font-semibold">Origen</th><th className="w-40 px-4 py-2.5 text-right font-semibold">Acciones</th></tr></thead><tbody>
                    {predeterminadas.map((item) => <tr key={item} className="border-t border-white/[0.06]"><td className="px-4 py-2.5 text-slate-200">{item}</td><td className="px-4 py-2.5 text-slate-500">Predeterminada</td><td className="px-4 py-2.5 text-right text-slate-600">Protegida</td></tr>)}
                    {categoriasPersonalizadas.map((item) => <tr key={item.id} className="border-t border-white/[0.06]"><td className="px-4 py-2.5 text-slate-200">{categoriaEnEdicion === item.id ? <input autoFocus value={nombreEnEdicion} onChange={(event) => setNombreEnEdicion(event.target.value)} maxLength={40} className="h-8 w-full max-w-xs rounded-md border border-violet-400/50 bg-[#0a1020] px-2 text-xs outline-none" /> : item.nombre}</td><td className="px-4 py-2.5 text-violet-200">Personalizada</td><td className="px-4 py-2.5"><div className="flex justify-end gap-2">{categoriaEnEdicion === item.id ? <><button type="button" onClick={() => void editarCategoria(item)} disabled={isUpdatingCategory} aria-label="Guardar categoría" className="rounded-md bg-emerald-500/15 p-1.5 text-emerald-300 disabled:opacity-50"><Check className="h-3.5 w-3.5" /></button><button type="button" onClick={() => setCategoriaEnEdicion(null)} aria-label="Cancelar edición" className="rounded-md bg-white/[0.06] p-1.5 text-slate-300"><X className="h-3.5 w-3.5" /></button></> : <><button type="button" onClick={() => { setCategoriaEnEdicion(item.id); setNombreEnEdicion(item.nombre); }} aria-label={`Editar ${item.nombre}`} className="rounded-md bg-blue-500/10 p-1.5 text-blue-300"><Pencil className="h-3.5 w-3.5" /></button><button type="button" onClick={() => void eliminarCategoria(item)} disabled={isDeletingCategory === item.id} aria-label={`Eliminar ${item.nombre}`} className="rounded-md bg-rose-500/10 p-1.5 text-rose-300 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /></button></>}</div></td></tr>)}
                    {!categoriasPersonalizadas.length && <tr><td colSpan={3} className="px-4 py-4 text-center text-slate-500">Aún no creaste clasificaciones personalizadas.</td></tr>}
                </tbody></table></div>
            </section>

            <section className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.035] p-6"><EncabezadoSeccion icono={Landmark} numero="03" titulo="Cuentas y destinos propios" descripcion="Registra cuentas, celulares o nombres propios para excluir transferencias internas del análisis." color="text-amber-300" />
                <form onSubmit={guardarCuenta} className="overflow-hidden rounded-xl border border-white/[0.08]"><table className="w-full text-left text-sm"><thead className="bg-white/[0.035] text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3 font-semibold">Alias</th><th className="px-4 py-3 font-semibold">Identificador</th><th className="w-24 px-4 py-3 text-right font-semibold">Acción</th></tr></thead><tbody><tr><td className="px-4 py-3"><input required value={aliasCuenta} onChange={(event) => setAliasCuenta(event.target.value)} placeholder="Ej. Ahorro Interbank" className={inputClass} /></td><td className="px-4 py-3"><input required value={identificadorCuenta} onChange={(event) => setIdentificadorCuenta(event.target.value)} placeholder="Nombre, celular o últimos 4" className={inputClass} /></td><td className="px-4 py-3 text-right"><button disabled={isSavingAccount} className="rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-slate-950 disabled:opacity-60">{isSavingAccount ? "Guardando" : "Agregar"}</button></td></tr></tbody></table></form>
                <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08]"><table className="w-full text-left text-xs"><thead className="bg-white/[0.035] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-2.5 font-semibold">Alias</th><th className="px-4 py-2.5 font-semibold">Identificador</th><th className="px-4 py-2.5 text-right font-semibold">Estado</th></tr></thead><tbody>{cuentas.length ? cuentas.map((cuenta) => <tr key={cuenta.id} className="border-t border-white/[0.06]"><td className="px-4 py-2.5 font-medium text-slate-200">{cuenta.alias}</td><td className="px-4 py-2.5 text-slate-400">{cuenta.identificador}</td><td className="px-4 py-2.5 text-right text-emerald-300">Excluida</td></tr>) : <tr><td colSpan={3} className="px-4 py-5 text-center text-slate-500">Aún no registraste destinos propios.</td></tr>}</tbody></table></div>
            </section>

            <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.035] p-6"><EncabezadoSeccion icono={Database} numero="04" titulo="Límites mensuales" descripcion="Define un tope por categoría; el panel mostrará alertas al acercarse al límite." color="text-emerald-300" />
                <form onSubmit={guardarPresupuesto} className="overflow-hidden rounded-xl border border-white/[0.08]"><table className="w-full text-left text-sm"><thead className="bg-white/[0.035] text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3 font-semibold">Categoría</th><th className="px-4 py-3 font-semibold">Límite mensual</th><th className="px-4 py-3 font-semibold">Periodo</th><th className="w-24 px-4 py-3 text-right font-semibold">Acción</th></tr></thead><tbody><tr><td className="px-4 py-3"><select value={categoria} onChange={(event) => setCategoria(event.target.value)} className={inputClass}>{categorias.map((item) => <option key={item}>{item}</option>)}</select></td><td className="px-4 py-3"><input type="number" min="0.01" step="0.01" required value={limite} onChange={(event) => setLimite(event.target.value)} placeholder="S/ 0.00" className={inputClass} /></td><td className="px-4 py-3"><input type="month" value={mesAnio} onChange={(event) => setMesAnio(event.target.value)} className={inputClass} /></td><td className="px-4 py-3 text-right"><button disabled={isSavingBudget} className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 disabled:opacity-60">{isSavingBudget ? "Guardando" : "Guardar"}</button></td></tr></tbody></table></form>
                {presupuestos.length > 0 && <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08]"><table className="w-full text-left text-xs"><thead className="bg-white/[0.035] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-2.5 font-semibold">Categoría</th><th className="px-4 py-2.5 font-semibold">Límite</th><th className="px-4 py-2.5 text-right font-semibold">Periodo</th></tr></thead><tbody>{presupuestos.map((item) => <tr key={item.categoria + item.mes_anio} className="border-t border-white/[0.06]"><td className="px-4 py-2.5 text-slate-200">{item.categoria}</td><td className="px-4 py-2.5 text-emerald-300">S/ {Number(item.limite_mensual).toFixed(2)}</td><td className="px-4 py-2.5 text-right text-slate-400">{item.mes_anio}</td></tr>)}</tbody></table></div>}
            </section>
        </div>
    </div></main>;
}
