// import
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { LinkContainer } from "react-router-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import CartScreen from "../screens/CartScreen";
import HomeScreen from "../screens/HomeScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import OrderScreen from "../screens/OrderScreen";
import PaymentMethodScreen from "../screens/PaymentMethodScreen";
import PlaceOrderScreen from "../screens/PlaceOrderScreen";
import ProductListScreen from "../screens/ProductListScreen";
import ProductScreen from "../screens/ProductScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SignupScreen from "../screens/SignupScreen";
import ShippingAddressScreen from "../screens/ShippingAddressScreen";
import SigninScreen from "../screens/SigninScreen";
import ProductEditScreen from "../screens/ProductEditScreen";
import OrderListScreen from "../screens/OrderListScreen";
import UserListScreen from "../screens/UserListScreen";
import UserEditScreen from "../screens/UserEditScreen";
import SellerRoute from "../components/SellerRoute";
import SellerScreen from "../screens/SellerScreen";
import SearchBox from "./SearchBox";
import SearchScreen from "../screens/SearchScreen";
import DashboardScreen from "../screens/DashboardScreen";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import { Store } from "../Store";
import { getError } from "../utils";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEllipsisVertical,
  faCircleXmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

/* useContext - The main idea of using the context is to allow your components 
   to access some global data and re-render when that global data is changed.
*/

