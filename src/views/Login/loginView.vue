<script setup lang="ts">
import Input from '@/components/InputItem.vue'
import Button from '@/components/ButtonItem.vue'
import { object, string } from 'yup';
import { Form } from 'vee-validate';
import axios from '@/axios';
import type { AxiosResponse, AxiosError } from 'axios';
import type { VueCookies } from 'vue-cookies';
import { inject } from 'vue';
import { useRouter } from 'vue-router'
import { type Button as ButtonInterface } from '../../components/ButtonItem.vue'
import { type Input as InputMyData } from '../../components/InputItem.vue'

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
    // @ts-expect-error
    formInput[inputId] = newValue; // Update input values
};

const inputLogin: InputMyData[] = [
    {
        id: 'email',
        icon: '<i class="bi bi-envelope-at"></i>',
        type: 'text',
        name: 'E-Mail',
        disabled: false,
        value: ''
    },
    {
        id: 'password',
        icon: '<i class="bi bi-lock"></i>',
        type: 'password',
        name: 'Passwort',
        disabled: false,
        value: ''
    },
]

const buttonLogin: ButtonInterface[] = [
    {
        id: 1,
        type: 'button',
        name: 'login',
        function: 'submit'
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

const handleButtonEmit = (task: string) => {
    if (task === 'submit') {
        onSubmit()
    }
}

</script>

<template>
    <h4 class="display-4"> Login</h4>
    <Form :validation-schema="schema">
        <Input :inputs="inputLogin" @input="handleInputUpdate"/>
        <Button :buttons="buttonLogin" @buttonClick="handleButtonEmit" />
    </Form>
    <div>
        <p>Noch nicht angemeldet?</p>
        <p><router-link to="/registration">Hier klicken</router-link> um sich zu registrieren.</p>
    </div>
</template>