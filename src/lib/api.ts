
const BASE_URL = 'http://localhost:7280';

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

export const transformSourceCode = async (data: TransformRequest): Promise<TransformResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/transform`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
