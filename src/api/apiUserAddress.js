import axiosInstance from "./axios";

const apiUserAddress = {
    create: (data) => {
        return axiosInstance.post("/user/create-user-address", data);
    },

    getDefault: (header) => {
        return axiosInstance.get("/user/default-address/", header);
    },
}

export default apiUserAddress;