import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx", "js", "jsx"],
  async redirects() {
    return [
      {
        source: "/docs/iot-migration-guide",
        destination: "/docs/guides/iot-migration-guide",
        permanent: true,
      },
      {
        source: "/docs/iot-integration-technical",
        destination: "/docs/guides/iot-integration-technical",
        permanent: true,
      },
      {
        source: "/docs/getting-started/run-locally",
        destination: "/docs",
        permanent: false,
      },
      {
        source: "/docs/getting-started/environment-variables",
        destination: "/docs/getting-started/installation",
        permanent: false,
      },
      {
        source: "/docs/getting-started/project-structure",
        destination: "/docs/concepts/architecture",
        permanent: false,
      },
      {
        source: "/docs/guides/dashboard-overview",
        destination: "/docs/guides/platform-api#dashboard",
        permanent: false,
      },
      {
        source: "/docs/guides/device-management",
        destination: "/docs/guides/platform-api#devices",
        permanent: false,
      },
      {
        source: "/docs/guides/live-telemetry",
        destination: "/docs/guides/platform-api#devices",
        permanent: false,
      },
      {
        source: "/docs/guides/alerts-anomalies",
        destination: "/docs/guides/platform-api#alerts",
        permanent: false,
      },
      {
        source: "/docs/guides/vulnerability-tracking",
        destination: "/docs/guides/platform-api#vulnerabilities",
        permanent: false,
      },
    ]
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
