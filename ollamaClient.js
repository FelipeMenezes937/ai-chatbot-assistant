import fetch from "node-fetch";

const OLLAMA_API_URL = "http://localhost:11434/api/chat";
const MODEL = "deepseek-r1:8b";

/**
 * Envia um prompt simples para o DeepSeek-R1 via Ollama
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function queryDeepSeek(prompt) {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("queryDeepSeek requires a non-empty string prompt");
  }

  const response = await fetch(OLLAMA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "user", content: prompt }
      ],
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Ollama API error (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();
  return data.message?.content ?? "";
}
