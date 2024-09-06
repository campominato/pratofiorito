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

  // Eventi per i pulsanti "Scopri" e "Bandiera"
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

  // Disabilita il comportamento predefinito del menu contestuale su canvas
  document.getElementById('gameCanvas').addEventListener('contextmenu', function (e) {
    e.preventDefault(); 
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
  var popupWidth = windowWidth * 0.4;
  var popupHeight = windowHeight * 0.15;
  var popupX = (windowWidth - popupWidth) / 2;
  var popupY = (windowHeight - popupHeight) / 2;

  fill(0);
  rect(popupX, popupY, popupWidth, popupHeight, 20);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(windowWidth * 0.05);
  var messaggio = gameOver ? "Hai perso!" : "Hai vinto!";
  text(messaggio, popupX + popupWidth / 2, popupY + popupHeight / 3);

  var buttonWidth = popupWidth * 0.4;
  var buttonHeight = popupHeight * 0.2;
  var buttonX = popupX + (popupWidth - buttonWidth) / 2;
  var buttonY = popupY + popupHeight - buttonHeight - windowHeight * 0.02;

  fill(178, 34, 34);
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 10);

  fill(255);
  textSize(windowWidth * 0.04);
  text("Rigioca", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
}

function mousePressed() {
  var offsetX = (width - DIM * DIM_CELLA) / 2;
  var offsetY = (height - DIM * DIM_CELLA) / 2;
  var x = int((mouseX - offsetX) / DIM_CELLA);
  var y = int((mouseY - offsetY) / DIM_CELLA);

  if (gameOver || vittoria) {
    var popupWidth = windowWidth * 0.4;
    var popupHeight = windowHeight * 0.15;
    var popupX = (windowWidth - popupWidth) / 2;
    var popupY = (windowHeight - popupHeight) / 2;

    var buttonWidth = popupWidth * 0.4;
    var buttonHeight = popupHeight * 0.2;
    var buttonX = popupX + (popupWidth - buttonWidth) / 2;
    var buttonY = popupY + popupHeight - buttonHeight - windowHeight * 0.02;

    if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
        mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      riavviaGioco();
    }
  } else if (x >= 0 && x < DIM && y >= 0 && y < DIM) {
    if (currentAction == "discover") {
      scopriCella(x, y);
    } else if (currentAction == "flag") {
      piazzaBandiera(x, y);
    }
  }
}

function touchStarted() {
  var offsetX = (width - DIM * DIM_CELLA) / 2;
  var offsetY = (height - DIM * DIM_CELLA) / 2;
  var x = int((touchX - offsetX) / DIM_CELLA);
  var y = int((touchY - offsetY) / DIM_CELLA);

  if (x >= 0 && x < DIM && y >= 0 && y < DIM) {
    if (currentAction == "discover") {
      scopriCella(x, y);
    } else if (currentAction == "flag") {
      piazzaBandiera(x, y);
    }
  }
  return false; // Previene il comportamento predefinito
}

function piazzaBandiera(x, y) {
  if (!bandiera[x][y] && bombeRimaste > 0) {
    bandiera[x][y] = true;
    bombeRimaste--;
  } else if (bandiera[x][y]) {
    bandiera[x][y] = false;
    bombeRimaste++;
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
  // Posiziona bombe
  for (var n = 0; n < NUM_BOMBE; n++) {
    var x, y;
    do {
      x = int(random(DIM));
      y = int(random(DIM));
    } while (griglia[x][y] == -1);
    griglia[x][y] = -1;
  }
}

function contaBombeVicine() {
  for (var x = 0; x < DIM; x++) {
    for (var y = 0; y < DIM; y++) {
      if (griglia[x][y] == -1) continue;
      var count = 0;
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          if (x + i >= 0 && x + i < DIM && y + j >= 0 && y + j < DIM) {
            if (griglia[x + i][y + j] == -1) count++;
          }
        }
      }
      griglia[x][y] = count;
    }
  }
}

function mostraGriglia() {
  var offsetX = (width - DIM * DIM_CELLA) / 2;
  var offsetY = (height - DIM * DIM_CELLA) / 2;

  for (var x = 0; x < DIM; x++) {
    for (var y = 0; y < DIM; y++) {
      var cellX = x * DIM_CELLA + offsetX;
      var cellY = y * DIM_CELLA + offsetY;
      stroke(255);
      if (scoperto[x][y]) {
        fill(150);
        rect(cellX, cellY, DIM_CELLA, DIM_CELLA);
        if (griglia[x][y] > 0) {
          fill(0);
          textAlign(CENTER, CENTER);
          textSize(DIM_CELLA * 0.6);
          text(griglia[x][y], cellX + DIM_CELLA / 2, cellY + DIM_CELLA / 2);
        }
      } else {
        fill(100);
        rect(cellX, cellY, DIM_CELLA, DIM_CELLA);
        if (bandiera[x][y]) {
          fill(255, 0, 0);
          textAlign(CENTER, CENTER);
          textSize(DIM_CELLA * 0.6);
          text('F', cellX + DIM_CELLA / 2, cellY + DIM_CELLA / 2);
        }
      }
    }
  }
}

function controllaVittoria() {
  var celleNonScoperte = 0;
  for (var x = 0; x < DIM; x++) {
    for (var y = 0; y < DIM; y++) {
      if (!scoperto[x][y] && griglia[x][y] != -1) {
        celleNonScoperte++;
      }
    }
  }
  if (celleNonScoperte == 0) {
    vittoria = true;
  }
}
