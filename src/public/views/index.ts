import firebase from "firebase";
import { buttonComponent } from "./../components/button";
import { inputComponent } from "./../components/input";
import { state } from "./../state";
const tijerasIMG = require("url:./../img/tijeras.png");
const piedraIMG = require("url:./../img/piedra.png");
const papelIMG = require("url:./../img/papel.png");

export function initIndex(params) {
  const el = document.createElement("div");
  el.innerHTML = `
  <div class="title-index__container">
      <h1 class="title-index">
        Piedra <br />
        Papel
        <span class="title-o">o</span>
        <br />
        Tijera
      </h1>
    </div>
    
    <div>
      ${buttonComponent("Nuevo Juego", "new-game", "")}
      ${buttonComponent("Ingresar a una sala", "get-game", "")}
    </div>

    <div class="hands_container">
      <div class="hands">
        <img src="${tijerasIMG}" alt="" class="img-hand__tijeras" />
        <img src="${piedraIMG}" alt="" class="img-hand__piedra" />
        <img src="${papelIMG}" alt="" class="img-hand__papel" />
      </div>
    </div>
  `;

  // const btnComp = el.querySelector(".button-component");
  // btnComp.addEventListener("click", (e) => {
  //   params.goTo("/empezar");
  // });

  firebase.initializeApp({
    apiKey: "AIzaSyAY51xRKdVdFlrXc1CtMHg2sSN6b4uIE9Y",
    authDomain: "dwf-m6-desafio.firebaseapp.com",
    databaseURL: "https://dwf-m6-desafio-default-rtdb.firebaseio.com/",
    storageBucket: "dwf-m6-desafio.appspot.com",
  });

  const newGame = el.querySelector("#new-game");
  const getGame = el.querySelector("#get-game");

  // Div donde se pone el nombre
  const nameDiv = document.createElement("div");
  nameDiv.innerHTML = `
      ${inputComponent("Tu Nombre", "", "inputName")}
      ${buttonComponent("Empezar", "startNewGame", "")}
    `;

  // Quitar anteriores div y colocar el de nombre
  newGame.addEventListener("click", () => {
    newGame.parentNode.parentNode.appendChild(nameDiv);
    newGame.parentNode.parentNode.removeChild(newGame.parentNode);
    getGame.parentNode.parentNode.removeChild(getGame.parentNode);

    const startNewGameButton = document.querySelector("#startNewGame");
    startNewGameButton.addEventListener("click", () => {
      const inputName: any = document.querySelector("#inputName");

      const playerOwner = inputName.value;
      if (inputName.value !== "") {
        fetch("/api/gamerooms", {
          method: "POST",
          body: JSON.stringify({
            playerOwner,
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((json) => {
            state.setState({
              ...state.getState(),
              gameroomId: json.gameroom,
              name: playerOwner,
              sala: json.gameroom,
            });

            params.goTo("/empezar");
          });
      }
    });
  });

  // Div donde se pone el codigo
  const codeDiv = document.createElement("div");
  codeDiv.innerHTML = `
      ${inputComponent("", "codigo", "inputCode")}
      ${buttonComponent("Ingresar a la sala", "addCodeButton", "")}
    `;

  // Quitar anteriores div y colocar el del codigo
  getGame.addEventListener("click", () => {
    getGame.parentNode.parentNode.appendChild(codeDiv);
    getGame.parentNode.parentNode.removeChild(getGame.parentNode);
    newGame.parentNode.parentNode.removeChild(newGame.parentNode);

    const addCodeButton = document.querySelector("#addCodeButton");
    addCodeButton.addEventListener("click", () => {
      const inputCode: any = document.querySelector("#inputCode");

      fetch(`/api/gamerooms/${inputCode.value}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            const errDiv = document.createElement("div");
            errDiv.innerHTML = `
              <h2 class="err">ERROR: ${json.error}<h2>
            `;
            inputCode.parentNode.appendChild(errDiv);
          } else {
            state.setState({
              ...state.getState(),
              sala: inputCode.value,
            });

            addCodeButton.parentNode.parentNode.appendChild(nameDiv);
            addCodeButton.parentNode.parentNode.removeChild(
              addCodeButton.parentNode
            );
            inputCode.parentNode.parentNode.parentNode.removeChild(
              inputCode.parentNode.parentNode
            );

            const start = document.querySelector("#startNewGame");
            start.addEventListener("click", () => {
              const inputName: any = document.querySelector("#inputName");
              const newPlayer = inputName.value;

              const newState = state.getState();
              if (inputName.value !== "") {
                fetch(`/api/gamerooms/${newState.sala}`, {
                  method: "POST",
                  body: JSON.stringify({
                    newPlayer,
                  }),
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => res.json())
                  .then((json) => {
                    if (json.error) {
                      const errDiv = document.createElement("div");
                      errDiv.innerHTML = `
                        <h2 class="err">ERROR: ${json.error}<h2>
                      `;
                      inputName.parentNode.appendChild(errDiv);
                    } else {
                      state.setState({
                        ...state.getState(),
                        gameroomId: json.id,
                        name: newPlayer,
                      });
                      params.goTo("/empezar");
                    }
                  });
              }
            });
          }
        });
    });
  });

  return el;
}
