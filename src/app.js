import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const usuarios = [];
const tweets = [];

app.post("/sign-up", (req, res) => {
    usuarios.push(req.body);
    res.send("OK");
});

app.post("/tweets", (req, res) => {
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