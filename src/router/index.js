import { createRouter, createWebHistory } from "vue-router";
import RegistrationView from '@/views/Registration/registrationView.vue'
import confirmRegistrationView from '@/views/Notifications/confirmRegistrationView.vue'
import Login from '@/views/Login/loginView.vue'
import Startpage from '@/views/Startpage/startpageView.vue'
import MyData from '@/views/MyData/myDataView.vue'
import ListPersons from '@/views/ListPersons/listPersonsView.vue'
import Search from '@/views/Search/searchView.vue'
import jwt_decode from "jwt-decode";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/registration',
            name: 'registration',
            component: RegistrationView,
        },
        {
            path: '/confirmRegistration',
            name: 'confirmRegistration',
            component: confirmRegistrationView
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/',
            name: 'startpage',
            component: Startpage,
            meta: { requiresAuth: true }
        },
        {
            path: '/mydata',
            name: 'mydata',
            component: MyData,
            meta: { requiresAuth: true }
        },
        {
            path: '/listpersons',
            name: 'listpersons',
            component: ListPersons,
            meta: { requiresAuth: true }
        },
        {
            path: '/search',
            name: 'search',
            component: Search,
            meta: { requiresAuth: true }
        }
    ]
});

// navigation guard, check if user is loggedIn, verified and token is valid

router.beforeEach((to, from, next) => {
    const decoded = jwt_decode($cookies.get('token'))
    const currentDate = Date.now() / 1000;

    if (to.meta.requiresAuth ) {
        if(!decoded){
            alert('Login')
            next('/login')
        }
        else if(decoded.verifyCode !== 1){
            alert('Verify')
            next('/login')
        } else if(decoded.exp < currentDate){
            alert('Expired')
            next('/login')
        } else next();
    } else {
        // Continue with the navigation
        next();
    }
});

export default router;