<script setup lang="ts">
import Navbar from '@/components/NavbarItem.vue'
import Table from '@/components/TableItem.vue'
import Page from '@/components/PaginationItem.vue'
import axios from '@/axios';
import { AxiosResponse, AxiosError } from 'axios';
import { VueCookies } from 'vue-cookies';
import { inject, reactive } from 'vue';
import jwt_decode from "jwt-decode";

const $cookies = inject<VueCookies>('$cookies');
const token = $cookies?.get('token');
const userId = (jwt_decode(token).Id);
const headers = { headers: { Authorization: `Bearer ${token}` } } 

const maxVisibleButtons = 5
const totalPages = 10
const perPages = 10
const currentPage = 1

const getMyData = async () => {
    await axios
        .get(`/pagination`, headers)
        .then((res: AxiosResponse) => {
            console.log(res)
            // response is an array with 1 object
           
            if (res.status = 200) {
                // loop through object and get key values
            }
        })
        .catch((error: AxiosError) => {
            console.log(error)
        })
};
getMyData();

</script>

<template>
    <h4> ListPersons</h4>
<Navbar />
<Table />
<Page 
:maxVisibleButtons = "maxVisibleButtons"
:totalPages = "totalPages"
:perPages = "perPages"
:currentPage = "currentPage"
/>
</template>