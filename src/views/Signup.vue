<template>
  <v-container fill-height style="max-width: 450px;">
    <v-layout align-center row wrap>
      <v-flex xs-12>
        <v-card>
          <v-toolbar dense flat dark height="60">
            <v-toolbar-title>회원가입</v-toolbar-title>
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
              @click="signup({
                email,
                password
              })"
            >
              회원가입
            </v-btn>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Signup',
  data() {
    return {
      email: null,
      password: null,
    }
  },
  methods: {
    signup() {
      this.$firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          console.log("success to signup")
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage)
        })
    }
  },
}
</script>