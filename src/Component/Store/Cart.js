import { configureStore } from '@reduxjs/toolkit'
import Cart_system from "../Redux/Cart-system"
import user_information from "../Redux/user_information"

export default configureStore({
  reducer: {
    cart:Cart_system,
    user:user_information,
  },
})