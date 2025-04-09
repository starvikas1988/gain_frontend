import api from "../api";

import {
  product_endpoint,
  resturent_endpoint,
  popular_endpoint,
  register_endpoint,
  login_endpoint,
  cart_endpoint,
  update_profile_endpoint,
  check_endpoint,
  history_endpoint,
  Address_endpoint,
  PlaceOrder_endpoint,
  OrderList_endpoint,
  ForgetPassward_endpoint,
  categoryProduct_endpoint,
  search_endpoint
} from "../api_endpoints";
const { PRODUCT_API, Particular_Product_API, RECOMMENDATION_API } =
  product_endpoint;
const { RESTURENT_API, RESTURENTProduct_API } = resturent_endpoint;
const { Popular_API } = popular_endpoint;
const { register_API } = register_endpoint;
const { login_API, logOut_API } = login_endpoint;
const { cart_add_API,cart_DELETE_API,cartOrder} = cart_endpoint;
const { update_profile_API, get_profile_API,profileImageUpdate_API} = update_profile_endpoint;
const { checkout_API,coupon_API } = check_endpoint;
const { history_API } = history_endpoint;
const { AddAddress_API,getAddress_API,updateAddress_API,deleteAddress_API} = Address_endpoint;
const {PlaceOrder_API,PaymentAdd_API,VerifyPayment_API} = PlaceOrder_endpoint;
const {OrderList_API,ParticularOrder_API} = OrderList_endpoint;
const {forgetPassward_API} = ForgetPassward_endpoint;
const {categoryProduct_API} = categoryProduct_endpoint;
const {search_endpoint_API} = search_endpoint
//const baseURL= "https://caterer.gainenterprises.in/backend/api/v1";
const baseURL = "http://localhost:8000/api/v1";
export const fetchProduct = async () => {
  let result = [];
  try {
    const response = await api.post(
      PRODUCT_API,
      {},
    );
    console.log("Product: ", response);
    result = response.data;
  } catch (error) {
    console.error("GET_ALL_PRODUCT_API_ERROR..........", error);
  }
  return result;
};

export const fetchParticularProduct = async (data) => {
  let result = [];
  try {
    const response = await api.post(Particular_Product_API, data);
    result = response.data;
  } catch {
    console.log("GET_PARTICULAR_PRODUCT_API_ERROR..........");
  }
  return result;
};

export const fetchResturentProduct = async () => {
  let result = [];
  try {
    const response = await api.post(
      RESTURENT_API,
      {},
    );
    result = response.data;
  } catch {
    console.log("GET_PARTICULAR_PRODUCT_API_ERROR..........");
  }
  return result;
};

export const fetchRestaurentProductDetails = async (data) => {
  let result = [];
  try {
    const response = await api.post(RESTURENTProduct_API, data);
    result = response.data;
  } catch {
    console.log("GET_PARTICULAR_PRODUCT_API_ERROR..........");
  }
  return result;
};




export const fetchRecommendation = async () => {
  let result = [];
  try {
    const response = await api.post(
      RECOMMENDATION_API,
      {}
    );
    result = response.data;
  } catch {
    console.log("GET_PARTICULAR_PRODUCT_API_ERROR..........");
  }
  return result;
};

export const fetchPopularProduct = async () => {
  let result = [];
  try {
    const response = await api.get(Popular_API);
    result = response.data;
  } catch {
    console.log("GET_PARTICULAR_PRODUCT_API_ERROR..........");
  }
  return result;
};
export const register_data = async (data) => {
  let result = [];
  try {
    // console.log(">>>>>>>saifuddin<<<<<<<<<<<")
    const response = await api.post(register_API, data);
    result = response.data;
    // console.log("........................")
    return result;
  } catch (error) {
    console.log("GET_register_API_ERROR..........");
  }
};
export const login_data = async (data) => {
  let result = [];
  try {
    console.log(">>>>>>>saifuddin<<<<<<<<<<<");
    const response = await api.post(login_API, data);
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_login_API_ERROR..........");
  }
};

