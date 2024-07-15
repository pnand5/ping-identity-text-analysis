const cluster = require('cluster');
const os = require('os');
const express = require("express");
var cors = require('cors')

const fileUploadValidator = require('./fileUploadValidator');
const { fileUploadHandler } = require('./fileUploadHandler');

const numCPUs = os.cpus().length;
if (cluster.isMaster && process.env.NODE_ENV !== 'test') {
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker process ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {

  const app = express();
  const port = 8000;

  var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  }
  app.use(cors(corsOptions));

  if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  app.get('/', (req, res) => {
    res.send('Welcome to my server!');
  });

  app.post('/upload', fileUploadValidator, fileUploadHandler);

  app.use((err, req, res, next) => {
    // console.error(err);
    res.status(500);
    res.send({ type: err.type, message: err.message });
  })

  module.exports = app;
}
