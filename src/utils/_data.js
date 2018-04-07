import axios from 'axios'
import utils from './index'

const handleError = ( error ) => {

  throw ( error )

}


// const apiRequest = ( endpoint, params, method ) => {
//
//   const body = params
//   debugger
//   const options = {
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       Authorization: '',
//     },
//   }
//
//   if ( method === 'GET' ) {
//
//     delete options.body
//
//   }
//
//   options.url = endpoint;
//   return axios(endpoint,params)
// }
//
//
const Service = {

  // login(data) {
  //
  //   const url = utils.getURL()
  //   return apiRequest( url, data )
  //
  // },
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
  const res = await axios.post(url, data)
  return res.data;
}

export async function getBankTransactions() {
  const url = utils.getURL('bank');
  const res = await axios.get(url)
  return res.data;
}

export async function delBankTransaction(transactionId) {
  const url = utils.getURL(`bank/${transactionId}`);
  const res = await axios.delete(url)
  return res || [];
}

export async function getUsers() {
  const url = utils.getURL( `usernames` );
  const res = await axios.get(url)
  return res || [];
}

export async function getTasks() {
  const url = utils.getURL( `tasks` );
  const res = await axios.get(url)
  return res || [];
}

export async function updateBankTransaction(data) {
  const url = utils.getURL('bank/update');
  const res = await axios.post(url, data)
  return res;
}

export default Service
