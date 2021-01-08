<template>
    <v-main>
      <v-card
        color="grey lighten-4"
        flat
        tile
      >
        <v-toolbar>
          <v-spacer></v-spacer>
          
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
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
};
</script>
