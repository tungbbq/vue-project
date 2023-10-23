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
import {  useRouter } from 'vue-router';
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
const users = ref<Array<User>>([])
// Define the table columns and their keys
const tableColumns = [
  { label: 'E-Mail', key: 'email' },
  { label: 'Name', key: 'name' },
  { label: 'Ort', key: 'ort' },
  { label: 'Postleitzahl', key: 'plz' },
  { label: 'Telefon', key: 'telefon' },
];

const totalCountUsers = ref(0)
const maxVisibleButtons = 3
const perPages = 10
const totalPages = ref(0)
const currentPage = ref(1)

const getTotalRecords = async () => {
    await axios
        .get(`/pagination`, headers)
        .then((res: AxiosResponse) => {
            totalCountUsers.value = res.data
            totalPages.value = Math.ceil(totalCountUsers.value / perPages)
            updatePagination(currentPage.value)

            if (res.status = 200) {
                // loop through object and get key values
            }
        })
        .catch((error: AxiosError) => {
            console.log(error)
        })
};
getTotalRecords();

const updatePagination = (newPage: number) => {
    const getNewPage = async () => {
        await axios
            .get(`/page/${newPage}`, headers)
            .then((res: AxiosResponse) => {
                console.log(res.data.response)
                users.value = res.data.response
                currentPage.value = newPage

                if (res.status = 200) {
                    // loop through object and get key values
                }
            })
            .catch((error: AxiosError) => {
                console.log(error)
            })
    }
    getNewPage();

}

const showUser = (id: number) =>
{
    console.log(id)
    router.push({ name: 'person', params: { id}});
}

</script>

<template>
    <h4> ListPersons</h4>
    <Navbar />
    <Table 
        :users="users"
        :tableColumns="tableColumns"
        @user-clicked="showUser"
    />
    <Pagination 
        :maxVisibleButtons="maxVisibleButtons" 
        :totalPages="totalPages" 
        :perPages="perPages"
        :currentPage="currentPage" 
        @pagechanged="updatePagination" />
</template>