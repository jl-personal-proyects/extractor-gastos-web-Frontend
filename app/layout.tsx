
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "./Providers";
import "./globals.css";

export const metadata: Metadata = {
    title: "Fluxo | Tus finanzas en piloto automático",
    description:
        "Organiza tus gastos y visualiza tus movimientos financieros desde un solo lugar.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode;
}) {
    return (
        <html lang="es">
        <body className="antialiased">
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
