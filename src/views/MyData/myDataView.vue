<script setup lang="ts">
import Navbar from '@/components/NavbarItem.vue'
import Input from '@/components/InputItem.vue'
import Button from '@/components/ButtonItem.vue'
import { object, string, ref as yupRef } from 'yup';
import { Form } from 'vee-validate';
import axios from '@/axios';
import { AxiosResponse, AxiosError } from 'axios';
import { VueCookies } from 'vue-cookies';
import { inject, reactive } from 'vue';
import jwt_decode from "jwt-decode";

// access vue-cookies
const $cookies = inject<VueCookies>('$cookies');
const token = $cookies?.get('token');
const userId = (jwt_decode(token).Id);
const headers = { headers: { Authorization: `Bearer ${token}` } } 

const formInput = {
    email: "",
    name: "",
    city: "",
    zip: "",
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
    formInput[inputId] = newValue; // Update input values
};

const inputMyData = reactive([
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

const buttonMyData = [
    {
        id: 1,
        type: 'submit',
        name: 'aktualisieren'
    }
];

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
            console.log(res)
            // response is an array with 1 object
            const data = res.data.response[0];
            if (res.status = 200) {
                // loop through object and get key values
                for (let key in data) {
                    if (key === 'email') {
                        email = data[key]
                    } if (key === 'name') {
                        name = data[key]
                    } if (key === 'plz') {
                        zip = data[key]
                    } if (key === 'ort') {
                        city = data[key]
                    } if (key === 'telefon') {
                        telephone = data[key]
                    }
                }
                // update inputMyData with new values
                // trigger reactive rerender
                inputMyData.forEach(input => {
                    for (let value in input) {
                        if (input[value] === 'email') {
                            input.value = email
                        } if (input[value] === 'name') {
                            input.value = name
                        } if (input[value] === 'zip') {
                            input.value = zip
                        } if (input[value] === 'city') {
                            input.value = city
                        } if (input[value] === 'telephone') {
                            input.value = telephone
                        }
                    }
                });
                for (let key in formInput) {
                    if (key === 'email') {
                        formInput[key] = email
                    } if (key === 'name') {
                        formInput[key] = name
                    } if (key === 'zip') {
                        formInput[key] = zip
                    } if (key === 'city') {
                        formInput[key] = city
                    } if (key === 'telephone') {
                        formInput[key] = telephone
                    }
                }
            }
        })
        .catch((error: AxiosError) => {
            console.log(error)
        })
};
getMyData();


// TODO: messages
const onSubmit = async () => {
    console.log(formInput)

    const data = { email : formInput.email, 
                    name : formInput.name,
                    ort : formInput.city,
                    plz : Number(formInput.zip),
                    telefon : formInput.telephone,
                    password : formInput.password            
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
        <Button :buttons="buttonMyData" />
    </Form>
</template>