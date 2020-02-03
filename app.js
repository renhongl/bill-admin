


const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');


const { SERVER, PORT } = require('./src/config/server.config');

const test = require('./src/routers/test');
const user = require('./src/routers/user');
const mongoose = require('./src/middlewares/mongoose');

const app = new Koa();
const router = new Router();

// Use routers

test(router);
user(router);

// Connect db

mongoose();

app
    .use(koaBody())
    .use(router.routes())
    .use(router.allowedMethods());

// start server

app.listen(PORT, () => {
    console.log(`Server running: http://${SERVER}:${PORT}`)
});