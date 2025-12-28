const express = require('express')
const bodyParser = require('body-parser')
const { joinOrdersWithProductsSuppliers } = require('./joinCollections')
const { queryDeepSeek } = require('./ollamaClient')
const app = express()

app.use(bodyParser.json())

app.get('/api/joined-orders', async (req, res) => {
    try{
        const data = await joinOrdersWithProductsSuppliers();
        res.json(data)
    }catch(err){
        res.status(500).json({error: "DB error"})
    }
})

app.post('/api/llm', async (req, res) => {
    const prompt = req.body.params;
    try{
        const ansewer = await queryDeepSeek(prompt)
        res.json({ ansewer })
    }catch(err){
        res.status(500.).json({error: "LLM error"})
    }
})

app.listen(3000, () => console.log("API running on http://localhost:3000"));