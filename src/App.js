import './App.css';
import {Routes,Route} from "react-router"
import Home from "./Component/Pages/Home"
// import About from './Component/Pages/About';
import Login from "./Component/Pages/Login"
import Signup from "./Component/Pages/Signup"
import Profile from './Component/Pages/Profile';
import Cart from './Component/Pages/Cart'
import Checkout from './Component/Pages/Checkout'
import Product from './Component/Pages/Product'
import { ResturentPoduct } from './Component/Pages/ResturentPoduct';
import AddAddress from './Component/Profile/AddAddress';
import { OrderDetails } from './Component/Profile/OrderDetails';
import ForgotPassward from './Component/Pages/ForgotPassward';
import ResturentList from './Component/Pages/ResturentList';
import PrivacyPolicy from './Component/Pages/PrivacyPolicy';
import ContactUs from './Component/Pages/ContactUs';
import TableLinksPage from './Component/Pages/TableLinksPage';
import TableWiseProductPage from './Component/Pages/TableWiseProductPage';
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        {/* <Route path='/about' element={<About/>}/> */}
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/product-listing' element={<Product/>}/>
        <Route path='/restaurant-listing' element={<ResturentPoduct/>}/>
        <Route path='/add-address' element={<AddAddress/>}/>
        <Route path='/order-details' element={<OrderDetails/>}/>
        <Route path='/forgot-password' element={<ForgotPassward/>}/>
        <Route path='/restaurent-all-product' element={<ResturentList/>}/>
        <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
        <Route path='/contact' element={<ContactUs/>}/>
        <Route path="/table-links" element={<TableLinksPage />} />
        <Route path="/table/:id" element={<TableWiseProductPage />} />

      </Routes>
    </div>
  );
}

export default App;
