

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
var currentAction = "discover";

function setup() {
  createCanvas(windowWidth, windowHeight);
  windowResized();
  inizializzaGriglia();
  contaBombeVicine();
  bombeRimaste = NUM_BOMBE;

  // Aggiungi event listener per i pulsanti
  document.getElementById('discoverButton').addEventListener('click', () => {
    currentAction = "discover";
    document.getElementById('discoverButton').classList.add('active');
    document.getElementById('flagButton').classList.remove('active');
  });
  document.getElementById('flagButton').addEventListener('click', () => {
    currentAction = "flag";
    document.getElementById('flagButton').classList.add('active');
    document.getElementById('discoverButton').classList.remove('active');
  });

  // Imposta il pulsante "Scopri" come predefinito attivo
  document.getElementById('discoverButton').classList.add('active');
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
  var popupWidth = windowWidth * 0.4; // 80% della larghezza dello schermo
  var popupHeight = windowHeight * 0.15; // 40% dell'altezza dello schermo
  var popupX = (windowWidth - popupWidth) / 2;
  var popupY = (windowHeight - popupHeight) / 2;

  // Disegna il rettangolo nero
  fill(0);
  rect(popupX, popupY, popupWidth, popupHeight, 20); // Angoli arrotondati

  // Testo centrale ("Hai perso!" o "Hai vinto!")
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(windowWidth * 0.05); // 5% della larghezza dello schermo per il testo
  var messaggio = gameOver ? "Hai perso!" : "Hai vinto!";
  text(messaggio, popupX + popupWidth / 2, popupY + popupHeight / 3);

  // Dimensioni e posizione del pulsante "Rigioca"
  var buttonWidth = popupWidth * 0.4; // 30% della larghezza del popup
  var buttonHeight = popupHeight * 0.2; // 15% dell'altezza del popup
  var buttonX = popupX + (popupWidth - buttonWidth) / 2;
  var buttonY = popupY + popupHeight - buttonHeight - windowHeight * 0.02; // Margine inferiore di 2% dell'altezza dello schermo

  fill(178, 34, 34);
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 10); // Angoli arrotondati

  // Testo del pulsante "Rigioca"
  fill(255);
  textSize(windowWidth * 0.04); // 4% della larghezza dello schermo per il testo del pulsante
  text("Rigioca", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

function mousePressed() {
  var offsetX = (width - DIM * DIM_CELLA) / 2;
  var offsetY = (height - DIM * DIM_CELLA) / 2;
  var x = int((mouseX - offsetX) / DIM_CELLA);
  var y = int((mouseY - offsetY) / DIM_CELLA);

  if (gameOver || vittoria) {
    var popupWidth = windowWidth * 0.4; // 40% della larghezza dello schermo
    var popupHeight = windowHeight * 0.15; // 15% dell'altezza dello schermo
    var popupX = (windowWidth - popupWidth) / 2;
    var popupY = (windowHeight - popupHeight) / 2;

    var buttonWidth = popupWidth * 0.4; // 40% della larghezza del popup
    var buttonHeight = popupHeight * 0.2; // 20% dell'altezza del popup
    var buttonX = popupX + (popupWidth - buttonWidth) / 2;
    var buttonY = popupY + popupHeight - buttonHeight - windowHeight * 0.02; // Margine inferiore di 2%

    // Verifica che il clic sia all'interno delle coordinate del pulsante "Rigioca"
    if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
        mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      riavviaGioco();
    }
  } else if (x >= 0 && x < DIM && y >= 0 && y < DIM) {
    if (currentAction == "discover") {
      scopriCella(x, y);
    } else if (currentAction == "flag") {
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




function riavviaGioco() {
  gameFinished = false;
  gameOver = false;
  vittoria = false;
  bombeRimaste = NUM_BOMBE;
  inizializzaGriglia();
  contaBombeVicine();
}

function scopriCella(x, y) {
  if (!scoperto[x][y] && !bandiera[x][y]) {
    scoperto[x][y] = true;
    if (griglia[x][y] == -1) {
      gameOver = true;
    } else if (griglia[x][y] == 0) {
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          if (x + i >= 0 && x + i < DIM && y + j >= 0 && y + j < DIM) {
            scopriCella(x + i, y + j);
          }
        }
      }
    }
  }
}

function inizializzaGriglia() {
  griglia = new Array(DIM);
  scoperto = new Array(DIM);
  bandiera = new Array(DIM);
  for (var i = 0; i < DIM; i++) {
    griglia[i] = new Array(DIM);
    scoperto[i] = new Array(DIM);
    bandiera[i] = new Array(DIM);
    for (var j = 0; j < DIM; j++) {
      griglia[i][j] = 0;
      scoperto[i][j] = false;
      bandiera[i][j] = false;
    }
  }
  var moduli = [
    [[1, 1], [4, 1], [4, 2], [5, 1]],
    [[2, 1], [3, 1], [3, 2], [6, 1]],
    [[1, 2], [4, 2], [4, 1], [5, 2]],
    [[2, 2], [3, 1], [3, 2], [6, 2]]
  ];
  for (var i = 0; i < DIM; i += 6) {
    for (var j = 0; j < DIM; j += 2) {
      var moduloScelto = int(random(moduli.length));
      for (var k = 0; k < moduli[moduloScelto].length; k++) {
        var x = i + moduli[moduloScelto][k][0] - 1;
        var y = j + moduli[moduloScelto][k][1] - 1;
        if (x < DIM && y < DIM) {
          griglia[x][y] = -1;
        }
      }
    }
  }
}

function contaBombeVicine() {
  for (var x = 0; x < DIM; x++) {
    for (var y = 0; y < DIM; y++) {
      if (griglia[x][y] == -1) {
        continue;
      }
      var conta = 0;
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          if (x + i >= 0 && x + i < DIM && y + j >= 0 && y + j < DIM && griglia[x + i][y + j] == -1) {
            conta++;
          }
        }
      }
      griglia[x][y] = conta;
    }
  }
}

