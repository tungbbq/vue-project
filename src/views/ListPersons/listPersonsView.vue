<script setup lang="ts">
import Navbar from '../../components/NavbarItem.vue'
import Table from '../../components/TableItem.vue'
import Pagination from '../../components/PaginationItem.vue'
import Test from '../../components/TestItem.vue'
import axios from '../../axios';
import type { AxiosResponse, AxiosError } from 'axios';
import type { VueCookies } from 'vue-cookies';
import { inject, ref } from 'vue';
import jwt_decode from "jwt-decode";
import { useRouter, useRoute } from 'vue-router';
import type { JwtPayload } from '../MyData/myDataView.vue';

export interface User {
    email: string,
    id: number,
    name: string,
    ort: string,
    plz: number,
    roles: Array<string>,
    telefon: string
}

const $cookies = inject<VueCookies>('$cookies');
const token = $cookies?.get('token');
const userId = (jwt_decode<JwtPayload>(token).Id);
const headers = { headers: { Authorization: `Bearer ${token}` } }

const router = useRouter();
const route = useRoute();
const users = ref<Array<User>>([])
// Define the table columns and their keys
const tableColumns = [
    { label: 'E-Mail', key: 'email' },
    { label: 'Name', key: 'name' },
    { label: 'Ort', key: 'ort' },
    { label: 'Postleitzahl', key: 'plz' },
    { label: 'Telefon', key: 'telefon' },
];

const totalCountUsers = ref(0);
const maxVisibleButtons = 3;
const perPages = 10;
const totalPages = ref(1);
const currentPage = ref(1);

const getTotalPages = async () => {
    await axios
        .get(`/pagination`, headers)
        .then((res: AxiosResponse) => {
            totalCountUsers.value = res.data
            totalPages.value = Math.ceil(totalCountUsers.value / perPages)
        })
        .catch((error: AxiosError) => {
            console.log(error)
        })
    updatePagination(currentPage.value)
};

const updatePagination = (newPage: number) => {
    const getNewPage = async () => {
        await axios
            .get(`/page/${newPage}`, headers)
            .then((res: AxiosResponse) => {
                console.log(res.data.response)
                users.value = res.data.response
                currentPage.value = newPage
            })
            .catch((error: AxiosError) => {
                console.log(error)
            })
    }
    getNewPage();
}

const showUser = (id: number) => {
    console.log(id)
    router.push({ name: 'person', params: { id } });
}

const searchResults = () => {
    // get query from url string
    // cast to number
    let searchQuery = {}
    searchQuery = { ...route.query }
    for (const key in searchQuery) {
        if (key === 'plz') {
            // @ts-ignore
            searchQuery[key] = Number(searchQuery[key])
        }
    }
    const getSearchResults = async () => {
        await axios
            .post('/user/search', searchQuery, headers)
            .then((res: AxiosResponse) => {
                if (res.status = 200) {
                    users.value = res.data.response
                }
            })
            .catch((error: AxiosError) => {
                console.log(error)
            })
    }
    getSearchResults()
}

(() => {
    if (Object.keys(route.query).length !== 0) {
        console.log('search')
        searchResults();
    } else if (Object.keys(route.query).length === 0) {
        console.log('update')
        getTotalPages();
    }
})();

</script>

<template>
    <div class="row">
        <div class="vh-100">
            <Navbar />
            <div
                class="container-fluid h-75 shadow p-3 mb-5 bg-white rounded col-12 d-flex align-items-center justify-content-center">
                <div class="container">
                    <Table :users="users" :tableColumns="tableColumns" @user-clicked="showUser" />
                    <div class="d-flex justify-content-center mt-4">
                        <Pagination :maxVisibleButtons="maxVisibleButtons" :totalPages="totalPages" :perPages="perPages"
                            :currentPage="currentPage" @pagechanged="updatePagination" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>