<template>
    <v-main>
      <v-card
        color="grey lighten-4"
        flat
        tile
      >
        <v-toolbar>
          <v-spacer></v-spacer>
          <v-btn text>
            회원가입
          </v-btn>

          <v-btn text>
            로그인
          </v-btn>
        </v-toolbar>
      </v-card>
      <router-view />
    </v-main>
</template>

<script>


export default {
  name: 'App',

  data: () => ({
    //
  }),
  mounted() {
    console.log(this.$firebase)
  },
};
</script>
