import axiosInstance from "./axios";

const apiProduct = {

  createProduct: (data) => {
    return axiosInstance.post(`/products`, data)
  },

  deleteProductById: (id) => {
    return axiosInstance.delete(`/products/${id}`);
  },

  getAll: () => {
    return axiosInstance.get("/products?populate=*");
  },

  getProductPagination: (page, perPage) => {
    return axiosInstance.get(`products?page=${page}&perPage=${perPage}`);
  },

  getOne: (id) => {
    return axiosInstance.get(`/products/${id}`)
  }, 

  getProductById: (id) => {
    return axiosInstance.get(`/products/${id}`);
  },

  getProductByCatId: (catid, page) => {
    return axiosInstance.get(`products/categories/${catid}?page=${page}`);
  },

  getNewestTopSelling: (query) => {
    return axiosInstance.get(`/products/${query}`);
  },

  getMostView: () => {
    return axiosInstance.get("/products");
  },

  getProductBySearch: (name) => {
    return axiosInstance.get(`/products/search/${name}`);
  },
  
  editProduct: (id, product) => {
    return axiosInstance.put(`/products/${id}`, product);
  },

  
}

export default apiProduct;