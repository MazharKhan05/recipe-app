/** @type {import('next').NextConfig} */
require('dotenv').config()
const nextConfig = {
  env:{
    STRAPI_API_URL: process.env.STRAPI_API_URL,
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
