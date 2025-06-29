import { Router } from "express";
import { MongoGetSessionsRepository } from "../repositories/session/get-sessions/mongo-get-sessions";
import { GetSessionsController } from "../controllers/session/get-sessions/get-sessions";
import { MongoGetSessionRepository } from "../repositories/session/get-session/mongo-get-session";
import { GetSessionController } from "../controllers/session/get-session/get-session";
import { MongoCreateSessionRepository } from "../repositories/session/create-session/mongo-create-session";
import { CreateSessionController } from "../controllers/session/create-session/create-session";
import { MongoUpdateSessionRepository } from "../repositories/session/update-session/mongo-update-session";
import { UpdateSessionController } from "../controllers/session/update-session/update-session";
import { MongoDeleteSessionRepository } from "../repositories/session/delete-session/mongo-delete-session";
import { DeleteSessionController } from "../controllers/session/delete-session/delete-session";

const sessionsRoutes = Router();

sessionsRoutes.get("/", async (req, res) => {
  const mongoGetSessionsRepository = new MongoGetSessionsRepository();

  const getSessionsController = new GetSessionsController(
    mongoGetSessionsRepository
  );

  const { body, statusCode } = await getSessionsController.handle();

  res.status(statusCode).send(body);
});

sessionsRoutes.get("/session/:id", async (req, res) => {
  const mongoGetSessionRepository = new MongoGetSessionRepository();

  const getSessionController = new GetSessionController(
    mongoGetSessionRepository
  );

  const { body, statusCode } = await getSessionController.handle({
    params: req.params,
  });

  res.status(statusCode).send(body);
});

sessionsRoutes.post("/create", async (req, res) => {
  const mongoCreateSessionRepository = new MongoCreateSessionRepository();

  const createSessionController = new CreateSessionController(
    mongoCreateSessionRepository
  );

  const { body, statusCode } = await createSessionController.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
});

sessionsRoutes.patch("/update/:id", async (req, res) => {
  const mongoUpdateSessionRepository = new MongoUpdateSessionRepository();

  const updateSessionController = new UpdateSessionController(
    mongoUpdateSessionRepository
  );

  const { body, statusCode } = await updateSessionController.handle({
    body: req.body,
    params: req.params,
  });

  res.status(statusCode).send(body);
});

sessionsRoutes.delete("/delete/:id", async (req, res) => {
  const mongoDeleteSessionRepository = new MongoDeleteSessionRepository();

  const deleteSessionController = new DeleteSessionController(
    mongoDeleteSessionRepository
  );

  const { body, statusCode } = await deleteSessionController.handle({
    params: req.params,
  });

  res.status(statusCode).send(body);
});

export default sessionsRoutes;
