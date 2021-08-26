import * as express from "express";
import firebase from "firebase";
import codeGen from "./codeGen";
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.static("dist"));

// Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAY51xRKdVdFlrXc1CtMHg2sSN6b4uIE9Y",
  authDomain: "dwf-m6-desafio.firebaseapp.com",
  projectId: "dwf-m6-desafio",
  storageBucket: "dwf-m6-desafio.appspot.com",
  messagingSenderId: "680897454436",
  appId: "1:680897454436:web:996881433d99655aee9a71",
});

// Firestore
const db = firebase.firestore();
const roomsCollection = db.collection("gamerooms");

// Realtime Database
const rtdb = firebase.database();

// Esqueleto para agregar objetos
const skeleton = (playerOwner: string) => {
  const objeto = {};
  objeto[playerOwner] = {
    puntos: 0,
  };

  return objeto;
};

const skeletonRTDB = (playerOwner: string) => {
  const objeto = {};
  objeto[playerOwner] = {
    ready: false,
  };

  return objeto;
};

// Rutas
// Crear gameroom
app.post("/api/gamerooms", async (req, res) => {
  const codeGetted = codeGen();
  const docRef = roomsCollection.doc(codeGetted);
  const rtdbRef = rtdb.ref(`gamerooms/${codeGetted}`);
  const { playerOwner } = req.body;

  await docRef.set({
    id: codeGetted,
    players: skeleton(playerOwner),
  });

  await rtdbRef.set({
    id: codeGetted,
    players: skeletonRTDB(playerOwner),
  });

  res.json({
    status: "Gameroom creada con exito",
    gameroom: codeGetted,
  });
});

// Mandar info de una gameroom
app.get("/api/gamerooms/:id", async (req, res) => {
  const snapshot = await roomsCollection.where("id", "==", req.params.id).get();

  if (snapshot.empty) {
    res.json({ error: "Gameroom no encontrada" });
  } else {
    let result: any = {};

    snapshot.forEach((doc) => {
      result = doc.data();
    });
    res.json(result);
  }
});

// Unirse a una gameroom
app.post("/api/gamerooms/:id", async (req, res) => {
  const snapshot = await roomsCollection.where("id", "==", req.params.id).get();
  const rtdbRef = rtdb.ref(`gamerooms/${req.params.id}`);
  const { newPlayer } = req.body;
  let result: any = {};

  snapshot.forEach((doc) => {
    result = doc.data();
  });

  if (snapshot.empty) {
    res.json({ error: "Gameroom no encontrada" });
  } else if (
    Object.keys(result.players).length == 2 &&
    !Object.keys(result.players).includes(newPlayer)
  ) {
    res.json({
      error:
        "Gameroom llena y tu nombre no coincide con uno de los registrados",
    });
  } else if (
    Object.keys(result.players).length == 2 &&
    Object.keys(result.players).includes(newPlayer)
  ) {
    // Hago esta operacion, porque si ya existe el usuario, no le resetee los puntos
    let { id, players } = result;

    await roomsCollection.doc(req.params.id).set({
      id,
      players,
    });

    let oldPlayers = players;

    players = {};
    players[Object.keys(oldPlayers)[0]] = {
      ready: false,
      handChoosen: false,
      winner: false,
    };

    players[Object.keys(oldPlayers)[1]] = {
      ready: false,
      handChoosen: false,
      winner: false,
    };
    await rtdbRef.set({
      id,
      players,
    });

    res.json(await (await roomsCollection.doc(req.params.id).get()).data());
  } else {
    // En este caso, si el usuario no existe en la gameroom pero todavia queda un espacio le ponga puntos iniciales
    result.players[newPlayer] = {
      puntos: 0,
    };

    let { id, players } = result;

    await roomsCollection.doc(req.params.id).set({
      id,
      players,
    });

    let oldPlayers = players;

    players = {};
    players[Object.keys(oldPlayers)[0]] = {
      ready: false,
      handChoosen: false,
      winner: false,
    };

    players[Object.keys(oldPlayers)[1]] = {
      ready: false,
      handChoosen: false,
      winner: false,
    };
    await rtdbRef.set({
      id,
      players,
    });

    res.json(await (await roomsCollection.doc(req.params.id).get()).data());
  }
});

// Asignar puntos a jugadores
app.put("/api/gamerooms/:id", async (req, res) => {
  const snapshot = await roomsCollection.where("id", "==", req.params.id).get();
  let result: any = {};

  snapshot.forEach((doc) => {
    result = doc.data();
  });

  // TODO: Arreglar esta wbda pa que mande un solo punto y mantener los que ya estan, y luego deploy pa
  if (snapshot.empty) {
    res.json({ error: "Gameroom no encontrado" });
  } else {
    const { winner } = req.body;

    result.players[winner].puntos++;

    const { id, players } = result;

    await roomsCollection.doc(req.params.id).set({
      id,
      players,
    });

    res.json(await (await roomsCollection.doc(req.params.id).get()).data());
  }
});

// Inicializar server
app.listen(PORT, () => console.log("Server on port", PORT));
