# LLM Local API com Node.js e Ollama

Este projeto consiste em uma **API REST desenvolvida em Node.js** que integra um **LLM (Large Language Model) rodando localmente** por meio do **Ollama**, sem dependência de serviços externos.

O objetivo é demonstrar, na prática, como consumir um modelo de linguagem local via HTTP, controlar latência, payload e fluxo de requisição, aplicando boas práticas de backend.

---

## O que são LLMs?

LLMs (*Large Language Models*) são modelos de inteligência artificial treinados para compreender e gerar texto em linguagem natural. Eles são a base de assistentes virtuais, chatbots e diversas soluções modernas de IA.

Neste projeto, o modelo é executado **localmente**, garantindo maior controle, privacidade e previsibilidade de custos.

---

## Arquitetura do Projeto

Fluxo simplificado da aplicação:

Client (Insomnia / Frontend)  
→ Express API (Node.js)  
→ Ollama HTTP API (localhost)  
→ LLM local (deepseek-r1:1.5b)  
→ Resposta em JSON  

---

## Tecnologias Utilizadas

- Node.js  
- Express  
- Ollama  
- Insomnia  

---

## Modelo Utilizado

- **deepseek-r1:1.5b**

Modelo leve, ideal para:
- testes locais
- prototipação
- respostas rápidas
- menor consumo de recursos

---

## Vantagens de usar um LLM local

- Controle total sobre o modelo e parâmetros
- Maior segurança e privacidade dos dados
- Redução da dependência de serviços externos
- Funcionamento offline
- Custo previsível

---

## Endpoint Disponível

### POST `/api/llm`

Endpoint responsável por enviar o prompt ao LLM local e retornar a resposta.

### Request Body (JSON)

```json
{
  "prompt": "Explain what Clean Code is"
}
```
---
### Testes
Os endpoints foram testados utilizando o Insomnia, validando:

- envio correto de payload JSON

- status HTTP

- tempo de resposta

- retorno do modelo

## Performance

- tempo médio de resposta: 7 segundos
- Inferência local via CPU
- Payload leve e controlado

---
### Como executar o projeto
1) clonar o projeto:
```
 git clone https://github.com/FelipeMenezes937/ai-chatbot-assistant.git
```

2) iniciar o modelo:
```PowerShell
ollama pull deepseek-r1:1.5b
```

Executar api
```bash
npm run dev
```