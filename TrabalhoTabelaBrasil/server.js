import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;  // Define a porta do servidor

// Habilita CORS para todas as origens
app.use(cors());

// Rota para buscar os dados do Brasileirão
app.get("/brasileirao-dados", async (req, res) => {
  const apiUrl =
    "https://jsuol.com.br/c/monaco/utils/gestor/commons.js?file=commons.uol.com.br/sistemas/esporte/modalidades/futebol/campeonatos/dados/2024/30/dados.json/";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }

    const data = await response.text();
    res.send(data); // Retorna os dados para o frontend
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    res.status(500).send("Erro ao buscar dados: " + error.message);
  }
});
// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});