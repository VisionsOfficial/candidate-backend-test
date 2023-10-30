import express from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import bodyParser from 'body-parser';

import { serve, setup } from 'swagger-ui-express';
import doc from '../docs/doc.json';

import seed from './utils/seeder';
import { logger } from './utils/logger';

import { contractsRouter } from './routes/contracts';

config();

const { DATABASE_URL, SECRET } = process.env;

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/ping', async (req, res, next) => {
    res.status(200).send('pong');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/contracts', contractsRouter);
// swagger
app.use('/api-docs', serve, setup(doc, { explorer: true }));

app.listen(PORT, async () => {
    try {
        if (!DATABASE_URL || !SECRET) {
            throw Error('Missing database env');
        }
        await connect(DATABASE_URL);
        await seed();
        logger.info(`App running on http://localhost:${PORT}`);
    } catch (error) {
        logger.error(error);
    }
});
