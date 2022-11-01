/** @type {import('next').NextConfig} */
require('dotenv').config()
const nextConfig = {
  env:{
    STRAPI_BACKEND_HOST: process.env.STRAPI_BACKEND_HOST,
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
