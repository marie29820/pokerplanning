import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {messageStore} from "@/store";

const stomp = "http://localhost:8080/stomp"
const roomTopic = "/topic/room/"

let stompClient = null;

export const pokerPlanningApi = {

  checkConnection() {
    return this.connect();
  },

  connect(callback) {
    return new Promise(function (resolve, reject) {
      if (!stompClient || !stompClient.connected) {
        stompClient = Stomp.over(new SockJS(stomp));
        stompClient.reconnect_delay = 2000;
        stompClient.connect(
          {}, () => {
            if (callback) {
              callback(stompClient)
            }
            resolve(true);
          },
          error => reject(new Error(error))
        );
      } else {
        resolve(true);
      }
    });
  },

  create(clientId) {
    stompClient.send("/room/" + clientId, {})
  },

  subscribe(roomId) {
    const store = messageStore();
    this.checkConnection().then(
      () => {
        stompClient.subscribe(roomTopic + roomId, message => {
          store.room = JSON.parse(message.body)
        })
      },
    );
  },

  play(roomId, player) {
    this.checkConnection().then(
      () =>
        stompClient.send("/room/" + roomId + "/play", {}, JSON.stringify({
          id: player.id,
          name: player.name,
          card: player.card,
        })),
      error => alert(error)
    );
  },

  reveal(roomId) {
    this.checkConnection().then(
      () =>
        stompClient.send("/room/" + roomId + "/reveal", {}),
      error => alert(error)
    );
  },
  reset(roomId) {
    this.checkConnection().then(
      () =>
        stompClient.send("/room/" + roomId + "/reset", {}),
      error => alert(error)
    );
  },
  addPlayer(roomId, player) {
    this.checkConnection().then(
      () =>
        stompClient.send("/room/" + roomId + "/player", {}, JSON.stringify({
          id: player.id,
          name: player.name
        })),
      error => alert(error)
    );
  },

  disconnect() {
    if (stompClient) {
      stompClient.disconnect();
    }
  },
}