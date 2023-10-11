<script setup lang="ts">
import Input from '@/components/InputItem.vue'
import Button from '@/components/ButtonItem.vue'
import { object, string, ref } from 'yup';
import { Form } from 'vee-validate';
import axios from '@/axios';
import { AxiosResponse, AxiosError } from 'axios';

// Registration.vue build Inputelements from Inputitem.vue via props 
// const inputRegistration include id, icon, type and name of all inputs
// registration logic is here
// to get values from input fields -> get values via emit from inputitem child
// values are safe in formInput

// values for registration logic
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
    password: string().required("Bitte gebe ein Passwort an."),
    confirmPW: string().required("Bitte gebe dein Passwort erneut an.").test('passwords-match', 'Passwort ist nicht identisch.', function (value) {
        return value === this.resolve(ref('password'));
    }),
});

// get input values from child component via emit and update formInput
const handleInputUpdate = ({ inputId, newValue }: { inputId: string, newValue: string }) => {
    formInput[inputId] = newValue; // Update input values
};

// values for inputitem
const inputRegistration = [
    {
        id: 'email',
        icon: '<i class="bi bi-envelope-at"></i>',
        type: 'text',
        name: 'E-Mail',
    },
    {
        id: 'name',
        icon: '<i class="bi bi-person-circle"></i>',
        type: 'text',
        name: 'Name',
    },
    {
        id: 'city',
        icon: '<i class="bi bi-geo-alt"></i>',
        type: 'text',
        name: 'Ort',
    },
    {
        id: 'zip',
        icon: '<i class="bi bi-postcard"></i>',
        type: 'text',
        name: 'PLZ',
    },
    {
        id: 'telephone',
        icon: '<i class="bi bi-telephone"></i>',
        type: 'text',
        name: 'Telefon',
    },
    {
        id: 'password',
        icon: '<i class="bi bi-lock"></i>',
        type: 'password',
        name: 'Passwort',
    },
    {
        id: 'confirmPW',
        icon: '<i class="bi bi-lock"></i>',
        type: 'password',
        name: 'Passwort Wiederholung',
    },

];

// values for buttonitem
const buttonRegistration = [
    {
        id: 1,
        type: 'submit',
        name: 'registrieren'
    }
];

// registration logic
// axios post request
// TODO: messages
const onSubmit = async () => {
    console.log(formInput)

    await axios
        .post('/register', {
            email: formInput.email,
            name: formInput.name,
            plz: formInput.zip,
            ort: formInput.city,
            telefon: formInput.telephone,
            password: formInput.password
        })
        .then((res: AxiosResponse) => {
            if(res.status = 200){
                console.log(res)
            }
        })
        .catch((error: AxiosError) => {

        })
};

</script>

<template>
    <main>
        <h1 class="display-5 text-center align-middle">Registration</h1>
        <Form @submit="onSubmit" :validation-schema="schema">
            <Input :inputs="inputRegistration" @input="handleInputUpdate" />
            <Button :buttons="buttonRegistration" />
        </Form>
    </main>
</template>