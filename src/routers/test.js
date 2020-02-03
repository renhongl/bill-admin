


module.exports = (router) => {
    // test response

    router.get('/', (ctx) => {
        ctx.body = 'Hello World';
    });
};