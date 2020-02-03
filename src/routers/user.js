

const User = require('../models/user');

module.exports = (router) => {

    // Get user list

    router.get('/user', (ctx) => {
        ctx.body = [111, 222, 333]
    });

    // Create user

    router.post('/user', async (ctx) => {
        console.log('post user');
        let user = new User({
            name: ctx.request.body.name
        });
        await user.save();
        ctx.body = 'OK';
    });

};