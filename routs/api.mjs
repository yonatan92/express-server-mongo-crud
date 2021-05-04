import express from 'express';
import log from '@ajar/marker';
// import usersRouter from './users.mjs';

const router = express.Router();

const paymentVerify = (req, res, next) => {
  log.green(`check user paid for service...`);
  res.redirect('/login');
  // next()
};
const myLog = (req, res, next) => {
  log.info(`request was called... ${req.url}`);
  next();
};
// router.use('/users',usersRouter);
//routes
router.get('/', (req, res) => {
  res.json({ msg: 'main api route' });
});
router.get('/pop', (req, res) => {
  res.json({ msg: 'pop api route' });
});
router.get('/payedOnly', myLog, paymentVerify, (req, res) => {
  res.json({ msg: 'payed route' });
});

export default router;
