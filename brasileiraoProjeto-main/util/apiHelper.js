const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function pegarInformacoesApi() {
  const response = await fetch("http://localhost:3000/brasileirao-dados", {
    headers: header,
  });
  const result = await response.json();
  return result;
}

export default pegarInformacoesApi;