<script setup lang="ts">
import Navbar from '../../components/NavbarItem.vue'
import Input from '../../components/InputItem.vue'
import Button from '../../components/ButtonItem.vue'
import { object, string, ref as yupRef } from 'yup';
import { Form } from 'vee-validate';
import axios from '../../axios';
import type { AxiosResponse, AxiosError } from 'axios';
import type { VueCookies } from 'vue-cookies';
import { inject, reactive } from 'vue';
import jwt_decode from "jwt-decode";
import { type Button as ButtonInterface } from '../../components/ButtonItem.vue'
import { type Input as InputMyData } from '../../components/InputItem.vue'

export interface JwtPayload {
    Id: number
    exp: number
    iat: number
    roles: Array<string>
    username: string
    verifyCode: number
}

// access vue-cookies
const $cookies = inject<VueCookies>('$cookies');
const token: string = $cookies?.get('token');
const userId: number = (jwt_decode<JwtPayload>(token).Id);
const headers = { headers: { Authorization: `Bearer ${token}` } }
const formInput = {
    email: "",
    name: "",
    city: "",
    zip: 0,
    telephone: "",
    password: "",
    confirmPW: "",
};

// regex pattern for custom validation
const telephoneNumberRegex = /^(?:\+\d{1,3}\s?)?\(?\d{3}\)?[-./\s]?\d{3}[-./\s]?\d{4}$|^\d+$/;
const zipCodeRegex = /^\d{5}$/;

// validation schema
const schema = object({
    email: string().required('Bitte fülle das E-Mail Feld aus.').email('Beispiel: Hallo@Welt.de'),
    name: string().required('Bitte gebe ein Name an.'),
    city: string().required("Bitte gebe ein Ort an."),
    zip: string().length(5, '5-stellige Postleitzahl.').matches(zipCodeRegex, '5-stellige Postleitzahl.').required("Bitte gebe eine Postleitzahl an."),
    telephone: string().matches(telephoneNumberRegex, '0-9, +, /, -').required("Bitte gebe eine Telefonnummer an."),
    confirmPW: string().test('passwords-match', 'Passwort ist nicht identisch.', function (value) {
        return value === this.resolve(yupRef('password'));
    }),
});

// get input values from child component via emit
const handleInputUpdate = ({ inputId, newValue }: { inputId: string, newValue: string }) => {
    // @ts-ignore
    formInput[inputId] = newValue; // Update input values
};

const inputMyData: InputMyData[] = reactive([
    {
        id: 'email',
        icon: '<i class="bi bi-envelope-at"></i>',
        type: 'text',
        name: 'E-Mail',
        value: ''
    },
    {
        id: 'name',
        icon: '<i class="bi bi-person-circle"></i>',
        type: 'text',
        name: 'Name',
        value: ''
    },
    {
        id: 'city',
        icon: '<i class="bi bi-geo-alt"></i>',
        type: 'text',
        name: 'Ort',
        value: ''
    },
    {
        id: 'zip',
        icon: '<i class="bi bi-postcard"></i>',
        type: 'text',
        name: 'PLZ',
        value: ''
    },
    {
        id: 'telephone',
        icon: '<i class="bi bi-telephone"></i>',
        type: 'text',
        name: 'Telefon',
        value: ''
    },
    {
        id: 'password',
        icon: '<i class="bi bi-lock"></i>',
        type: 'password',
        name: 'Passwort',
        value: ''
    },
    {
        id: 'confirmPW',
        icon: '<i class="bi bi-lock"></i>',
        type: 'password',
        name: 'Passwort Wiederholung',
        value: ''
    },

]);

const buttonMyData: ButtonInterface[] = [
    {
        id: 1,
        type: 'submit',
        name: 'aktualisieren'
    }
];

// TODO: switch case instead of if condition
// get user data
const getMyData = async () => {
    let email: string;
    let name: string;
    let zip: number;
    let city: string;
    let telephone: string;

    await axios
        .get(`/user/${userId}`, headers)
        .then((res: AxiosResponse) => {
            console.log(res);
            // response is an array with 1 object
            const data = res.data.response[0];
            switch (res.status) {
                case 200:
                    // loop through object and get key values
                    for (let key in data) {
                        switch (key) {
                            case 'email':
                                email = data[key];
                                break;
                            case 'name':
                                name = data[key];
                                break;
                            case 'plz':
                                zip = data[key];
                                break;
                            case 'ort':
                                city = data[key];
                                break;
                            case 'telefon':
                                telephone = data[key];
                                break;
                            default:
                                break;
                        }
                    }

                    // update inputMyData with new values
                    // trigger reactive rerender
                    inputMyData.forEach(input => {
                        for (let value in input) {
                            // @ts-ignore
                            switch (input[value]) {
                                case 'email':
                                    input.value = email;
                                    break;
                                case 'name':
                                    input.value = name;
                                    break;
                                case 'zip':
                                    input.value = zip;
                                    break;
                                case 'city':
                                    input.value = city;
                                    break;
                                case 'telephone':
                                    input.value = telephone;
                                    break;
                                default:
                                    break;
                            }
                        }
                    });

                    for (let key in formInput) {
                        switch (key) {
                            case 'email':
                                formInput[key] = email;
                                break;
                            case 'name':
                                formInput[key] = name;
                                break;
                            case 'zip':
                                formInput[key] = zip;
                                break;
                            case 'city':
                                formInput[key] = city;
                                break;
                            case 'telephone':
                                formInput[key] = telephone;
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                default:
                    break;
            }
        })
        .catch((error: AxiosError) => {
            console.log(error);
        });
};

getMyData();


// TODO: messages
const onSubmit = async () => {
    console.log(formInput)

    const data = {
        email: formInput.email,
        name: formInput.name,
        ort: formInput.city,
        plz: Number(formInput.zip),
        telefon: formInput.telephone,
        password: formInput.password
    }

    await axios
        .put(`/user/${userId}`, data, headers)
        .then((res: AxiosResponse) => {
            if (res.status = 200) {
                console.log(res)
            }
        })
        .catch((error: AxiosError) => {
            console.log(error)
        })
};

</script>

<template>
    <h4> MyData</h4>
    <Navbar />
    <Form @submit="onSubmit" :validation-schema="schema">
        <Input :inputs="inputMyData" @input="handleInputUpdate" />
        <Button :buttons="buttonMyData"></Button>
    </Form>
</template>