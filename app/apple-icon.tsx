import { ImageResponse } from "next/og";

// Apple touch icon — the navy WicketTravel mark. Also referenced as the
// Organization logo in JSON-LD (square, 180px ≥ Google's 112px minimum).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#132a63",
          color: "#ffffff",
          fontSize: 104,
        }}
      >
        ✈
      </div>
    ),
    { ...size }
  );
}
