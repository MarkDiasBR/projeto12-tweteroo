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
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    //Retorna 400 quando o username é vazio e/ou não é string
    if (!req.body.username || typeof req.body.username !== "string") {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }
    
    //Retorna 400 quando o avatar é vazio e/ou não é string
    if (!req.body.avatar || typeof req.body.avatar !== "string") {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    usuarios.push(req.body);
    res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {

    //Retorna 400 quando a propriedade 'username' e/ou 'tweet' não estão presentes
    if (!(req.body.hasOwnProperty("username")) || !(req.body.hasOwnProperty("tweet"))) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    //Retorna 400 quando o username é vazio e/ou não é string
    if (!req.body.username || typeof req.body.username !== "string") {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }
    
    //Retorna 400 quando o tweet é vazio e/ou não é string
    if (!req.body.tweet || typeof req.body.tweet !== "string") {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    const tweet = req.body;

    const usuarioLogado = usuarios.find(u => u.username === tweet.username);

    if (usuarioLogado) {
        tweets.push(tweet);
        res.status(201).send("OK");
    } else {
        res.status(401).send("UNAUTHORIZED");
    }
});

app.get("/tweets", (req, res) => {
    let page = undefined;
    let body = [...tweets];

    if (req.query.page) {
        page = Number(req.query.page);

        if (Number.isInteger(page) && page < 1 || isNaN(page) || !Number.isInteger(page)) {
            res.status(400).send("Informe uma página válida!");
            return;
        }

        if (body.length>10*page) {
            body = body.splice(body.length - 10*page,10);
        } else if (body.length < 10*page && body.length > 10*(page-1)) {
            body = body.splice(0,body.length - 10*(page-1));
        } else {
            body = [];
        }

        body = body.map(t => {
            const usuario = usuarios.find(u => u.username === t.username);
            
            return ({avatar: `${usuario.avatar}`,...t})
        });

        res.send(body);
        return;
    }
    
    body = body.length>10 ? body.slice(body.length - 10) : body;

    body = body.map(t => {
        const usuario = usuarios.find(u => u.username === t.username);
        
        return ({avatar: `${usuario.avatar}`,...t})
    });

    res.send(body);
});

app.get("/tweets/:username", (req, res) => {
    const nomeUsuario = req.params.username;

    let body = tweets.filter(t => t.username === nomeUsuario)

    body = body.map(t => {
        const usuario = usuarios.find(u => u.username === t.username);
        
        return ({avatar: `${usuario.avatar}`,...t})
    })

    res.send(body);
});

const PORT = 5000;
app.listen(PORT, ()=>console.log(`Servidor rodando na porta ${PORT}`));