// src/lib/constants/app.ts
export const APP_TIMEZONE = "America/Sao_Paulo";

export const APP_NAME = "Tio Dog Barbearia";

export const APP_DESCRIPTION =
  "Sistema de gestão para barbearias: agenda, atendimentos, clientes, barbeiros, serviços e faturamento em um só lugar.";

// Absolute base URL used for canonical links, Open Graph, robots and sitemap.
// NEXT_PUBLIC_APP_URL wins; on Vercel it falls back to the production domain.
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
