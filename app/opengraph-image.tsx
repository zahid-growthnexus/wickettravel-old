import { ImageResponse } from "next/og";

// Branded social share card (Open Graph + Twitter). Generated at build time so
// no binary asset is needed and it stays on-brand (navy + accent orange).
export const alt =
  "Wicket Travel — book cheap flights from the UK at the best airline ticket fares";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0b1638 0%, #132a63 60%, #0b1638 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 20,
              background: "#1b3a7a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
            }}
          >
            ✈
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
            <span style={{ color: "#ffffff" }}>Wicket</span>
            <span style={{ color: "#f97316" }}>Travel</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Cheap flights from the UK
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, color: "#fb923c", lineHeight: 1.05, letterSpacing: -2 }}>
            at the best airline fares
          </div>
        </div>

        {/* Footline */}
        <div style={{ fontSize: 30, color: "#c7d2e8", fontWeight: 600 }}>
          Trusted airlines · Pakistan · India · Dubai · Worldwide · No hidden fees
        </div>
      </div>
    ),
    { ...size }
  );
}
