import { useEffect, useContext } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  redirect,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import WebLayout from "./layouts/WebLayout";
import Home from "./components/web/home/Home";
import Login from "./components/web/Auth/Login";
import Register from "./components/web/Auth/Register";
import ClassifyUser from "./components/web/Auth/ClassifyUser";
import Cart from "./components/web/cart/Cart";
import OrderDetails from "./components/web/cart/OrderDetailsDialog";
import DashboardLayout from "./layouts/DashboardLayout";
import MainLayout from "./layouts/Layout";
import DashboardHome from "./components/dashboard/home/Home";
import ProductsList from "./components/dashboard/products/ProductsList";
import UpdateProduct from "./components/dashboard/products/UpdateProduct";
import CreateProduct from "./components/dashboard/products/CreateProduct";
import PageNotFound from "./components/pages/PageNotFound";
import UserAccountPage from "./components/web/user/UserAcountPage";
import PersonalInfo from "./components/web/user/PersonalInfo";
import OrdersInfo from "./components/web/user/OrdersInfo";
import SendCode from "./components/web/Auth/SendCode";
import ForgetPassword from "./components/web/Auth/ForgetPassword";
import FavoriteProducts from "./components/web/user/Favorites.jsx";
import ProductDetails from "./components/web/products/ProductDetails.jsx";
import CustomerList from "./components/dashboard/customers/CustomerList.jsx";
import CustomerOrders from "./components/dashboard/customers/CustomerOrders.jsx";
import Categories from "./components/dashboard/categories/Categories.jsx";
import Products from "./components/web/products/Products";
import OrdersList from "./components/dashboard/orders/OrdersList.jsx";
import UpdateOrderDialog from "./components/dashboard/orders/UpdateOrderDialog.jsx";
import "./index.css";

import Coupons from "./components/dashboard/coupons/Coupons.jsx";
import UpdateCouponDialog from "./components/dashboard/coupons/UpdateCouponDialog.jsx";
import CreateCouponDialog from "./components/dashboard/coupons/CreateCouponDialog.jsx";

import { LoginContext } from "./contexts/LoginContext.jsx";

import { authenticate } from "./utils/requireAuth.js";
import { checkLoginStatus, checkToken } from "./utils/checkUserStatus.js";
import SearchProducts from "./components/web/products/SearchProducts.jsx";
import CreateCategory from "./components/dashboard/categories/CreateCategory.jsx";
import UpdateCategory from "./components/dashboard/categories/UpdateCategory.jsx";
import ConfirmOrder from "./components/dashboard/orders/ConfirmOrder.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="/" element={<WebLayout />}>
        <Route index element={<Home />} />
        <Route path="auth" loader={() => checkToken()}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="cls" element={<ClassifyUser />} />
          <Route path="send-code" element={<SendCode />} />
          <Route path="forget-password" element={<ForgetPassword />} />
        </Route>

        <Route path="cart" element={<Cart />} loader={() => checkLoginStatus()}>
          <Route path="order-details" element={<OrderDetails />} />
        </Route>

        <Route path="/:subcategorySlug/:categorySlug" element={<Products />} />
        <Route path="/:productSlug" element={<ProductDetails />} />
        <Route
          path="myFav"
          element={<FavoriteProducts />}
          loader={() => checkLoginStatus()}
        />
        <Route path="searchProducts" element={<SearchProducts />} />

        <Route
          path="user/profile"
          element={<UserAccountPage />}
          loader={() => checkLoginStatus()}
        >
          <Route index element={<PersonalInfo />} />
          <Route path="peronalInfo" element={<PersonalInfo />} />
          <Route path="orders" element={<OrdersInfo />} />
        </Route>
        <Route path="/:subcategorySlug/:categorySlug" element={<Products />}>
          <Route path=":productSlug" element={<ProductDetails />}></Route>
        </Route>

        <Route path="not-found" element={<PageNotFound />} />
      </Route>

      <Route
        path="order/confirmOrder/:id"
        element={<ConfirmOrder />}
        loader={() => checkLoginStatus()}
      />

      <Route
        path="/dashboard"
        element={<DashboardLayout />}
        loader={() => authenticate()}
      >
        <Route index element={<DashboardHome />} />
        <Route path="categories" element={<Categories />}>
          <Route path="create" element={<CreateCategory />} />
          <Route path="update/:slug" element={<UpdateCategory />} />
        </Route>

        <Route path="products">
          <Route index element={<ProductsList />} />
          <Route path="update/:id" element={<UpdateProduct />} />
          <Route path="create" element={<CreateProduct />} />
        </Route>

        <Route path="customers" element={<CustomerList />} />
        <Route
          path="customers/customerOrders/:customerId"
          element={<CustomerOrders />}
        />

        <Route path="orders" element={<OrdersList />}>
          <Route path="update/:id" element={<UpdateOrderDialog />} />
        </Route>

        <Route path="coupons" element={<Coupons />}>
          <Route path="update/:id" element={<UpdateCouponDialog />} />
          <Route path="create" element={<CreateCouponDialog />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Route>,
  ),
);

const queryClient = new QueryClient();

function App() {
  const { checkLoginStatus, userToken } = useContext(LoginContext);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // FIXME: redirect not working
  useEffect(() => {
    if (!userToken) redirect("/auth/login");
  }, [userToken]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
