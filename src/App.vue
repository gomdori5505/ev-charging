<template>
  <v-app id="inspire">
    <v-card
      color="grey lighten-4"
      flat
      tile
    >
      <v-toolbar>
        <v-btn
          text
          router :to='{
            name: "home"
          }'
          exact
        >
          EV
        </v-btn>
        <v-spacer></v-spacer>
        <div v-if="checkLoginData === 1">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                v-bind="attrs"
                v-on="on"
                exact
              >
                마이페이지
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                link
                router :to='{
                  name: "mypage",
                  params: {
                    page: "profile"
                  }
                }'
              >
                <v-list-item-title>
                  aaa
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>bbb</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>ccc</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            text
            exact
            @click="signout()"
          >
            로그아웃
          </v-btn>
        </div>
        <div v-else-if="checkLoginData === 0">
          <v-btn
            text
            router :to='{
              name: "signup"
            }'
            exact
          >
            회원가입
          </v-btn>
          <v-btn
            text
            router :to='{
              name: "login"
            }'
            exact
          >
            로그인
          </v-btn>
        </div>
      </v-toolbar>
      <v-snackbar
        v-model="$store.state.snackBarStatus"
        :timeout="timeout"
        absolute
        top
        color="success"
      >
        {{ $store.state.snackBarText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="$store.state.snackBarStatus = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-card>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      timeout: 4000
    }
  },
  methods: {
    signout() {
      this.$firebase.auth().signOut().then(() => {
        this.$store.dispatch('snackBarOpen', '로그아웃 되었습니다.')
        this.$router.push({
          name: 'home'
        }).catch(()=>{}) // home에서 home으로 가려고하면 에러뜸. 무시하기위해 catch
      }).catch(error => {
        console.log(error)
      });
    }
  },
  created() {
    this.$store.dispatch('checkLogin')
  },
  computed: {
    ...mapState([
      'checkLoginData'
    ])
  }
};
</script>
