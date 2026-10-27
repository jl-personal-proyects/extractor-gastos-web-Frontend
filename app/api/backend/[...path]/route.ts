import { getToken } from "next-auth/jwt";
import { createHmac } from "node:crypto";
import { NextRequest } from "next/server";

const backendUrl = process.env.BACKEND_API_URL?.replace(/\/$/, "");
const backendSecret = process.env.BACKEND_INTERNAL_SECRET;

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    if (!backendUrl || !backendSecret) return Response.json({ detail: "El proxy seguro no está configurado." }, { status: 503 });

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const email = typeof token?.email === "string" ? token.email : null;
    const refreshToken = typeof token?.refreshToken === "string" ? token.refreshToken : null;
    if (!email) return Response.json({ detail: "Sesión no válida." }, { status: 401 });

    const { path } = await context.params;
    const url = new URL(`${backendUrl}/${path.map(encodeURIComponent).join("/")}`);
    url.search = request.nextUrl.search;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = createHmac("sha256", backendSecret).update(`${email}:${timestamp}`).digest("hex");
    const headers = new Headers();
    headers.set("X-User-Email", email);
    headers.set("X-User-Timestamp", timestamp);
    headers.set("X-User-Signature", signature);
    // El token de Gmail solo viaja al backend cuando este necesita leer el buzón.
    if ((path[0] === "sincronizar" || path.join("/") === "privacidad/gmail/conectar" || path.join("/") === "privacidad/gmail/desconectar") && refreshToken) headers.set("X-Gmail-Refresh-Token", refreshToken);
    const idempotencyKey = request.headers.get("idempotency-key");
    if (idempotencyKey) headers.set("Idempotency-Key", idempotencyKey);
    const contentType = request.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);

    const response = await fetch(url, {
        method: request.method,
        headers,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
        cache: "no-store",
    });
    const responseHeaders = new Headers();
    for (const name of ["content-type", "content-disposition"]) {
        const value = response.headers.get(name);
        if (value) responseHeaders.set(name, value);
    }
    return new Response(response.body, { status: response.status, headers: responseHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
