import http from "http";
import { routes } from "./routes.js";
import { json } from "./middlewares/json.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

// UUID Unique Universal Identifier

// HTTP
// - Método
// - URL

// GET, POST, PUT, PATCH, DELETE

// GET => Buscar um recurso do back-end
// POST => Criar um recurso no back-end
// PUT => Atualizar um recurso no back-end
// PATCH => Atualizar uma informacao de um recurso no back-end
// DELETE => Deletar um recurso do back-end

// Stateful - guarda informacao em tempo de execucao
// stateless - Não guarda

// Cabecalhos (Requisicao/Resposta) => Metadados

//--- Routes  ---
// Query Parameters: URL statefull => Filtros, paginacao, não-obrigatorios
// Route Parameters: Identificacao de recursos
// Request body: Envio de informacaoes de formulário

//..url/users?page=3&category=student&

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  console.log(method, url);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  res.writeHead(404).end("Route not found");
});

server.listen(3333);
