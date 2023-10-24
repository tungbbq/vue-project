<script setup lang="ts">
import type { VueCookies } from 'vue-cookies';
import { inject } from 'vue';

const $cookies = inject<VueCookies>('$cookies');

const logOut = () => {
    if ($cookies) {
        const cookieKeys: Array<string> = $cookies.keys();

        cookieKeys.forEach(key => {
            $cookies.remove(key)
        });
    }
}
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
            <a class="navbar-brand" href="/">Skygate</a>
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                <li class="nav-item">
                    <router-link class="nav-link" to="/mydata">My Data</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/listpersons">List Persons</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/search">Search</router-link>
                </li>
            </ul>

            <button @click="logOut" class="btn btn-outline-success my-2 my-sm-0" type="button">Logout</button>

        </div>
    </nav>
</template>