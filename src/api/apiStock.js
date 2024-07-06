import axiosInstance from "./axios";

const apiStock = {
    create: (data, header) => {
        return axiosInstance.post("/stocks", data, header);
    },

    getOne: (id) => {
        return axiosInstance.get(`/stocks/${id}`);
    }
}

export default apiStock;