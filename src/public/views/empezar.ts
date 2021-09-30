import { rtdb } from "./../db";
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

  state.subscribe(() => {
    if (window.location.pathname == "/empezar") {
      const content = document.querySelector(".container_content");
      const { name, oponentName, oponentObject, sala } = state.getState();
      if (oponentObject) {
        const afterDiv = document.createElement("div");
        afterDiv.innerHTML = `

        <div class="header-empezar text-header">
          <div class="left-header">
            <h5>
              ${name}
            </h5>
            <span class="text-orange">
              ${oponentName}
            </span>
          </div>

          <div class="right-header">
            <h5 class="sala-header">
              Sala:
            </h5>
            <span>
              ${sala}
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

        setTimeout(() => {
          const startGameButton = document.querySelector("#startGame");
          startGameButton?.addEventListener("click", () => {
            let { userObject } = state.getState();
            userObject.ready = true;
            rtdb
              .ref(
                `/gamerooms/${state.getState().sala}/players/${
                  state.getState().name
                }`
              )
              .update(userObject);
          });

          const { oponentObject, userObject, oponentName } = state.getState();

          if (!oponentObject.ready && userObject.ready) {
            const descriptionEmpezar = document.querySelector(
              ".description-empezar"
            );

            const waitingDiv = document.createElement("div");
            waitingDiv.innerHTML = `<span>Esperando a que <strong> ${oponentName} </strong> presione ¡Jugar!...</span>`;
            waitingDiv.classList.add("waiting-text");

            descriptionEmpezar.parentNode?.removeChild(descriptionEmpezar);
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
        const { sala } = state.getState();
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
              ${sala}
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
    }
  });

  return el;
}
