/* eslint-disable no-unused-vars */
import { Router } from "express";

// Supondo que você tenha um middleware para verificar a autenticação

// Repositórios e Controllers de Ticket
import { MongoGetTicketsRepository } from "../repositories/ticket/get-tickets/mongo-get-tickets";
import { GetTicketsController } from "../controllers/ticket/get-tickets/get-tickets";

import { MongoGetTicketRepository } from "../repositories/ticket/get-ticket/mongo-get-ticket";
import { GetTicketController } from "../controllers/ticket/get-ticket/get-ticket";

import { MongoCreateTicketRepository } from "../repositories/ticket/create-ticket/mongo-create-ticket";
import { CreateTicketController } from "../controllers/ticket/create-ticket/create-ticket";

import { MongoUpdateTicketRepository } from "../repositories/ticket/update-ticket/mongo-update-ticket";
import { UpdateTicketStatusController } from "../controllers/ticket/update-ticket/update-ticket";
import { Status } from "../models/ticket";
import { User } from "../models/user";
import { authMiddleware } from "../middlewares/auth-ticket";

import { ValidateTicketByQrController } from "../controllers/ticket/validate-ticket-by-qr/validate-ticket-by-qr";
import { MongoValidateTicketByQrRepository } from "../repositories/ticket/validate-ticket-by-qr/mongo-validate-ticket-by-qr";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const ticketsRoutes = Router();

// // Todas as rotas de ticket requerem autenticação
// Wrap async middleware to handle errors
function asyncMiddleware(handler: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

ticketsRoutes.use(asyncMiddleware(authMiddleware));

// --- ROTAS DE LEITURA (GET) ---

// Listar tickets (com filtros e permissões baseadas em role)
ticketsRoutes.get("/", async (req, res) => {
  const mongoGetTicketsRepository = new MongoGetTicketsRepository();
  const getTicketsController = new GetTicketsController(
    mongoGetTicketsRepository
  );

  const { body, statusCode } = await getTicketsController.handle({
    query: req.query, // Passa os filtros da URL (ex: ?sessionId=...)
    user: req.user, // Passa o usuário logado para a lógica de permissão
  });

  res.status(statusCode).send(body);
});

// Buscar um ticket específico por ID (com validação de dono ou admin)
ticketsRoutes.get("/ticket/:id", async (req, res) => {
  const mongoGetTicketRepository = new MongoGetTicketRepository();
  const getTicketController = new GetTicketController(mongoGetTicketRepository);

  const { body, statusCode } = await getTicketController.handle({
    params: req.params,
    user: req.user,
  });

  res.status(statusCode).send(body);
});

// --- ROTA DE CRIAÇÃO (POST) ---

// Reservar um ou mais ingressos
ticketsRoutes.post("/reserve", async (req, res) => {
  const mongoCreateTicketRepository = new MongoCreateTicketRepository();
  const createTicketController = new CreateTicketController(
    mongoCreateTicketRepository
  );

  const { body, statusCode } = await createTicketController.handle({
    body: req.body,
    user: req.user,
  });

  res.status(statusCode).send(body);
});

// --- ROTAS DE ATUALIZAÇÃO DE STATUS (PATCH) ---

// Cancelar um ingresso
ticketsRoutes.patch("/ticket/:id/cancel", async (req, res) => {
  // Instanciamos ambos os repositórios necessários para o controller
  const getTicketRepository = new MongoGetTicketRepository();
  const updateTicketRepository = new MongoUpdateTicketRepository();

  // Configura o controller para a ação de CANCELAR
  const cancelTicketController = new UpdateTicketStatusController(
    getTicketRepository,
    updateTicketRepository,
    Status.ACTIVE, // Status inicial permitido
    Status.CANCELLED // Status de destino
  );

  const { body, statusCode } = await cancelTicketController.handle({
    params: req.params,
    user: req.user,
  });

  res.status(statusCode).send(body);
});

// Marcar um ingresso como usado (ex: na entrada do cinema)
ticketsRoutes.patch("/ticket/:id/use", async (req, res) => {
  const getTicketRepository = new MongoGetTicketRepository();
  const updateTicketRepository = new MongoUpdateTicketRepository();

  // Configura o mesmo controller para a ação de USAR
  const useTicketController = new UpdateTicketStatusController(
    getTicketRepository,
    updateTicketRepository,
    Status.ACTIVE, // Status inicial permitido
    Status.USED // Status de destino
  );

  const { body, statusCode } = await useTicketController.handle({
    params: req.params,
    user: req.user,
  });

  res.status(statusCode).send(body);
});

ticketsRoutes.patch("/validate-by-qr", async (req, res) => {
  const repo = new MongoValidateTicketByQrRepository();
  const controller = new ValidateTicketByQrController(repo);

  const { body, statusCode } = await controller.handle({
    body: req.body, // O corpo da requisição terá o { "qrUuid": "..." }
    user: req.user,
  });

  res.status(statusCode).send(body);
});

export default ticketsRoutes;
