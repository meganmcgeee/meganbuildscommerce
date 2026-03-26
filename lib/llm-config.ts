/** Google retired `gemini-2.0-flash` for new users; use a current model. */
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export type GeminiConfig = {
  apiKey: string;
  model: string;
};

/**
 * Gemini only. Set one of:
 * - `GOOGLE_GENERATIVE_AI_API_KEY` (Google AI Studio)
 * - `GEMINI_API_KEY` (alias)
 *
 * Optional: `LLM_MODEL` (default `gemini-2.5-flash`).
 */
export function resolveGeminiConfig(): GeminiConfig {
  const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ??
    process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "Set GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY for the Lab agent. Optional: LLM_MODEL."
    );
  }

  const model = process.env.LLM_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

  return { apiKey, model };
}

export function hasGeminiCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
      process.env.GEMINI_API_KEY?.trim()
  );
}
