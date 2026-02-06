# Gatekeeper AI

**Prove Your Worth.**

Gatekeeper AI is an immersive prompt engineering challenge where you must pass 5 levels of increasingly difficult AI "Gatekeepers". Each level requires a specific strategy, testing your ability to reason, persuade, and understand LLM behavior.

Try it out on : [text](https://gatekeeper-ai.vercel.app/)


## Features

- **5 Unique Levels**: From simple politeness to deep philosophical reasoning.
- **Multi-Provider Support**: Bring your own key for **OpenAI**, **Google Gemini**, or **Groq**.
- **Immersive UI**: built with Framer Motion animations, glassmorphism effects, and a responsive dark mode design.
- **Real-time Feedback**: The Gatekeepers react to your inputs with specific personalities and rejection reasons.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Directory)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18+ installed.
- An API key for one of the supported providers (OpenAI, Gemini, or Groq).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/gatekeeper-ai.git
    cd gatekeeper-ai
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

To play the game, you need to configure an API key.
1. Click the **Settings** icon (gear) in the top right corner.
2. Select your preferred provider (OpenAI, Gemini, or Groq).
3. Paste your API key.
4. Click **Save Configuration**.

Your API key is stored locally in your browser and is never sent to any server other than the LLM provider directly.

## The Levels

1.  **The Grumpy Gatekeeper**: He hates everything. Manners matter more than you think.
2.  **The Trickster Detector**: No jailbreaks allowed. Intent must be clear and specific.
3.  **The Reasoner**: It's not about *what* you want, but *why* you want it.
4.  **The Socratic Void**: Don't ask for fish; ask how to fish.
5.  **The Omniscient Silence**: The final boss. Understand the nature of the Gatekeeper to pass.

## License

MIT
