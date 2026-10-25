import { Cpu, Database, FileKey, ShieldAlert, ShieldCheck, Network, Activity, UserCog, AlertTriangle, FileClock } from "lucide-react";
import { LegalShell } from "@/components/landing/LegalShell";

const secciones = [
    [
        "1. Minimización y Extracción de Datos",
        "Fluxo opera bajo el principio de privilegio mínimo (Zero Trust). Nuestro motor de procesamiento únicamente extrae metadatos transaccionales estrictamente necesarios (comercio, fecha, importe, moneda, banco emisor y código de referencia) de comprobantes compatibles. Fluxo no lee, almacena, comparte ni procesa correos personales, promocionales o confidenciales."
    ],
    [
        "2. Cumplimiento Normativo (Google API Services)",
        "El uso y la transferencia por parte de Fluxo de la información recibida de las API de Google se ajustará estrictamente a la Política de Datos del Usuario de los Servicios API de Google. Nunca venderemos tus datos a terceros ni los usaremos para servir anuncios o perfilamiento publicitario."
    ],
    [
        "3. Modelado Algorítmico y Anonimización",
        "La plataforma utiliza técnicas de Machine Learning para la categorización automatizada. Los datos utilizados para entrenar y refinar estos modelos (como nombres de comercios o patrones de gasto) son rigurosamente anonimizados y desvinculados de cualquier identificador personal, garantizando la privacidad estructural del usuario."
    ],
    [
        "4. Telemetría y Rastreo Analítico",
        "Recopilamos datos de telemetría técnica (logs de errores, tiempos de respuesta de la API y uso de CPU) de forma disociada para garantizar la estabilidad de la plataforma. No utilizamos cookies de rastreo de terceros, píxeles de marketing ni herramientas de análisis invasivas que rastreen tu actividad fuera de Fluxo."
    ],
    [
        "5. Infraestructura y Transferencia Internacional",
        "Toda la información financiera consolidada se transmite mediante protocolos cifrados (TLS 1.3). Al ser una plataforma nativa en la nube, tus datos pueden ser procesados en servidores ubicados fuera de tu país de residencia, amparados bajo cláusulas contractuales estándar que aseguran un nivel de protección equivalente."
    ],
    [
        "6. Ejercicio de Derechos de Privacidad (ARCO/GDPR)",
        "Tienes derecho absoluto e irrenunciable a solicitar el acceso, rectificación, portabilidad o eliminación definitiva de tu información. Puedes ejecutar un borrado en cascada (Hard Delete) de toda tu historia transaccional directamente desde tu panel de ajustes, sin requerir intervención de soporte."
    ],
    [
        "7. Retención y Caducidad de Tokens",
        "Los tokens de acceso OAuth2 se almacenan encriptados en repositorios aislados. Si detectamos inactividad prolongada (superior a 180 días) o la revocación del permiso desde la consola de Google, iniciaremos un protocolo de purga automatizada, eliminando tus datos derivados de nuestros servidores."
    ],
    [
        "8. Protocolo ante Brechas de Seguridad",
        "En el improbable caso de una vulneración que comprometa la integridad de la base de datos, Fluxo se compromete a notificar a los usuarios afectados y a las autoridades competentes en un plazo no mayor a 72 horas desde su confirmación, detallando la naturaleza del incidente y las medidas de mitigación."
    ],
    [
        "9. Modificaciones a la Política de Privacidad",
        "Nos reservamos el derecho de actualizar esta política para reflejar cambios tecnológicos o legales. Las modificaciones sustanciales serán notificadas a través de la plataforma. El uso continuado del servicio tras dichas notificaciones constituirá tu aceptación tácita de los nuevos términos."
    ],
    [
        "10. Configuraciones bajo tu control",
        "Las categorías creadas, correcciones de gastos, presupuestos y destinos propios se guardan para la cuenta que los configuró. Los destinos propios se usan para distinguir transferencias internas de pagos a terceros en las vistas financieras."
    ],
    [
        "11. Conservación de información",
        "Los movimientos guardados permanecen disponibles para construir tus reportes mientras la integración y el almacenamiento estén activos. La duración concreta de conservación puede depender de la configuración del servicio y de obligaciones aplicables."
    ],
    [
        "12. Recomendaciones para tu cuenta",
        "No compartas contraseñas, secretos de aplicación ni archivos de credenciales. Revisa periódicamente las aplicaciones autorizadas en Google y revoca permisos que ya no desees mantener."
    ],
];

export default function PrivacidadPage() {
    return (
        <LegalShell seccion="privacidad">
            <article className="rounded-3xl border border-emerald-500/20 bg-slate-900/80 p-7 shadow-[0_0_40px_-15px_rgba(16,185,129,0.15)] backdrop-blur-xl md:p-10 xl:p-12">
                <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                    <div>
                        <p className="text-xs font-bold tracking-[0.22em] text-emerald-400">
                            POLÍTICA DE PRIVACIDAD CORPORATIVA
                        </p>
                        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                            Seguridad de grado<br />
                            <span className="text-emerald-400">institucional.</span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
                            Políticas estrictas de protección de datos, diseñadas para salvaguardar tu integridad financiera y cumplir con los estándares globales de seguridad en la nube.
                        </p>
                    </div>
                    <div className="grid h-16 w-16 place-items-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 shadow-inner">
                        <ShieldCheck className="h-8 w-8 text-emerald-400" />
                    </div>
                </div>
                <div className="mt-8 grid gap-3 border-y border-white/[0.08] py-5 text-sm text-slate-400 sm:grid-cols-3"><p><span className="font-semibold text-slate-200">Acceso:</span> con autorización de Google</p><p><span className="font-semibold text-slate-200">Control:</span> categorías y cuentas propias</p><p><span className="font-semibold text-slate-200">Última revisión:</span> octubre de 2026</p></div>

                <div className="mt-8 grid gap-5">
                    {secciones.map(([titulo, contenido], indice) => {
                        const iconos = [Database, FileKey, Cpu, Activity, Network, UserCog, FileClock, AlertTriangle, ShieldAlert];
                        const Icon = iconos[indice] || Database;
                        return (
                            <section
                                key={titulo}
                                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-emerald-500/30 hover:bg-white/[0.04]"
                            >
                                <div className="flex gap-4">
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                                        <Icon className="h-5 w-5 text-emerald-400" />
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
