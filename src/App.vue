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
      </v-toolbar>
    </v-card>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>


export default {
  name: 'App',
  mounted() {
    console.log(this.$firebase)
  },
};
</script>
