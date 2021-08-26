import firebase from "firebase";
import { state } from "../state";
import { buttonComponent } from "../components/button";
const tijerasIMG = require("url:./../img/tijeras.png");
const piedraIMG = require("url:./../img/piedra.png");
const papelIMG = require("url:./../img/papel.png");
const three = require("url:./../img/three.png");
const two = require("url:./../img/two.png");
const loseSign = require("url:./../img/lose-sign.png");
const successSign = require("url:./../img/success-sign.png");

export function initJuego(params) {
  const el = document.createElement("div");
  el.innerHTML = `
  <div class="cron_container"></div>
  <div class="hands_container">
      <div class="hands">
        <img src="${tijerasIMG}" alt="" class="img-hand__tijeras" />
        <img src="${piedraIMG}" alt="" class="img-hand__piedra" />
        <img src="${papelIMG}" alt="" class="img-hand__papel" />
      </div>
    </div>
    `;

  let rtdbJuego: any = firebase.database();
  let rtdbRefJuego: any = rtdbJuego.ref(
    `/gamerooms/${state.getState().sala}/players`
  );
  let dataJuego: any = {};

  const tijeras = el.querySelector(".img-hand__tijeras");
  const piedra = el.querySelector(".img-hand__piedra");
  const papel = el.querySelector(".img-hand__papel");

  const tijerasListeners = () => {
    tijeras.classList.add("selected");
    tijeras.classList.remove("deselected");
    piedra.classList.add("deselected");
    piedra.classList.remove("selected");
    papel.classList.add("deselected");
    papel.classList.remove("selected");

    state.setState({
      ...state.getState(),
      handOn: "tijeras",
    });
  };

  const piedraListeners = () => {
    tijeras.classList.add("deselected");
    tijeras.classList.remove("selected");
    piedra.classList.add("selected");
    piedra.classList.remove("deselected");
    papel.classList.add("deselected");
    papel.classList.remove("selected");

    state.setState({
      ...state.getState(),
      handOn: "piedra",
    });
  };

  const papelListeners = () => {
    tijeras.classList.add("deselected");
    tijeras.classList.remove("selected");
    piedra.classList.add("deselected");
    piedra.classList.remove("selected");
    papel.classList.add("selected");
    papel.classList.remove("deselected");

    state.setState({
      ...state.getState(),
      handOn: "papel",
    });
  };

  tijeras.addEventListener("click", tijerasListeners);
  piedra.addEventListener("click", piedraListeners);
  papel.addEventListener("click", papelListeners);

  state.setState({ ...state.getState(), time: 0, moment: "waiting" });

  setTimeout(() => {
    const container = document.querySelector(".cron_container");
    const div = document.createElement("div");
    div.innerHTML = `<img src="${three}" class="cron-item" />`;
    container.appendChild(div);
  }, 1000);

  setTimeout(() => {
    const container = document.querySelector(".cron_container");
    const div = document.createElement("div");
    div.innerHTML = `<img src="${two}" class="cron-item" />`;
    container.removeChild(container.firstChild);
    container.appendChild(div);
  }, 2000);

  setTimeout(() => {
    const container = document.querySelector(".cron_container");
    container.innerHTML = `<h1 class="ready-sign">Ready!</h1>`;

    state.setState({ ...state.getState(), time: 3, moment: "result" });
  }, 3000);

  setTimeout(() => {
    rtdbRefJuego.on("value", (snapshot) => {
      dataJuego = snapshot.val();
      const lastState = state.getState();

      if (state.getState().handOn != false) {
        if (lastState.time == 3 && lastState.moment == "result") {
          const handsContainer = document.querySelector(".hands_container");
          let selected = document.querySelector(".selected");
          let arrayHands = [tijeras, piedra, papel];

          if (
            !state.getState().handOn ||
            state.getState().handOn == null ||
            state.getState().handOn == undefined
          ) {
            let random = Math.floor(Math.random() * 3);
            selected = arrayHands[random];
            let arrayToState = ["tijeras", "piedra", "papel"];
            state.setState({
              ...state.getState(),
              handOn: arrayToState[random],
            });
          }

          state.setState({
            ...state.getState(),
            oponent:
              Object.keys(dataJuego)[0] != state.getState().name
                ? Object.keys(dataJuego)[0]
                : Object.keys(dataJuego)[1],
          });

          const oponentObject = dataJuego[state.getState().oponent];
          let userObject = dataJuego[state.getState().name];

          userObject.handChoosen = state.getState().handOn;
          rtdbJuego
            .ref(
              `/gamerooms/${state.getState().sala}/players/${
                state.getState().name
              }`
            )
            .update(userObject);

          setTimeout(() => {
            let handOponent = document.querySelector(
              `.img-hand__${oponentObject.handChoosen}`
            );
            handsContainer.appendChild(handOponent);
            handsContainer.appendChild(selected);
            let containerToRemove = document.querySelector(".hands");
            containerToRemove.parentNode.removeChild(containerToRemove);

            handOponent.classList.remove("deselected");
            handOponent.classList.add("hand-oponent");
            selected.classList.remove("selected");
            selected.classList.add("hand-selected");

            handsContainer.parentNode.removeChild(
              document.querySelector(".cron_container")
            );
            handsContainer.classList.remove("hands_container");
            handsContainer.classList.add("hands_result");
          }, 2000);
        }

        setTimeout(() => {
          const handSelected = document.querySelector(".hand-selected");
          const root = document.querySelector(".root");
          const TheResultDiv = document.createElement("div");
          TheResultDiv.classList.add("result");
          root.firstChild.appendChild(TheResultDiv);
          const resultDiv = document.querySelector(".result");

          const handOponent = document.querySelector(".hand-oponent");

          if (
            (handSelected.classList.value.includes("tijeras") &&
              handOponent.classList.value.includes("papel")) ||
            (handSelected.classList.value.includes("papel") &&
              handOponent.classList.value.includes("piedra")) ||
            (handSelected.classList.value.includes("piedra") &&
              handOponent.classList.value.includes("tijeras"))
          ) {
            tijeras.removeEventListener("click", tijerasListeners);
            piedra.removeEventListener("click", piedraListeners);
            papel.removeEventListener("click", papelListeners);
            state.setState({
              ...state.getState(),
              winner: state.getState().name,
            });
          } else {
            state.setState({
              ...state.getState(),
              winner: state.getState().oponent,
            });
          }

          const initResult = () => {
            if (state.getState().winner == state.getState().oponent) {
              const message = document.createElement("div");
              message.innerHTML = `
                <img src="${loseSign}" class="sign-result" />
                  <div class="score-container">
                    <h2>Score</h2>
                    <h3>${state.getState().name}: ${
                dataPlayers[state.getState().name].puntos
              }</h3>
                    <h3>${state.getState().oponent}: ${
                dataPlayers[state.getState().oponent].puntos
              }</h3>
                  </div>
  
                  ${buttonComponent("Volver a jugar", "", "backAndReset")}`;
              resultDiv.appendChild(message);
              resultDiv.classList.add("err-bg");
            } else {
              const message = document.createElement("div");
              message.innerHTML = `
                    <img src="${successSign}" class="sign-result" />
                    <div class="score-container">
                      <h2>Score</h2>
                      <h3>${state.getState().name}: ${
                dataPlayers[state.getState().name].puntos
              }</h3>
                      <h3>${state.getState().oponent}: ${
                dataPlayers[state.getState().oponent].puntos
              }</h3>
                    </div>
                  ${buttonComponent("Volver a jugar", "", "backAndReset")}`;
              resultDiv.appendChild(message);
              resultDiv.classList.add("success-bg");
            }
            const buttonComp = document.querySelector(".backAndReset");
            buttonComp.addEventListener("click", (e) => {
              params.goTo("/empezar");
            });
          };

          const resetValuesRTDB = () => {
            if (state.getState().compStatus == "reset") {
              let dataToReset = {
                handChoosen: false,
                ready: false,
              };

              state.setState({
                ...state.getState(),
                compStatus: "other",
              });
              rtdbJuego
                .ref(
                  `/gamerooms/${state.getState().sala}/players/${
                    state.getState().name
                  }`
                )
                .update(dataToReset);

              rtdbJuego = "";
              rtdbRefJuego = "";
            }
          };

          let dataPlayers = {};
          if (state.getState().winner == state.getState().name) {
            fetch(`/api/gamerooms/${state.getState().sala}`, {
              method: "PUT",
              body: JSON.stringify({
                winner: state.getState().winner,
              }),
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((json) => {
                dataPlayers = json.players;
                state.setState({
                  ...state.getState(),
                  compStatus: "reset",
                  handOn: false,
                });
                resetValuesRTDB();
                initResult();
              });
          } else {
            setTimeout(() => {
              fetch(`/api/gamerooms/${state.getState().sala}`)
                .then((res) => res.json())
                .then((json) => {
                  dataPlayers = json.players;
                  state.setState({
                    ...state.getState(),
                    compStatus: "reset",
                    handOn: false,
                  });
                  resetValuesRTDB();
                  initResult();
                });
            }, 2000);
          }
        }, 2000);
      }
    });
  }, 4000);
  return el;
}
