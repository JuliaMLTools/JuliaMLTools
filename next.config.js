/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}

module.exports = {
    redirects: async () => {
        return [
            {
                // Source Path ( from )
                source: '/',

                // Destination Path ( to )
                destination: '/transformer-blocks',
                permanent: true,
            },
        ]
    },
}