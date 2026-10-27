import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import PrivacyClient from "@/components/dashboard/PrivacyClient";
import { authOptions } from "@/lib/auth";

export const instant = false;

export default async function PrivacyPage() {
    await connection();
    if (!await getServerSession(authOptions)) redirect("/api/auth/signin?callbackUrl=/dashboard/privacy");
    return <PrivacyClient />;
}
