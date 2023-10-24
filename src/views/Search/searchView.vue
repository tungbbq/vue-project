<script setup lang="ts">
import Navbar from '@/components/NavbarItem.vue'
import Input from '../../components/InputItem.vue'
import Button from '../../components/ButtonItem.vue'
import { type Input as InputMyData } from '../../components/InputItem.vue'
import { type Button as ButtonInterface } from '../../components/ButtonItem.vue'
import { inject, reactive } from 'vue'
import type { VueCookies } from 'vue-cookies';
import jwt_decode from "jwt-decode";
import { type JwtPayload } from '../MyData/myDataView.vue'

import { useRouter } from 'vue-router'

const formInput = {
        email: "",
        name: "",
        city: "",
        zip: 0,
        telephone: "",
        password: "",
        confirmPW: "",
};

const inputMyData: InputMyData[] = reactive([
        {
                id: 'email',
                icon: '<i class="bi bi-envelope-at"></i>',
                type: 'text',
                name: 'E-Mail',
                disabled: false,
                value: ''
        },
        {
                id: 'name',
                icon: '<i class="bi bi-person-circle"></i>',
                type: 'text',
                name: 'Name',
                disabled: false,
                value: ''
        },
        {
                id: 'city',
                icon: '<i class="bi bi-geo-alt"></i>',
                type: 'text',
                name: 'Ort',
                disabled: false,
                value: ''
        },
        {
                id: 'zip',
                icon: '<i class="bi bi-postcard"></i>',
                type: 'text',
                name: 'PLZ',
                disabled: false,
                value: ''
        },
        {
                id: 'telephone',
                icon: '<i class="bi bi-telephone"></i>',
                type: 'text',
                name: 'Telefon',
                disabled: false,
                value: ''
        }

]);

let buttonMyData: ButtonInterface[] = [
        {
                id: 1,
                type: 'button',
                name: 'Suchen',
                function: 'search'
        }
];

const router = useRouter();
const $cookies = inject<VueCookies>('$cookies');
const token: string = $cookies?.get('token');
const roles = jwt_decode<JwtPayload>(token).roles



const handleInputUpdate = ({ inputId, newValue }: { inputId: string, newValue: string }) => {
        // @ts-ignore
        formInput[inputId] = newValue; // Update input values
};

const handleButtonEmit = (task: string) => {
        // TODO
        if (task === 'search') {
                const data = {
                        email: formInput.email,
                        name: formInput.name,
                        ort: formInput.city,
                        plz: formInput.zip,
                        telefon: formInput.telephone,
                        password: formInput.password
                }
                router.push({
                        name: 'searchResults',
                        query: data, // Pass the search data as query parameters
                });

        }
}

</script>

<template>
        <h4> Search</h4>
        <Navbar />
        <Input :inputs="inputMyData" @input="handleInputUpdate" />
        <Button :buttons="buttonMyData" @buttonClick="handleButtonEmit" />
</template>