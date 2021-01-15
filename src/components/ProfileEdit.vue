<template>
  <v-container fill-height style="max-width: 450px;">
    <v-layout align-center row wrap>
      <v-flex xs-12>
        <v-alert
          type="error"
          v-if="accountIssue"
        >
          Issue!!
        </v-alert>
        <v-card>
          <v-toolbar dense flat dark height="60">
            <v-toolbar-title>프로필 수정</v-toolbar-title>
          </v-toolbar>
          <div class="pa-3">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                type="password"
                label="정보를 변경하시려면 현재 password를 입력하세요."
                required
              ></v-text-field>
              <v-text-field
                v-model="newEmail"
                :rules="emailRules"
                label="변경하실 E-mail을 입력하세요."
                required
              ></v-text-field>
              <v-text-field
                v-model="newNickName"
                :rules="nickNameRules"
                label="변경하실 NickName을 입력하세요."
                required
              ></v-text-field>
              <v-text-field
                v-model="newPassword"
                :rules="newPasswordRules"
                type="password"
                label="변경하실 새로운 password를 입력하세요."
                required
              ></v-text-field>
              <v-text-field
                v-model="newPasswordConfirm"
                :rules="newPasswordConfirmRules"
                type="password"
                label="변경하실 새로운 password를 다시한번 입력하세요."
                required
              ></v-text-field>
              <v-btn
                :disabled="!valid"
                color="primary"
                depressed
                block
                large
                @click="updateUserData()"
              >
                수정
              </v-btn>
            </v-form>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProfileEdit',
  data() {
    return {
      valid: true,
      newEmail: null,
      newNickName: null,
      emailRules: [
        v => !!v || 'E-mail은 필수입니다.',
        v => /.+@.+\..+/.test(v) || 'E-mail이 유효하지 않습니다.'
      ],
      nickNameRules: [
        v => !!v || 'NickName은 필수입니다.',
        v => (v && v.length >= 2) || 'NickName은 2자리 이상이어야 합니다.',
        v => /^[a-zA-Z가-힣0-9]*$/.test(v) || 'NickName은 영문, 숫자만 허용됩니다.'
      ],
      password: null,
      passwordRules: [
        v => !!v || '현재 Password는 필수입니다.',
      ],
      newPassword: null,
      newPasswordRules: [
        v => !!v || '새로운 Password는 필수입니다.',
        v => (v && v.length >= 6) || 'Password는 6자리 이상이어야 합니다.'
      ],
      newPasswordConfirm: null,
      newPasswordConfirmRules: [
        v => !!v || '새로운 Password는 필수입니다.',
        v => v === this.newPassword || 'Password는 동일해야 합니다.'
      ],
      accountIssue: false
    }
  },
  created() {
    this.$store.dispatch('checkLogin')
    this.$store.dispatch('getUserData', this.uidData)
    this.newEmail = this.email
    this.newNickName = this.nickName
  },
  computed: {
    ...mapState([
      'uidData',
      'email',
      'nickName',
      'updateUserDataResult'
    ])
  },
  watch: {
    email(newVal) {
      this.newEmail = newVal
    },
    nickName(newVal) {
      this.newNickName = newVal
    },
    updateUserDataResult(newVal) {
      !newVal && (this.accountIssue = true)
    }
  },
  methods: {
    async updateUserData() {
      if(this.$refs.form.validate()) {
        try {
          // 재인증 완료 되면
          if(await this.reAuth(this.password)) {
            this.$store.dispatch('updateUserData', {
              email: this.newEmail,
              nickName: this.newNickName,
              password: this.newPassword
            })
          }else {
            this.accountIssue = true
          }
        } catch (error) {
          console.log(error)
          this.accountIssue = true
        }
      }
    },
    async reAuth(password) {
      let credential = this.$firebase.auth.EmailAuthProvider.credential(
        this.$firebase.auth().currentUser.email,
        password
      );

      return await this.$firebase.auth().currentUser.reauthenticateWithCredential(credential)
        .then(function() {
          console.log("success to reAuth")
          return true
        })
        .catch(function(error) {
          console.log(error)
          return false
        });
    }
  },
}
</script>