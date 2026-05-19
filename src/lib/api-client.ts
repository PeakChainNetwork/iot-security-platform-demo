import { requireBackendBaseUrl } from "@/lib/backend-url"

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function urlFor(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  return `${requireBackendBaseUrl()}${path}`
}

export async function fetchJson<T>(pathname: string): Promise<T> {
  let res: Response

  try {
    res = await fetch(urlFor(pathname), {
      cache: "no-store",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    })
  } catch {
    throw new ApiError(
      0,
      "Could not reach the backend. Make sure the server is running and the URL is correct."
    )
  }

  if (!res.ok) {
    let detail = ""
    try {
      const ct = res.headers.get("content-type") ?? ""
      if (ct.includes("application/json")) {
        const body = await res.json()
        detail = body.detail ?? body.message ?? ""
        if (typeof detail !== "string") detail = JSON.stringify(detail)
      }
    } catch {
      // ignore unreadable / HTML bodies
    }
    throw new ApiError(
      res.status,
      detail || `Backend returned ${res.status}. The service may be offline or the endpoint unavailable.`
    )
  }

  return (await res.json()) as T
}
