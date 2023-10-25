import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/ping', async (req, res, next) => {
    res.status(200).send('pong');
});

app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
});
