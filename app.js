import tabela2024 from "./tabela.js";
import express from "express";

const app = express();

app.get("/", (requisicao, resposta) => {
    resposta.send(tabela2024);
});

app.listen(300, () => console.log("Servidor rodando com sucesso!"));
