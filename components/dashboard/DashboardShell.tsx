"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardCheck, LayoutDashboard, LogOut, ReceiptText, Settings, ShieldCheck, WalletCards } from "lucide-react";
import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

const navigation = [
    { href: "/dashboard", label: "Resumen", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/transactions", label: "Movimientos", icon: ReceiptText },
    { href: "/dashboard/analytics", label: "Análisis", icon: BarChart3 },
    { href: "/dashboard/review", label: "Revisión", icon: ClipboardCheck },
    { href: "/dashboard/settings", label: "Ajustes", icon: Settings },
    { href: "/dashboard/privacy", label: "Privacidad", icon: ShieldCheck },
];

export default function DashboardShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#080c18] text-slate-100">
            <div className="min-h-screen overflow-hidden bg-[#090e1e]">
                <header className="flex h-[70px] items-center justify-between border-b border-slate-700/40 px-5 md:px-7">
                    <Link href="/dashboard" className="flex items-center gap-3" aria-label="Fluxo, resumen">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-500/15 text-blue-400"><WalletCards className="h-5 w-5" /></span>
                        <span className="font-bold tracking-tight">Fluxo</span>
                    </Link>
                    <button type="button" onClick={() => void signOut({ callbackUrl: "/" })} className="inline-flex items-center gap-2 rounded-lg border border-slate-600/50 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-200"><LogOut className="h-4 w-4" />Cerrar sesión</button>
                </header>
                <div className="flex min-h-[calc(100vh-70px)] flex-col md:flex-row">
                    <nav aria-label="Navegación del panel" className="flex gap-1 overflow-x-auto border-b border-slate-700/40 px-3 py-3 md:w-52 md:shrink-0 md:flex-col md:border-r md:border-b-0 md:px-2 md:py-5">
                        {navigation.map(({ href, label, icon: Icon, exact }) => {
                            const active = exact ? pathname === href : pathname.startsWith(href);
                            return <Link key={href} href={href} className={`inline-flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? "bg-blue-500/15 text-blue-300" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"}`}><Icon className="h-4 w-4" />{label}</Link>;
                        })}
                    </nav>
                    <div className="min-w-0 flex-1">{children}</div>
                </div>
            </div>
        </div>
    );
}
