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
