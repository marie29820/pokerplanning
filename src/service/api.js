import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {messageStore} from "@/store";

const stomp = "http://http://tomcat-lb-1477370552.us-east-1.elb.amazonaws.com/pokerplanning/stomp"
const roomTopic = "/topic/room/"

let stompClient = null;

export const pokerPlanningApi = {
  connect(callback) {
    return new Promise((resolve, reject) => {
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
          })),
      )
        .then(() => resolve(true))
        .catch(error => reject(error))
    })
  },
  reveal(roomId) {
    return new Promise((resolve, reject) => {
      this.connect().then(
        () =>
          stompClient.send("/room/" + roomId + "/reveal", {}),
      )
        .then(() => resolve(true))
        .catch(error => reject(error))
    })
  },
  reset(roomId) {
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
  addPlayer(roomId, player) {
    return new Promise((resolve, reject) => {
      this.connect().then(
        () =>
          stompClient.send("/room/" + roomId + "/player", {}, JSON.stringify({
            id: player.id,
            name: player.name
          })),
      )
        .then(() => resolve(true))
        .catch(error => reject(error))
    })
  }
  ,
  disconnect() {
    if (stompClient) {
      stompClient.disconnect();
    }
  }
}
