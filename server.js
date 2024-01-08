import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport';
import cookieSession from 'cookie-session';
import authRoute from "./routes/auth.js"
import bodyParser from 'body-parser';
import axios from 'axios';
import Router from './routes/route.js';
import passportSetup from "./passport.js"

import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(
    cookieSession({
        name:"session",
        keys:["NyaySetu"],
        maxAge:24*60*60*100,
    })
)
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended:true}))
app.use(
    cors({
        origin: "http://localhost:3000",
        methods:"GET,PUT,POST,DELETE",
        credentials:true
    })
)

app.use("/auth",authRoute);

app.use("/",Router);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/converter', upload.single('file'), async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post('https://converter.portal.ayfie.com/api/converter/1/FileConverter/Convert', formData, {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'multipart/form-data',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error converting file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





/// end of convert api


app.post('/translate', async (req, res) => {
  try {
    const { inputText, inputLanguage, outputLanguage } = req.body;
    const requestData = {
      inputText,
      inputLanguage,
      outputLanguage
    };
    const response = await axios.post('https://tts.bhashini.ai/v1/translate', requestData, {
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
        // Add any other required headers here
      },
    });

    // Send the translated text back to the frontend
    res.status(200).json({ translatedText: response.data });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// whisper ai

app.post('/transcribe-audio', (req, res) => {
  try {
    const { transcript } = req.body;
    // Here, you can handle the transcription data received from the frontend
    console.log('Transcription:', transcript);

    // Dummy response for demonstration
    res.status(200).json({ message: 'Transcription received successfully.' });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'An error occurred during transcription.' });
  }
});
// end of whisper ai

app.listen(PORT, 
  () => {
    console.log(`Server is running on PORT ${PORT}`);
  }
)


// Connection(USERNAME,PASSWORD);
