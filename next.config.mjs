/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`
const nextConfig = {
    reactStrictMode: false,
    headers: async () => {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'geolocation=(), browsing-topics=()'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src *; script-src 'unsafe-inline' 'unsafe-eval' *; style-src 'unsafe-inline' *; img-src *; font-src *; connect-src *; media-src *; object-src *; frame-src *;"
                    }
                ],
            },
        ];
    }
};


export default nextConfig;
