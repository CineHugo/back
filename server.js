import express from 'express';

const app = express();

const users = [];

app.post('/users', (request, response) => {
    console.log(request);
    response.send('OK, Post!');
});

app.get('/users', (request, response) => {
    response.send('Ok, Deu Bom!');
});

app.listen(3000);

/*
    1) Tipo de Rota / Método HTTP
    2) Endereço
*/