import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCartSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import _ from "lodash";
import { search_api } from "../Services/Operations/ProductAPI";
import "../Style/Navbar.css";
import TableLinksPage from "../Pages/TableLinksPage";

const Navbar = () => {
  const { totalItem } = useSelector((state) => state.cart);
  const { loginData } = useSelector((state) => state.user);
  const [mobileIcon, setMobileIcon] = useState(false);
  const [query, setQuery] = useState("");
  const [restaurent, setRestaurent] = useState([]);
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);


  const navigate = useNavigate();

  const handlerIcon = () => {
    setMobileIcon((prev) => !prev);
  };

  const debouncedSearch = useCallback(
    _.debounce(async (searchQuery) => {
      if (searchQuery.trim() === "") {
        setRestaurent([]);
        setProduct([]);
        return;
      }
      setError(null);
      try {
        const formData = new FormData();
        formData.append("query", searchQuery);
        const response = await search_api(formData);
        if (response.success === true) {
          setProduct(response.data.category || []);
          setRestaurent(response.data.restaurant || []);
        } else {
          setRestaurent([]);
          setProduct([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("An error occurred while searching. Please try again.");
      }
    }, 300),
    [loginData]
  );

  const handleSearch = (text) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const handleItemClick = (item, type) => {
    if (type === "product") {
    navigate(`/restaurent-all-product?Id=${item.id}`);
    } else if (type === "restaurent") {
    navigate(`/restaurant-listing?Id=${item.id}`);
    }
  };

  return (
    <div className="navbar-wrapper">
      <div className="navbar-section-container">
        <div className="navbar-container">
          <div className="navbar-image">
            <Link className="navbar-image-link" to="/">
              <img
                src="Assets/img/favicons/LOGO-OF-GAIN-1.png"
                alt="logo"
                width="60"
              />
              <span className="navbar-span">Gain</span>
            </Link>
          </div>
          <div
            className={`${
              mobileIcon ? "main-nav mobile-main-nav" : "main-nav"
            }`}
          >
            <div
              className={`${
                mobileIcon
                  ? "navbar-input-button mobile-navbar-input-button"
                  : "navbar-input-button"
              }`}
            >
              <IoSearch className="navbar-icon" />
              <input
                className="navbar-input-button1"
                type="text"
                placeholder="Search Food"
                name="search"
                id="search"
                onChange={(e) => handleSearch(e.target.value)}
                value={query}
              />
              {!loginData ? (
                <Link className="mobile-food-btn" to="/login">
                  <button type="submit">
                    <FaUser className="navbar-input-button2" /> Login
                  </button>
                </Link>
              ) : (
                <Link
                  style={{ textDecoration: "none" }}
                  className="user-profile"
                  to="/profile"
                >
                  <FaUser />
                  <span style={{ marginLeft: "10px" }}>Profile</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {query && (restaurent.length > 0 || product.length > 0) && (
          <div className="search-results-dropdown">
            <ul>
              {product.map((item) => (
                <li
                  key={item.id}
                  className="search-result-item"
                  onClick={() => handleItemClick(item, "product")}
                >
                  <img src={item.icon} alt={item.name} className="item-image" />
                  <div>
                    <p>{item.name}</p>
                    {/* <span>Price : {item.price}</span> */}
                  </div>
                </li>
              ))}
              {restaurent.map((item) => (
                <li
                  key={item.id}
                  className="search-result-item"
                  onClick={() => handleItemClick(item, "restaurent")}
                >
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div>
                    <p>{item.name}</p>
                    <span>Restaurent</span><br/>
                    <span>Ratings : {item.rating}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="navbar-cart-menu">
          <Link style={{ position: "relative" }} to="/cart">
            <IoCartSharp
              className="navbar-link-cart-total"
              style={{ fontSize: "25px", color: "black", marginRight: "20px" }}
            />
            {totalItem > 0 && <div className="nav-total">{totalItem}</div>}
          </Link>
      
          <button
            className="navbar-table-btn"
            onClick={() => setShowTableModal(true)}
          >
            Choose Your Table
          </button>
          {showTableModal && (
          <TableLinksPage onClose={() => setShowTableModal(false)} />
        )}


          <div className="navbar-menu-icon" onClick={handlerIcon}>
            <GiHamburgerMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
