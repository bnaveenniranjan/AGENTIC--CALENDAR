const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class SessionExpiredError extends Error {
    constructor() {
        super("session expired");
        this.name = "SessionExpiredError";
    }
}

export async function apiFetch<T>(
    path: string,
    Options: {
        method?: string;
        token?: string | null;
        body?: unknown;
    } = {}
): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (Options.token) headers.Authorization = `Bearer ${Options.token}`;

    const res = await fetch(`${API_URL}${path}`, {
        method: Options.method ?? "GET",
        headers,
        body: Options.body !== undefined ? JSON.stringify(Options.body) : undefined,
    });

    const data = (await res.json().catch(() => ({}))) as T & { error?: string };

    if (!res.ok) {
        if (res.status === 401 || data.error?.toLowerCase().includes("session expired")) {
            throw new SessionExpiredError();
        }
        throw new Error(data.error ?? "Request failed");
    }

    return data;
}
