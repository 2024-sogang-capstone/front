<template>
  <VueBotUI
    :options="botOptions"
    :messages="messageData"
    :bot-typing="botTyping"
    :input-disable="inputDisable"
    :is-open="true"
    @init="botStart"
    @msg-send="msgSend"
  />
</template>
<script>
import { VueBotUI } from 'vue-bot-ui';
import axios from 'axios';

export default {
  components: {
    VueBotUI,
  },

  data() {
    return {
      userInput: '',
      messageData: [],
      username: '',
      isFirstMessage: true,
      botTyping: false,
      inputDisable: false,
      botOptions: {
        botTitle: '뮤즈릭테일',
        botAvatarImg: './assets/icons/bot.png',
        boardContentBg: '#f4f4f4',
        msgBubbleBgBot: '#fff',
        bubbleBtnSize: 0,
        inputPlaceholder: '당신의 이야기를 들려주세요',
        inputDisableBg: '#fff',
        inputDisablePlaceholder: 'Hit the buttons above to respond',
      },
    };
  },

  methods: {
    botStart() {
      this.botTyping = true;
      setTimeout(() => {
        this.botTyping = false;
        this.messageData.push({
          agent: 'bot',
          type: 'text',
          text: `
            안녕하세요 뮤즈릭테일입니다.
            감정을 기반으로 노래를 추천해드릴게요. 
            먼저 이름을 알려주세요.
          `,
        });

        /**
         * 한글 입력이 두 번 되는 문제 해결을 위해서, vue-bot-ui의 input을 제거하고 직접 eventListener를 추가
         */
        const oldInput = document.querySelector('.qkb-board-action__input');
        const newInput = oldInput.cloneNode(true);
        oldInput.parentNode.replaceChild(newInput, oldInput);

        newInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && e.isComposing === false) {
            this.msgSend({ text: e.target.value });
            newInput.value = '';
          }
        });
      }, 1000);
    },

    async msgSend(value) {
      this.userInput = value.text;
      this.messageData.push({
        agent: 'user',
        type: 'text',
        text: value.text,
      });

      if (this.isFirstMessage) {
        this.isFirstMessage = false;
        this.username = value.text.trim();
        this.botTyping = true;
        setTimeout(() => {
          this.botTyping = false;
          this.messageData.push({
            agent: 'bot',
            type: 'text',
            text: `${this.username}님 이제 감정을 분석해볼게요. 당신의 이야기를 들려주세요.`,
          });
        }, 1000);
        return;
      }

      this.getResponse();
    },

    async getResponse() {
      this.botTyping = true;
      const input = this.userInput;
      const email = 'test@gmail.com';

      const response = await axios.post(
        'http://ec2-43-200-182-138.ap-northeast-2.compute.amazonaws.com/api/v1/chat',
        { input },
        {
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Accept-Charset': 'utf-8',
            'user-email': email,
          },
        }
      );

      const result = response.data.data;
      this.inputDisable = true;

      await this.sendMessage(
        `현재 ${this.username}님의 감정은 "${result.emotion}" 이군요. 해당 감정에 어울리는 노래를 추천해드릴게요.`
      );

      await this.sendBtnMessage(
        `${this.username}님의 감정을 바탕으로 ${result.songs.length}개의 노래를 추천해드렸어요.`,
        result.songs
      );

      await this.sendMessage(
        `더 많은 노래를 추천받고 싶으시면, 또 다른 이야기를 들려주세요.`
      );

      setTimeout(() => {
        this.inputDisable = false;
        this.botTyping = false;
      }, 2000);
      return result;
    },

    async sendMessage(message) {
      setTimeout(() => {
        this.messageData.push({
          agent: 'bot',
          type: 'text',
          text: message,
        });
      }, 1000);
    },

    async sendBtnMessage(message, songs) {
      setTimeout(() => {
        this.messageData.push({
          agent: 'bot',
          type: 'button',
          text: message,
          options: songs.map((song) => {
            return {
              text: `${song.title} - ${song.singer}`,
              value: `${song.link}`,
              action: 'url',
            };
          }),
        });
      }, 1000);
    },
  },
};
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  justify-content: center;
  align-items: center;
  font-size: 10em;
}
.qkb-board {
  display: flex;
  overflow: hidden;
  height: 95vh;
  width: 97vw;
  justify-content: center;
  box-shadow: 0 3px 30px 0 rgba(0, 0, 0, 0.15);
}
.qkb-msg-bubble-component {
  font-size: 1.5em;
}
</style>
