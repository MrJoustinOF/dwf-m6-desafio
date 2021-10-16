import { rtdb } from "./db";
import { buttonComponent } from "./components/button";
const loseSign = require("url:./img/lose-sign.png");
const successSign = require("url:./img/success-sign.png");

const state = {
  data: {},
  listeners: [],
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
  },
  subscribe(callback: (any) => any) {
    if (this.listeners.length < 3) {
      this.listeners.push(callback);
    }
  },
  initRTDBData(roomId) {
    const rtdbRef = rtdb.ref(`/gamerooms/${roomId}/players`);
    let data: any = {};

    rtdbRef.on("value", (snapshot) => {
      const { name } = this.getState();
      data = snapshot.val();

      // Data a agregar
      let userObject =
        Object.keys(data)[0] == name
          ? data[Object.keys(data)[0]]
          : data[Object.keys(data)[1]];

      if (Object.keys(data).length === 2) {
        var oponentName =
          Object.keys(data)[0] != name
            ? Object.keys(data)[0]
            : Object.keys(data)[1];

        var oponentObject = data[oponentName];
      }

      state.setState({
        ...state.getState(),
        userObject,
        oponentName,
        oponentObject,
      });
    });
  },
  setReady() {
    let { userObject } = state.getState();
    userObject.ready = true;
    rtdb
      .ref(
        `/gamerooms/${state.getState().sala}/players/${state.getState().name}`
      )
      .update(userObject);
  },
  setHand() {
    let { userObject } = state.getState();
    rtdb
      .ref(
        `/gamerooms/${state.getState().sala}/players/${state.getState().name}`
      )
      .update(userObject);
  },
  resetValuesRTDB() {
    if (state.getState().compStatus == "reset") {
      let dataToReset = {
        handChoosen: false,
        ready: false,
      };

      state.setState({
        ...state.getState(),
        compStatus: "other",
      });
      rtdb
        .ref(
          `/gamerooms/${state.getState().sala}/players/${state.getState().name}`
        )
        .update(dataToReset);

      state.setState({
        ...state.getState(),
        time: 0,
        moment: "waiting",
      });
    }
  },
  initResult(data, params) {
    const resultDiv = document.querySelector(".result");
    if (state.getState().winner == state.getState().oponentName) {
      const message = document.createElement("div");
      message.innerHTML = `
        <img src="${loseSign}" class="sign-result" />
            <div class="score-container">
              <h2>Score</h2>
              <h3>${state.getState().name}: ${
        data[state.getState().name].puntos
      }</h3>
              <h3>${state.getState().oponentName}: ${
        data[state.getState().oponentName].puntos
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
        data[state.getState().name].puntos
      }</h3>
                <h3>${state.getState().oponentName}: ${
        data[state.getState().oponentName].puntos
      }</h3>
              </div>
            ${buttonComponent("Volver a jugar", "", "backAndReset")}`;
      resultDiv.appendChild(message);
      resultDiv.classList.add("success-bg");
    }
    const buttonComp = document.querySelector(".backAndReset");
    buttonComp.addEventListener("click", (e) => {
      params.goTo("/empezar");
      state.setState({
        ...state.getState(),
        compStatus: false,
        handOn: false,
        moment: false,
        time: false,
        winner: false,
      });
    });
  },
  fetchResults(params) {
    let { winner, name, validator, sala } = state.getState();
    let dataPlayers = {};

    if (winner == name && validator == true) {
      state.setState({ ...state.getState(), validator: false });

      fetch(`/api/gamerooms/${sala}`, {
        method: "PUT",
        body: JSON.stringify({
          winner,
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
          state.resetValuesRTDB();
          state.initResult(dataPlayers, params);
        });
    } else if (winner != name && validator == true) {
      state.setState({ ...state.getState(), validator: false });

      setTimeout(() => {
        fetch(`/api/gamerooms/${sala}`)
          .then((res) => res.json())
          .then((json) => {
            dataPlayers = json.players;
            state.setState({
              ...state.getState(),
              compStatus: "reset",
              handOn: false,
            });
            state.resetValuesRTDB();
            state.initResult(dataPlayers, params);
          });
      }, 2000);
    }
  },
};

export { state };
