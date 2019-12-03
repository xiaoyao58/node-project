var _ = require('lodash');
module.exports = options => {
    return async function join(ctx, next) {
        var access_token = ctx.request.body.access_token ? ctx.request.body.access_token : '';
        // console.log(ctx.request.body);
        var create_user = await ctx.service.getUser.getUserByToken(access_token);
        // console.log(create_user);
        if (_.isEmpty(create_user)) {
            return ctx.body = {
                errorno: 0,
                errordesc: 'access_token 不正确或access_token为空'
            }
        }
        var user_id = create_user[0].create_user;
        var user = await ctx.service.getUser.getUser(user_id);
        ctx.user = {
            user_id: user[0].user_id,
            name: user[0].name,
            avatar: user[0].avatar,
            project_id: user[0].project_id,
            job_number: user[0].job_number
        }

        ctx.dept = [];
        var dept = await ctx.service.getUser.getDept(user_id);
        if (!_.isEmpty(dept)) {
            _.forEach(dept, (de) => {
                var d = {};
                d.dept_id = de.dept_id;
                d.dept_name = de.dept_name;
                d.parent_id = de.parent_id;
                ctx.dept.push(d);
            });
        } else {
            var d = {};
            d.dept_id = null;
            d.dept_name = null;
            d.parent_id = null;
            ctx.dept.push(d);
        }

        await next();
    };
};