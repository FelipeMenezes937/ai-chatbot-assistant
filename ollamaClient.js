const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL = "deepseek-r1:1.5b";

async function queryDeepSeek(prompt) {
  console.log(" Entrou na queryDeepSeek");
  console.log("Prompt:", prompt);

  try {
    console.log(" Enviando request para Ollama...");

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
            { role: "system", content: "Responda de forma curta e direta." },
            { role: "user", content: prompt }
        ],
        think: false,
        stream: false
      })
    });

    console.log("Status da resposta:", response.status);
    
    const rawText = await response.text();
    console.log("Resposta bruta do Ollama:", rawText);

    if (!response.ok) {
      throw new Error(`Ollama respondeu erro ${response.status}`);
    }

    const data = JSON.parse(rawText);

    console.log("Parse JSON OK");

    return data.message.content;

  } catch (err) {
    console.error("ERRO DENTRO queryDeepSeek:", err.message);
    throw err; // isso causa o 500
  }
}

module.exports = { queryDeepSeek };
