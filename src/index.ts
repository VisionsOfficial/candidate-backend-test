import express, { Application } from "express";
import morgan from "morgan";
import Router from "./routes";
import swaggerUi from "swagger-ui-express";
import * as mongoose from 'mongoose';
import logger from './logger';

const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json",
        },
    })
);

app.use(Router);

mongoose.connect(`mongodb://localhost:27017/visions`, {
}).then(
    r => logger.info("Connected"),
    error => logger.error("Failed to connect", error)
);


app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});

export default app;