function mostraGriglia() {
  var offsetX = (width - DIM * DIM_CELLA) / 2;
  var offsetY = (height - DIM * DIM_CELLA) / 2;
  for (var x = 0; x < DIM; x++) {
    for (var y = 0; y < DIM; y++) {
      var cellX = offsetX + x * DIM_CELLA;
      var cellY = offsetY + y * DIM_CELLA;
      if (scoperto[x][y] || gameOver && griglia[x][y] == -1) {
        fill(200);
      } else {
        fill(100);
      }
      rect(cellX, cellY, DIM_CELLA, DIM_CELLA);
      if (scoperto[x][y] && griglia[x][y] > 0) {
        disegnaNumero(x, y, griglia[x][y], cellX, cellY);
      }
      if (bandiera[x][y]) {
        fill(255, 0, 0);
        triangle(cellX + 5, cellY + 5, cellX + DIM_CELLA / 2, cellY + 25, cellX + 25, cellY + 5);
      }
      if (gameOver && griglia[x][y] == -1) {
        fill(0);
        ellipse(cellX + DIM_CELLA / 2, cellY + DIM_CELLA / 2, DIM_CELLA / 2, DIM_CELLA / 2);
      }
    }
  }
}

function disegnaNumero(x, y, numero, cellX, cellY) {
  switch (numero) {
    case 1: fill(0, 0, 255); break;
    case 2: fill(0, 255, 0); break;
    case 3: fill(255, 0, 0); break;
    case 4: fill(255, 255, 0); break;
    case 5: fill(128, 0, 128); break;
    case 6: fill(255, 165, 0); break;
    case 7: fill(165, 42, 42); break;
    case 8: fill(0); break;
  }
  textAlign(CENTER, CENTER);
  textSize(15);
  text(numero.toString(), cellX + DIM_CELLA / 2, cellY + DIM_CELLA / 2);
}

function controllaVittoria() {
  var scoperte = 0;
  for (var x = 0; x < DIM; x++) {
    for (var y = 0; y < DIM; y++) {
      if (scoperto[x][y] || (bandiera[x][y] && griglia[x][y] == -1)) {
        scoperte++;
      }
    }
  }
  if (scoperte == DIM * DIM) {
    vittoria = true;
  }
}
