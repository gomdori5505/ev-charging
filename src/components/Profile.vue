<template>
  <v-container fill-height style="max-width: 450px;">
    <v-layout align-center row wrap>
      <v-flex xs-12>
        <v-card>
          <v-toolbar dense flat dark height="60">
            <v-toolbar-title>프로필</v-toolbar-title>
          </v-toolbar>
          <div class="pa-3">
            <v-text-field
              v-model="email"
              label="현재 E-mail"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="nickName"
              label="현재 NickName"
              readonly
            ></v-text-field>
            <v-btn
              color="primary"
              depressed
              block
              large
              router :to='{
                name: "profileEdit",
                params: {
                  page: "edit"
                }
              }'
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
      'nickName'
    ])
  }
}
</script>