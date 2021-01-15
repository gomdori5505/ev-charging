<template>
  <span v-if="$route.params.page === 'profile'">
    <Profile />
  </span>
  <span v-else>
    profile else
  </span>
</template>

<script>
import Profile from '../components/Profile'

export default {
  name: "Mypage",
  components: {
    Profile
  },
}
</script>