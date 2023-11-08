<script setup lang="ts">
import type { VueCookies } from 'vue-cookies';
import { inject, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isListPersonsRoute = computed(() => {
  return route.path.startsWith('/listpersons');
});

const isSearchRoute = computed(() => {
  return route.path.startsWith('/search');
});

const $cookies = inject<VueCookies>('$cookies');

const logOut = () => {
  if ($cookies) {
    const cookieKeys: Array<string> = $cookies.keys();

    cookieKeys.forEach(key => {
      $cookies.remove(key)
    });
  }
  router.push({        
    name: 'login'
                });
}
</script>

<template>

  <nav class="navbar
                  navbar-expand-lg 
                  custom-navbar 
                  shadow
                  p-2
                  mt-3
                  rounded
                  mx-auto
                  ">
    <div class="container-fluid">
      <a class="navbar-brand col-2" href="/">
        <p class="custom-paragraph text-center">SkyGate</p>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li :class="{ 'nav-item': true, 'active': $route.path === '/mydata', 'display-6': $route.path === '/mydata' }">
            <router-link class="nav-link" to="/mydata">My Data</router-link>
          </li>
          <li :class="{ 'nav-item': true, 'active': isListPersonsRoute, 'display-6': isListPersonsRoute }">
            <router-link class="nav-link" to="/listpersons">List Persons</router-link>
          </li>
          <li :class="{ 'nav-item': true, 'active': isSearchRoute, 'display-6': isSearchRoute }">
            <router-link class="nav-link" to="/search">Search</router-link>
          </li>
        </ul>
        <button @click="logOut" class="btn btn-outline-light ms-auto" type="button">Logout</button>
      </div>
    </div>
  </nav>

</template>
  
<style scoped>
.custom-navbar {
  background-color: #4d99e7;
  /* Your specific color code here */
}

/* Change link color to white */
.nav-link {
  color: white;
}

/* Change link color to white when it's active (e.g., selected) */
.nav-item.active .nav-link {
  color: white;
}

/* Optionally, change link color on hover */
.nav-link:hover {
  color: lightgray;
  /* Change to the desired color on hover */
}

.custom-paragraph {
  font-family: Consolas, monaco, monospace;
  /* Change the font family as needed */
  font-size: 50px;
  /* Change the font size as needed */
  font-weight: bold;
  color: rgb(255, 255, 255);
  /* Change the color to your desired color code */
}
</style>