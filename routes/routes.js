const express = require("express");
const router = express.Router();

const CadastroController = require("../controllers/cars"); // Verifique o caminho correto

router.post("/cadastrarCars", CadastroController.cadastrarCars);
router.get("/cars", CadastroController.listarCars);
router.get("/cars/:id", CadastroController.listarCarsId);
router.put("/atualizarCars/:id", CadastroController.atualizarCars);
router.delete("/deletarCars/:id", CadastroController.deletarCars);
module.exports = router;
