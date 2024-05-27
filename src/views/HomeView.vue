<template>
  <div class="home">
    <img alt="Vue logo" src="https://asset.cloudinary.com/dwm1uksw4/d2958b38b5b5ebac15c254af6a4a9d2a">
    <!-- <HelloWorld msg="???.js App"/> -->
    <InputBox />
    <about v-if="sharedInputValue"/>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import InputBox from '@/components/InputBox.vue'
import about from '@/views/AboutView.vue'

export default {
  name: 'HomeView',
  components: {
    InputBox,
    about
  },
  data: () =>({
    sharedInputValue : '',
  })
}
</script>
