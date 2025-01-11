class Display {
    constructor() {
      this.gameStatusElem = document.getElementById('game-status');
      this.elapsedTimeElem = document.getElementById('elapsed-time');
      this.lapsLeftElem = document.getElementById('laps-left');
      this.airLayerElem = document.getElementById('air-layer');
      this.vouchersElem = document.getElementById('vouchers');
      this.positionElem = document.getElementById('position');
      this.heightElem = document.getElementById('height');
      this.elapsedTime = 0;
      this.lapsCompleted = 0;
      this.airLayer = "Low";
      this.vouchers = 0;
      this.gameRunning = false;
      this.position = 'A';
      this.height = 0;
    }
  
  
    updateGameStatus(status) {
      this.gameStatusElem.textContent = status;
      switch (status) {
        case "Initial":
          this.gameRunning = false;
          this.elapsedTime = 0;
          this.elapsedTimeElem.textContent = "0:0";
          this.gameStatusElem.textContent = status;
          break;
        case "Running":
          this.gameRunning = true;
          break;
        case "Paused":
          this.gameRunning = false;
          break;
        case "Finished":
          this.gameRunning = false;
          break;
        case "Paused due to obstacle!":
          break;
        default:
          console.warn("Invalid game status.");
          break;
      }
    }
  
    updateLaps(laps) {
      this.lapsCompleted = laps;
      this.lapsLeftElem.textContent = laps;
    }
  
    updateAirLayer(layer) {
      this.airLayer = layer;
      this.airLayerElem.textContent = layer;
    }
  
    updateVouchers(count) {
      this.vouchers = count;
      this.vouchersElem.textContent = count;
    }
  
    updateTimer(time) {
      this.elapsedTime = time;
      this.elapsedTimeElem.textContent = `${Math.floor(time / 60)}:${time % 60}`;
    }

    updatePosition(position){
      this.position = position;
      this.positionElem.textContent = position;
    }

    updateHeight(height){
      this.height =4
      this.heightElem.textContent = height;
    }

  }
  

  export default  Display;