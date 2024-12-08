import { FastifyInstance } from 'fastify';
import { knex } from '../db';
import { z } from 'zod';
import { randomUUID } from 'crypto';

// http

// controller
// service
// repository

// SOLID

// unit
// integration
// e2e

export async function booksRouter(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [app.authenticate],
    },
    async (request) => {
      const { id } = request.user;

      const books = await knex('books').where('user_id', id).select();

      return { books };
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [app.authenticate],
    },
    async (request) => {
      const { id: user_id } = request.user;

      const getBookParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getBookParamsSchema.parse(request.params);

      const book = await knex('books')
        .where({
          id,
          user_id,
        })
        .first();

      return { book };
    },
  );

  app.post(
    '/',
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const createBookBodySchema = z.object({
        title: z.string(),
        genrer: z.string(),
        author: z.string(),
      });

      const { title, author, genrer } = createBookBodySchema.parse(
        request.body,
      );

      await knex('books').insert({
        id: randomUUID(),
        title,
        author,
        genrer,
        user_id: request.user.id,
      });

      return reply.status(201).send();
    },
  );


  app.put(
    '/:id',
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const { id: user_id } = request.user;

      const updateBookParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const updateBookBodySchema = z.object({
        title: z.string().optional(),
        genrer: z.string().optional(),
        author: z.string().optional(),
      });

      const { id } = updateBookParamsSchema.parse(request.params);
      const updateData = updateBookBodySchema.parse(request.body);

      const updatedRows = await knex('books')
        .where({
          id,
          user_id,
        })
        .update(updateData);

      if (updatedRows === 0) {
        return reply.status(404).send({ error: 'Livro não encontrado ou não autorizado' });
      }

      return reply.status(204).send({ message: 'Livro Atualizado' });
    },
  );

  app.delete(
    '/:id',
    {
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const { id: user_id } = request.user;

      const deleteBookParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = deleteBookParamsSchema.parse(request.params);

      const deletedRows = await knex('books')
        .where({
          id,
          user_id,
        })
        .delete();

      if (deletedRows === 0) {
        return reply.status(404).send({ error: 'Livro não encontrado ou não autorizado' });
      }

      return reply.status(204).send({ message: 'Livro Removido' });
    },
  );


}
