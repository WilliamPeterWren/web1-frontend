import axiosInstance from "./axios";

const apiWishlist = {
    // create
    addToWishlist: (data, header) => {
        return axiosInstance.post("/product/wishlist", data, header);
    },

    getWishListByPagination: (page, header) => {
        return axiosInstance.get(`/product/wishlist?page=${page}`, header);
    },

    getAll: (header) => {
        return axiosInstance.get(`/product/wishlist`, header);
    },

    deleteWishListById: (id, header) => {
        return axiosInstance.delete(`/product/wishlist/${id}`, header);
    },
}

export default apiWishlist;