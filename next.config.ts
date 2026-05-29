import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx", "js", "jsx"],
  // Allow HMR/dev resources when browsing the dev server over the LAN IP
  // (not just localhost), so hot reload reaches the browser.
  allowedDevOrigins: ["192.168.1.173"],
  async redirects() {
    return [
      { source: "/dashboard", destination: "/", permanent: true },

      // Old docs IA → current pages
      { source: "/docs/getting-started/:path*", destination: "/docs", permanent: false },
      { source: "/docs/concepts/:path*", destination: "/docs/how-it-works", permanent: false },
      { source: "/docs/see-it-in-action", destination: "/docs/how-it-works", permanent: false },
      { source: "/docs/iot-integration-technical", destination: "/docs/developers/mqtt-integration", permanent: false },
      { source: "/docs/guides/iot-integration-technical", destination: "/docs/developers/mqtt-integration", permanent: false },
      { source: "/docs/iot-migration-guide", destination: "/docs/guides/iot-migration-guide", permanent: false },
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
