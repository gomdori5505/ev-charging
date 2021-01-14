<template>
  <div v-if="$route.params.page === 'profile'">
    <Profile />
  </div>
  <div v-else>
    profile else
  </div>
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