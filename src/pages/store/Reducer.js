import { toast } from "react-toastify";

const initialState = {
    user_data: {},
    show_modal: false,
    toast_message: "",
    product_id: 0,
    cart_count: 0,
    wishlist_count: 0,
    toast_count: 0,
};

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case "USER_DATA":
            return {
                ...state,
                user_data: action.value,
            };
        case "MODAL_CONTROL":
            return {
                ...state,
                show_modal: action.value,
            };
        case "LOGIN_CONTROL":
            return {
                ...state,
                show_login: action.value,
            };
        case "QUICKVIEW_CONTROL":
            return {
                ...state,
                product_id: action.value,
                show_modal: true,
            };
        case "CART_COUNT":
            return {
                ...state,
                cart_count: action.value,
            };
        case "WISHLIST_COUNT":
            return {
                ...state,
                wishlist_count: action.value,
            };
        case "SHOW_TOAST":
            toast.success(`${action.value}`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: {
                        top: "-50%",
                        transform: "translateY(50%)",
                        marginRight: "2%",
                        width: "fit-content",
                    },
                });
            return {
                ...state,
                toast_show: action.value,
                toast_state: true,
            };
        case "HIDE_TOAST":
            return {
                ...state,
                toast_show: false,
            };
        default:
            return state;
    }
};

export default Reducer;