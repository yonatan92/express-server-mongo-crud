import bcrypt from 'bcryptjs';
import express from 'express';
import log from '@ajar/marker';
import raw from '../middleware/route.async.wrapper.mjs';
import sqlConnection from '../db/mysql.connection.mjs';
// import user_model from './user.model.mjs';
import { postSchema, putSchema } from './serverSchemValidator.mjs';
import {
  verify_token,
  false_response,
  tokenize,
} from '../middleware/auth.middleware.mjs';
const { DB_TABLE_NAME } = process.env;

const router = express.Router();

router.use(express.json());

//REGISTER
router.post(
  '/register',
  raw(async (req, res) => {
    // log.obj(req.body, 'register, req.body:');
    await postSchema.validateAsync(req.body);
    const { phone, first_name, last_name, email, country, password } = req.body;

    // console.log({ user: user[0]['insertId'] });
    const salt = await bcrypt.genSalt(10);
    // console.log({ salt });
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // console.log({ hashedPassword });
    const user = await sqlConnection.query(
      `INSERT INTO ${DB_TABLE_NAME}(phone, first_name, last_name, email, country, password) VALUES( ${phone},"${first_name}","${last_name}", "${email}", "${country}", "${hashedPassword}") ;`
    );
    // log.info('hashedPassword:', hashedPassword);
    // const user_data = {
    //   ...req.body,
    //   password: hashedPassword,
    // };
    // create a user
    // const created_user = await user_model.create(user_data);
    // log.obj(created_user, 'register, created_user:');

    // create a token
    const token = tokenize(user[0]['insertId']);
    // console.log({ token });

    // log.info('token:', token);

    return res.status(200).json({
      auth: true,
      token,
      //   user: created_user,
    });
  })
);

//LOGIN
router.post(
  '/login',
  raw(async (req, res) => {
    //extract from req.body the credentials the user entered
    const { email, password } = req.body;
    console.log(email, password);
    //look for the user in db by email
    // const user = await user_model.findOne({ email });
    const user = await sqlConnection.query(
      `SELECT * FROM ${DB_TABLE_NAME} WHERE email = "${email}";`
    );
    console.log({ user: user[0][0] });

    //if no user found...
    if (!user) {
      return res
        .status(401)
        .json({ ...false_response, message: 'wrong email or password' });
    }
    // check if the password is valid
    console.log({ PASSWORD: user[0][0].password });
    const password_is_valid = await bcrypt.compare(
      password,
      user[0][0].password
    );
    if (!password_is_valid) {
      return res
        .status(401)
        .json({ ...false_response, message: 'wrong email or password' });
    }
    console.log('HERE');

    // if user is found and password is valid
    // create a fresh new token
    const token = tokenize(user[0][0].id);

    // return the information including token as JSON
    return res.status(200).json({
      auth: true,
      token,
    });
  })
);

router.get(
  '/logout',
  raw(async (req, res) => {
    return res.status(200).json(false_response);
  })
);

router.get(
  '/me',
  verify_token,
  raw(async (req, res) => {
    const user = await sqlConnection.query(
      `SELECT * FROM ${DB_TABLE_NAME} WHERE id = ${req.user_id};`
    );
    if (!user) return res.status(404).json({ message: 'No user found.' });
    res.status(200).json(user[0][0]);
  })
);

export default router;
