import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors({ origin: true }));

app.set('trust proxy', 1); // trust first proxy
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());

function customHeaders(req, res, next) {
  app.disable('x-powered-by');
  res.setHeader('X-Powered-By', 'Docuplier Inc');
  next();
}
app.use(customHeaders);

app.use('/api/v1', routes);

app.use((err, req, res, next) => errorHandler(err, req, res));

export default app;
