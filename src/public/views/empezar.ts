import firebase from "firebase";
import { buttonComponent } from "../components/button";
import { state } from "./../state";
const tijerasIMG = require("url:./../img/tijeras.png");
const piedraIMG = require("url:./../img/piedra.png");
const papelIMG = require("url:./../img/papel.png");

export function initEmpezarPage(params) {
  const el = document.createElement("div");
  el.innerHTML = `
    <div class="container_content">
    </div>
    
    <div class="hands_container">
      <div class="hands">
        <img src="${tijerasIMG}" alt="" class="img-hand__tijeras" />
        <img src="${piedraIMG}" alt="" class="img-hand__piedra" />
        <img src="${papelIMG}" alt="" class="img-hand__papel" />
      </div>
    </div>
  `;

  const rtdb = firebase.database();
  const rtdbRef = rtdb.ref(`/gamerooms/${state.getState().sala}/players`);

  let data: any = {};
  // if (state.getState().compStatus != "result") {
  rtdbRef.on("value", (snapshot) => {
    data = snapshot.val();

    const content = el.querySelector(".container_content");
    // setTimeout(() => {
    if (Object.keys(data).length === 2) {
      const afterDiv = document.createElement("div");
      afterDiv.innerHTML = `

        <div class="header-empezar text-header">
          <div class="left-header">
            <h5>
              ${Object.keys(data)[0]}
            </h5>
            <span class="text-orange">
              ${Object.keys(data)[1] ? Object.keys(data)[1] : ""}
            </span>
          </div>

          <div class="right-header">
            <h5 class="sala-header">
              Sala:
            </h5>
            <span>
              ${state.getState().sala}
            </span>
          </div>
        </div>

        <div class="description-empezar">
          <p>
            Presioná jugar <br />
            y elegí: piedra,<br />
            papel o tijera<br />
            antes de que <br />pasen los 3<br />
            segundos.
          </p>
        </div>

        ${buttonComponent("Jugar", "startGame", "")}
        

        `;

      // Comprobar si el primer dato del array es igual al usuario logeado
      let userObject: any =
        Object.keys(data)[0] == state.getState().name
          ? data[Object.keys(data)[0]]
          : data[Object.keys(data)[1]];

      // Utilizo un timeout por que la respuesta de firebase tarda y me da un error si agrego un eventListener antes
      setTimeout(() => {
        const startGameButton = document.querySelector("#startGame");
        startGameButton.addEventListener("click", () => {
          userObject.ready = true;
          rtdb
            .ref(
              `/gamerooms/${state.getState().sala}/players/${
                state.getState().name
              }`
            )
            .update(userObject);
        });

        // Comprobar si el segundo dato del array es igual al oponente
        const oponentObject =
          Object.keys(data)[0] != state.getState().name
            ? data[Object.keys(data)[0]]
            : data[Object.keys(data)[1]];

        if (!oponentObject.ready && userObject.ready) {
          const descriptionEmpezar = document.querySelector(
            ".description-empezar"
          );

          const waitingDiv = document.createElement("div");
          waitingDiv.innerHTML = `<span>Esperando a que <strong> ${
            Object.keys(data)[0] != state.getState().name
              ? Object.keys(data)[0]
              : Object.keys(data)[1]
          } </strong> presione ¡Jugar!...</span>`;
          waitingDiv.classList.add("waiting-text");

          descriptionEmpezar.parentNode.removeChild(descriptionEmpezar);
          startGameButton.parentNode.removeChild(startGameButton);
          content.firstChild.appendChild(waitingDiv);
        } else if (oponentObject.ready && userObject.ready) {
          // Si el oponente y tu estan listo redirigir a /juego
          params.goTo("/juego");
        }
      }, 2000);

      content.firstChild?.remove();
      content.appendChild(afterDiv);
    } else {
      const beforeDiv = document.createElement("div");
      beforeDiv.innerHTML = `
        <div class="container-divs-before">
          <div class="div-before-game normal-divs">
            <span>
              Comparte el codigo
            </span>
          </div>
          <br />

          <div class="div-before-game code-div">
            <h3>
              ${state.getState().sala}
            </h3>
          </div>
          <br />

          <div class="div-before-game normal-divs">
            <span>
              Con tu contricante
            </span>
          </div>
        </div>
      `;
      content.firstChild?.remove();
      content.appendChild(beforeDiv);
    }
    // }, 2000);
  });
  // }

  return el;
}
