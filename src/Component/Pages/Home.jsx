import React, { useEffect, useState } from "react";
import Navbar from "../Core/Navbar";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../Style/Home.css";
import { MdAccessAlarms } from "react-icons/md";
import { FaTag } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import { FaAngleRight } from "react-icons/fa6";
import CardSection from "../Home/CardSection";
import Footer from "../Core/Footer";
// import { FaAngleLeft } from "react-icons/fa6";
import whatsapp from "../../assets/whatsapp-873316_1280.png";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { addOrder, removeOrder, loadOrder } from "../Redux/Cart-system";
import Cookies from "js-cookie";
import {
  cart_delete,
  fetchProduct,
  fetchRecommendation,
} from "../Services/Operations/ProductAPI";
import {
  fetchResturentProduct,
  fetchPopularProduct,
} from "../Services/Operations/ProductAPI";
import {
  cart_data,
  getCart_data,
} from "../Services/Operations/ProductAPI";
import {
  addCart,
  removeCart
} from "../Redux/Cart-system";

import { Commet } from "react-loading-indicators";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userId } = useSelector((state) => state.user);
  const users_id = localStorage.getItem("user_id");

  const image1 = [
    {
      src: "Assets/img/gallery/discount-item-1.png",
      // src: "../../../public/Assets/img/gallery/discount-item-1.png",
      alt: "Discount image",
      text: 15,
      text2: "Flat Hill Slingback",
    },
    {
      src: "Assets/img/gallery/discount-item-2.png",
      alt: "Discount image",
      text: 10,
      text2: "Ocean Blue Ring",
    },
    {
      src: "Assets/img/gallery/discount-item-3.png",
      alt: "Discount image",
      text: 25,
      text2: "Brown Wallet",
    },
    {
      src: "Assets/img/gallery/discount-item-4.png",
      alt: "Discount image",
      text: 30,
      text2: "Silver Wristwatch",
    },
  ];

  const data = [
    {
      text1: "Best deals",
      text2: "Crispy Sandwiches",
      text3:
        "Enjoy the large size of sandwiches. Complete your meal with the perfect slice of sandwiches.",
      btn: "Proceed to Order",
      src: "Assets/img/gallery/crispy-sandwiches.png",
      active: true,
    },
    {
      text1: "Celebrate parties with",
      text2: "Fried Chicken",
      text3:
        "Get the best fried chicken smeared with a lip smacking lemon chili flavor. Check out best deals for fried chicken.",
      btn: "Proceed to Order",
      src: "Assets/img/gallery/fried-chicken.png",
      active: false,
    },
    {
      text1: "Wanna eat hot &",
      text2: "spicy Pizza?",
      text3:
        "Pair up with a friend and enjoy the hot and crispy pizza pops. Try it with the best deals.",
      btn: "Proceed to Order",
      src: "Assets/img/gallery/pizza.png",
      active: true,
    },
  ];
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 530,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const settings1 = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 860,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 560,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const { orderState, totalItem } = useSelector((state) => state.cart);
  const { loginData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleOrder = async (product, qty = 1) => {
    console.log("product : ", product);
    if (loginData) {
      try {
        const token = loginData.access_token;
        const formData = new FormData();
         formData.append("restaurantId", product.restaurant_id);
        formData.append("productId", product.id);
        // formData.append("user_id", users_id);
        formData.append("qty", qty);

        const response = await cart_data(formData, token);
        console.log("response : ", response);
        if (response.data.success) {
          dispatch(
            addOrder({
              // restaurant_id: restaurantId,
              product_id: product.product_id,
              qty,
            })
          );
          dispatch(addCart(response.data.data));
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    } else {
      navigate("/login");
    }
  };
  const handleCountPositive = (product) => {
    const currentQty = getItemQuantity(product);
    handleOrder(product, currentQty + 1);
  };

  const handleCountNegative = (product) => {
    const currentQty = getItemQuantity(product);
    if (currentQty > 1) {
      handleOrder(product, currentQty - 1);
    } else {
      dispatch(
        removeOrder({
          // restaurant_id: String(restaurantId),
          product_id: Number(product.product_id),
        })
      );
      dispatch(
        removeCart({
          restaurant_id: product.restaurant_id,
          product_id: product.product_id,
        })
      );
    }
  };

  // const handleCountPositive = async (item) => {
  //     const user_id = userId.user_id;

  //     try {
  //         const response = await getCart_data(user_id);
  //         console.log("count positive1 : ", response);

  //         const cartItems = response.data.data;

  //         const cartItem = cartItems.find(cart => String(cart.prod_id) === String(item.id));
  //         console.log("matched1:", cartItem);

  //         if (cartItem) {
  //             let quant = cartItem.qty + 1;
  //             console.log(quant);

  //             const updateResponse = await cart_update(user_id, item.id, quant, item.prod_price);
  //             console.log("Count positive response : ", updateResponse);
  //             if (updateResponse.data.status === "success") {
  //                 // const response = await getCart_data(user_id);
  //                 fetchCartData1();
  //             }
  //         } else {
  //             console.log("Item not found in cart.");
  //         }
  //     } catch (error) {
  //         console.error("Error updating cart:", error);
  //     }
  // };

  // const handleCountNegative = async (item) => {
  //     const user_id = userId.user_id;

  //     try {
  //         const response = await getCart_data(user_id);
  //         console.log("count positive1 : ", response);

  //         const cartItems = response.data.data;

  //         const cartItem = cartItems.find(cart => String(cart.prod_id) === String(item.id));
  //         console.log("matched1:", cartItem);

  //         if (cartItem) {
  //             let quant = cartItem.qty - 1;
  //             if (quant <= 0) {
  //                 const response = await cart_delete(cartItem.id);
  //                 const id = cartItem.prod_id;
  //                 dispatch(removeOrder({ id }));
  //             }
  //             else {
  //                 console.log(quant);

  //                 const updateResponse = await cart_update(user_id, item.id, quant, item.prod_price);
  //                 console.log("Count positive response : ", updateResponse);
  //                 if (updateResponse.data.status === "success") {
  //                     // const response = await getCart_data(user_id);
  //                     fetchCartData1();
  //                 }
  //             }
  //         } else {
  //             console.log("Item not found in cart.");
  //         }
  //     } catch (error) {
  //         console.error("Error updating cart:", error);
  //     }
  // };

  useEffect(() => {
    const savedOrder = Cookies.get("orderState");
    if (savedOrder) {
      dispatch(loadOrder(JSON.parse(savedOrder)));
    }
  }, [dispatch]);

  const [response1, setResponse1] = useState([]);
  const [response_res, setResponse_res] = useState([]);
  const [popular_res, setPopular_res] = useState([]);
  const [popular_qty, setPopular_qty] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const result = await fetchProduct();
        const result1 = await fetchResturentProduct();
        // const result2 = await fetchPopularProduct();
        const result3 = await fetchRecommendation();
        console.log("Recommendation : ", result3);
        setResponse_res(result1.data);
        setPopular_res(result3.data);
        if (result && result.success === true) {
          setResponse1(result.data);
          console.log("DON ABJKSSDHJJGHF");
        } else {
          console.error("Failed to fetch product details:", result.message);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching productsamsdhbaj:", error);
        setLoading(false);
      }
    };
    loadProduct();
  }, []);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const user_id = userId.user_id;
        const response = await getCart_data(user_id);
        console.log("Cart Data in popular section", response.data.data);
        setPopular_qty(response.data.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCartData();
  }, []);

  const fetchCartData1 = async () => {
    try {
      const user_id = userId.user_id;
      const response = await getCart_data(user_id);
      console.log("Cart Data in popular section", response.data.data);
      setPopular_qty(response.data.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const getItemQuantity = (item) => {
    console.log("item", item);
    const qty_value = popular_qty;
    const cartItem = qty_value.find(
      (cart) => String(cart.prod_id) === String(item.id)
    );
    console.log("matched:", cartItem);
    if (cartItem) {
      console.log("match prod_id");
      return cartItem.qty;
    } else {
      return 0;
    }
  };

  const handleSlideClick = async (categoryId) => {
    // navigate(`/product-listing?Id=${categoryId}`);
    navigate(`/restaurent-all-product?Id=${categoryId}`);
  };

  const handleRestaurantClick = async (restaurantId) => {
    navigate(`/restaurant-listing?Id=${restaurantId}`);
  };

  const [viewButton, setViewButton] = useState(false);
  const itemsToShow = viewButton ? response_res.length : 8;
  const handleViewBtn = () => {
    setViewButton((prev) => !prev);
  };

  return (
    <>
      {loading ? (
        <div className="Loading-section1">
          <div className="commet-container">
            <Commet color="#32cd32" size="medium" text="" textColor="" />
            <p>Loading....</p>
          </div>
        </div>
      ) : (
        <div className="home-all-wrapper">
          <style>
            {`
                    .swiper-button-prev, .swiper-button-next {
                        top: 32px;
                        color: orangered;
                        font-weight: bolder;
                    }
                `}
          </style>
          <div className="home-whatsapp-wrapper">
            <Link to="https://wa.me/918670284546">
              <img
                className="whatsapp-img"
                src={whatsapp}
                width="50"
                alt="..."
              />
            </Link>
          </div>
          <div className="home-wrapper">
            <Navbar />
            <div className="home-container">
              <div className="home-deliver-add">
                <h1>Are you starving?</h1>
                <h4>
                  Within a few clicks, find meals
                  <span>that are accessible near you</span>
                </h4>
              </div>
              <div className="home-image">
                <img
                  src="Assets/img/gallery/hero-header.png"
                  alt="hero-header"
                />
              </div>
            </div>
          </div>
          <div className="home-item-container">
            <div className="home-item-wrapper">
              {image1.map((item, index) => (
                <div id={index} className="home-item-image">
                  <img src={item.src} alt={item.alt} />
                  <div className="home-background-color"></div>
                  <div className="home-item-off">
                    <h4>{item.text}</h4>
                    <div className="item-off">
                      <p>%</p>
                      <p>0ff</p>
                    </div>
                  </div>
                  <div className="home-item-text">
                    <h3>{item.text2}</h3>
                    <span>6 days Remaining</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="search-food-wrapper">
            <div className="search-food-section">
              <div className="search-section">
                <h4>Search by Food</h4>
              </div>
              <div
                className="search-container"
                // style={{
                //   display: "flex",
                //   alignItems: "center",
                //   justifyContent: "center",
                // }}
              >
                <Slider {...settings}>
                  {response1.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSlideClick(item.id)}
                      className="search-image-text"
                    >
                      <img
                        src={item.icon}
                        alt="..."
                        style={{ cursor: "pointer" }}
                      />
                      <p>{item.name}</p>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
          <div className="section2-container">
            <div className="section2-wrapper">
              <h4>Popular items</h4>
              <div className="section2-all-container">
                <Slider {...settings1}>
                  {popular_res.map((item, index) => (
                    <div key={index} className="section2-one-container">
                      <img
                        style={{ width: "100%", cursor: "pointer" }}
                        src={item.image}
                        alt="..."
                      />
                      <h5>{item.name}</h5>
                      {/* <p><FaMapMarkerAlt /> {item.text2}</p> */}
                      <p className="section2-span-rs">${item.price}</p>
                      {!orderState.some(
                        (cartItem) =>
                          Number(cartItem.product_id) ===
                            Number(item.product_id) 
                            // &&
                          // String(cartItem.restaurant_id) ===
                          //   String(restaurantId)
                      ) 
                      ? (
                        <button
                          className="section2-one-btn"
                          onClick={() => handleOrder(item)}
                        >
                          Order Now
                        </button>
                      ) : (
                        <div className="section-btn">
                          <button
                            className="section-add-sub"
                            onClick={() => handleCountNegative(item)}
                          >
                            -
                          </button>
                          <span>{getItemQuantity(item)}</span>
                          <span>{item.qty}</span>
                          <button
                            className="section-add-sub"
                            onClick={() => handleCountPositive(item)}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
          <div className="section2-container section3-container">
            <div className="section2-wrapper">
              <h4>Featured Restaurants</h4>
              <div className="section3-all-container">
                {response_res.slice(0, itemsToShow).map((item, index) => (
                  <div
                    id={index}
                    className="section3-one-container"
                    onClick={() => handleRestaurantClick(item.id)}
                  >
                    <img
                      className="section3-image"
                      src={item.image}
                      alt="..."
                      style={{ cursor: "pointer" }}
                    />
                    {/* <div className='section3-one-span'>
                                                    <span className='section3-one-span-1'><FaTag />20% off</span>
                                                    <span className='section3-one-span-2'><MdAccessAlarms />Fast</span>
                                                </div> */}
                    <div className="section3-image-text">
                      {/* <img src={item.logo} alt="..." /> */}
                      <div className="section3-text-span">
                        <span className="section3-span-3">{item.name}</span>
                        <span className="section3-span-4">
                          <IoIosStar />
                          {item.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="section3-view-btn">
                <button
                  style={{
                    backgroundColor: viewButton ? "orangered" : "orange",
                  }}
                  onClick={handleViewBtn}
                  className="section3-button-btn"
                >
                  {viewButton ? "View Less" : "View More"} <FaAngleRight />
                </button>
              </div>
            </div>
          </div>
          <div className="discounts-wrapper">
            <div className="discounts-contaner">
              <div className="discounts-image">
                <img
                  src="Assets/img/icons/discounts.png"
                  width="100"
                  alt="..."
                />
                <div className="quick-delivery">
                  <h4>Daily</h4>
                  <h4>Discounts</h4>
                </div>
              </div>
              <div className="discounts-image">
                <img
                  src="Assets/img/icons/live-tracking.png"
                  width="100"
                  alt="..."
                />
                <div className="quick-delivery">
                  <h4>Live</h4>
                  <h4>Tracking</h4>
                </div>
              </div>
              <div className="discounts-image">
                <img
                  src="Assets/img/icons/quick-delivery.png"
                  width="100"
                  alt="..."
                />
                <div className="quick-delivery">
                  <h4>Quick</h4>
                  <h4>Delivery</h4>
                </div>
              </div>
            </div>
            <div className="discounts-install">
              <div className="discounts-phone-image">
                <img src="Assets/img/gallery/phone-cta-one.png" alt="..." />
              </div>
              <div className="discounts-install1">
                <h1>Install the app</h1>
                <p>
                  It's never been easier to order food. Look for the finest{" "}
                  <span>
                    discounts and you'll be lost in a world of delectable food.
                  </span>
                </p>
                <div className="dis-imag">
                  <img
                    src="Assets/img/gallery/app-store.svg"
                    width="160"
                    alt="..."
                  />
                  <img
                    src="Assets/img/gallery/google-play.svg"
                    width="160"
                    alt="..."
                  />
                </div>
              </div>
            </div>
          </div>
          <CardSection data={data[0]} />
          <CardSection data={data[1]} />
          <CardSection data={data[2]} />
          <div className="section-order-proceed">
            <div className="section-order-text">
              <h1>
                Are you ready to order
                <br />
                <span>with the best deals?</span>
              </h1>
              <button>
                PROCEED TO ORDER <FaAngleRight />
              </button>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Home;
