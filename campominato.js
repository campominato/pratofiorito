var DIM = 24;
var NUM_BOMBE = 88;
var griglia = [];
var scoperto = [];
var bandiera = [];
var gameOver = false;
var vittoria = false;
var gameFinished = false;
var bombeRimaste;
var DIM_CELLA;

function setup() {
  createCanvas(windowWidth, windowHeight);
  windowResized();
  inizializzaGriglia();
  contaBombeVicine();
  bombeRimaste = NUM_BOMBE;

  // Prevenire il comportamento predefinito del touch sui dispositivi mobili
  let canvasElement = document.querySelector('canvas');
  canvasElement.addEventListener('touchstart', function(e) {
    e.preventDefault();
  }, { passive: false });
}

function draw() {
  background(0);
  fill(255);
  textAlign(LEFT, TOP);
  textSize(20);
  text("Bombe rimaste: " + bombeRimaste, 10, 10);
  mostraGriglia();
  controllaVittoria();
  if (gameOver || vittoria) {
    opacizzaGriglia();
    mostraPopup();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  DIM_CELLA = min(windowWidth, windowHeight) / DIM;
}

function opacizzaGriglia() {
  fill(0, 150);
  rect(0, 0, width, height);
}

function mostraPopup() {
  textAlign(CENTER, CENTER);
  textSize(40);
  if (vittoria) {
    fill(0, 255, 0);
    text("Hai vinto!", width / 2, height / 2);
  } else {
    fill(255, 0, 0);
    text("Hai perso!", width / 2, height / 2);
  }
}

function mousePressed() {
  var offsetX = (width - DIM * DIM_CELLA) / 2;
  var offsetY = (height - DIM * DIM_CELLA) / 2;
  var x = int((mouseX - offsetX) / DIM_CELLA);
  var y = int((mouseY - offsetY) / DIM_CELLA);
  
  if (gameOver || vittoria) {
    return;
  }

  if (x >= 0 && x < DIM && y >= 0 && y < DIM) {
    if (mouseButton === LEFT) {
      scopriCella(x, y);
    } else if (mouseButton === RIGHT) {
      if (!bandiera[x][y] && bombeRimaste > 0) {
        bandiera[x][y] = true;
        bombeRimaste--;
      } else if (bandiera[x][y]) {
        bandiera[x][y] = false;
        bombeRimaste++;
      }
    }
  }
}

function scopriCella(x, y) {
  if (!scoperto[x][y] && !bandiera[x][y]) {
    scoperto[x][y] = true;
    if (griglia[x][y] === -1) {
      gameOver = true;
    } else if (griglia[x][y] === 0) {
      scopriAdiacenti(x, y);
    }
  }
}

// Funzione per scoprire celle adiacenti
function scopriAdiacenti(x, y) {
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      var nuovoX = x + i;
      var nuovoY = y + j;
      if (nuovoX >= 0 && nuovoX < DIM && nuovoY >= 0 && nuovoY < DIM) {
        scopriCella(nuovoX, nuovoY);
      }
    }
  }
}

function inizializzaGriglia() {
  for (var x = 0; x < DIM; x++) {
    griglia[x] = [];
    scoperto[x] = [];
    bandiera[x] = [];
    for (var y = 0; y < DIM; y++) {
      griglia[x][y] = 0;
      scoperto[x][y] = false;
      bandiera[x][y] = false;
    }
  }
  
  // Posizionare le bombe
  var bombePosizionate = 0;
  while (bombePosizionate < NUM_BOMBE) {
    var x = int(random(DIM));
    var y = int(random(DIM));
    if (griglia[x][y] !== -1) {
      griglia[x][y] = -1;
      bombePosizionate++;
    }
  }
}

function contaBombeVicine() {
  for (var x = 0; x < DIM; x++) {
    for (var y = 0; y < DIM; y++) {
      if (griglia[x][y] === -1) continue;
      var bombeVicine = 0;
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          var nuovoX = x + i;
          var nuovoY = y + j;
          if (nuovoX >= 0 && nuovoX < DIM && nuovoY >= 0 && nuovoY < DIM) {
            if (griglia[nuovoX][nuovoY] === -1) {
              bombeVicine++;
            }
          }
        }
      }
      griglia[x][y] = bombeVicine;
    }
  }
}

function controllaVittoria() {
  if (bombeRimaste === 0) {
    var tutteBandierate = true;
    for (var x = 0; x < DIM; x++) {
      for (var y = 0; y < DIM; y++) {
        if (griglia[x][y] === -1 && !bandiera[x][y]) {
          tutteBandierate = false;
        }
      }
    }
    if (tutteBandierate) {
      vittoria = true;
    }
  }
}
