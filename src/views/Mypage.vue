<template>
  <span v-if="$route.params.page === 'profile'">
    <Profile />
  </span>
  <span v-else-if="$route.params.page === 'favorite'">
    <Favorite />
  </span>
  <span v-else>
    profile else
  </span>
</template>

<script>
import Profile from '../components/Profile'
import Favorite from '../components/Favorite'

export default {
  name: "Mypage",
  components: {
    Profile,
    Favorite
  },
}
</script>