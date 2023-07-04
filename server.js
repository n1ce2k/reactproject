import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import express from 'express';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 4000;

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
});


// app.get('/api/swapi', async (req, res) => {
//     try {
//         const response = await axios.get('https://swapi.dev/api/people/');
//         res.json(response.data.results);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
//
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


// Обработка GET-запроса для получения списка фильмов
app.get('/api/swapi/films', async (req, res) => {
    try {
        const response = await axios.get('https://swapi.dev/api/films');
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch films' });
    }
});

// Обработка GET-запроса для получения списка персонажей по URL фильма
app.get('/api/swapi/characters', async (req, res) => {
    const { filmUrl } = req.query;

    try {
        const response = await axios.get(filmUrl);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

