//Estudo de back-end com express
//Back-end study with express

//Qualquer dúvida, contate-me: github.com/markdiasbr
//Any questions, get in touch: github.com/markdiasbr

// Importando o módulo express e o módulo cors
// Importing the express and cors modules
import express from "express";
import cors from "cors";

// Criando uma instância do express
// Creating an instance of express
const app = express();
// Usando o módulo cors para permitir acesso a recursos de outros domínios
// Using the cors module to allow access to resources from other domains
app.use(cors());
// Configurando o servidor para receber dados no formato JSON
// Configuring the server to receive data in JSON format
app.use(express.json());

// Criando arrays para armazenar usuários e tweets
// Creating arrays to store users and tweets
const usuarios = [];
const tweets = [];

// Endpoint para logar usuários
// Endpoint for user login
app.post("/sign-up", (req, res) => {

    //Seção de validação da requisição
    //Requisition validation section
    
    //Retorna 400 quando a propriedade 'username' e/ou 'avatar' não estão presentes
    //Returns 400 when the 'username' property and/or 'avatar' aren't present
    if (!(req.body.hasOwnProperty("username")) || !(req.body.hasOwnProperty("avatar"))) {
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }

    //Retorna 400 quando o username é vazio e/ou não é string
    //Returns 400 when username is empty and/or is not a string
    if (!req.body.username || typeof req.body.username !== "string") {
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }
    
    //Retorna 400 quando o avatar é vazio e/ou não é string
    //Returns 400 when avatar is empty and/or is not a string
    if (!req.body.avatar || typeof req.body.avatar !== "string") {
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }

    //Seção de processamento e saída
    //Processing and output section

    //Tudo certo, envia o body para o array de usuários, logando o usuário
    //Everything turned out fine, send the body to the users array, logging him/her/them
    usuarios.push(req.body);
    res.status(statusCodes.created).send(status.ok);
});

//Postar tweets
//Posting tweets
app.post("/tweets", (req, res) => {

    //Seção de validação da requisição
    //Requisition validation section

    //Se a propriedade 'username' e/ou 'tweet' não estão presentes
    //If the 'username' property and/or 'tweet' aren't present
    if (!(req.body.hasOwnProperty("username") || req.header("user")) || !(req.body.hasOwnProperty("tweet"))) {
        //Retorna 400
        //Returns 400
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }

    //Se o body tem a propriedade 'username' presente
    //If body has the 'username' property

    //E Se o req.body.username é vazio e/ou não é string
    //AND If the req.body.username is empty or is not a string
    if (req.body.hasOwnProperty("username") && (!req.body.username || typeof req.body.username !== "string")) {
        //Retorna 400
        //Returns 400
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }      

    //Se o header tem a propriedade 'user' presente
    //E se o req.header.('user') é vazio e/ou não é string
    if (req.header("user") && (!req.header("user") || typeof req.header("user") !== "string")) {
        //Retorna 400
        //Returns 400
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }
    
    //Retorna 400 quando o tweet é vazio e/ou não é string
    //Returns 400 when the tweet is empty and/or is not a string
    if (!req.body.tweet || typeof req.body.tweet !== "string") {
        //Retorna 400
        //Returns 400
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }

    //Seção de processamento e saída
    //Processing and output section

    //Salvar o tweet
    // Save the tweet
    let tweet = req.body;
    //Salvar o header do tweet se houver
    // Save the tweet header if any
    const tweetHeader = req.header("user");

    //Checar se o usuário está logado
    // Check if the user is logged in
    const usuarioLogado = usuarios.find(u => u.username === tweet.username || u.username === tweetHeader);

    //Se o tweet não tem uma propriedade 'username'
    // If the tweet doesn't have a 'username' property
    if (!tweet.hasOwnProperty("username")) {
        //Adicionar propriedade 'username'
        //Add 'username' property
        tweet = {username:`${tweetHeader}`,...tweet};
    }

    //Se o usuário está logado
    // If the user is logged in
    if (usuarioLogado) {
        //Adiciona o tweet à lista
        // add the tweet to the list
        tweets.push(tweet);
        //Retorna 201 Criado
        // Return 201 Created
        res.status(statusCodes.created).send(status.ok);
    } else {
        //Retorna 401 Não autorizado
        // Return 401 Unauthorized
        res.status(statusCodes.unauthorized).send(status.unauthorized);
    }
});

//Endpoint pra obter os tweets
//Endpoint to get tweets
app.get("/tweets", (req, res) => {
    let page = null;
    let body = [...tweets];

    //Se a request tem um query parameter 'page'
    // If the request has a 'page' query parameter
    if (req.query.page) {
        //Salvar page
        //Save page
        page = Number(req.query.page);

        //Se parâmetro 'page' não é um inteiro positivo ou é NaN
        // If the 'page' parameter is not a positive integer or is NaN
        if (Number.isInteger(page) && page < 1 || isNaN(page) || !Number.isInteger(page)) {
            //Retorna 400 Requisição ruim
            // Return 400 Bad Request
            res.status(statusCodes.badRequest).send(status.badRequest2);
            return;
        }

        //Se há mais de 10*page tweets, mostre os 10 últimos
        // If there are more than 10*page tweets, show the last 10
        if (body.length>10*page) {
            body = body.splice(body.length - 10*page,10);

        //Se há menos de 10*page tweets porém mais de 10*(page-1), mostre o restante
        // If there are less than 10*page tweets but more than 10*(page-1), show the remaining ones
        } else if (body.length < 10*page && body.length > 10*(page-1)) {
            body = body.splice(0,body.length - 10*(page-1));

        //Se não há tweets pra mostrar, retorne uma lista vazia
        // If there are no tweets to show, return an empty array
        } else {
            body = [];
        }

    //Se a requisição não tem um parâmetro 'page'
    //If the request doesn't have a 'page' parameter
    } else {
        //Retorne os 10 ou menos tweets
        //return the last 10 or less tweets
        body = body.length>10 ? body.slice(body.length - 10) : body;
    }

    //Adicione a propriedade avatar e seu valor aos tweets
    //Add the avatar property and value to the tweets
    body = body.map(t => {
        const usuario = usuarios.find(u => u.username === t.username);
        return ({avatar: `${usuario.avatar}`,...t});
    });

    //Retornar o body formatado
    //return the formatted body
    res.send(body);
    return;
});

//Endpoint para pegar todos os tweets de determinado username
//Endpoint to get all tweets by one username
app.get("/tweets/:username", (req, res) => {
    //Salvando o username
    //Saving the username
    const nomeUsuario = req.params.username;

    //Filtrando os tweets que tem o username
    //Filtering the tweets that has the username
    let body = tweets.filter(t => t.username === nomeUsuario);

    //Adicionando a propriedade avatar e seu valor aos tweets
    //Add the avatar property and value to the tweets
    body = body.map(t => {
        const usuario = usuarios.find(u => u.username === t.username);
        return ({avatar: `${usuario.avatar}`,...t});
    });

    //Retorna o body formatado
    //return the formatted body
    res.send(body);
});

const PORT = 5000;
app.listen(PORT, ()=>console.log(`Servidor rodando na porta ${PORT}`));

const statusCodes = {
    ok: 200,
    created: 201,
    badRequest: 400,
    unauthorized: 401,
};

const status = {
    ok: "OK",
    badRequest1: "Todos os campos são obrigatórios!",
    badRequest2: "Informe uma página válida!",
    unauthorized: "UNAUTHORIZED"
}; 