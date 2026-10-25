
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { authOptions } from "@/lib/auth";

export const instant = false;

export default async function DashboardPage() {
    await connection();
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/dashboard");
    }

    return <DashboardClient userName={session.user?.name ?? session.user?.email ?? ""} />;
}
