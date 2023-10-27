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
        <a class="navbar-brand" href="/"><img src="../assets/skygate-logo.0d9d427a.svg" width="150" height="60"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <router-link class="nav-link" to="/mydata">My Data</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/listpersons">List Persons</router-link>
                </li>
                <li class="nav-item dropdown">
                    <router-link class="nav-link" to="/search">Search</router-link>
                </li>

            </ul>
                <button @click="logOut" class="btn btn-outline-primary align-items-end" type="button">Logout</button>
        </div>
    </nav>
</template>
