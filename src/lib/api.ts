
export interface TransformRequest {
  sourceCode: string;
  language: string;
  outputType: string;
}

export interface TransformResponse {
  result: string;
  error?: string;
  logs?: string[];
}

export const transformSourceCode = async (data: TransformRequest): Promise<TransformResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mocking the backend C++ CLI execution
  if (!data.sourceCode.trim()) {
    return {
      result: "",
      error: "Nastala chyba: Zdrojový kód je prázdny."
    };
  }

  if (data.outputType === 'uml') {
    return {
      result: `@startuml\nclass Transformer {\n  + transform(code: String): String\n}\n@enduml`,
      logs: ["Starting UML parser...", "Extracting classes...", "Generating PlantUML syntax."]
    };
  }

  return {
    result: `POSTUP transformacia(${data.language})\nZAČIATOK\n  AK zdrojovy_kod JE platny POTOM\n    generuj_vystup()\n  INAK\n    vypis_chybu()\nKONIEC`,
    logs: ["Initializing pseudocode generator...", "Mapping AST to pseudo-tokens."]
  };
};

export const checkHealth = async (): Promise<{ status: string; timestamp: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    status: "Healthy",
    timestamp: new Date().toISOString()
  };
};
