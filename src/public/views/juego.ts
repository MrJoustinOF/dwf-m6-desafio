import firebase from "firebase";
import { state } from "../state";
import { buttonComponent } from "../components/button";
import { addSelected } from "./utils/addSelected";
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
    addSelected("tijeras", el);
    state.setState({
      ...state.getState(),
      handOn: "tijeras",
    });
  };

  const piedraListeners = () => {
    addSelected("piedra", el);
    state.setState({
      ...state.getState(),
      handOn: "piedra",
    });
  };

  const papelListeners = () => {
    addSelected("papel", el);
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
    let handsContainer: any = "";
    let selected: any = "";

    rtdbRefJuego.on("value", (snapshot) => {
      if (state.getState().time === 3 && state.getState().moment === "result") {
        dataJuego = snapshot.val();
        handsContainer = document.querySelector(".hands_container");
        selected = document.querySelector(".selected");
        let arrayHands = [tijeras, piedra, papel];

        if (
          state.getState().handOn === undefined ||
          state.getState().handOn === false
        ) {
          let random = Math.floor(Math.random() * 3);
          selected = arrayHands[random];
          let arrayToState = ["tijeras", "piedra", "papel"];

          addSelected(arrayToState[random], el);
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

        let oponentObject = dataJuego[state.getState().oponent];
        let userObject = dataJuego[state.getState().name];

        if (state.getState().handOn !== undefined) {
          userObject.handChoosen = state.getState().handOn;
          rtdbJuego
            .ref(
              `/gamerooms/${state.getState().sala}/players/${
                state.getState().name
              }`
            )
            .update(userObject);
        }

        if (oponentObject.handChoosen !== false) {
          state.setState({
            ...state.getState(),
            handOponent: oponentObject.handChoosen,
          });
        }

        // c
        if (state.getState().handOponent !== false) {
          setTimeout(() => {
            // const oponentObject = dataJuego[state.getState().oponent];
            let handOponent = document.querySelector(
              `.img-hand__${state.getState().handOponent}`
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
            // }, 2000);

            // setTimeout(() => {
            const handSelected = document.querySelector(".hand-selected");
            const root = document.querySelector(".root");
            const TheResultDiv = document.createElement("div");
            TheResultDiv.classList.add("result");
            root.firstChild.appendChild(TheResultDiv);
            // const resultDiv = document.querySelector(".result");

            const handOponentcomp = document.querySelector(".hand-oponent");

            if (
              (handSelected.classList.value.includes("tijeras") &&
                handOponentcomp.classList.value.includes("papel")) ||
              (handSelected.classList.value.includes("papel") &&
                handOponentcomp.classList.value.includes("piedra")) ||
              (handSelected.classList.value.includes("piedra") &&
                handOponentcomp.classList.value.includes("tijeras"))
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
          }, 2000);
        }
        // k
      }
    });

    setTimeout(() => {
      const resultDiv = document.querySelector(".result");
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

          state.setState({
            ...state.getState(),
            time: 0,
            moment: "waiting",
          });
        }
      };

      let dataPlayers = {};
      state.setState({ ...state.getState(), validator: true });
      if (
        state.getState().winner == state.getState().name &&
        state.getState().validator == true
      ) {
        state.setState({ ...state.getState(), validator: false });
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
      } else if (
        state.getState().winner != state.getState().name &&
        state.getState().validator == true
      ) {
        state.setState({ ...state.getState(), validator: false });
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
    }, 3000);
  }, 4000);
  return el;
}
