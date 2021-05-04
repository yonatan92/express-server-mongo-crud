import express from 'express';
import log from '@ajar/marker';
// import morgan from 'morgan';

import usersRouter from './routs/users.mjs';
// import apiRouter from './routes/api.mjs';

const app = express();
// const PORT =  process.env.PORT || 3030;
// const HOST =  process.env.HOST || 'localhost';
const { PORT = 3030, HOST = 'localhost' } = process.env;

// app.use(morgan('dev'));
app.use(express.json());

//routing
// app.use('/api', apiRouter);
app.use('/users', usersRouter);

app.use('*', (req, res) => {
  res.status(404).send(`<h1>path ${req.url} was not found...</h1>`);
});

app.listen(PORT, HOST, () => {
  log.magenta(`🌎  listening on`, `http://${HOST}:${PORT}`);
});
