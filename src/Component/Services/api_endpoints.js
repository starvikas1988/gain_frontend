const baseURL= "https://caterer.gainenterprises.in/backend/api/v1"
// const baseURL = "http://localhost:8000/api/v1";


//category endpoint
export const product_endpoint={
    PRODUCT_API:baseURL+"/getAllCategories",
    Particular_Product_API:baseURL+"/getAllProductByCategoryId",
    RECOMMENDATION_API:baseURL+"/getRecommendedProduct",
}

//feature resturents endpoint
export const resturent_endpoint={
    RESTURENT_API:baseURL+"/getAllRestaurant",
    RESTURENTProduct_API:baseURL+"/getAllProductByRestaurantIdWithFilter",
}

//feature popular endpoint
export const popular_endpoint={
    Popular_API:baseURL+"/most-popular-product",
}
//register endpoint
export const register_endpoint={
    register_API:baseURL+"/customer/register",
}

//login endpoint
export const login_endpoint={
    login_API:baseURL+"/customer/login",
    logOut_API:baseURL+"/customer/logout",
}

//cart endpoint
export const cart_endpoint={
    cart_add_API:baseURL+"/customer/addToCart",
    cart_DELETE_API:baseURL+"/customer/deleteCartById",
    cartOrder:baseURL+"/customer/getorderValueByCart",
}   

//update profile endpoint
export const update_profile_endpoint={
    update_profile_API:baseURL+"/customer/updateprofile",
    get_profile_API:baseURL+"/customer/profile",
    profileImageUpdate_API:baseURL+"/customer/updateprofileimg",
}

//check endpoint
export const check_endpoint={
    checkout_API:baseURL+"/checkout",
    coupon_API:baseURL+"/customer/applyCoupon",
}

//order history endpoint
export const history_endpoint={
    history_API:baseURL+"/orderHistory",
}
//Add address endpoint
export const Address_endpoint={
    AddAddress_API:baseURL+"/customer/addUserAddress",
    getAddress_API:baseURL+"/customer/getUserAddressList",
    updateAddress_API:baseURL+"/customer/updateUserAddress",
    deleteAddress_API:baseURL+"/customer/deleteUserAddress",
}
//Place Order endpoint
export const PlaceOrder_endpoint={
    PlaceOrder_API:baseURL+"/customer/placeOrder",
    PaymentAdd_API:baseURL+"/customer/paymentAdd",
    VerifyPayment_API:baseURL+"/customer/verifyPayments",
}
//Order list endpoint
export const OrderList_endpoint={
    OrderList_API:baseURL+"/customer/getOrderList",
    ParticularOrder_API:baseURL+"/customer/getOrderDetailById",

}

//forget passward endpoint
export const ForgetPassward_endpoint={
    forgetPassward_API:baseURL+"/forgotPassword",
}

//category by product endpoint
export const categoryProduct_endpoint={
    categoryProduct_API:baseURL+"/getAllRestaurantByCategoryId",
}

//Search by Product and restaurent
export const search_endpoint={
    search_endpoint_API:baseURL+"/searchProductOrRestaurant",
}

