import type { CSSProperties } from "react";

type BlobProps = Pick<CSSProperties, "top" | "right" | "bottom" | "left" | "transform" | "width" | "height">;

export default function Blob({ width = "1000px", height = "800px", ...position }: BlobProps) {
  return (
    <div
      className="hidden md:block"
      style={{
        backgroundImage:'radial-gradient(#008080 0%, rgba(94, 208, 234, 0) 60%)',
        zIndex:0,
        opacity:0.2,
        width,
        height,
        position:"absolute",
        pointerEvents:"none",
        flexShrink:0,
        ...position
    }}
    />
  )
}
