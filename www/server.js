import http from 'http';
import app from '../src/index.js';
import db from '../src/database/models/index.js';
import logger from '../src/utils/logger.js';
import seedProducts from '../src/database/seeders/index.js';

const server = http.createServer(app);

const port = process.env.PORT || 8080;

db.connection
  .sync({ force: +process.argv[2] === 1 })
  .then(() => logger.info('Database Connected.'))
  .then(() => seedProducts())
  .then(() => {
    server.listen(port, () => {
      logger.info(`Listening on PORT: ${port}`);
    });
  })
  .catch(logger.error);
