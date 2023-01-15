import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {messageStore} from "@/store";

const stomp = "http://localhost:8080/stomp"
const topic = "/topic/room"
let stompClient = null;
export const pokerPlanningApi = {

  connect() {
    const store = messageStore();
    store.connected = false;
    stompClient = Stomp.over(new SockJS(stomp));
    stompClient.reconnect_delay = 2000;
    stompClient.connect(
      {},
      frame => {
        console.log(frame);
        stompClient.subscribe(topic, message => {
          store.room = JSON.parse(message.body)
        });
        store.connected = true;
      },
      error => {
        console.log(error);
        store.connected = false;
      }
    );
  },
  create() {
    if (stompClient && stompClient.connected) {
      stompClient.send("/room/create", {});
    }
  },
  addPlayer(roomId, player) {
    if (stompClient && stompClient.connected) {
      stompClient.send("/room/addPlayer", {}, JSON.stringify({
        roomId: roomId,
        id: player.id,
        name: player.name
      }));
    }
  },
  disconnect() {
    if (stompClient) {
      stompClient.disconnect();
    }
  },
}