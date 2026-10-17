import { ImageResponse } from "next/og";

import { siteConfig } from "@/content";

export const alt = siteConfig.brandTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social card, generated from the brand config at build time.
 * No external image asset, no design file to keep in sync.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#05070c",
          padding: "72px",
          color: "#edeae3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              background: "#38d6f2",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#7b8595",
            }}
          >
            The Digital Frontier
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            {siteConfig.headline}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color: "#9aa3b2",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            {siteConfig.supportingStatement}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #18212f",
            paddingTop: 26,
          }}
        >
          {/* Satori requires an explicit display on any element with more
              than one child. */}
          <div style={{ display: "flex", fontSize: 34 }}>
            {siteConfig.name}
            <span style={{ color: "#38d6f2" }}>.</span>
          </div>
          <div style={{ fontSize: 22, color: "#7b8595" }}>
            Ideas become systems. Systems become products.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
