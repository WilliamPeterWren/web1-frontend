import axiosInstance from "./axios";

const apiShoppingCart = {
    // create
    addToCart: (data, header) => {
        return axiosInstance.post("/product/cart-list", data, header);
    },

    getAll: (header) => {
        return axiosInstance.get("/product/cart-list",header);
    },

    getOne: (id, header) => {
        return axiosInstance.get(`/product/cart-list/${id}`,header);
    }, 

    getCartGuest: (data) => {
        return axiosInstance.get("/product/cart-list/guest",data);
    },

    deleteCartById: (id, header) => {
        return axiosInstance.delete(`/product/cart-list/${id}`, header);
    },

    updateCartById: (id, data, header) => {
        return axiosInstance.put(`/product/cart-list/${id}`, data, header);
    },

    deleteAllCart: (header) => {
        return axiosInstance.delete(`/product/cart-list`, header);
    },

}

export default apiShoppingCart;