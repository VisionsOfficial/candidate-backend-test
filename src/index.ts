import express from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';

import seed from './utils/seeder';

import { contractsRouter } from './routes/contracts';

config();

const { DATABASE_URL } = process.env;

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/ping', async (req, res, next) => {
    res.status(200).send('pong');
});

app.use('/contracts', contractsRouter);

app.listen(PORT, async () => {
    try {
        if (!DATABASE_URL) {
            throw Error('Missing database env');
        }
        await connect(DATABASE_URL);
        await seed();
        console.log(`App running on http://localhost:${PORT}`);
    } catch (error) {
        console.error(error);
    }
});
