import nextra from 'nextra'

const withNextra = nextra({
  
})

const nextConfig = withNextra({
  reactStrictMode: true,
  eslint: {
    // ESLint behaves weirdly in this monorepo.
    ignoreDuringBuilds: true
  },
 
  experimental: {
    turbo: {
      rules: {
       
      }
    }
  }
})

export default nextConfig