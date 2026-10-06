import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// The share image for every page: the hero's redline drawn as a sheet, with no words in it. Apple's guide to link
// previews (TN3156) asks for no text in the image, because it shows at many sizes; the title and description travel
// as tags instead. The same file serves /method and /view through an absolute og:image in their heads.
export const alt =
  "A drawing sheet on pale grid paper: three lines of dark ink, the last one struck through by a hand-drawn red line, with a red correction marked underneath.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colors come from the light :root block of app/globals.css, so the site's tokens stay the only source.
const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
const lightRoot = css.slice(css.indexOf(":root {"), css.indexOf("}", css.indexOf(":root {")));
function token(name: string): string {
  const value = lightRoot.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
  if (!value) throw new Error(`opengraph-image: --${name} is missing from the light :root block of app/globals.css`);
  return value;
}
const paper = token("paper");
const ink = token("ink");
const inkSoft = token("ink-soft");
const red = token("red");
const grid = token("grid");

// A word drawn as a hatched box, the way a drawing marks a filled area.
const bar = (width: number, color: string, height = 46) => ({
  width,
  height,
  border: `2px solid ${color}`,
  backgroundImage: `repeating-linear-gradient(135deg, ${color} 0px, ${color} 1.5px, transparent 1.5px, transparent 9px)`,
});

// The sheet's border and its title block, as on a construction drawing.
function Sheet() {
  const edge = `2px solid ${ink}`;
  return (
    <div style={{ position: "absolute", top: 36, left: 36, right: 36, bottom: 36, display: "flex", border: edge }}>
      <div style={{ position: "absolute", right: 0, bottom: 0, width: 312, height: 108, display: "flex", borderLeft: edge, borderTop: edge }}>
        <div style={{ width: 196, display: "flex", flexDirection: "column", borderRight: `1px solid ${ink}` }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: 18, borderBottom: `1px solid ${ink}` }}>
            <div style={bar(132, ink, 16)} />
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: 18 }}>
            <div style={bar(92, inkSoft, 10)} />
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="54" height="48" viewBox="0 0 54 48">
            <path d="M27 4 L51 44 L3 44 Z" fill="none" stroke={red} strokeWidth="3" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// The hero's line, with words as bars: the last one struck through in red and corrected underneath.
function Redline() {
  return (
    <div style={{ position: "absolute", left: 108, top: 140, display: "flex", flexDirection: "column", gap: 30 }}>
      <div style={bar(612, ink)} />
      <div style={bar(744, ink)} />
      <div style={{ display: "flex", position: "relative", width: 452, height: 46 }}>
        <div style={bar(452, inkSoft)} />
        <svg width="500" height="40" viewBox="0 0 100 10" preserveAspectRatio="none" style={{ position: "absolute", left: -24, top: 6 }}>
          <path d="M1 6 C 30 3, 60 8, 99 4" fill="none" stroke={red} strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginTop: -6, marginLeft: 10 }}>
        <svg width="48" height="48" viewBox="0 0 48 48">
          <path d="M8 4 L8 32 L40 32 M30 22 L40 32 L30 42" fill="none" stroke={red} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ width: 236, height: 30, background: red, transform: "rotate(-2deg)", marginBottom: 8 }} />
      </div>
    </div>
  );
}

export default function Image() {
  const gridLines = `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: paper, backgroundImage: gridLines, backgroundSize: "30px 30px" }}>
        <Sheet />
        <Redline />
      </div>
    ),
    size,
  );
}
