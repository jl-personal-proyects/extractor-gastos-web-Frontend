import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import ReviewClient from "@/components/dashboard/ReviewClient";
import { authOptions } from "@/lib/auth";

export const instant = false;

export default async function ReviewPage() {
    await connection();
    if (!await getServerSession(authOptions)) redirect("/api/auth/signin?callbackUrl=/dashboard/review");
    return <ReviewClient />;
}
