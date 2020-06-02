/////// PLAYER FACTORY ///////
const addPlayer = (name) => {
  let symbol;
  (gameboard.players.length > 0) ? symbol = 'O' : symbol = 'X';
  const playerWin = () => {alert("Round over!")};
  return {name, symbol, playerWin};
};


/////// GAMEBOARD ///////
let gameboard = {
    board: ['','','','','','','','',''],
    players: [],
    turn: 0,
    toggleTurn: () => {

    },
    render: () => {
      const board = document.getElementById("gameboard");
      while (board.firstChild) {
        board.removeChild(board.lastChild);
      }
      for (let i = 0; i < gameboard.board.length; i++) {
        const newTile = document.createElement("div");
        newTile.classList.add("gameboard__tile");
        newTile.setAttribute("data-index", `${i}`);
        newTile.innerHTML = gameboard.board[i];
        board.appendChild(newTile);
        newTile.addEventListener("click", (e) => gameModule.takeTurn(e.target.dataset.index))
      }
    }
  }


/////// GAME FLOW ///////
const gameModule = (() => {

  /** Game settings selection */
  let settings = {
    mode: '',
  }

  document.querySelectorAll(".settings__button").forEach(button => {
    let players = gameboard.players;
    let playerOneName = document.getElementById("playerOneName");
    let playerTwoName = document.getElementById("playerTwoName");
    button.addEventListener("click", (e) => {
      if (e.target.id === "newGame") {
        document.getElementById("modalOverlay").classList.toggle("closed")
      };
      if (e.target.classList.contains("mode__button")) {
        gameModule.settings.mode = e.target.id;
      };
      if (e.target.id === "submitPlayers") {
        if (gameModule.settings.mode === "PvP") {
          (playerOneName.value === '') ? players.push(addPlayer(playerOneName.placeholder)) : players.push(addPlayer(playerOneName.value));
          (playerTwoName.value === '') ? players.push(addPlayer(playerTwoName.placeholder)) : players.push(addPlayer(playerTwoName.value));
          playerOneName.value = '';
          playerTwoName.value = '';
        } else if (gameModule.settings.mode === "PvAI") {
        //If PvAI selection, allow input of only one player
        }
        document.getElementById("modalOverlay").classList.toggle("closed")
        document.getElementById("gameboard").classList.toggle("closed")
      }
    })
  })

  /** Gameplay logic */
  function takeTurn(tile) {
    const symbol = gameboard.players[gameboard.turn].symbol;
    if (gameboard.board[tile] === '') {
      gameboard.board[tile] = symbol;
      gameboard.render();
      gameModule.checkWin(symbol);
      gameModule.toggleTurn();
    }
  }

  function toggleTurn() {
    (gameboard.turn == 0) ? gameboard.turn = 1 : gameboard.turn = 0;
  }

  function checkWin(symbol) {
    const winArrays = {
      'Top3':   [0,1,2],
      'HMid3':  [3,4,5],
      'Low3':   [6,7,8],
      'Left3':  [0,3,6],
      'VMid3':  [1,4,7],
      'Right3': [2,5,8],
      'LDiag3': [0,4,8],
      'RDiag3': [2,4,6]
    }
    /** map over array to turn tiles with matching symbol into their respective 
    index value, else turning into falsy value, then filter out falsy values */
    const tilesPlayed = gameboard.board.map((tile,index) => (tile === symbol) ? index : undefined)
                                       .filter(x => (x || x === 0)); //don't filter out '0' as falsy
    Object.values(winArrays).forEach(subArray => {
      if (subArray.every(e => tilesPlayed.includes(e))) {
        return gameboard.players[gameboard.turn].playerWin();
      }
    })
  }

  return {settings, takeTurn, toggleTurn, checkWin}
})();


gameboard.render();