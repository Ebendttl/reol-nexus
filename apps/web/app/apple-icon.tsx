import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 110,
          background: "linear-gradient(135deg, #0F5132 0%, #07301C 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "24%",
          color: "#F4F7F5",
          fontWeight: 900,
          fontFamily: "Playfair Display, Georgia, serif",
          border: "4px solid #1E2E23",
        }}
      >
        <span style={{ display: "flex", alignItems: "baseline", transform: "translateY(-4px)" }}>
          R<span style={{ color: "#D4AF37", marginLeft: "2px" }}>.</span>
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
