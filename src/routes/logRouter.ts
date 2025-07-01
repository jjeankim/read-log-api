import express from "express";

const logRouter = express.Router();

logRouter.route("/").post().get();

logRouter.route("/:id").get().patch().delete();

export default logRouter;
