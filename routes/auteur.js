import express from "express";
import { getAllAuteurs, getStatsLivresApres1900 } from "../controllers/auteurController.js";

const router = express.Router();

router.get("/", getAllAuteurs);
router.get("/livres1900", getStatsLivresApres1900);

export default router;