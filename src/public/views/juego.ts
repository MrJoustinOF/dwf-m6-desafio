import { rtdb } from "./../db";
import { state } from "../state";
import { addSelected } from "./utils/addSelected";
const tijerasIMG = require("url:./../img/tijeras.png");
const piedraIMG = require("url:./../img/piedra.png");
const papelIMG = require("url:./../img/papel.png");
const three = require("url:./../img/three.png");
const two = require("url:./../img/two.png");

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
    container.innerHTML = `<img src="${three}" class="cron-item" />`;
  }, 1000);

  setTimeout(() => {
    const container = document.querySelector(".cron_container");
    container.innerHTML = `<img src="${two}" class="cron-item" />`;
  }, 2000);

  setTimeout(() => {
    const container = document.querySelector(".cron_container");
    container.innerHTML = `<h1 class="ready-sign">Ready!</h1>`;

    state.setState({ ...state.getState(), time: 3, moment: "result" });
  }, 3000);

  state.subscribe(() => {
    const { pathname } = window.location;
    let { time, moment } = state.getState();

    if (time === 3 && moment === "result" && pathname === "/juego") {
      setTimeout(() => {
        let handsContainer = document.querySelector(".hands_container");
        let selected = document.querySelector(".selected");
        let arrayHands = [tijeras, piedra, papel];

        tijeras.removeEventListener("click", tijerasListeners);
        piedra.removeEventListener("click", piedraListeners);
        papel.removeEventListener("click", papelListeners);

        let { handOn, userObject } = state.getState();
        if (!handOn) {
          let random = Math.floor(Math.random() * 3);
          let arrayToState = ["tijeras", "piedra", "papel"];
          selected = arrayHands[random];
          addSelected(arrayToState[random], "");
          state.setState({
            ...state.getState(),
            handOn: arrayToState[random],
          });
        }

        if (!userObject.handChoosen && handOn) {
          state.setState({
            ...state.getState(),
            userObject: {
              handChoosen: state.getState().handOn,
              ready: true,
              winner: false,
            },
          });
        }

        if (state.getState().userObject.handChoosen) {
          state.setHand();
        }

        let handOponent = document.querySelector(
          `.img-hand__${state.getState().oponentObject.handChoosen}`
        );
        handsContainer?.appendChild(handOponent);
        handsContainer?.appendChild(selected);
        let containerToRemove = document.querySelector(".hands");
        containerToRemove?.parentNode.removeChild(containerToRemove);

        handOponent.classList.remove("deselected");
        handOponent.classList.add("hand-oponent");
        selected.classList.remove("selected");
        selected.classList.add("hand-selected");

        handsContainer.parentNode.removeChild(
          document.querySelector(".cron_container")
        );
        handsContainer.classList.remove("hands_container");
        handsContainer.classList.add("hands_result");

        const handSelected = document.querySelector(".hand-selected");
        const root = document.querySelector(".root");
        const TheResultDiv = document.createElement("div");
        TheResultDiv.classList.add("result");
        root.firstChild.appendChild(TheResultDiv);

        const handOponentcomp = document.querySelector(".hand-oponent");

        let { winner } = state.getState();
        if (!winner) {
          if (
            (handSelected.classList.value.includes("tijeras") &&
              handOponentcomp.classList.value.includes("papel")) ||
            (handSelected.classList.value.includes("papel") &&
              handOponentcomp.classList.value.includes("piedra")) ||
            (handSelected.classList.value.includes("piedra") &&
              handOponentcomp.classList.value.includes("tijeras"))
          ) {
            let { name } = state.getState();
            state.setState({
              ...state.getState(),
              winner: name,
            });
          } else {
            let { oponentName } = state.getState();
            state.setState({
              ...state.getState(),
              winner: oponentName,
            });
          }
          state.setState({
            ...state.getState(),
            validator: true,
            time: 0,
            moment: "waiting",
          });
        }
      }, 1000);
    }
  });

  setTimeout(() => {
    state.fetchResults(params);
  }, 7000);

  return el;
}
