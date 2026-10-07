const  API_URL=process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000"


export async function apiFetch<T>(
    path : string,
    Options :{
        method?: string;
        token?: string | null;
        body?: unknown 
    } ={}
): Promise<T> {
    const headers : Record<string,string> = {
        "Content-type" : "application/json"
    }
    if(Options.token) headers.Authorization = `Bearer ${Option.token}`

    const res = await fetch(`${API_URL}${path}`,{
        method : Options.method ?? "GET",
        headers,
        body : Option.body !== undefined ? JSON.stringify(Options.body) : undefined
    })

    const data = (await res.json().catch(() => ({}))) as T & {error?: string}
    if(!res.ok) throw new Error(data.error ?? "Request failed")

        return data;
}

