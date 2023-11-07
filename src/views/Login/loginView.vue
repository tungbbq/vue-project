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
        name: 'Login',
        function: 'submit'
    }
];
// save user information in cookie
// TODO: messages
const onSubmit = async () => {
    console.log(formInput)
    await axios
        .post('/login_check', {
            email: formInput.email,
            password: formInput.password
        })
        .then((res: AxiosResponse) => {
            if (res.status === 200 && $cookies) {
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
    <div class="container-fluid d-flex flex-column align-items-center justify-content-center vh-100">
      <div class="row">
        <!-- Left side with the image (25% width) -->
        <div class="col-md-2 d-flex justify-content-center align-items-center">
          <!-- Use 'd-flex justify-content-center align-items-center' classes -->
          <img src="../../assets/skygate-logo.0d9d427a.svg" class="mb-4" width="185" height="80">
        </div>
        <!-- Middle side | -->
        <div class="col-md-2">

        </div>
        <!-- Right side with the content (75% width) -->
        <div class="col-md-8 mt-4">
          <!-- Add 'mt-4' class for top margin to create space -->
          <div class="container h-50">
            <div class="col-lg-12 mx-auto">
              <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                <div class="col p-4 d-flex flex-column position-static">
                  <h4 class="display-6 mb-4 "> Login</h4>
  
                  <Form :validation-schema="schema">
                    <Input :inputs="inputLogin" @input="handleInputUpdate" />
                    <Button :buttons="buttonLogin" @buttonClick="handleButtonEmit" />
                  </Form>
                  <hr class="my-4">
                  <div class="text-center">
                    <p>Noch nicht angemeldet? <br>
                      <router-link to="/registration">Hier klicken</router-link> um sich zu registrieren.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
