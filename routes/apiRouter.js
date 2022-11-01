const express = require("express");
const apiRouter = express.Router();
const notesRouter = require("./notesRouter");

apiRouter.use("/notes", notesRouter);

module.exports = apiRouter;