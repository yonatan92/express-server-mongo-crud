import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 } from 'uuid';
// import { v4 } from 'uuid';

export const getAllUsers = async () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const users = await fs.readFile(
    path.resolve(__dirname, '../dbMock/users.json'),
    `utf-8`
  );
  return users;
};

export const writeUsereToDb = async (data) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const users = await fs.writeFile(
    path.resolve(__dirname, '../dbMock/users.json'),
    JSON.stringify(data)
  );
};

export const deleteUserById = async (id) => {
  const users = await getAllUsers();
  const parseUsers = JSON.parse(users);
  const updateUsers = parseUsers.filter((user) => user.userId != id);
  await writeUsereToDb(updateUsers);
};

export const getUserById = async (id) => {
  const users = await getAllUsers();
  const parseUsers = JSON.parse(users);
  const user = parseUsers.find((user) => user.userId == id);
  return user;
};

export const createNewUser = async (name) => {
  const users = await getAllUsers();
  const parseUsers = JSON.parse(users);
  console.log({ parseUsers });
  parseUsers.push({ userId: v4(), name });

  await writeUsereToDb(parseUsers);
};
