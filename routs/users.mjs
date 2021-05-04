import express, { json } from 'express';
import { access } from 'fs';
import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  getAllUsers,
  deleteUserById,
  getUserById,
  createNewUser,
} from './routesUtils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../dbMock/users.json');
// import usersRouter from './users.mjs';

const router = express.Router();

const usersDbMiddlware = async (req, res, next) => {
  try {
    const exist = await fs.access(dbPath);
    req.users = await getAllUsers();
    next();
  } catch (e) {
    console.log('ffffff');
    await fs.writeFile(dbPath, JSON.stringify([]));
    req.users = await getAllUsers();
    next();
  }
};

router.use(usersDbMiddlware);
//
// router.use('/users',usersRouter);
//routes
router.get('/all', async (req, res) => {
  const { users } = req;
  // const users = await getAllUsers();
  res.send(users).status(200);
});
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const user = await getUserById(user_id);
  res.json(user).status(200);
});

router.post('/create', async (req, res) => {
  const { user_name } = req.body;
  await createNewUser(user_name);
  res.status(200);
});

router.delete('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  await deleteUserById(user_id);
  res.status(200);
});
// router.get('/payedOnly', myLog, paymentVerify, (req, res) => {
//   res.json({ msg: 'payed route' });
// });

export default router;
