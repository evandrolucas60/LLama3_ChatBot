// index.js (servidor Express)
import express from 'express'
import cors from 'cors';
import axios from 'axios'

const app = express();
app.use(express.json());
app.use(cors());

app.post('/ia', async (req, res) => {
    const { text } = req.body;

    try {
        const llamaResponse = await axios.post(
            'http://localhost:11434/api/generate',
            {
                model: 'llama3',
                prompt: text,
                stream: true,
            },
            { responseType: 'stream' }
        );

        let respostaFinal = '';

        llamaResponse.data.on('data', (chunk) => {
            const lines = chunk.toString().split('\n').filter(Boolean);

            for (const line of lines) {
                try {
                    const json = JSON.parse(line);
                    if (json?.response) {
                        respostaFinal += json.response;
                    }
                } catch (err) {
                    console.error('Erro ao processar linha JSON:', line);
                }
            }
        });

        llamaResponse.data.on('end', () => {
            res.json({ response: respostaFinal });
        });

    } catch (error) {
        console.error('Erro na chamada ao LLaMA:', error.message);
        res.status(500).json({ error: 'Erro ao gerar resposta da IA.' });
    }
});

app.listen(3000, () => {
    console.log('Servidor IA ouvindo em http://localhost:3000/ia');
});
