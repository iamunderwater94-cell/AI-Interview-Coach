"use strict";

// next.config.js
var nextConfig = {
  images: {
    domains: ["localhost"]
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: false
  }
};
module.exports = nextConfig;
