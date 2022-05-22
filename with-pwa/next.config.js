// @ts-check
const withPWA = require('next-pwa')
const isDev = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	pwa: {
		dest: 'public',
		disable: isDev,
	},
}

module.exports = withPWA(nextConfig)
