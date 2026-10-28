import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { APP_NAME } from "@/lib/constants/app";

export const alt = `${APP_NAME} — sistema de gestão para barbearias`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          background: "#0a0a0a",
          color: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={200} height={200} alt="" style={{ borderRadius: 24 }} />
        <div style={{ fontSize: 72, fontWeight: 700 }}>{APP_NAME}</div>
        <div style={{ fontSize: 36, color: "#a3a3a3" }}>
          Agenda, atendimentos e faturamento da sua barbearia
        </div>
      </div>
    ),
    size
  );
}
