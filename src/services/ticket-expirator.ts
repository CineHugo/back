// src/services/ticket-expirator.ts

import cron from 'node-cron';
import { MongoClient } from '../database/mongo';
import { Status, Ticket } from '../models/ticket';
import { Session } from '../models/session';

// A função que faz o trabalho pesado
const expireOldTickets = async () => {
  console.log('--- [CRON JOB] Iniciando verificação de ingressos expirados... ---');
  
  try {
    const now = new Date();

    // 1. Encontrar todas as sessões que já terminaram
    const expiredSessions = await MongoClient.db
      .collection<Session>('sessions')
      .find({ endsAt: { $lt: now } }) // $lt = less than (menor que)
      .toArray();

    if (expiredSessions.length === 0) {
      console.log('--- [CRON JOB] Nenhum ingresso para expirar. Finalizando. ---');
      return;
    }

    // 2. Extrair os IDs dessas sessões
    const expiredSessionIds = expiredSessions.map(session => session._id);

    // 3. Atualizar todos os ingressos ATIVOS que pertencem a essas sessões
    const updateResult = await MongoClient.db
      .collection<Ticket>('tickets')
      .updateMany(
        { 
          sessionId: { $in: expiredSessionIds }, // $in = "está contido no array"
          status: Status.ACTIVE 
        },
        { 
          $set: { 
            status: Status.EXPIRED, // Ou um novo status 'EXPIRED' se preferir
            updatedAt: now 
          } 
        }
      );

    if (updateResult.modifiedCount > 0) {
      console.log(`--- [CRON JOB] SUCESSO: ${updateResult.modifiedCount} ingressos foram marcados como expirados. ---`);
    } else {
      console.log('--- [CRON JOB] Nenhum ingresso ativo encontrado para as sessões expiradas. ---');
    }

  } catch (error) {
    console.error('--- [CRON JOB] ERRO ao executar a tarefa de expiração de ingressos: ---', error);
  }
};

// A função que agenda o trabalho
export const scheduleTicketExpirationJob = () => {
  // Agenda a tarefa para rodar a cada hora, no minuto 0.
  // (ex: 13:00, 14:00, 15:00)
  cron.schedule('0 * * * *', expireOldTickets);

  console.log('=> [CRON JOB] Tarefa de expiração de ingressos agendada para rodar a cada hora.');
};