

const User = require('../models/user');
const { errorRes, successRes } = require('../utils/response');
const Store = require('../utils/store');
const { send, getHtml } = require('../utils/mail');
const { SECRET, EXPIRE_TIME } = require('../config/token.config');
const jsonwebtoken = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

const store = new Store();

const generateCode = function (len) {
    const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let ret = '';
    for (let i = 0; i < len; i++) {
        ret += data[Math.floor(Math.random() * 10)];
    }
    return ret;
}

module.exports = (router) => {

    // Extend token

    router.post('/user/token', async (ctx) => {
        try {
            const { body } = ctx.request;
            const user = await User.findOne({ userName: body.userName });
            if (!user) {
                ctx.body = {
                    ...errorRes,
                    message: 'User name error',
                };
                return;
            }
            ctx.body = {
                ...successRes,
                message: 'Extend token',
                data: {
                    token: jsonwebtoken.sign(
                        {
                            data: user,
                            exp: Math.floor(Date.now() / 1000) + EXPIRE_TIME,
                        },
                        SECRET,
                    ),
                    user,
                },
            };
        } catch (error) {
            console.log(error);
            ctx.body = errorRes;
        }
    });

    // Login

    router.post('/user/login', async (ctx) => {
        try {
            const { body } = ctx.request;
            const user = await User.findOne({ userName: body.userName });
            if (!user) {
                ctx.body = {
                    ...errorRes,
                    message: 'User name error',
                };
                return;
            }
            if (body.password, user.password) {
                ctx.body = {
                    ...successRes,
                    data: {
                        token: jsonwebtoken.sign(
                            {
                                data: user,
                                exp: Math.floor(Date.now() / 1000) + EXPIRE_TIME,
                            },
                            SECRET,
                        ),
                        user,
                    },
                };
            } else {
                ctx.body = errorRes;
            }
        } catch (error) {
            console.log(error);
            ctx.body = errorRes;
        }
    });

    // Verify email address

    router.post('/user/mail', async (ctx) => {
        try {
            const { body } = ctx.request;
            if (!body.mail || !body.userName) {
                ctx.body = {
                    ...errorRes,
                    message: 'Bad request, User name and mail is required'
                }
                return;
            }
            const code = generateCode(6);
            store.setItem(body.mail, code);
            console.log(code);
            setTimeout(() => {
                store.setItem(body.mail, null);
            }, 1000 * 60 * 30);
            let res = await send({
                to: body.mail,
                subject: '[Bill Mgmt]Register New Account',
                html: getHtml(body.userName, code),
            });
            ctx.body = {
                ...successRes,
                message: 'Mail sent, please check from your email',
                data: res,
            }
        } catch (error) {
            ctx.body = ctx.body = errorRes;
        }
    });

    // Get user list

    router.get('/user', async (ctx) => {
        try {
            let users = await User.find({});
            ctx.body = {
                ...successRes,
                data: users,
            };
        } catch (error) {
            ctx.body = {
                ...errorRes,
            };
        }
    });

    // Create user

    router.post('/user/create', async (ctx) => {
        console.log('create user');
        try {
            const { body } = ctx.request;
            if (!body.userName || !body.password || !body.code || !body.mail) {
                ctx.body = {
                    ...errorRes,
                    message: `Bad request, User name, password, mail, verify code is required`,
                };
                return;
            }
            // body.password = await bcrypt.hash(body.password, 5);

            let user = await User.find({ userName: body.userName });

            console.log(user.length);

            if (!user.length) {
                console.log(body.code);
                console.log(store.getItem(body.mail));
                if (body.code !== store.getItem(body.mail)) {
                    ctx.body = {
                        ...errorRes,
                        message: 'Verify code is invalid',
                    };
                    return;
                }
                const newUser = new User(body);
                user = await newUser.save();
                return ctx.body = {
                    ...successRes,
                    data: user,
                };
            } else {
                return ctx.body = {
                    ...errorRes,
                    message: 'User name existed',
                };
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                ...errorRes,
                message: JSON.stringify(error),
            };
        }
    });

};