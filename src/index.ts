import express, { Application } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import * as mongoose from 'mongoose';
import Logger from '../configs/logger';
import contractRouter from './routes/contract';
import userRouter from './routes/user';
import seedDb from '../configs/seed';

// windows and env issue
const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));

// Swagger docs
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json",
        },
    })
);

// Router
app.use(contractRouter, userRouter);

// Avoid error with test and don't use the same DB in test and development environnement
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(`mongodb://localhost:27017/visions`, {
    }).then(
        async r => {
            Logger.info('Connected');

            // DATA SEED
            await seedDb();
        },
        error => Logger.error("Failed to connect", error)
    );

    app.listen(PORT, () => {
        console.log("Server is running on port", PORT);
    });
}



export default app;