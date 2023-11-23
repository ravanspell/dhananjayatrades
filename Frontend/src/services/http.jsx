import axios from "axios";

export const baseUrl = 'http://ceylontearepo.com/';  // "http://dhananjayatrades.com/";  'http://ceylontearepo.com/';  "http://localhost:8080/"; 

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

export const getOrderHistory = (page, rowsPerPage, params) => {
  let url =  `${baseUrl}api/orders/hostory/${page}/${rowsPerPage}`;
  if(params){
    url = url + params;
  }
  return get(url);
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
//     return get(`${baseUrl}api/dashboard/profit`);
//   };

//-------------- categories ---------------//

export const getCategories = () => {
  return get(baseUrl + `api/catagories/all`);
};

//-------------- customers ---------------//
export const addCustomer = (data) => {
  return post(baseUrl + "api/customers", data);
};

export const customers = () => {
  return get(baseUrl + `api/customers`);
};

export const searchCustomer = (customer) => {
  return get(baseUrl + `api/customers/search?search=${customer}`);
};

//---------------Socket Io ----------------//
export const sendOrdersToKitchen = (data) => {
  return post(baseUrl + `api/orders/pin`, data);
};

export const getOrdersToKitchen = () => {
  return get(baseUrl + `api/orders/kitchen`);
};