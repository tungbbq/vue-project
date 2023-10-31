<script setup lang="ts">
import Navbar from '../../components/NavbarItem.vue'
import Input from '../../components/InputItem.vue'
import Button from '../../components/ButtonItem.vue'
import { object, string, ref as yupRef } from 'yup';
import { Form } from 'vee-validate';
import axios from '../../axios';
import type { AxiosResponse, AxiosError } from 'axios';
import type { VueCookies } from 'vue-cookies';
import { inject, reactive, ref } from 'vue';
import jwt_decode from "jwt-decode";
import { type Button as ButtonInterface } from '../../components/ButtonItem.vue'
import { type Input as InputMyData } from '../../components/InputItem.vue'
import { useRoute } from 'vue-router';

const route = useRoute();
let inputMyData:InputMyData[] = [];
let buttonMyData: ButtonInterface[] = [];

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
const roles = jwt_decode<JwtPayload>(token).roles

const headers = { headers: { Authorization: `Bearer ${token}` } }
const form = ref(null);
const formInput = {
    email: "",
    name: "",
    city: "",
    zip: 0,
    telephone: "",
    password: "",
    confirmPW: "",
};

// TODO: messages
const onSubmit = async () => {
    if (form.value) {
        // @ts-ignore
        await form.value.validate();
        // @ts-ignore
        if (Object.keys(form.value.getErrors()).length === 0) {

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
    }
}
};

let initialInputs: InputMyData[] = reactive([
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
    },
    {
        id: 'password',
        icon: '<i class="bi bi-lock"></i>',
        type: 'password',
        name: 'Passwort',
        disabled: false,
        value: ''
    },
    {
        id: 'confirmPW',
        icon: '<i class="bi bi-lock"></i>',
        type: 'password',
        name: 'Passwort Wiederholung',
        disabled: false,
        value: ''
    },

]);


let initialButtons: ButtonInterface[] = [
    {
        id: 1,
        type: 'button',
        name: 'Aktualisieren',
        function: 'submit'
    }
];

// check if url id parameter exist, if true then we are in listpersons
// else we are in mydata and use cookie user id
const userId = (() => {
    if (route.params.id) {
        console.log(roles)
        let filterButtons: ButtonInterface[] = []
        let filterInitialInputs = initialInputs
        // add submit button from initialButtons
        if (roles.includes('ROLE_UPDATE')){
            filterButtons = initialButtons
        }
        // add delete button
        if (roles.includes('ROLE_DELETE'))
            filterButtons.push({
                id: 2,
                type: 'button',
                name: 'Löschen',
                function: 'delete'
            })
          
        // if user has no update right, disable inputs   
        if (!roles.includes('ROLE_UPDATE')) {
            buttonMyData = []
            filterInitialInputs = filterInitialInputs.filter((item) => {
                item.disabled = true
                return item.id !== 'password' && item.id !== 'confirmPW'
            });
        }
        inputMyData = filterInitialInputs
        buttonMyData = filterButtons
        return Number(route.params.id);
    } else {
        inputMyData = initialInputs
        buttonMyData = initialButtons
        return jwt_decode<JwtPayload>(token).Id;
    }
})();

// TODO: messages
const deleteUser = (async () => {
    await axios
        .delete(`/user/${userId}`, headers)
        .then((res: AxiosResponse) => {
            if (res.status = 200) {
                console.log(res)
            }
        })
        .catch((error: AxiosError) => {
            console.log(error)
        })
})

const handleButtonEmit = (task: string) => {
    console.log(task)
    if (task === 'submit') {
        onSubmit()
    } else if (task === 'delete') {
        deleteUser()
    }
}

// regex pattern for custom validation
const telephoneNumberRegex = /^[\d\s+\-.()]+$/;
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


// get user data
const getMyData = (async () => {
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
});

getMyData();


</script>

<template>


    <Navbar />
    <div class="container d-flex justify-content-center align-items-center">
    <Form ref='form' :validation-schema="schema">
        <Input :inputs="inputMyData" @input="handleInputUpdate" />
        <Button :buttons="buttonMyData" @buttonClick="handleButtonEmit"></Button>
    </Form>
</div>
</template>