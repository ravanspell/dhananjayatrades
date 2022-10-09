import axios from "axios";

const baseUrl = "http://localhost:3800/"; // "http://dhananjayatrades.com/"; 

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

//------------orders ----------------------------//
export const addOrder = (orderData) => {
  return post(baseUrl + "api/orders/add", orderData);
};

export const searchOrders = (tearm) => {
  return get(baseUrl + `api/orders/search/all/${tearm}`);
};

export const getOrderHistory = (page, rowsPerPage) => {
  return get(baseUrl + `api/orders/hostory/${page}/${rowsPerPage}`);
};

export const getOldOrder = (orderId) => {
  return get(baseUrl + `api/orders/${orderId}`);
};

//------------------------------------------------
//------------Items ----------------------------//
export const getItemData = (page, rowsPerPage) => {
  return get(baseUrl + `api/items/all/${page}/${rowsPerPage}`);
};

export const removeStockItem = (itemId) => {
  return remove(baseUrl + `api/items/delete`, itemId);
};

export const itemSearch = (tearm) => {
  return get(baseUrl + `api/items/search/all/${tearm}`);
};

export const saveItem = (itemData) => {
  return post(baseUrl + "api/items/save", itemData);
};

export const loadSearchItems = () => {
  return get(baseUrl + `api/items/search`);
};
//------------------------------------------------
//------------ Dashboard API ---------------//

// export const getProfitStatus = (page, rowsPerPage) => {
//     return get(baseUrl + `api/items/all/${page}/${rowsPerPage}`);
//   };

//-------------- categories ---------------//

export const getCategories = () => {
  return get(baseUrl + `api/catagories/all`);
};
