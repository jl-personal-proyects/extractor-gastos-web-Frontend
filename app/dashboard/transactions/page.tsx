import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import TransactionsClient from "@/components/dashboard/TransactionsClient";
import { authOptions } from "@/lib/auth";

export const instant = false;

export default async function TransactionsPage() {
    await connection();
    const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin?callbackUrl=/dashboard/transactions");
    return <TransactionsClient />;
}
