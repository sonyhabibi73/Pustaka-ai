import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "mammoth"],
  // Playwright serves the app from 127.0.0.1 while Next's dev client assumes
  // localhost; without this the HMR websocket is rejected as cross-origin.
  // LAN entries let the app open from another device — update when the machine
  // gets a new DHCP address.
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.1.7"],
};

export default nextConfig;
