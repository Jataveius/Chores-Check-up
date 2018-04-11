import axios from 'axios'
import utils from './index'

const config = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: utils.getCookie( 'auth' ) || '',
  },
}

export async function login(data) {
  const url = utils.getURL('user/login');
  const res = await axios.post(url, data)
  return res.data;
}

export async function logout() {
  localStorage.setItem('user', '');
  utils.eraseCookie(['auth', 'userId']);
  return true
}

export async function addBankTransaction(data) {
  const url = utils.getURL('bank');
  const res = await axios.post(url, data, config)
  return res.data;
}

export async function getBankTransactions() {
  const url = utils.getURL('bank');
  const res = await axios.get(url, config)
  return res.data;
}

export async function getUserBanks(username) {
  const url = utils.getURL(`bank/${username}`);
  const res = await axios.get(url, config)
  return res.data;
}

export async function delBankTransaction(transactionId) {
  const url = utils.getURL(`bank/${transactionId}`);
  const res = await axios.delete(url, config)
  return res || [];
}

export async function getUsers() {
  const url = utils.getURL( `usernames` );
  const res = await axios.get(url, config)
  return res || [];
}

export async function getTasks() {
  const url = utils.getURL( `tasks` );
  const res = await axios.get(url, config)
  return res || [];
}

export async function updateBankTransaction(data) {
  const url = utils.getURL('bank/update');
  const res = await axios.post(url, data, config)
  return res;
}

export async function getBooks() {
  const url = utils.getURL( `books` );
  const res = await axios.get(url, config)
  return res.data || [];
}

export async function getUserBooks() {
  const url = utils.getURL( `books/userbooks` );
  const res = await axios.get(url, config)
  return res.data || [];
}

export async function updateBook(data) {
  const url = utils.getURL( `books/update` );
  const res = await axios.post(url, data, config)
  return res;
}

export async function addUserBook(data) {
  const url = utils.getURL( `books` );
  const res = await axios.post(url, data, config)
  return res;
}

export async function deleteUserBook(bookId) {
  const url = utils.getURL( `books/${bookId}` );
  const res = await axios.delete(url, config)
  return res;
}

export async function removeUsers(userId) {
  const url = utils.getURL( `user/${userId}` );
  const res = await axios.delete(url, config)
  return res || [];
}

export async function addUser(data) {
  const url = utils.getURL( `register` );
  const res = await axios.post(url, data, config)
  return res;
}

export async function resetTask(data) {
  const url = utils.getURL( `tasks/reset` );
  const res = await axios.post(url, data, config)
  return res;
}

export async function addTask(data) {
  const url = utils.getURL( `tasks` );
  const res = await axios.post(url, data, config)
  return res;
}

export async function updateTask(data) {
  const url = utils.getURL( `tasks/update` );
  const res = await axios.post(url, data, config)
  return res;
}

export async function updateTaskCheckbox(data) {
  const url = utils.getURL( `tasks/checkbox` );
  const res = await axios.post(url, data, config)
  return res;
}

export async function delTask(taskId) {
  const url = utils.getURL(`tasks/${taskId}`);
  const res = await axios.delete(url, config)
  return res || [];
}

export async function getUserTasks(username) {
  const url = utils.getURL( `tasks/${username}` );
  const res = await axios.get(url, config)
  return res || [];
}

