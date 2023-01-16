import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {messageStore} from "@/store";

const stomp = "http://localhost:8080/stomp"
const roomTopic = "/topic/room/"
let stompClient = null;

export const pokerPlanningApi = {

  checkConnection(roomId) {
      return this.connect(roomId);
  },

  connect(roomId) {
    return new Promise(function (resolve, reject) {
        if (!stompClient || !stompClient.connected) {
          const store = messageStore();
          stompClient = Stomp.over(new SockJS(stomp));
          stompClient.reconnect_delay = 2000;
          stompClient.connect(
            {},
            frame => {
              console.log(frame);
              stompClient.subscribe(roomTopic + roomId, message => {
                store.room = JSON.parse(message.body)
              });
              resolve(true);
            },
            error => {
              console.log(error);
              reject(new Error("connection KO"))
            }
          );
        } else {
          resolve(true);
        }
    });
  },

  create(roomId) {
    this.checkConnection(roomId).then(
      () => stompClient.send("/room/" + roomId, {}),
      error => alert(error) // ne se lance pas
    );
  },
  play(roomId, player) {
    this.checkConnection(roomId).then(
      () => stompClient.send("/room/" + roomId + "/play", {}, JSON.stringify({
        id: player.id,
        name: player.name,
        card: player.card
      })),
      error => alert(error) // ne se lance pas
    );
  },
  addPlayer(roomId, player) {
    this.checkConnection(roomId).then(
      () => stompClient.send("/room/" + roomId + "/addPlayer", {}, JSON.stringify({
        id: player.id,
        name: player.name
      })),
      error => alert(error) // ne se lance pas
    );
  },

  disconnect() {
    if (stompClient) {
      stompClient.disconnect();
    }
  },
}