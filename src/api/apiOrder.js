import axiosInstance from "./axios";

const apiOrder = {
    create: (data, header) => {
        return axiosInstance.post("/order", data, header);
    },

}

export default apiOrder;