import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const initialState = {
  orderState: Cookies.get("orderState")
    ? JSON.parse(Cookies.get("orderState"))
    : [],
  All_cart: Cookies.get("All_cart") ? JSON.parse(Cookies.get("All_cart")) : [],
  totalItem: Cookies.get("totalItem") ? Cookies.get("totalItem") : 0,
  total: Cookies.get("total") ? JSON.parse(Cookies.get("total")) : 0,
};

export const Cart_system = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCart: (state, action) => {
      const newCartItems = action.payload; 
      console.log("newCartItems : ", newCartItems);
      newCartItems.forEach(newCartItem => {
        const existingCartIndex = state.All_cart.findIndex(
          (item) =>
            item.restaurant_id === newCartItem.restaurant_id &&
            item.product_id === newCartItem.product_id
        );
    
        if (existingCartIndex !== -1) {
          state.All_cart[existingCartIndex].qty = newCartItem.qty;
        } else {
          state.All_cart.push(newCartItem);
        }
      });
    
      state.totalItem = state.All_cart.length;
      state.total = state.All_cart.reduce(
        (acc, item) => acc + item.product_price * item.qty, 
        0
      );
    
      // Save to cookies
      Cookies.set("All_cart", JSON.stringify(state.All_cart));
      Cookies.set("totalItem", state.totalItem);
      Cookies.set("total", JSON.stringify(state.total));
    
      console.log("Updated All_cart:", state.All_cart);
    },
    
    deleteAllCart: (state) => {
      console.log("delete cart..........")
      state.All_cart = [];
      state.orderState = [];
      state.totalItem=0;
      state.total=0;
      Cookies.set("All_cart", JSON.stringify(state.All_cart));
      Cookies.set("orderState", JSON.stringify(state.orderState));
      Cookies.set("totalItem", state.totalItem);
      Cookies.set("total", JSON.stringify(state.total));
      console.log("All cart cleared");
    },

    removeCart: (state, action) => {
      const { restaurant_id, product_id } = action.payload;
      state.All_cart = state.All_cart.filter(
        (item) =>
          item.restaurant_id !== restaurant_id || item.product_id !== product_id
      );
      state.totalItem = state.All_cart.length;
      state.total = state.All_cart.reduce(
        (acc, item) => acc + item.product.price * item.qty,
        0
      );
      const restaurantIdAsString = String(restaurant_id);
      state.orderState = state.orderState.filter(
        (item) =>
          item.restaurant_id !== restaurantIdAsString || item.product_id !== product_id
      );
      Cookies.set("All_cart", JSON.stringify(state.All_cart));
      Cookies.set("orderState", JSON.stringify(state.orderState));
      Cookies.set("totalItem", state.totalItem);
      Cookies.set("total", JSON.stringify(state.total));
      toast.success("Item removed from cart");
    },
    
    addOrder: (state, action) => {
      const { restaurant_id, product_id, qty, table_id = null } = action.payload;
      const restaurantIdAsString = String(restaurant_id);
      const tableIdAsString = table_id !== null ? String(table_id) : null;
    
      const existingOrderIndex = state.orderState.findIndex((item) => {
        const isSameRestaurant = item.restaurant_id === restaurantIdAsString;
        const isSameProduct = item.product_id === product_id;
        const isSameTable = tableIdAsString ? item.table_id === tableIdAsString : true;
    
        return isSameRestaurant && isSameProduct && isSameTable;
      });
    
      if (existingOrderIndex !== -1) {
        state.orderState[existingOrderIndex].qty = qty;
      } else {
        const newItem = {
          restaurant_id: restaurantIdAsString,
          product_id,
          qty,
        };
    
        if (tableIdAsString) {
          newItem.table_id = tableIdAsString;
        }
    
        state.orderState.push(newItem);
      }
    
      state.totalItem = state.orderState.length;
    
      Cookies.set("orderState", JSON.stringify(state.orderState));
      Cookies.set("totalItem", state.totalItem);
    },
    

    // addOrder: (state, action) => {
    //   const { restaurant_id, product_id, qty } = action.payload;
    //   const restaurantIdAsString = String(restaurant_id);
    //   console.log("restaurant_id : ",restaurantIdAsString)
    //   console.log("product_id : ",product_id)
    //   console.log("state.orderState : ",product_id)
    //   const existingOrderIndex = state.orderState.findIndex(
    //     (item) =>
    //       item.restaurant_id === restaurantIdAsString &&
    //       item.product_id === product_id
    //   );
    
    //   if (existingOrderIndex !== -1) {
    //     state.orderState[existingOrderIndex].qty = qty;
    //   } else {
    //     state.orderState.push({ restaurant_id :restaurantIdAsString, product_id, qty });
    //   }
    
    //   state.totalItem = state.orderState.length;
    
    //   Cookies.set("orderState", JSON.stringify(state.orderState));
    //   Cookies.set("totalItem", state.totalItem);
    // },
    

    removeOrder: (state, action) => {
      const { restaurant_id, product_id } = action.payload;
      console.log("restaurant_id : ",restaurant_id)
      console.log("product_id : ",product_id)
      state.orderState = state.orderState.filter(
        (item) =>
          item.restaurant_id !== restaurant_id || item.product_id !== product_id
      );
      console.log("orderState : ",state.orderState)
      state.totalItem = state.All_cart.length;
      Cookies.set("orderState", JSON.stringify(state.orderState));
      Cookies.set("totalItem", state.totalItem);
    },

    loadOrder: (state, action) => {
      const payload = action.payload;
      if (Array.isArray(payload)) {
        state.orderState = payload;
      } else {
        state.orderState = [];
      }
    },

    add_total: (state, action) => {
      state.total = action.payload;
      Cookies.set("total", JSON.stringify(state.total));
    },

    logout_Cart(state) {
      state.All_cart = [];
      state.orderState = [];
      state.totalItem = 0;
      state.total = 0;

      Cookies.set("All_cart", JSON.stringify(state.All_cart));
      Cookies.set("orderState", JSON.stringify(state.orderState));
      Cookies.set("totalItem", state.totalItem);
      Cookies.set("total", JSON.stringify(state.total));
    },
  },
});

export const {
  addOrder,
  removeOrder,
  loadOrder,
  add_total,
  addCart,
  logout_Cart,
  removeCart,
  deleteAllCart,
} = Cart_system.actions;

export default Cart_system.reducer;
