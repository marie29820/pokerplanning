<template>
  <div id="canvas-container"></div>
</template>

<script>
import confetti from "canvas-confetti";

export default {
  name: "explode",
  data() {
    return {
      colors: ["#8b5642", "#6a696b"],
    };
  },
  methods: {
    frame() {
      let myCanvas = document.createElement('canvas');
      myCanvas.style.width = '100%';
      myCanvas.style.height = '100%';
      document.getElementById('canvas-container').appendChild(myCanvas);

      let myConfetti = confetti.create(myCanvas, {
        resize: true,
        useWorker: true
      });
      myConfetti({
        particleCount: 500,
        angle: 210,
        spread: 100,
        origin: { x: 1.1, y:0 },
      });
    },
  },
  mounted() {
    this.frame();
  },
}
</script>

<style scoped>
#canvas-container {
  font-family: "Arial";
  font-size: 4em;
  text-align: center;
  white-space: nowrap;
  position: fixed;
  z-index: -100;
  height: 100%;
  width: 100%;
}
#myCanvas{
  height: 100%!important;
  width: 100%!important;
}
</style>