export const Coupon_data = async (data,token) => {
  let result = [];
  try {
    console.log(">>>>>>>saifuddin<<<<<<<<<<<");
    const response = await api.post(coupon_API, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Coupon Api : ",response)
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_login_API_ERROR..........");
  }
};

export const logoutProfile_data = async (token) => {
  let result = [];
  try {
    const response = await api.post(
      logOut_API,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true, // <-- Important for CORS and session/cookie handling
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........", error);
  }
};


export const cart_data = async (data, token) => {
  try {
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }
    const response = await api.post(
      cart_add_API,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.log("GET_cart_API_ERROR..........");
  }
};
export const getCart_data = async (user) => {
  try {
    console.log("user", user);
    // const { user_id } = user;
    // console.log("user",user_id);
    // console.log("user_id to fetch cart : ", user_id);
    const response = await api.get(`${cart_add_API}?user_id=${user}`);
    console.log("response popular cart data : ", response);
    return response;
  } catch (error) {
    console.log("GET_Allcart_API_ERROR..........");
  }
};

// export const getCart_data = async (userId) => {
//   try {
//     console.log("userId", userId);

//     const formData = new FormData();
//     formData.append("user_id", userId);

//     const response = await api.post(cart_add_API, formData);
//     console.log("response from cart data POST: ", response);
//     return response;
//   } catch (error) {
//     console.log("POST_getCart_API_ERROR..........", error);
//   }
// };

export const cart_delete = async (data,token) => {
  try {
    const response = await api.post(cart_DELETE_API,data,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Saifuddin.........mondal....");
    return response;
  } catch (error) {
    console.log("GET_cartUpdate_API_ERROR..........");
  }
};
export const update_profile = async (data, token) => {
  try {
    console.log("update data: ", data);
    const response = await api.post(update_profile_API, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log("GET_update_profile_API_ERROR..........", error);
  }
};

export const get_profile = async (token) => {
  let result = [];
  try {
    const response = await api.post(
      get_profile_API,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Profile : ", response);
    result = response.data;
  } catch (error) {
    console.error("GET_ALL_PRODUCT_API_ERROR..........", error);
  }
  return result;
};

export const get_checkout = async (data) => {
  try {
    console.log("Rana", data);
    const response = await api.post(checkout_API, data);
    console.log("Rana", response);
    return response;
  } catch (error) {
    console.log("GET_update_profile_API_ERROR..........");
  }
};
export const get_order_history = async (user) => {
  try {
    console.log(user);
    const user_id = user.user_id;
    console.log("order_history", user);
    const response = await api.get(`${history_API}?user_id=${user_id}`);
    console.log("Rana", user);
    return response;
  } catch (error) {
    console.log("GET_update_profile_API_ERROR..........");
  }
};

export const newAddressAdd = async (data,token) => {
  let result = [];
  try {
    console.log(">>>>>>>saifuddin<<<<<<<<<<<");
    const response = await api.post(
      AddAddress_API,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........");
  }
};

export const getAddressAdd = async (token) => {
  let result = [];
  try {
    console.log(">>>>>>>saifuddin<<<<<<<<<<<");
    const response = await api.post(
      getAddress_API,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........");
  }
};

export const updateAddress = async (data,token) => {
  let result = [];
  try {
    console.log(">>>>>>>saifuddin<<<<<<<<<<<");
    const response = await api.post(
      updateAddress_API,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........");
  }
};

export const deleteAddress = async (data,token) => {
  let result = [];
  try {
    console.log(">>>>>>>saifuddin<<<<<<<<<<<");
    const response = await api.post(
      deleteAddress_API,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........");
  }
};

export const PlaceOrder = async (data,token) => {
  let result = [];
  try {
    console.log(">>>>>>>saifuddin<<<<<<<<<<<");
    const response = await api.post(
      PlaceOrder_API,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........");
  }
};

export const PaymentAdd = async (data,token) => {
  let result = [];
  try {
    console.log("data : ",data);
    const response = await api.post(
      PaymentAdd_API,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........");
  }
};

export const orderValidate = async (data,token) => {
  let result = [];
  try {
    console.log("data : ",data);
    const response = await api.post(
      VerifyPayment_API,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........");
  }
};

export const orderList = async (token) => {
  let result = [];
  try {
    const response = await api.post(
      OrderList_API,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........");
  }
};

export const particularOrder = async (data,token) => {
  let result = [];
  try {
    const response = await api.post(
      ParticularOrder_API,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........");
  }
};

export const update_profile_image = async (data,token) => {
  let result = [];
  try {
    const response = await api.post(
      profileImageUpdate_API,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........");
  }
};

export const forgetPasswardChange = async (email) => {
  let result = [];
  try {
    const response = await api.post(
      forgetPassward_API,
      email
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........");
  }
};

export const categoryProduct = async (data) => {
  let result = [];
  try {
    const response = await api.post(
      categoryProduct_API,
      data
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........");
  }
};

export const search_api = async (data) => {
  let result = [];
  try {
      console.log("Search name : ",data);
      const response = await api.post(search_endpoint_API,data);
      
      console.log("api search data : ", response);
      result = response.data;
  } catch (error) {
      //console.log("GET_PRODUCT_DETAILS_API_ERROR: ", error);
  }
  return result;
};

export const getorderCart = async (data,token) => {
  let result = [];
  try {
    const response = await api.post(
      cartOrder,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    result = response.data;
    return result;
  } catch (error) {
    console.log("GET_logOut_API_ERROR..........");
  }
};
