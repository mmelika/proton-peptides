/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['uuid'],
  env: {
    NOWPAYMENTS_API_KEY: process.env.NOWPAYMENTS_API_KEY,
    NOWPAYMENTS_IPN_SECRET: process.env.NOWPAYMENTS_IPN_SECRET,
  },
};

export default nextConfig;
