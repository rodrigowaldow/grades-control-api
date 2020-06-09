const express = require('express');
const winston = require('winston');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs').promises;
const cors = require('cors');
const router = require('./routes/grades.js');
const swaggerDocument = require('./document.js');

global.fileName = 'grades.json';

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'grades-control-api.log' }),
  ],
  format: combine(
    label({ label: 'grades-control-api' }),
    timestamp(),
    myFormat
  ),
});

const app = express();
app.use(express.json());
app.use(cors());
app.use('/grade', router);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, async () => {
  try {
    fs.readFile(global.fileName, 'utf8');
    logger.info('API Started!');
  } catch (err) {
    logger.error(err);
  }
});
