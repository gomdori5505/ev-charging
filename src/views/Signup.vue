<template>
  <v-container fill-height style="max-width: 450px;">
    <v-layout align-center row wrap>
      <v-flex xs-12>
        <v-alert
          type="error"
          v-if="accountIssue"
        >
          {{ accountIssueReason }}
        </v-alert>
        <v-card>
          <v-toolbar dense flat dark height="60">
            <v-toolbar-title>회원가입</v-toolbar-title>
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
                label="이메일을 입력하세요."
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                type="password"
                label="패스워드를 입력하세요."
                required
              ></v-text-field>
              <v-text-field
                v-model="passwordConfirm"
                :rules="passwordConfirmRules"
                type="password"
                label="패스워드를 다시한번 입력하세요."
                required
              ></v-text-field>
              <v-btn
                :disabled="!valid"
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
            </v-form>
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
      valid: true,
      email: null,
      emailRules: [
        v => !!v || 'E-mail은 필수입니다.',
        v => /.+@.+\..+/.test(v) || 'E-mail이 유효하지 않습니다.'
      ],
      password: null,
      passwordRules: [
        v => !!v || 'Password는 필수입니다.',
        v => (v && v.length >= 6) || 'Password는 6자리 이상이어야 합니다.'
      ],
      passwordConfirm: null,
      passwordConfirmRules: [
        v => !!v || 'Password는 필수입니다.',
        v => 
          v === this.password || 'Password는 동일해야 합니다.'
      ],
      accountIssue: false,
      accountIssueReason: null
    }
  },
  methods: {
    signup() {
      this.$refs.form.validate() && (
        this.$firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            console.log("success to signup")
            this.$store.dispatch('snackBarOpen', '회원가입이 완료되었습니다.')
            this.$router.push({
              name: 'home'
            })
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
            this.accountIssue = true
            this.accountIssueReason = errorMessage
          })
      )
    }
  },
}
</script>