// main function
function MainRoute() {
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart, userInfo } = state;

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const { cartItems } = cart;

  const signoutHandler = () => {
    ctxDispatch({
      type: "USER_SIGNOUT",
    });

    // remove items from localStorage
    localStorage.removeItem(
      "userInfo" // pass parameter: 'userInfo'
    );
    localStorage.removeItem(
      "cartItems" // pass parameter: 'cartItems'
    );
    localStorage.removeItem(
      "shippingAddress" // pass parameter: 'shippingAddress'
    );
    localStorage.removeItem(
      "paymentMethod" // pass parameter: 'paymentMethod'
    );

    // redirect to signin page
    window.location.href = "/signin";
  };

  const [categories, setCategories] = useState(
    [] // pass a empty array
  );

  useEffect(
    () => {
      // define fetchCategories function (async function)
      const fetchCategories = async () => {
        try {
          const {
            data, // get data from backend
          } = await Axios.get(
            `/api/products/categories` // parameter
          );
          // call function
          setCategories(
            data // parameter
          );

          // if there is an error
        } catch (err) {
          // show toast error
          toast.error(
            getError(
              err // parameter of getError method
            )
          ); // parameter of error method
        }
      };
      fetchCategories();
    }, // 1st parameter
    [ctxDispatch] // 2nd parameter - array with ctxDispatch
  );

  sidebarIsOpen
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen // is defined
            ? // set className
              // 'site-container active-cont d-flex flex-column'
              "site-container active-cont d-flex flex-column"
            : // is not defined
              // set className
              "site-container d-flex flex-column"
        }
      >
        <Helmet>
          {/* render title */}
          <title>FootieShop</title>
        </Helmet>
        <ToastContainer
          position="bottom-center" /* set position */
          limit={1} /* set limit */
        />
        <header>
          <Navbar bg="" variant="" expand="lg">
            <Container>
              {/* SideBar Button */}
              <span
                className="fabars"
                onClick={() =>
                  setSidebarIsOpen(
                    !sidebarIsOpen // parameter
                  )
                }
              >
                <FontAwesomeIcon icon={faBars} />
              </span>
              <LinkContainer to="/">
                <Navbar.Brand>FootieShop</Navbar.Brand>
              </LinkContainer>

              <Navbar.Toggle aria-controls="basic-navbar-nav">
                <FontAwesomeIcon
                  className="faEllipsisVertical"
                  icon={faEllipsisVertical}
                />
              </Navbar.Toggle>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  {userInfo && userInfo.isSeller && (
                    <NavDropdown title="Seller" id="basic-nav-dropdown">
                      <LinkContainer to="/productlist/seller">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <LinkContainer to="/orderlist/seller">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="basic-nav-dropdown">
                      <LinkContainer to="/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <LinkContainer to="/productlist">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <LinkContainer to="/orderlist">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <LinkContainer to="/userlist">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}

                  <NavDropdown title="Brands" id="basic-nav-dropdown">
                    <LinkContainer to="/seller/63b319c984517d0f978e7ffe">
                      <NavDropdown.Item>Nike</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/seller/63b319da84517d0f978e8003">
                      <NavDropdown.Item>Adidas</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/seller/63b319e784517d0f978e8008">
                      <NavDropdown.Item>Puma</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>

                  <SearchBox />
                </Nav>
              </Navbar.Collapse>

              {userInfo ? (
                <NavDropdown
                  // add profile icon

                  title={
                    <span>
                      {userInfo.name + "  "}
                       <FontAwesomeIcon
                        className="fa-solid fa-user"
                        icon={faUser}
                      />
                    </span>
                  }
                  id="basic-nav-dropdown"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>User Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <LinkContainer to="/orderhistory">
                    <NavDropdown.Item>Order History</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Divider />
                  <Link
                    className="dropdown-item"
                    to="#signout"
                    onClick={signoutHandler}
                  >
                    Sign Out
                  </Link>
                </NavDropdown>
              ) : (
                <Link className="nav-link" to="/signin">
                  Sign In
                </Link>
              )}
              <Link to="/cart" className="nav-link">
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartItems.length > 0 && (
                  <span className="badge rounded-pill bg-danger">
                    {
                      //use reduce function to calculate accumulator (a) and current item (c)
                      // default value to accumulator is zero
                      cartItems.reduce((a, c) => a + c.quantity, 0)
                    }
                  </span>
                )}
              </Link>
            </Container>
          </Navbar>

          {/* side bar */}
          <hr className="" />
        </header>

        <div
          className={
            sidebarIsOpen /* sidebarIsOpen is defined */
              ? /* set className text */
                " active-nav side-navbar d-flex active-cont justify-content-between flex-wrap flex-column"
              : /* sidebarIsOpen is not defined */
                /* set className text */
                "side-navbar d-flex justify-content-between flex-wrap flex-column"
          }
        >
          {/* render Nav */}
          <Nav className="flex-column text-white w-100 p-2">
            {/* render Nav Item */}
            <Nav.Item>
              <span
                className="ml-4 fabars"
                onClick={() =>
                  setSidebarIsOpen(
                    !sidebarIsOpen // parameter
                  )
                }
              >
                <FontAwesomeIcon icon={faCircleXmark} />
              </span>
            </Nav.Item>
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main
          className="container mt-3"
          onClick={() => setSidebarIsOpen(false)}
        >
          {/* Routes */}
          <Routes>
            <Route path="/seller/:id" element={<SellerScreen />}></Route>
            <Route path="/cart" element={<CartScreen />}></Route>
            <Route path="/cart/:id" element={<CartScreen />}></Route>

            <Route path="/product/:id" element={<ProductScreen />}></Route>
            <Route
              path="/product/:id/edit"
              element={<ProductEditScreen />}
            ></Route>
            <Route path="/signin" element={<SigninScreen />}></Route>
            <Route path="/signup" element={<SignupScreen />}></Route>
            <Route path="/shipping" element={<ShippingAddressScreen />}></Route>
            <Route path="/payment" element={<PaymentMethodScreen />}></Route>
            <Route path="/placeorder" element={<PlaceOrderScreen />}></Route>
            <Route path="/order/:id" element={<OrderScreen />}></Route>
            <Route
              path="/orderhistory"
              element={<OrderHistoryScreen />}
            ></Route>
            <Route path="/search" element={<SearchScreen />}></Route>

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfileScreen />
                </PrivateRoute>
              }
            />

            <Route
              path="/productlist"
              element={
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>
              }
            />

            <Route
              path="/orderlist"
              element={
                <AdminRoute>
                  <OrderListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/userlist"
              element={
                <AdminRoute>
                  <UserListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/user/:id/edit"
              element={
                <AdminRoute>
                  <UserEditScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <DashboardScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/productlist/seller"
              element={
                <SellerRoute>
                  <ProductListScreen />
                </SellerRoute>
              }
            />
            <Route
              path="/orderlist/seller"
              element={
                <SellerRoute>
                  <OrderListScreen />
                </SellerRoute>
              }
            />

            <Route path="/" element={<HomeScreen />}></Route>
          </Routes>
        </main>

        <div className="text-center">
          <i className="fas fa-ellipsis-h"></i>
        </div>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}

// export
export default MainRoute;
