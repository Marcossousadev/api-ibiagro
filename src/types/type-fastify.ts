import { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export type FastifyTypeInstance = FastifyInstance<
// instancia servirdor fastify
RawServerDefault,
// Tipo da requisição bruta (IncomingMessage no Node.js).
RawRequestDefaultExpression,
// Tipo da resposta bruta (ServerResponse do Node.js).
RawReplyDefaultExpression,

// Tipo do sistema de log usado pelo Fastify (por padrão, pino).
FastifyBaseLogger,
// Para utlizar o Zod para tipar os schemas!
ZodTypeProvider
> 