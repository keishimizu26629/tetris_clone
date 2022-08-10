'use strict';

{
  const FIELD_COL = 10;
  const FIELD_ROW = 20;

  const BLOCK_SIZE = 20;

  const TETRO_SIZE = 4;

  let GAME_SPEED = 1000;

  const SCREEN_W = FIELD_COL * BLOCK_SIZE;
  const SCREEN_H = FIELD_ROW * BLOCK_SIZE;

  let can = document.getElementById("can");
  let con = can.getContext("2d");

  can.width = SCREEN_W;
  can.height = SCREEN_H;
  can.style.border = "2px solid #555";

  const TETRO_COLORS = [
    "#000",
    "#6CF",
    "#F92",
    "#66F",
    "#C5C",
    "#FD2",
    "#F44",
    "#5B5",
  ]

  const TETRO_TYPES = [
    [],
    [ 
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [ 
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [ 
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [ 
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [ 
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [ 
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [ 
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ]

  const START_X = FIELD_COL / 2 - TETRO_SIZE / 2;
  const START_Y = 0;

  let tetro;
  let tetro_x;
  let tetro_y;
  let tetro_t;

  let field = [];

  function dropAgain() {
    tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
    tetro = TETRO_TYPES[tetro_t];
  
    tetro_x = START_X;
    tetro_y = START_Y;
  }
  
  function init() {
    for(let y = 0; y < FIELD_ROW; y++) {
      field[y] = [];
      for(let x = 0; x < FIELD_COL; x++) {
        field[y][x] = 0;
      }
    }
  }

  function drawBlock(x, y, c) {
    let px = x * BLOCK_SIZE;
    let py = y * BLOCK_SIZE;

    con.fillStyle = TETRO_COLORS[c];
    con.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
    con.strokeStyle = "black";
    con.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
  }

  function drawAll() {
    con.clearRect(0, 0, SCREEN_W, SCREEN_H);
    for(let y = 0; y < FIELD_ROW ; y++) {
      for(let x = 0; x < FIELD_COL; x++) {
        if(field[y][x]) {
          drawBlock(x, y, field[y][x]);
        }
      }
    }
    for(let y = 0; y < TETRO_SIZE ; y++) {
      for(let x = 0; x < TETRO_SIZE; x++) {
        if(tetro[y][x]) {
          drawBlock(tetro_x + x, tetro_y + y, tetro_t);
        }
      }
    }
  }

  function checkMove(my, mx, ntetro) {
    if(ntetro == undefined) {
      ntetro = tetro;
    }
    for(let y = 0; y < TETRO_SIZE; y++) {
      for(let x = 0; x < TETRO_SIZE; x++) {
        let ny = tetro_y + y + my;
        let nx = tetro_x + x + mx;
        if(ntetro[y][x]) {
          if(
            ny < 0 || 
            nx < 0 ||
            ny >= FIELD_ROW ||
            nx >= FIELD_COL ||
            field[ny][nx]) {

            return false;
          }
        }
      }
    }
    return true;
  }

  function rotate() {
    let ntetro = [];
    for(let y = 0; y < TETRO_SIZE; y++) {
      ntetro[y] = [];
      for(let x = 0; x < TETRO_SIZE; x++) {
        ntetro[y][x] = tetro[TETRO_SIZE - x - 1][y];
      }
    }
    return ntetro;
  }

  function fixTetro() {
    for(let y = 0; y < TETRO_SIZE; y++) {
      for(let x = 0; x < TETRO_SIZE; x++) {
        if(tetro[y][x]) {
          field[tetro_y + y][tetro_x + x] = tetro_t;
        }
      }
    }
  }

  function checkLine(){
    let lineCount = 0;
    for(let y = 0; y < FIELD_ROW; y++) {
      let flag = true;
      for(let x = 0; x < FIELD_COL; x++) {
        if(!field[y][x]) {
          flag = false;
          break;
        }
      }
      if(flag) {
        lineCount++;
        for(let ny = y; ny > 0 ; ny--) {
          for(let nx = 0; nx < FIELD_COL; nx++) {
            field[ny][nx] = field[ny-1][nx];
          }
        }
      }
    }
  }

  function dropTetro() {
    if(checkMove(1, 0)) {
      tetro_y++;
      drawAll();
    } else {
      fixTetro();
      checkLine();
      dropAgain();
    }
  }

  window.addEventListener('keydown', e => {
    switch(e.key) {
      case 'ArrowUp':
        if(checkMove(-1, 0)) {
          tetro_y--;
        }
        break;
      case 'ArrowRight':
        if(checkMove(0, 1)) {
          tetro_x++;
        }
        break;
      case 'ArrowDown':
        if(checkMove(1, 0)) {
          tetro_y++;
        }
        break;
      case 'ArrowLeft':
        if(checkMove(0, -1)) {
          tetro_x--;
        }  
        break;
      case ' ':
        let ntetro = rotate();
        if(checkMove(0, 0, ntetro)) {
          tetro = ntetro;
        }  
        break;
    }
    drawAll();
  });

  init();
  dropAgain();
  drawAll();

  setInterval(() => {
    dropTetro();
  }, GAME_SPEED);


}