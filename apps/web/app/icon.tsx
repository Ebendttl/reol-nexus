import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 20,
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
        }}
      >
        <span style={{ display: "flex", alignItems: "baseline", transform: "translateY(-1px)" }}>
          R<span style={{ color: "#D4AF37", marginLeft: "0.5px" }}>.</span>
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
