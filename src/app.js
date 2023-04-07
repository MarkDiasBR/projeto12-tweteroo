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
    res.send("OK");
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
        res.send("OK");
    } else {
        res.status(401).send("UNAUTHORIZED");
    }
});

app.get("/tweets", (req, res) => {

    let body = tweets.length>10 ? tweets.slice(tweets.length - 10) : tweets;

    body = body.map(t => {
        const usuario = usuarios.find(u => u.username === t.username);
        
        return ({avatar: `${usuario.avatar}`,...t})
    })

    res.send(body);
});

const PORT = 5000;
app.listen(PORT, ()=>console.log(`Servidor rodando na porta ${PORT}`));