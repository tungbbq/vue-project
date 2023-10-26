<script setup lang="ts">
import Input from '@/components/InputItem.vue'
import Button from '@/components/ButtonItem.vue'
import { object, string, ref as yupRef, boolean } from 'yup';
import { Form } from 'vee-validate';
import axios from '@/axios';
import { type AxiosResponse, AxiosError } from 'axios';
import { type Button as ButtonInterface } from '../../components/ButtonItem.vue'
import { type Input as InputMyData } from '../../components/InputItem.vue'
import { ref } from 'vue';
import { Field, ErrorMessage } from 'vee-validate';
import { useRouter } from 'vue-router';

const router = useRouter();

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
    zip: 0,
    telephone: "",
    password: "",
    confirmPW: "",
};

const form = ref(null);
const termsOfUse = ref(null);

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
    password: string().required("Bitte gebe ein Passwort an."),
    confirmPW: string().required("Bitte gebe dein Passwort erneut an.").test('passwords-match', 'Passwort ist nicht identisch.', function (value) {
        return value === this.resolve(yupRef('password'))
    }),
    termsOfUse: boolean().required('Bitte stimmde den Nuztungsbedingungen und der Datenschutzerklärung zu.'),
});

// get input values from child component via emit and update formInput
const handleInputUpdate = ({ inputId, newValue }: { inputId: string, newValue: string }) => {
    // @ts-ignore
    formInput[inputId] = newValue; // Update input values
};

// values for inputitem
const inputRegistration: InputMyData[] = [
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
];

// values for buttonitem
const buttonRegistration: ButtonInterface[] = [
    {
        id: 1,
        type: 'button',
        name: 'registrieren',
        function: 'submit'
    }
];

// registration logic
// axios post request
// TODO: messages
const onSubmit = async () => {
    console.log(form.value)
    if (form.value) {
        // @ts-ignore
        await form.value.validate();
        // @ts-ignore
        if (Object.keys(form.value.getErrors()).length === 0) {
            console.log(formInput);
            await axios
                .post('/register', {
                    email: formInput.email,
                    name: formInput.name,
                    plz: Number(formInput.zip),
                    ort: formInput.city,
                    telefon: formInput.telephone,
                    password: formInput.password
                })
                .then((res: AxiosResponse) => {
                    if (res.status = 200) {
                        console.log(res)
                        router.push('/verify');
                    }
                })
                .catch((error: AxiosError) => {

                })
        } else console.log('error');
    }
};

const handleButtonEmit = (task: string) => {
    if (task === 'submit') {
        onSubmit()
    }
}
</script>

<template>
    <main>
        <h1 class="display-5 text-center align-middle">Registration</h1>
        <Form ref='form' :validation-schema="schema">
            <Input :inputs="inputRegistration" @input="handleInputUpdate" />

            <div class="input-group mb-3">
                <span class="input-group-text"><i class="bi bi-check2-circle"></i></span>
                <Field 
                name='termsOfUse' 
                v-model="termsOfUse" 
                type="checkbox" 
                class="btn-check" 
                id="btn-check-outlined"
                value="true" 
                autocomplete="off" 
                />
                <label class="btn btn-outline-secondary form-control" for="btn-check-outlined">Ich stimme den <b> Nutzungsbedingungen
                    </b> zu
                    und habe die <b> Datenschutzerklärung </b> gelesen.</label><br>

                <ErrorMessage name="termsOfUse" class='form-control is-invalid' />
            </div>

            <Button :buttons="buttonRegistration" @buttonClick="handleButtonEmit" />
        </Form>
    </main>
</template>