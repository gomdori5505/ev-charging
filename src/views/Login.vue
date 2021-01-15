<template>
  <v-container fill-height style="max-width: 450px;">
    <v-layout align-center row wrap>
      <v-flex xs-12>
        <v-alert
          type="error"
          v-if="inCorrectAccount"
        >
          아이디와 비밀번호를 확인해주세요.
        </v-alert>
        <v-card>
          <v-toolbar dense flat dark height="60">
            <v-toolbar-title>로그인</v-toolbar-title>
          </v-toolbar>
          <div class="pa-3">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail을 입력하세요."
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                type="password"
                label="Password를 입력하세요."
                required
              ></v-text-field>
              <v-btn
                :disabled="!valid"
                color="primary"
                depressed
                block
                large
                @click="login({
                  email,
                  password
                })"
              >
                로그인
              </v-btn>
            </v-form>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      valid: true,
      email: null,
      emailRules: [
        v => !!v || 'E-mail은 필수입니다.',
        v => /.+@.+\..+/.test(v) || 'E-mail이 유효하지 않습니다.'
      ],
      password: null,
      passwordRules: [
        v => !!v || 'Password는 필수입니다.'
      ],
      inCorrectAccount: false
    }
  },
  methods: {
    login() {
      if(this.$refs.form.validate()) {
        this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            this.$store.dispatch('snackBarOpen', '로그인 되었습니다.')
            this.$router.push({
              name: 'home'
            })
          })
          .catch((error) => {
            console.log(error.code)
            console.log(error.message)
            this.inCorrectAccount = true
          });
      }
    },
  },
}
</script>