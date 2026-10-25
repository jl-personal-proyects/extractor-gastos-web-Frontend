import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import AnalyticsClient from "@/components/dashboard/AnalyticsClient";
import { authOptions } from "@/lib/auth";

export const instant = false;

export default async function AnalyticsPage() {
    await connection();
    const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin?callbackUrl=/dashboard/analytics");
    return <AnalyticsClient />;
}
