import { createRouter, createWebHistory } from "vue-router";
import RegistrationView from "@/views/Registration/registrationView.vue";
import confirmVerification from "@/views/Notifications/confirmVerificationView.vue";
import Login from "@/views/Login/loginView.vue";
import Startpage from "@/views/Startpage/startpageView.vue";
import MyData from "@/views/MyData/myDataView.vue";
import ListPersons from "@/views/ListPersons/listPersonsView.vue";
import Search from "@/views/Search/searchView.vue";
import VerifyNote from "@/views/Notifications/verifyNoteView.vue";
import jwt_decode from "jwt-decode";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/registration",
      name: "registration",
      component: RegistrationView,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/",
      name: "startpage",
      component: Startpage,
      meta: { requiresAuth: true },
    },
    {
      path: "/mydata",
      name: "mydata",
      component: MyData,
      meta: { requiresAuth: true },
    },
    {
      path: "/listpersons",
      name: "listpersons",
      component: ListPersons,
      meta: { requiresAuth: true },
    },
    {
      path: "/search",
      name: "search",
      component: Search,
      meta: { requiresAuth: true },
    },
    {
      path: "/listpersons/id/:id",
      name: "person",
      component: MyData,
      meta: { requiresAuth: true },
    },
    {
      path: "/searchResults",
      name: "searchResults",
      component: ListPersons,
      meta: { requiresAuth: true },
    },
    {
      path: "/verify",
      name: "VerifyNote",
      component: VerifyNote,
    },
    {
      path: "/Verification/id/:id/code/:code",
      name: "confirmVerification",
      component: confirmVerification,
    },
  ],
});

// navigation guard, check if user is loggedIn, verified and token is valid

router.beforeEach((to, from, next) => {
  const token = $cookies.get("token");
  if (to.meta.requiresAuth) {
    if (!token) {
      // User is not logged in, redirect to login page with a message
      alert("Login");
      next({ name: "login", query: { message: "Please log in." } });
    } else {
      const decoded = jwt_decode(token);
      const currentDate = Date.now() / 1000;

      if (decoded.verifyCode !== 1) {
        // User is not verified, redirect to login page with a message
        alert("Verify");
        next({
          name: "login",
          query: { message: "Please verify your account." },
        });
      } else if (decoded.exp < currentDate) {
        // Token has expired, redirect to login page with a message
        alert("Expired");
        next({
          name: "login",
          query: { message: "Session expired. Please log in again." },
        });
      } else {
        // User is authenticated and token is valid, proceed with the route
        next();
      }
    }
  } else {
    // Continue with the navigation for routes that do not require authentication
    next();
  }
});

export default router;
