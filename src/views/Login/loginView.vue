<script setup lang="ts">
import Input from '@/components/InputItem.vue'
import Button from '@/components/ButtonItem.vue'
import { object, string } from 'yup';
import { Form } from 'vee-validate';
import axios from '@/axios';
import { AxiosResponse, AxiosError } from 'axios';
import { VueCookies } from 'vue-cookies';
import { inject } from 'vue';
import { useRouter } from 'vue-router'

const formInput = {
    email: "",
    password: "",
};

const $cookies = inject<VueCookies>('$cookies'); 
const router = useRouter()

// validation schema
const schema = object({
    email: string().required('Bitte fülle das E-Mail Feld aus.').email('Beispiel: Hallo@Welt.de'),
    password: string().required("Bitte gebe ein Passwort an."),
});
// get input values from child component via emit
const handleInputUpdate = ({ inputId, newValue }: { inputId: string, newValue: string }) => {
    formInput[inputId] = newValue; // Update input values
};

const inputLogin = [
    {
        id: 'email',
        icon: '<i class="bi bi-envelope-at"></i>',
        type: 'text',
        name: 'E-Mail',
    },
    {
        id: 'password',
        icon: '<i class="bi bi-lock"></i>',
        type: 'password',
        name: 'Passwort',
    },
]

const buttonLogin = [
    {
        id: 1,
        type: 'submit',
        name: 'login'
    }
];
// save user information in cookie
// TODO: messages
const onSubmit = async ()=> {
console.log(formInput)
await axios
        .post('/login_check', {
            email: formInput.email,
            password: formInput.password
        })
        .then((res: AxiosResponse) => {
            if (res.status === 200 && $cookies){
               $cookies.set('refresh_token', res.data.refresh_token)
               $cookies.set('token', res.data.token)
               router.push({ path: '/' })
            }
        })
        .catch((error: AxiosError) => {
console.log(error)
        })
};

</script>

<template>
    <h4 class="display-4"> Login</h4>
    <Form @submit="onSubmit" :validation-schema="schema">
        <Input :inputs="inputLogin" @input="handleInputUpdate"/>
        <Button :buttons="buttonLogin" />
    </Form>
</template>