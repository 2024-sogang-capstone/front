<template>
  <div class="hello">
    <form @submit.prevent="submitAction">
      <input type="text" placeholder="Type your emotion!" v-model="inputValue" name="input">
      <button type="submit">Enter</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HelloWorld',
  data() {
    return {
      inputValue: ''
    };
  },
  methods: {
    async submitAction() {
      console.log(this.inputValue);

      const input = this.inputValue;
      const email = 'test@gmail.com';

      try {
        const response = await axios.post(
          'http://ec2-43-200-182-138.ap-northeast-2.compute.amazonaws.com/api/v1/chat',
          { input },
          {
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Accept-Charset': 'utf-8',
              'user-email': email
            }
          }
        );

        const result = response.data.data;
        const emotion = result.emotion;
        const songs = result.songs;

        console.log(emotion);
        songs.forEach((song) => {
          console.log(`제목 : ${song.title}, 가수 : ${song.singer}, 링크 : ${song.link}`);
        });
      } catch (error) {
        console.error('Error fetching music:', error);
      }
    }
  }
}
</script>