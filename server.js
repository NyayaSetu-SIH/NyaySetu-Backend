import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport';
import cookieSession from 'cookie-session';
import passportSetup from "./passport.js"
import authRoute from "./routes/auth.js"
import bodyParser from 'body-parser';
// import Connection from './database/db.js';
import axios from 'axios';
// import Router from './routes/route.js';

const app = express();
dotenv.config();

const PORT = 8000 || process.env.PORT;

app.use(
    cookieSession({
        name:"session",
        keys:["NyaySetu"],
        maxAge:24*60*60*100,
    })
)
app.use(passport.initialize());
app.use(passport.session());
// app.use(cors());
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended:true}))
app.use(
    cors({
        origin: "https://nyaysetu22.netlify.app/",
        methods:"GET,PUT,POST,DELETE",
        credentials:true
    })
)

app.use("/auth",authRoute)
// app.use('/',Router)


app.post('/translate', async (req, res) => {
  try {
    // Extract input data from the request body
    const { inputText, inputLanguage, outputLanguage } = req.body;

    // Set up the request data for Bhashini API
    const requestData = {
      inputText,
      inputLanguage,
      outputLanguage
    };

    // Make a POST request to the Bhashini API
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



app.listen(PORT, 
  () => {
    console.log(`Server is running on PORT ${PORT}`);
  }
)


// Connection(USERNAME,PASSWORD);
