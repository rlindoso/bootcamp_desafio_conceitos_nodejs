const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositoryId(req, res, next) {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  req.repositoryIndex = repositoryIndex;

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

const repositories = [];

/**
 * { 
 *    id: "uuid", 
 *    title: 'Desafio Node.js', 
 *    url: 'http://github.com/...', 
 *    techs: ["Node.js", "..."], 
 *    likes: 0 
 * }
 */

app.get("/repositories", (request, response) => {
  const { tech } = request.query;

  const results = tech ? repositories.filter(repository => repository.techs.includes(tech)) : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  console.log(request.params);
  const { id } = request.params;
  const repositoryIndex = request.repositoryIndex;
  const { title, url, techs } = request.body;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.status(201).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const repositoryIndex = request.repositoryIndex;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const repositoryIndex = request.repositoryIndex;

  repositories[repositoryIndex].likes++;

  return response.status(201).json(repositories[repositoryIndex]);
});

module.exports = app;
