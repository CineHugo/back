import { Router } from "express";
import { MongoGetRoomsRepository } from "../repositories/room/get-rooms/mongo-get-rooms";
import { GetRoomsController } from "../controllers/room/get-rooms/get-rooms";
import { MongoGetRoomRepository } from "../repositories/room/get-room/mongo-get-room";
import { GetRoomController } from "../controllers/room/get-room/get-room";
import { MongoCreateRoomRepository } from "../repositories/room/create-room/mongo-create-room";
import { CreateRoomController } from "../controllers/room/create-room/create-room";
import { MongoUpdateRoomRepository } from "../repositories/room/update-room/mongo-update-room";
import { UpdateRoomController } from "../controllers/room/update-room/update-room";
import { MongoDeleteRoomRepository } from "../repositories/room/delete-room/mongo-delete-room";
import { DeleteRoomController } from "../controllers/room/delete-room/delete-room";

const roomsRoutes = Router();

roomsRoutes.get("/", async (req, res) => {
  const mongoGetRoomsRepository = new MongoGetRoomsRepository();

  const getRoomsController = new GetRoomsController(mongoGetRoomsRepository);

  const { body, statusCode } = await getRoomsController.handle();

  res.status(statusCode).send(body);
});

roomsRoutes.get("/room/:id", async (req, res) => {
  const mongoGetRoomRepository = new MongoGetRoomRepository();

  const getRoomController = new GetRoomController(mongoGetRoomRepository);

  const { body, statusCode } = await getRoomController.handle({
    params: req.params,
  });

  res.status(statusCode).send(body);
});

roomsRoutes.post("/create", async (req, res) => {
  const mongoCreateRoomRepository = new MongoCreateRoomRepository();

  const createRoomController = new CreateRoomController(
    mongoCreateRoomRepository
  );

  const { body, statusCode } = await createRoomController.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
});

roomsRoutes.patch("/update/:id", async (req, res) => {
  const mongoUpdateRoomRepository = new MongoUpdateRoomRepository();

  const updateRoomController = new UpdateRoomController(
    mongoUpdateRoomRepository
  );

  const { body, statusCode } = await updateRoomController.handle({
    body: req.body,
    params: req.params,
  });

  res.status(statusCode).send(body);
});

roomsRoutes.delete("/delete/:id", async (req, res) => {
  const mongoDeleteRoomRepository = new MongoDeleteRoomRepository();

  const deleteRoomController = new DeleteRoomController(
    mongoDeleteRoomRepository
  );

  const { body, statusCode } = await deleteRoomController.handle({
    params: req.params,
  });

  res.status(statusCode).send(body);
});

export default roomsRoutes;
