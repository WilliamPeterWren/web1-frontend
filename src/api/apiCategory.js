import axiosInstance from "./axios";

const apiCategory = {

  getAll: () => {
    return axiosInstance.get("/categories");
  },  

  getOne: (id) => {
    return axiosInstance.get(`/categories/${id}`);
  },

  getCategoryPagination: (page) => {
    return axiosInstance.get(`categories?page=${page}`);
  },

  createCategory: (category) => {
    return axiosInstance.post("/categories", category);
  },

  getCategoryById: (id) => {
    return axiosInstance.get(`/categories/${id}`);
  },

  editCategory: (id, category) => {
    return axiosInstance.put(`/categories/${id}`, category);
  },

  deleteCategoryById: (id) => {
    return axiosInstance.delete(`/categories/${id}`);
  },
}

export default apiCategory;