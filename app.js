


const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const jwt = require('koa-jsonwebtoken').default;
const cors = require('@koa/cors');

const { SERVER, PORT } = require('./src/config/server.config');
const { SECRET, TOKEN_KEY } = require('./src/config/token.config');

const test = require('./src/routers/test');
const user = require('./src/routers/user');
const university = require('./src/routers/university');
const mongoose = require('./src/middlewares/mongoose');
const errorHandler = require('./src/middlewares/errorHandler');

const app = new Koa();
const router = new Router();

const corsOptions = {
    origin: '*'
}

app.use(cors(corsOptions));

// Handle common error
app.use(errorHandler);

// Use routers

test(router);
user(router);
university(router);

// Connect db

mongoose();

// Apply token validation

app.use(
    jwt({
        secret: SECRET,
        extractToken: ctx => {
            return ctx.header.token;
        },
        key: TOKEN_KEY,
    }).unless({
        path: [/\/user\/login/, /\/user\/mail/, /\/user\/create/],
    }),
);

app
    .use(koaBody())
    .use(router.routes())
    .use(router.allowedMethods());

// start server

app.listen(PORT, () => {
    console.log(`Server running: http://${SERVER}:${PORT}`)
});