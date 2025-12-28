const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL = "deepseek-r1:1.5b";

async function queryDeepSeek(prompt) {
  try {
  const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
            { role: "system", content: "Keep the response short and direct." },
            { role: "user", content: prompt }
        ],
        think: false,
        stream: false
      })
    });
    const rawText = await response.text();

    if (!response.ok) {
      throw new Error(`Ollama respondeu erro ${response.status}`);
    }

    const data = JSON.parse(rawText);

    return data.message.content;

  } catch (err) {
    console.error("ERRO DENTRO queryDeepSeek:", err.message);
    throw err;
  }
}

module.exports = { queryDeepSeek };
