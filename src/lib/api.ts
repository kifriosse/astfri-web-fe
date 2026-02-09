
const BASE_URL = 'https://localhost:7280';

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
  return Buffer.from(str).toString('base64');
};

export const transformSourceCode = async (data: TransformRequest): Promise<TransformResponse> => {
  try {
    // Encode the source code to base64 before sending
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
      error: "Nastala chyba pri komunikácii so serverom. Skontrolujte, či je backend spustený na localhost:7280."
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
