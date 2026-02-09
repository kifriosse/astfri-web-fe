
import config from './config.json';

const BASE_URL = config.ApiBaseUrl;

export interface TransformRequest {
  inputLib: string | null;
  inputText: string | null;
  outputLib: string | null;
}

export interface TransformResponse {
  result: string;
  error?: string;
  logs?: string[];
}

/**
 * Base64 encodes a string, handling Unicode characters correctly.
 */
const toBase64 = (str: string): string => {
  try {
    // Browser-safe base64 encoding for Unicode
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch (e) {
    // Fallback to Buffer if available (Node environment)
    return typeof Buffer !== 'undefined' ? Buffer.from(str).toString('base64') : btoa(str);
  }
};

export const transformSourceCode = async (data: TransformRequest): Promise<TransformResponse> => {
  try {
    // Encode the source code to base64 before sending as requested
    const payload = {
      ...data,
      inputText: data.inputText ? toBase64(data.inputText) : null
    };

    const response = await fetch(`${BASE_URL}/transform`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        result: "",
        error: `Nastala chyba: ${errorText || "Nepodarilo sa vykonať transformáciu."}`
      };
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      return { result: text };
    }
  } catch (err) {
    console.error("API Error:", err);
    return {
      result: "",
      error: `Nastala chyba pri komunikácii so serverom. Skontrolujte, či je backend spustený na ${BASE_URL}.`
    };
  }
};

export const checkHealth = async (): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/healthcheck`);
    if (!response.ok) throw new Error("API is not healthy");
    return { status: "Healthy" };
  } catch (err) {
    throw err;
  }
};
