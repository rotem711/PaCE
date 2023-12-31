<template>
  <v-container id="login" class="fill-height justify-center" tag="section">
    <v-row justify="center">
      <v-col lg="11" sm="8" xl="7">
        <v-card class="elevation-4">
          <v-row>
            <v-col lg="7" md="6" class="d-none d-md-flex login-image">
            </v-col>
            <v-col lg="5" md="6" class="pr-0">
              <div class="pa-0 px-4 d-flex justify-end">
                <v-btn icon text @click="close">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <div class="pa-7 pa-sm-12">
                <p class="font-weight-bold mt-4 text-center blue-grey--text text--darken-2">Request reset</p>
                <h6 class="subtitle-1 mb-5 text-center">
                  Enter your email address to receive a link to reset your password
                </h6>

                <v-form ref="form" @submit="submit">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                    outlined
                  ></v-text-field>
                  <v-btn
                    :disabled="!valid || sent"
                    block
                    class="mr-4 white--text bg-pace-yellow"
                    submit
                    type="submit"
                  >Reset Password</v-btn>
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
export default {
  name: "ResetPassword",
  props: {
    dialogView: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    valid: true,
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    sent: false
  }),
  methods: {
    ...mapActions("account", ["forgotPassword"]),
    async submit(event) {
      event.preventDefault();
      this.$refs.form.validate();
      if (this.$refs.form.validate(true)) {
        let payload = {
          email: this.email
        };
        let res = await this.forgotPassword(payload);
        if (res.data) {
          this.$notify({
            text: 'Check your inbox for the reset link and next steps',
            type: 'success'
          });
          this.sent = true;
        } else {
          this.$notify({
            text: res.errors[0].errorMessage,
            type: 'error'
          });
        }
      }
    },
    close() {
      if (this.dialogView) {
        this.$emit('close-modal');
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
