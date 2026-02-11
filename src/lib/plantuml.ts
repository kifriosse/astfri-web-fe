
import pako from 'pako';

function encode6bit(b: number): string {
  if (b < 10) return String.fromCharCode(48 + b);
  b -= 10;
  if (b < 26) return String.fromCharCode(65 + b);
  b -= 26;
  if (b < 26) return String.fromCharCode(97 + b);
  b -= 26;
  if (b === 0) return '-';
  if (b === 1) return '_';
  return '?';
}

function append3bytes(b1: number, b2: number, b3: number): string {
  const c1 = b1 >> 2;
  const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
  const c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
  const c4 = b3 & 0x3f;
  return (
    encode6bit(c1 & 0x3f) +
    encode6bit(c2 & 0x3f) +
    encode6bit(c3 & 0x3f) +
    encode6bit(c4 & 0x3f)
  );
}

function encode64(data: Uint8Array): string {
  let r = "";
  for (let i = 0; i < data.length; i += 3) {
    if (i + 2 === data.length) {
      r += append3bytes(data[i], data[i + 1], 0);
    } else if (i + 1 === data.length) {
      r += append3bytes(data[i], 0, 0);
    } else {
      r += append3bytes(data[i], data[i + 1], data[i + 2]);
    }
  }
  return r;
}

/**
 * Encodes PlantUML source code into a URL-friendly format for the official PlantUML server.
 */
export function getPlantUMLUrl(puml: string, format: 'svg' | 'png' = 'svg'): string {
  if (!puml) return "";
  try {
    const data = new TextEncoder().encode(puml);
    const compressed = pako.deflate(data, { level: 9 });
    const encoded = encode64(compressed);
    return `https://www.plantuml.com/plantuml/${format}/~1${encoded}`;
  } catch (err) {
    console.error("Error encoding PlantUML:", err);
    return "";
  }
}

/**
 * Extracts PlantUML block from text content.
 */
export function extractPlantUML(content: string): string | null {
  const pumlRegex = /@startuml[\s\S]*?@enduml/g;
  const match = content.match(pumlRegex);
  return match ? match[0] : null;
}
