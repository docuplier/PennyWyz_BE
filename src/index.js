import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors({ origin: true }));

app.set('trust proxy', 1); // trust first proxy
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', routes);

app.use((err, req, res, next) => errorHandler(err, req, res));

export default app;
