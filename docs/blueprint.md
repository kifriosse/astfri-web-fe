# **App Name**: ASTFRI Web Interface

## Core Features:

- Source Code Upload and Display: Allow users to upload source code (C++, Java, C#) or input it directly into a text editor. The source code is displayed in a Monaco Editor component on the left side of the split screen UI.
- Language Selection: A dropdown menu enables the user to specify the language of the input source code. Configuration is data-driven via JSON configuration. The selected language is transmitted to the backend to determine the correct parser executable.
- Transformation Execution: When triggered, the source code and selected input/output libraries are sent to the ASP.NET Core backend via REST API (as defined in swagger.json, using the /transform endpoint with a TransformRequest payload). The backend wraps and executes the corresponding C++ CLI tool, passing input via STDIN. Error handling and logging are included to ensure stable performance. Use `setTimeout` with mock data while the real implementation is prepared.
- Output Display: Display the result from the C++ tool on the right side of the split screen UI. Output types include Pseudocode and UML. Configuration for the backend response is driven by a JSON configuration file.
- Error Handling: Error messages generated from CLI will be displayed in the frontend. This is displayed in Slovak (e.g., "Nastala chyba").
- Data-Driven Configuration: Configuration files define the mapping of languages and output to C++ executables and parameters.
- Health Check Endpoint: Implement a health check endpoint (/healthcheck) on the backend, as defined in swagger.json, to monitor the API's availability and status.

## Style Guidelines:

- Primary color: Dark slate blue (#374151) for a professional and focused feel.
- Background color: Very light gray (#F9FAFB) for a clean, unobtrusive backdrop.
- Accent color: Soft Lavender (#A78BFA) to provide subtle, modern highlights on interactive elements.
- Body font: 'Inter' sans-serif font for clear and readable UI text. Headline font: 'Space Grotesk' sans-serif font to add emphasis with its distinct modern design.
- Lucide Icons: Consistent style, used for buttons and controls.
- Split-screen layout with Monaco Editor on the left, and the output display on the right.
- Subtle transition animations to indicate loading status between user input and CLI tool result.