<template>
  <v-container id="login" class="fill-height justify-center" tag="section">
    <v-row justify="center">
      <v-col lg="11" sm="8" xl="7">
        <v-card class="elevation-4">
          <v-row>
            <v-col lg="7" md="6" class="d-none d-md-flex login-image">
            </v-col>
            <v-col lg="5" md="6" class="pr-0">
              <div class="pa-0 px-3 d-flex justify-end">
                <v-btn icon text @click="close">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <div class="pa-7 pa-sm-12">
                <p class="font-weight-bold mt-4 text-center blue-grey--text text--darken-2">Create an account</p>
                <h6 class="subtitle-1 mb-5 text-center">
                  Keep your data by recording your email address and setting a password
                </h6>

                <v-form ref="form" @submit="submit">
                  <v-text-field
                    v-model="form.email"
                    type="email"
                    :error-messages="fieldErrors('form.email')"
                    @input="$v.form.email.$touch()"
                    @blur="$v.form.email.$touch()"
                    label="E-mail"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="form.password"
                    :error-messages="fieldErrors('form.password')"
                    @input="$v.form.password.$touch()"
                    @blur="$v.form.password.$touch()"
                    label="Password"
                    outlined
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show1 = !show1"
                    :type="show1 ? 'text' : 'password'"
                  ></v-text-field>
                  <v-btn
                    :disabled="$v.form.$invalid"
                    block
                    class="mr-4 white--text bg-pace-yellow"
                    submit
                    type="submit"
                  >Submit</v-btn>
                </v-form>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import {
  required,
  minLength,
  email
} from "vuelidate/lib/validators";
import validationMixin from "@/mixins/validationMixin";
import { validPassword } from "@/utils/validators";

export default {
  name: "Register",
  props: {
    dialogView: {
      type: Boolean,
      default: false
    },
    fromLogin: {
      type: Boolean,
      default: false
    },
  },
  mixins: [validationMixin],
  validations: {
    form: {
      email: { required, email },
      password: {
        required,
        validPassword,
        minLength: minLength(6)
      }
    }
  },
  validationMessages: {
    form: {
      email: {
        required: "Email is required",
        email: "Email must be valid"
      },
      password: { 
        required: "Password is required",
        minLength: "Password must be more than 6 characters",
        validPassword: "Password must contain uppercase, lowercase, number and symbol"
      }
    }
  },
  data: () => ({
    form: {
      email: null,
      password: null
    },
    show1: false,
  }),
  methods: {
    ...mapActions("account", ["register"]),
    ...mapActions(["toggleAuthModal"]),
    async submit(event) {
      event.preventDefault();
      let res = await this.register(this.form);
      if (res === true) {
        this.$notify({
          text: 'Check your inbox for the verification link.',
          type: 'success'
        });
        this.close();
      } else {
        this.$notify({
          text: res.errors[0].errorMessage,
          type: 'error'
        });
      }
    },
    close() {
      if (this.dialogView) {
        if (this.fromLogin) {
          this.$emit('show-login');
        } else {
          this.$emit('close-modal');
        }
      } else {
        this.$router.push('/');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login-image {
  background-image: url('../../assets/image1.png');
  background-position-x: center;
}

.logo {
  max-width: 369px;
  max-height: 70px;
  width: 100%;
  height: auto;
}
</style>
