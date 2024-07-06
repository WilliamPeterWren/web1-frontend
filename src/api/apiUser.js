import axiosInstance from "./axios";

const apiUser = {
    // create user
    createUser: (data) =>{
        return axiosInstance.post("/register", data);
    },

    loginUser: (data) =>{
        return axiosInstance.post("/login", data);
    },

    getOne: (id) => {
        return axiosInstance.get(`/users/${id}?populate=*`);
    },

    getAll: () => {
        return axiosInstance.get("/users?populate=*");
    },

    getAuth: (header) => {
        return axiosInstance.get("/auth", header);
    },
}

export default apiUser;