import admin, { ServiceAccount } from "firebase-admin";
import dotenv from "dotenv";
import { Game } from "../models/Game.model";

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.NEXT_PUBLIC_FIREBASE_TYPE,
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      private_key_id: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
      private_key: `${process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY}`.replace(
        /\\n/gm,
        "\n"
      ),
      client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      client_id: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
      auth_uri: process.env.NEXT_PUBLIC_FIREBASE_AUTH_URI,
      token_uri: process.env.NEXT_PUBLIC_FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CERT_URL,
    } as ServiceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASEURL,
  });
}

const db = admin.firestore();

const Repository = {
  findByPk: async (id: string) => {
    const gameDoc = await db.collection("games").doc(id).get();
    if (!gameDoc.exists) {
      return null;
    } else {
      return {
        ...gameDoc.data(),
        boardInfo: JSON.parse(gameDoc.data()?.boardInfo),
      } as Game;
    }
  },
  create: async (game: Game) => {
    let newDoc = db.collection("games").doc();
    const data = {
      ...game,
      id: newDoc.id,
      boardInfo: JSON.stringify(game.boardInfo),
      winner: "",
      inPlay: false,
    };
    await newDoc.set(data);

    let gameDoc = await db.collection("games").doc(data.id).get();
    if (!gameDoc.exists) {
      return null;
    } else {
      return {
        ...gameDoc.data(),
        boardInfo: JSON.parse(gameDoc.data()?.boardInfo),
      } as Game;
    }
  },
  update: async (game: Game) => {
    const data: any = { ...game };
    if (game.boardInfo) {
      data.boardInfo = JSON.stringify(game.boardInfo);
    }

    await db.collection("games").doc(game.id).update(data);
  },
};

export default Repository;
