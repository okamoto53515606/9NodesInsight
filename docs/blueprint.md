# **App Name**: 9Nodes Insight

## Core Features:

- User Input Form: Collects user's '3 favorite songs', '3 favorite books', '3 favorite words', and 'a message to AI' through a dedicated Japanese interface.
- Philosophical Profile Generation: Utilizes the Gemini API as a tool to profile the user's deep-seated 'philosophy of structure' based on the input data, applying the provided prompt template.
- Hacker-style Loading Interface: Presents a dynamic terminal-like loading screen during API processing, displaying pseudo-logs and typewriting animation of the raw prompt with user data substitution. The screen also allows text selection for the prompt.
- Automated Disclaimer Scroll: After prompt display on the loading screen, disclaimers regarding data transmission, stateless usage, and potential service interruption auto-scroll like movie credits.
- Profile Result Display: Renders the Gemini API's generated philosophical profile in a structured Markdown format for the user.
- LLMO HTML Optimization: Embeds key content like the raw prompt, architecture explanation, and disclaimers within the initial HTML DOM tree (e.g., using <details> or hidden areas) for improved LLM crawler visibility.
- JSON-LD Metadata: Implements structured data (SoftwareApplication JSON-LD) in the <head> to provide descriptive metadata to search engine crawlers.

## Style Guidelines:

- Main application background: Pristine white (#FFFFFF) for clarity and focus, adhering to user's specification.
- Main application text: Deep black (#000000) for readability, as requested by the user.
- Main theme color: A profound, thoughtful deep violet (#4A148C), utilized for prominent UI elements and interactive components.
- Loading screen background: Solid black (#000000), creating a command-line interface atmosphere.
- Loading screen text: Energetic hacker green (#00FF41), delivering a technical and engaging experience.
- Loading screen and console output: 'Source Code Pro' (monospace sans-serif) to replicate a classic terminal interface.
- Clean, structured layouts with ample whitespace to focus attention on input fields and profile results. The loading screen features a distinct full-screen, text-dominant layout.
- Typewriter effect for text display on the loading screen and a smooth, cinematic vertical scroll for disclaimers to engage users during waiting periods.