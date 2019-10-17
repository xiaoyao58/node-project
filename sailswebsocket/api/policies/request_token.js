/**
 * request_token
 * 用户验证
 */

var arr_path_ignore = ['/common/todo_statis', '/conv/list'];

module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  if (req.token) {
    //   if(_.indexOf(arr_path_ignore, req.path) == -1){
    //       var x_log = {
    //           user_id: req.token.user_id,
    //           method: req.method,
    //           path: req.path,
    //           url: req.url,
    //           ips: JSON.stringify(req.ips),
    //         //   headers: JSON.stringify(req.headers),
    //           params: JSON.stringify(req.allParams())
    //       };
    //       BaseService.exec_sql('insert into user_log set ?;', [x_log], function(err){
    //           if(err) sails.log.warn(err);
    //       });
    //   }

      if(req.token.client_info){
          if((req.token.client_info==req.headers['user-agent'])){
              return res.json({error_code: '10201', error_desc: '获取access_token时发生错误，或者access_token无效'});
          }
      }
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.json({error_code: '10201', error_desc: '获取access_token时发生错误，或者access_token无效'});
};
