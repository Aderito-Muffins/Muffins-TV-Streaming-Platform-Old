const functions = require("firebase-functions");
const axios = require("axios");

exports.proxyAnime = functions.https.onRequest((req, res) => {
  try {
    // Obtenha a URL da query string e adicione o parâmetro "autoPlay"
    const urlObj = new URL(req.query.url);
    urlObj.searchParams.set("autoPlay", "1");
    const animeUrl = urlObj.toString();

    // Configuração das opções da requisição HTTP com Axios
    const axiosConfig = {
      method: req.method,
      url: animeUrl,
      headers: {
        "host": "megacloud.tv",
        "connection": "keep-alive",
        "pragma": "no-cache",
        "cache-control": "no-cache",
        "sec-ch-ua": "\"Android WebView\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (Linux; Android 12; SM-A025F Build/SP1A.210812.016; wv) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/129.0.6668.100 Mobile Safari/537.36",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp," +
          "image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "x-requested-with": "com.zozoplayer",
        "sec-fetch-site": "none",
        "sec-fetch-mode": "navigate",
        "sec-fetch-user": "?1",
        "sec-fetch-dest": "document",
        "referer": "https://hianime.to/",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "cookie": "_ga_EL3PNTGQT1=GS1.1.1729942562.3.1.1729949096.0.0.0; _ga=GA1.1.1707936625.1729636348",
      },
      data: req.body,
    };

    // Realiza a requisição com Axios
    axios(axiosConfig)
        .then((response) => {
        // Envia a resposta com o mesmo status e dados da resposta original
          res.status(response.status).send(response.data);
        })
        .catch((error) => {
        // Trata erros na requisição e envia um status adequado
          const statusCode = error.response ? error.response.status : 500;
          res.status(statusCode).send({
            message: error.message,
          });
        });
  } catch (error) {
    // Trata erro na construção da URL ou na configuração da requisição
    res.status(500).send({
      message: "Erro ao processar a URL ou a requisição",
      error: error.message,
    });
  }
});
