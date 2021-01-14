<template>
  <v-container fill-height style="max-width: 450px;">
    <v-layout align-center row wrap>
      <v-flex xs-12>
        <v-alert
          type="error"
          v-if="accountIssue"
        >
          아이디와 비밀번호를 확인해주세요.
        </v-alert>
        <v-card>
          <v-toolbar dense flat dark height="60">
            <v-toolbar-title>프로필</v-toolbar-title>
          </v-toolbar>
          <div class="pa-3">
            <v-row>
              <v-col sm=4>
                <v-switch
                  v-model="switchEmail"
                  :label="'Email 변경'"
                ></v-switch>
              </v-col>
              <v-col sm=8 v-if="switchEmail">
                <v-text-field
                  v-model="newEmail"
                  :rules="newEmailRules"
                  label="변경하실 E-mail을 입력하세요."
                ></v-text-field>
              </v-col>
              <v-col sm=8 v-else>
                <v-text-field
                  v-model="email"
                  label="현재 E-mail"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm=4>
                <v-switch
                  v-model="switchNickName"
                  :label="'NickName 변경'"
                ></v-switch>
              </v-col>
              <v-col sm=8 v-if="switchNickName">
                <v-text-field
                  v-model="newNickName"
                  :rules="newNickNameRules"
                  label="변경하실 NickName을 입력하세요."
                  required
                ></v-text-field>
              </v-col>
              <v-col sm=8 v-else>
                <v-text-field
                  v-model="nickName"
                  label="현재 NickName"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm=4>
                <v-switch
                  v-model="switchPassword"
                  :label="'Password 변경'"
                ></v-switch>
              </v-col>
              <v-col sm=8 v-if="switchPassword">
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  type="password"
                  label="현재 password를 입력하세요."
                ></v-text-field>
              </v-col>
            </v-row>
            <v-text-field
              v-if="switchPassword"
              v-model="newPassword"
              :rules="newPasswordRules"
              type="password"
              label="변경하실 새로운 password를 입력하세요."
            ></v-text-field>
            <v-text-field
              v-if="switchPassword"
              v-model="newPasswordConfirm"
              :rules="newPasswordConfirmRules"
              type="password"
              label="변경하실 새로운 password를 다시한번 입력하세요."
            ></v-text-field>
            <v-btn
              v-if="switchEmail || switchNickName || switchPassword"
              color="primary"
              depressed
              block
              large
              @click="updateUserData(switchEmail, switchNickName, switchPassword)"
            >
              수정
            </v-btn>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Profile',
  data() {
    return {
      newEmail: null,
      newEmailRules: [
        v => !!v || 'E-mail은 필수입니다.',
        v => /.+@.+\..+/.test(v) || 'E-mail이 유효하지 않습니다.'
      ],
      switchEmail: false,
      newNickName: null,
      newNickNameRules: [
        v => !!v || 'NickName은 필수입니다.',
        v => (v && v.length >= 2) || 'NickName은 2자리 이상이어야 합니다.',
        v => /^[a-zA-Z가-힣0-9]*$/.test(v) || 'NickName은 영문, 숫자만 허용됩니다.'
      ],
      switchNickName: false,
      switchPassword: false,
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

  },
  computed: {
    ...mapState([
      'uidData',
      'email',
      'nickName',
      'updateEmailResult'
    ])
  },
  methods: {
    updateUserData(switchEmail, switchNickName, switchPassword) {
      if(switchPassword) {
        this.reAuthPassword(this.password)
      } else {
        switchEmail && this.$store.dispatch('updateEmail', this.newEmail)
        switchNickName && this.$store.dispatch('updateNickName', this.newNickName)
      }
    },
    reAuthPassword(password) {
      let credential = this.$firebase.auth.EmailAuthProvider.credential(
        this.$firebase.auth().currentUser.email,
        password
      );

      this.$firebase.auth().currentUser.reauthenticateWithCredential(credential).then(function() {
        console.log("success to reAuth")
        switchEmail && this.$store.dispatch('updateEmail', this.newEmail)
        switchNickName && this.$store.dispatch('updateNickName', this.newNickName)
        this.$store.dispatch('updatePassword')
      }).catch(function(error) {
        this.accountIssue = true
        console.log(error)
      });
    }
  },
}
</script>