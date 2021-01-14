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
            <v-text-field
              v-model="email"
              label="이메일을 입력하세요."
            ></v-text-field>
            <v-text-field
              v-model="password"
              type="password"
              label="패스워드를 입력하세요."
            ></v-text-field>
            <v-btn
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
      email: null,
      password: null,
      inCorrectAccount: false
    }
  },
  methods: {
    login() {
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
    },
  },
}
</script>