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
    const { prompt } = req.body;
    try{
        
        const ansewer = await queryDeepSeek(prompt)
        res.status(200).json({ ansewer })
    }catch(err){
        res.status(500.).json({error: "error llm "})
    }
})

app.listen(3000, () => console.log("API running on http://localhost:3000"));