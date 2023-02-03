import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {messageStore} from "@/store";
import {utils} from "@/service/utils";

const stomp = "https://api.pokerplanningonline.com/pokerplanning/stomp"
// const stomp = "http://localhost:8080/pokerplanning/stomp"
const roomTopic = "/topic/room/"
let stompClient = null;
let uuid = utils.uuidv4();

export const pokerPlanningApi = {
  connect() {
    return new Promise((resolve, reject) => {
      if (!stompClient || !stompClient.connected) {
        stompClient = Stomp.over(new SockJS(stomp, null, {sessionId: () => uuid}));
        stompClient.reconnect_delay = 2000;
        stompClient.connect(
          {},
          () => {
            resolve(uuid)
          },
          error => reject(new Error(error)),
          () => console.log('ws close')
        );
      } else {
        resolve(uuid);
      }
    });
  },
  subscribeRoom(roomId) {
    return new Promise((resolve, reject) => {
      const store = messageStore();
      this.connect().then(
        () => {
          stompClient.subscribe(roomTopic + roomId, message => {
            store.room = JSON.parse(message.body)
          })
        }
      ).then(() => resolve(true))
        .catch(error => reject(error))
    })
  },
  play(roomId, player) {
    return new Promise((resolve, reject) => {
      this.connect().then(
        () => {
          stompClient.send("/room/" + roomId + "/play", {}, JSON.stringify({
            id: player.id,
            name: player.name,
            card: player.card,
          }))
        }
      ).then(() => resolve(true))
        .catch(error => reject(error))
    })
  },
  addPlayer(roomId, player) {
    return new Promise((resolve, reject) => {
      this.connect().then(
        () => {
          stompClient.send("/room/" + roomId + "/player", {}, JSON.stringify({
            name: player.name,
          }))
        }
      ).then(() => resolve(true))
        .catch(error => reject(error))
    })
  },
  revealGame(roomId) {
    return new Promise((resolve, reject) => {
      this.connect().then(
        () => {
          stompClient.send("/room/" + roomId + "/reveal", {})
        }
      ).then(() => resolve(true))
        .catch(error => reject(error))
    })
  },
  resetGame(roomId) {
    return new Promise((resolve, reject) => {
      this.connect().then(
        () => {
          stompClient.send("/room/" + roomId + "/reset", {})
        }
      ).then(() => resolve(true))
        .catch(error => reject(error))
    })
  },
  disconnect() {
    if (stompClient) {
      stompClient.disconnect();
    }
  }
}