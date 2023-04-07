import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const usuarios = [];
const tweets = [];

app.post("/sign-up", (req, res) => {

    //Retorna 400 quando a propriedade 'username' e/ou 'avatar' não estão presentes
    if (!(req.body.hasOwnProperty("username")) || !(req.body.hasOwnProperty("avatar"))) {
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }

    //Retorna 400 quando o username é vazio e/ou não é string
    if (!req.body.username || typeof req.body.username !== "string") {
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }
    
    //Retorna 400 quando o avatar é vazio e/ou não é string
    if (!req.body.avatar || typeof req.body.avatar !== "string") {
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }

    usuarios.push(req.body);
    res.status(statusCodes.created).send(status.ok);
});

app.post("/tweets", (req, res) => {

    //Retorna 400 quando a propriedade 'username' e/ou 'tweet' não estão presentes
    if (!(req.body.hasOwnProperty("username") || req.header("user")) || !(req.body.hasOwnProperty("tweet"))) {
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }

    //Se o body tem a propriedade 'username' presente
    //E se o req.body.username é vazio e/ou não é string
    if (req.body.hasOwnProperty("username") && (!req.body.username || typeof req.body.username !== "string")) {
        //Retorna 400
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }      

    //Se o header tem a propriedade 'user' presente
    //E se o req.header.('user') é vazio e/ou não é string
    if (req.header("user") && (!req.header("user") || typeof req.header("user") !== "string")) {
        //Retorna 400
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }
    
    //Retorna 400 quando o tweet é vazio e/ou não é string
    if (!req.body.tweet || typeof req.body.tweet !== "string") {
        //Retorna 400
        res.status(statusCodes.badRequest).send(status.badRequest1);
        return;
    }

    let tweet = req.body;
    const tweetHeader = req.header("user");

    const usuarioLogado = usuarios.find(u => u.username === tweet.username || u.username === tweetHeader);

    if (!tweet.hasOwnProperty("username")) {
        tweet = {username:`${tweetHeader}`,...tweet};
    }

    if (usuarioLogado) {
        tweets.push(tweet);
        res.status(statusCodes.created).send(status.ok);
    } else {
        res.status(statusCodes.unauthorized).send(status.unauthorized);
    }
});

app.get("/tweets", (req, res) => {
    let page = null;
    let body = [...tweets];

    if (req.query.page) {
        page = Number(req.query.page);

        if (Number.isInteger(page) && page < 1 || isNaN(page) || !Number.isInteger(page)) {
            res.status(statusCodes.badRequest).send(status.badRequest2);
            return;
        }

        if (body.length>10*page) {
            body = body.splice(body.length - 10*page,10);
        } else if (body.length < 10*page && body.length > 10*(page-1)) {
            body = body.splice(0,body.length - 10*(page-1));
        } else {
            body = [];
        }
    } else {
        body = body.length>10 ? body.slice(body.length - 10) : body;
    }

    body = body.map(t => {
        const usuario = usuarios.find(u => u.username === t.username);
        return ({avatar: `${usuario.avatar}`,...t});
    });

    res.send(body);
    return;
});

app.get("/tweets/:username", (req, res) => {
    const nomeUsuario = req.params.username;

    let body = tweets.filter(t => t.username === nomeUsuario);

    body = body.map(t => {
        const usuario = usuarios.find(u => u.username === t.username);
        return ({avatar: `${usuario.avatar}`,...t});
    });

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