import type { Metadata } from "next"

import { PostmanGuide } from "@/features/docs/components/postman-guide"

export const metadata: Metadata = {
  title: "Postman Collection",
  description:
    "Download and import the IoT Security Platform Postman collection and environment to test every API endpoint instantly.",
}

export default function PostmanPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Postman Collection
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
          Download two JSON files, import them into Postman, and you get a fully configured workspace with every API
          endpoint, pre-filled request bodies, example responses, and an environment with the{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">base_url</code> variable ready to go.
        </p>
      </div>
      <PostmanGuide />
    </div>
  )
}
