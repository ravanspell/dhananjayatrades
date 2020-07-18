import axios from "axios";

const baseUrl = "http://dhananjayatrades.com/"; //http://localhost:3800/

const get = (url, params = {}) => {
  return axios.get(url);
};

const post = (url, data) => {
  return axios.post(url, data);
};

const remove = (url, data) => {
  return axios.delete(url, data);
};

export const sendLogin = (userData) => {
  return post(baseUrl + "api/user/login", userData);
};

export const addOrder = (orderData) => {
  return post(baseUrl + "api/orders/add", orderData);
};

export const getItemData = (page, rowsPerPage) => {
  return get(baseUrl + `api/items/all/${page}/${rowsPerPage}`);
};

export const removeStockItem = (itemId) => {
  return remove(baseUrl + `api/items/delete`, itemId);
};

export const saveItem = (itemData) => {
  return post(baseUrl + "api/items/save", itemData);
};

export const loadSearchItems = () => {
  return get(baseUrl + `api/items/search`);
};

//------------ Dashboard API ---------------//

// export const getProfitStatus = (page, rowsPerPage) => {
//     return get(baseUrl + `api/items/all/${page}/${rowsPerPage}`);
//   };
