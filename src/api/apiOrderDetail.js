import axiosInstance from "./axios";

const apiOrderDetail = {
    create: (data, header) => {
        return axiosInstance.post("/orderdetail", data, header);
    },

}

export default apiOrderDetail;