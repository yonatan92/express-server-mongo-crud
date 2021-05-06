import express, { json } from 'express';
import { access } from 'fs';
import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import sqlConnection from '../db/mysql.connection.mjs';
import raw from '../middleware/route.async.wrapper.mjs';
import { postSchema, putSchema } from './serverSchemValidator.mjs';
import {
  getAllUsers,
  deleteUserById,
  getUserById,
  createNewUser,
} from './routesUtils.mjs';
const { DB_TABLE_NAME } = process.env;

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../dbMock/users.json');
// import usersRouter from './users.mjs';

const router = express.Router();

const usersDbMiddlware = async (req, res, next) => {
  try {
    const exist = await fs.access(dbPath);
  } catch (e) {
    await fs.writeFile(dbPath, JSON.stringify([]));
  } finally {
    req.users = await getAllUsers();
    next();
  }
};

// router.use(usersDbMiddlware);

router.get('/test', async (req, res, next) => {
  const user = await sqlConnection.query(
    `SELECT * FROM ${DB_TABLE_NAME} WHERE id = 33`
  );
  console.log({ user: user[0][0] });
  res.send(user[0][0]).status(200);
});

//GET ALL USERS
router.get(
  '/all',
  raw(async (req, res, next) => {
    const users = await sqlConnection.query(`SELECT * FROM ${DB_TABLE_NAME} `);
    res.send(users[0]).status(200);
  })
);

//GET USER BY ID
router.get(
  '/:user_id',
  raw(async (req, res, next) => {
    const { user_id } = req.params;
    // const user = await getUserById(user_id);
    const user = await sqlConnection.query(
      `SELECT * FROM ${DB_TABLE_NAME} WHERE id = ${user_id}`
    );
    res.json(user[0][0]).status(200);
  })
);

//CREATE NEW USER
router.post(
  '/create',
  raw(async (req, res, next) => {
    const { user_name } = req.body;
    await postSchema.validateAsync(req.body);
    const { phone, first_name, last_name, email, country } = req.body;
    const user = await sqlConnection.query(
      `INSERT INTO ${DB_TABLE_NAME}(phone, first_name, last_name, email, country) VALUES( ${phone},"${first_name}","${last_name}", "${email}", "${country}") ;`
    );
    res.status(200).json(user);
  })
);

//DELETE USER BY ID
router.delete('/:user_id', async (req, res, next) => {
  const { user_id } = req.params;
  // await deleteUserById(user_id);
  await sqlConnection.query(
    `DELETE FROM ${DB_TABLE_NAME} WHERE id = ${user_id}`
  );
  res.status(200).json({ status: 'user deleted' });
});

//DELETE ALL USERS
router.delete('', async (req, res) => {
  await sqlConnection.query(`DELETE FROM ${DB_TABLE_NAME}`);
  res.status(200).json({ status: 'all users deleted' });
});

router.put(
  '/:user_id',
  raw(async (req, res, next) => {
    const { user_id } = req.params;
    // await deleteUserById(user_id);
    await putSchema.validateAsync(req.body);
    // const user = await sqlConnection.query(
    //   `SELECT * FROM ${DB_TABLE_NAME} WHERE id = ${user_id}`
    // );
    // // console.log({ user: user[0][0] });
    // const {
    //   phone = user[0][0].phone,
    //   first_name = user[0][0].first_name,
    //   last_name = user[0][0].last_name,
    //   email = user[0][0].email,
    //   country = user[0][0].country,
    //   id = user_id,
    // } = req.body;
    // // console.log({ country }, 'sdsds');
    // const updatedUser = await sqlConnection.query(
    //   `REPLACE INTO ${DB_TABLE_NAME}(id, phone, first_name, last_name, email, country) VALUES(${id}, ${phone},"${first_name}","${last_name}", "${email}", "${country}") ;`
    // );
    // console.log({ user: updatedUser[0][0] });
    res.status(200).json('test');
  })
);
// router.get('/payedOnly', myLog, paymentVerify, (req, res) => {
//   res.json({ msg: 'payed route' });
// });

export default router;
