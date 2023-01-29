import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {messageStore} from "@/store";
import {PLAYER_ACTION} from "@/config/wordings";

const stomp = "https://api.pokerplanningonline.com/pokerplanning/stomp"
const roomTopic = "/topic/room/"
let stompClient = null;

export const pokerPlanningApi = {
  connect() {
    return new Promise((resolve, reject) => {
      if (!stompClient || !stompClient.connected) {
        stompClient = Stomp.over(new SockJS(stomp));
        stompClient.reconnect_delay = 2000;
        stompClient.connect({},
          () => resolve(true),
          error => reject(new Error(error))
        );
      } else {
        resolve(true);
      }
    });
  },

  subscribePrivateChannel(uuid) {
    return new Promise((resolve, reject) => {
      const store = messageStore();
      this.connect().then(
        () => {
          stompClient.subscribe("/topic/user/" + uuid, message => {
            store.room = JSON.parse(message.body)
          })
        },
      )
        .then(() => resolve(true))
        .catch(error => reject(error))
    })


  },
  createRoom(clientId) {
    stompClient.send("/room/" + clientId, {})
  },
  subscribeRoom(roomId) {
    return new Promise((resolve, reject) => {
      const store = messageStore();
      this.connect().then(
        () => {
          stompClient.subscribe(roomTopic + roomId, message => {
            store.room = JSON.parse(message.body)
          })
        },
      )
        .then(() => resolve(true))
        .catch(error => reject(error))
    })
  },
  play(roomId, player) {
    return new Promise((resolve, reject) => {
      this.connect().then(
        () =>
          stompClient.send("/room/" + roomId + "/play", {}, JSON.stringify({
            id: player.id,
            name: player.name,
            card: player.card,
            action: PLAYER_ACTION.PLAY
          })),
      )
        .then(() => resolve(true))
        .catch(error => reject(error))
    })
  },
  revealGame(roomId) {
    return new Promise((resolve, reject) => {
      this.connect().then(
        () =>
          stompClient.send("/room/" + roomId + "/reveal", {}),
      )
        .then(() => resolve(true))
        .catch(error => reject(error))
    })
  },
  resetGame(roomId) {
    return new Promise((resolve, reject) => {
      this.connect().then(
        () =>
          stompClient.send("/room/" + roomId + "/reset", {}),
        error => alert(error)
      )
        .then(() => resolve(true))
        .catch(error => reject(error))
    })
  },
  switchPlayer(roomId, player, PLAYER_ACTION) {
    return new Promise((resolve, reject) => {
      this.connect().then(
        () =>
          stompClient.send("/room/" + roomId + "/player", {}, JSON.stringify({
            id: player.id,
            name: player.name,
            card: null,
            action: PLAYER_ACTION
          })),
      )
        .then(() => resolve(true))
        .catch(error => reject(error))
    })
  },
  disconnect() {
    if (stompClient) {
      stompClient.disconnect();
    }
  }
}