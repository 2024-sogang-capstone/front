<template>
 <div id="app">
    <img
      alt="Vue Bot UI"
      src="./assets/logo.png"
    />
    <div id="ChatBox">
      <VueBotUI
      :options="botOptions"
      :messages="messageData"
      :bot-typing="botTyping"
      :input-disable="inputDisable"
      :is-open="true"
      @msg-send="msgSend"
    />
    </div>
  </div>
  </template>
  <script>
  // import BotIcon from './assets/icons/bot.png'
  import { VueBotUI } from 'vue-bot-ui'
  // import { messageService } from './helpers/message'
  import axios from 'axios'

  export default {
    components: {
      VueBotUI
    },
  
    data () {
      return {
        userInput: '',
        messageData: [],
        botTyping: false,
        inputDisable: false,
        botOptions: {
          botAvatarImg: './assets/icons/bot.png',
          boardContentBg: '#f4f4f4',
          msgBubbleBgBot: '#fff',
          bubbleBtnSize: 0,
          inputPlaceholder: 'Type hereeee...',
          inputDisableBg: '#fff',
          inputDisablePlaceholder: 'Hit the buttons above to respond'
        }
      }
    },
  
    methods: {
      // botStart () {
      //   // Get token if you want to build a private bot
      //   // Request first message here
  
      //   // Fake typing for the first message
      //   this.botTyping = true
      //   setTimeout(() => {
      //     this.botTyping = false
      //     this.messageData.push({
      //       agent: 'bot',
      //       type: 'text',
      //       text: '안녕하세요. 무엇을 도와드릴까요?'
      //     })
      //   }, 1000)
      // },
  
      msgSend (value) {
        // Push the user's message to board
        this.userInput = value.text
        this.messageData.push({
          agent: 'user',
          type: 'text',
          text: value.text
        })
  
        this.getResponse()
      },
  
      // Submit the message from user to bot API, then get the response from Bot
      async getResponse () {
        // Loading
        this.botTyping = true
  
        // Post the message from user here
        // Then get the response as below
  
        // Create new message from fake data
        // messageService.createMessage(this.userInput)
        //   .then((res) => {
        //     const replyMessage = {
        //       agent: 'bot',
        //       ...res
        //     }
        //     this.inputDisable = res.disableInput
        //     this.messageData.push(replyMessage)
        //     console.log(replyMessage)
        //     // finish
        //     this.botTyping = false
              
        //     })
        const input = this.userInput
        console.log("input is : " + input)
        const email = 'test@gmail.com'
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
        )

        const result = response.data.data;
          
        this.inputDisable = false;
        
        let messageText = `입력하신 문장의 감정 분석 결과는 '${result.emotion}' 입니다.` + "\n1"
        
        let replyMessage = {
          agent: 'bot',
          type: 'text',
          text: messageText,
        }
        console.log(messageText)
        this.messageData.push(replyMessage)

        messageText = `해당 감정을 기반으로 추천된 노래 결과는 다음과 같습니다. <br>`
        replyMessage = {
          agent: 'bot',
          type: 'text',
          text: messageText,
        }
        this.messageData.push(replyMessage)

        messageText = ''
        const songs = result.songs;
        let songNum = 1
        songs.forEach((song) => {
          messageText += `${songNum}. ${song.title}` + "\n" + `가수: ${song.singer}<br>link: ${song.link}` + "\n"
          songNum++
        })
        replyMessage = {
          agent: 'bot',
          type: 'text',
          text: `${messageText}`,
        }
        this.messageData.push(replyMessage)
        console.log(replyMessage.text)
        this.botTyping = false
        // console.log(replyMessage)
        console.log(result)
        return result
      }
    }
  }
  </script>
  <style lang="scss">
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    justify-content: center;
    align-items: center;
  }
  .qkb-board {
  display: flex;
  flex-direction: column;
  position: absolute;
  overflow: hidden;
  // width: $board-width;
  height: 80vh;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 10px;
  // border-radius: $board-radius;
  // background-color: $board-bg;
  box-shadow: 0 3px 30px 0 rgba(0, 0, 0, .15);
}
  </style>