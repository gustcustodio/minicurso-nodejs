// * importação dos módulos necessários * //
// ? importa a tabela com os dados dos times, o framework Express e os modelos de validação para estruturar os dados das requisições. ? //
import tabela2024 from "./tabela.js";
import express, { response } from "express";
import { modeloTime, modeloAtualizacaoTime } from "./validacao.js";

// * criação da instância do servidor * //
// ? cria a aplicação Express que servirá como base para o servidor HTTP. ? //
const app = express();

// * middleware para interpretar JSON no corpo das requisições * //
// ? middleware que transforma o corpo das requisições no formato JSON em um objeto JavaScript. ? //
app.use(express.json());

// * rota inicial para retornar a tabela completa * //
// ? retorna todos os dados armazenados na `tabela2024` ao acessar a rota raiz ("/"). ? //
// ? usa status HTTP 200 para indicar sucesso. ? //
app.get("/", (requisicao, resposta) => {
  resposta.status(200).send(tabela2024);
});

// * rota dinâmica para buscar informações de um time pela sigla * //
// ? busca um time na tabela com base na sigla fornecida na URL. ? //
// ? retorna status 404 caso o time não seja encontrado. ? //
app.get("/:sigla", (requisicao, resposta) => {
  const sigla = requisicao.params.sigla.toUpperCase();
  const time = tabela2024.find((infoTime) => infoTime.sigla === sigla);

  if (!time) {
    resposta
      .status(404)
      .send(
        "Não existe na séria A do Brasileirão um time com a sigla informada!"
      );
    return;
  }

  resposta.status(200).send(time);
});

// * rota para atualizar informações de um time existente * //
// ? atualiza os dados de um time com base na sigla fornecida na URL. ? //
// ? primeiro verifica se o time existe e se os dados enviados atendem ao modelo de validação (`modeloAtualizacaoTime`). ? //
// ? usa `Object.keys` para iterar pelos campos enviados no corpo da requisição e atualizá-los. ? //
// ? retorna status 400 para erros de validação e 404 se o time não for encontrado. ? //
app.put("/:sigla", (requisicao, resposta) => {
  const sigla = requisicao.params.sigla.toUpperCase();
  const timeSelecionado = tabela2024.find((time) => time.sigla === sigla);

  if (!timeSelecionado) {
    resposta
      .status(404)
      .send(
        "Não existe na série A do Brasileirão um time com a sigla informada!"
      );
    return;
  }

  const resultadoAvaliacao = modeloAtualizacaoTime.validate(
    requisicao.body
  ).error;

  if (resultadoAvaliacao) {
    resposta.status(400).send(resultadoAvaliacao);
    return;
  }

  const campos = Object.keys(requisicao.body);

  for (let campo of campos) {
    timeSelecionado[campo] = requisicao.body[campo];
  }

  resposta.status(200).send(timeSelecionado);
});

// * rota para criar um novo time na tabela * //
// ? recebe os dados de um novo time no corpo da requisição e valida contra o modelo (`modeloTime`). ? //
// ? se for válido, adiciona o novo time ao array `tabela2024`. ? //
// ? retorna status 400 para erros de validação e 201 para criação bem-sucedida. ? //
app.post("/", (requisicao, resposta) => {
  const novoTime = requisicao.body;
  const resultadoAvaliacao = modeloTime.validate(novoTime).error;

  if (resultadoAvaliacao) {
    resposta.status(400).send(resultadoAvaliacao);
    return;
  }

  tabela2024.push(novoTime);
  resposta.status(201).send(novoTime);
});

// * rota para remover um time com base na sigla * //
// ? encontra o índice do time a ser removido com base na sigla fornecida. ? //
// ? retorna status 404 se o time não for encontrado. ? //
// ? remove o time da tabela usando `splice` e retorna o objeto removido. ? //
app.delete("/:sigla", (requisicao, resposta) => {
  const sigla = requisicao.params.sigla.toUpperCase();
  const indiceTimeSelecionado = tabela2024.findIndex(
    (time) => time.sigla === sigla
  );

  if (indiceTimeSelecionado === -1) {
    resposta
      .status(404)
      .send(
        "Não existe na série A do Brasileirão um time com a sigla informada!"
      );
    return;
  }

  const timeRemovido = tabela2024.splice(indiceTimeSelecionado, 1);
  resposta.status(200).send(timeRemovido);
});

// * inicialização do servidor * //
// ? o servidor começa a escutar na porta 300 e exibe uma mensagem de sucesso no console. ? //
app.listen(300, () => console.log("Servidor rodando com sucesso!"));
