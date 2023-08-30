<script setup lang="ts">

</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
            <a class="navbar-brand" href="#">Skygate</a>
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

            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Logout</button>

        </div>
    </nav>
</template>