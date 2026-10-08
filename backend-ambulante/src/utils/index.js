const express = require("express");

module.exports = (pool) => {
  const router = express.Router();
  router.use(require("./ambulantes")(pool));
  router.use(require("./pontos")(pool));
  router.use(require("./solicitacoes")(pool));
  return router;
};