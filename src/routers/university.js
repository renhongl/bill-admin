
const University = require('../models/university');
const { errorRes, successRes } = require('../utils/response');

module.exports = (router) => {
    // Query university

    router.get('/university', async (ctx) => {
        try {
            let uArr = await University.find({});
            ctx.body = {
                ...successRes,
                data: uArr,
            }
        } catch (error) {
            ctx.body = errorRes;
        }
    });
};