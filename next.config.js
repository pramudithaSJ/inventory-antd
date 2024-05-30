/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
        minimumCacheTTL: 600,
    },
    env: {
        BASE_URL: process.env.BASE_URL,
    }


}

module.exports = nextConfig
