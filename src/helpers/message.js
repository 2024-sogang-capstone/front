import { fakeMessages } from './fake-messages'

export const messageService = {
  createMessage
}

function createMessage() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let randomNumber = Math.floor(Math.random() * fakeMessages.length);
      if (randomNumber % 2 === 0) {
        resolve(fakeMessages[randomNumber]);
      } else {
        reject(new Error('Failed to create message'));
      }
    }, 1000);
  });
}