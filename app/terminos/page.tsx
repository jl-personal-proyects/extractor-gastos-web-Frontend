import { AlertOctagon, Briefcase, Scale, ServerCrash, UserX, Infinity, Link2, CloudLightning, Landmark, PenTool } from "lucide-react";
import { LegalShell } from "@/components/landing/LegalShell";

const secciones = [
    [
        "1. Naturaleza del Servicio y Exención de Asesoría",
        "Fluxo es una herramienta de software (SaaS) diseñada exclusivamente para la consolidación analítica y visualización de datos transaccionales automatizados. En ningún caso, el software, sus algoritmos, métricas o reportes constituyen asesoría financiera, contable, tributaria, legal o de inversión."
    ],
    [
        "2. Precisión Algorítmica y Responsabilidad del Usuario",
        "Nuestra tecnología de extracción y clasificación basada en aprendizaje automático es de naturaleza asistida. Pueden existir variaciones, omisiones o falsos positivos debido a cambios en los formatos de las entidades bancarias. Es tu responsabilidad estricta auditar y verificar la exactitud de los montos categorizados."
    ],
    [
        "3. Renuncia de Garantías (Servicio 'As Is')",
        "El servicio se proporciona 'tal cual' (as is) y 'según disponibilidad'. Fluxo rechaza expresamente todas las garantías, expresas o implícitas, incluyendo la comerciabilidad, la idoneidad para un fin contable particular, o la operación ininterrumpida y libre de errores de nuestros servidores."
    ],
    [
        "4. Acuerdos de Nivel de Servicio (SLA)",
        "Aunque procuramos una alta disponibilidad técnica, no ofrecemos compromisos vinculantes de tiempo de actividad (Uptime). Fluxo puede experimentar tiempos de inactividad por mantenimiento programado, actualizaciones de base de datos o fallos en infraestructuras subyacentes sin generar derecho a compensación."
    ],
    [
        "5. Evolución y Modificación de la Plataforma",
        "Fluxo se reserva el derecho unilateral de modificar, suspender, limitar o descontinuar temporal o permanentemente cualquier característica, métrica o funcionalidad del servicio, con o sin previo aviso, como parte de nuestro ciclo de integración continua y desarrollo de software."
    ],
    [
        "6. Integraciones y Dependencias de Terceros",
        "Nuestra operatividad depende intrínsecamente de APIs y servicios de terceros (ej. Google Cloud, Supabase). Fluxo no asume ninguna responsabilidad por bloqueos de cuentas, límites de cuota de API, o cambios en las políticas de estos proveedores que impidan el correcto funcionamiento de nuestra plataforma."
    ],
    [
        "7. Limitación de Responsabilidad e Indemnización",
        "En la máxima medida permitida por la ley aplicable, Fluxo, sus creadores y entidades afiliadas no serán responsables por daños directos, indirectos, incidentales o consecuentes (incluyendo lucro cesante o multas tributarias) que resulten del uso, imposibilidad de uso, o fallos en la extracción de comprobantes."
    ],
    [
        "8. Propiedad Intelectual e Ingeniería Inversa",
        "Todo el código fuente, diseño de interfaz (UI/UX), algoritmos de clasificación, esquemas de bases de datos y marcas registradas asociadas a Fluxo son propiedad intelectual exclusiva. Queda terminantemente prohibido reproducir, descompilar, realizar ingeniería inversa o comercializar la plataforma."
    ],
    [
        "9. Fuerza Mayor y Casos Fortuitos",
        "No seremos responsables de ningún retraso o fallo en el rendimiento del servicio resultante directamente de causas que escapen a nuestro control razonable, incluyendo ataques cibernéticos a gran escala, cortes de proveedores de internet, desastres naturales, o normativas gubernamentales emergentes."
    ],
    [
        "10. Ley Aplicable y Jurisdicción",
        "Este acuerdo de servicio se regirá e interpretará de acuerdo con las leyes vigentes aplicables. Cualquier disputa legal, controversia o reclamo que surja en relación con el uso de Fluxo estará sujeto a la jurisdicción exclusiva de los tribunales competentes en Lima, Perú."
    ],
    [
        "11. Cuenta, Integraciones y Permisos",
        "La conexión con Google se realiza únicamente tras tu autorización. Puedes revocar el acceso desde las opciones de seguridad de tu cuenta de Google. Las funcionalidades disponibles dependen de que los correos y comprobantes de las entidades emisoras sean compatibles con el formato reconocido por la plataforma."
    ],
    [
        "12. Categorías y Configuración Personal",
        "Las categorías creadas por el usuario, correcciones manuales, presupuestos y destinos propios son configuraciones personales. Antes de usar un reporte para una decisión relevante, verifica que dichas configuraciones representen correctamente tus movimientos."
    ],
    [
        "13. Cambios a estos términos",
        "Estos términos pueden actualizarse para reflejar cambios funcionales, técnicos o normativos. La versión vigente estará disponible en esta sección; se recomienda revisarla antes de continuar utilizando el servicio."
    ]
];

export default function TerminosPage() {
    return (
        <LegalShell seccion="terminos">
            <article className="rounded-3xl border border-blue-500/20 bg-slate-900/80 p-7 shadow-[0_0_40px_-15px_rgba(59,130,246,0.15)] backdrop-blur-xl md:p-10 xl:p-12">
                <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                    <div>
                        <p className="text-xs font-bold tracking-[0.22em] text-blue-400">
                            ACUERDO DE TÉRMINOS DE SERVICIO
                        </p>
                        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                            Marco legal y<br />
                            <span className="text-blue-400">condiciones de uso.</span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
                            Al acceder y utilizar la plataforma Fluxo, aceptas estar legalmente vinculado a las siguientes condiciones operativas y limitaciones de responsabilidad.
                        </p>
                    </div>
                    <div className="grid h-16 w-16 place-items-center rounded-2xl border border-blue-500/20 bg-blue-500/10 shadow-inner">
                        <Scale className="h-8 w-8 text-blue-400" />
                    </div>
                </div>
                <div className="mt-8 grid gap-3 border-y border-white/[0.08] py-5 text-sm text-slate-400 sm:grid-cols-3"><p><span className="font-semibold text-slate-200">Servicio:</span> control financiero personal</p><p><span className="font-semibold text-slate-200">Integraciones:</span> correo autorizado</p><p><span className="font-semibold text-slate-200">Última revisión:</span> octubre de 2026</p></div>

                <div className="mt-8 grid gap-5">
                    {secciones.map(([titulo, contenido], indice) => {
                        const iconos = [Briefcase, PenTool, ServerCrash, Infinity, CloudLightning, Link2, AlertOctagon, UserX, CloudLightning, Landmark];
                        const Icon = iconos[indice] || Scale;
                        return (
                            <section
                                key={titulo}
                                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-blue-500/30 hover:bg-white/[0.04]"
                            >
                                <div className="flex gap-4">
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500/10 transition-colors group-hover:bg-blue-500/20">
                                        <Icon className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-100">{titulo}</h2>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
                                            {contenido}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </article>
        </LegalShell>
    );
}
