import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, child, get } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "urlworker.firebaseapp.com",
  databaseURL: "https://urlworker-default-rtdb.firebaseio.com",
  projectId: "urlworker",
  storageBucket: "urlworker.appspot.com",
  messagingSenderId: "765373114457",
  appId: "1:765373114457:web:14f1627e1563122517e948"
};

// Initialize Firebase
const app = express();
app.use(cors());
dotenv.config();
const firebase = initializeApp(firebaseConfig);
const port = 8080;

// Initialize Firebase Realtime database
const database = getDatabase(firebase);

async function writeDB(route, setObject) {
  set(ref(database, route), setObject);
}
async function readDB(route) {
  return await get(child(ref(database), route)).then((snapshot) => { return snapshot.val() });
}

//Add route to send emails with resend
app.post('/shorten', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL is required.' });
    }
    let count = await readDB("/count");
    var setObject = { url: url };
    writeDB('/'+count, setObject);
    writeDB('/count', count + 1);
    return res.json({ id: count });
  } catch (error) {
      console.error('Error shortening URL:', error);
      res.status(500).json({ error: 'Failed to shorten URL.' });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id)
    const url = (await readDB('/'+id)).url;
    console.log(url)
    if (!url) {
      return res.status(404).json({ error: 'URL not found.' });
    }
    if(!url.startsWith('http')) {
      return res.redirect('https://' + url);
    }
    return res.redirect(url);
  } catch (error) {
      console.error('Error redirecting:', error);
      res.status(500).json({ error: 'Failed to redirect.' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});