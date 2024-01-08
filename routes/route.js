import express from 'express'
const router = express.Router();
import {summarizeText} from '../controllers/SummarizerController.js';

router.post('/api/summarize', summarizeText);

export default router