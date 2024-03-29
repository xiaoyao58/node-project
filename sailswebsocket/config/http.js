/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */
var moment = require('moment');
module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP request. (the Sails *
    * router is invoked by the "router" middleware below.)                     *
    *                                                                          *
    ***************************************************************************/

    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'myRequestLogger',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'myTokenParse',
      // 'poweredBy',
      // '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],

    /****************************************************************************
    *                                                                           *
    * Example custom middleware; logs each request to the console.              *
    *                                                                           *
    ****************************************************************************/

    // myRequestLogger: function (req, res, next) {
    //     console.log("Requested :: ", req.method, req.url);
    //     return next();
    // }
    myTokenParse: function (req, res, next) {
      // setInterval(()=>{
      //   console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
      // },1000);

      var access_token = req.param('access_token');
      if (access_token) {
        BaseService.exec_sql('select * from wdzt.users u,wdzt.app_token `at` where u.user_id = at.create_user and at.access_token = ?', [access_token], function (err, rss) {
          if (err) {
            sails.log(err);
            return next();
          }
          if (!_.isEmpty(rss)) {
            var me = rss[0];
            me.avatar = 'http://10.2.100.151:1337/images/' + (me.avatar ? me.avatar : '4a06f622-028a-4323-97ef-a58326006f88.jpeg');
            BaseService.exec_sql('select dept_id from wdzt.dept_user where user_id = ?', [rss[0].user_id], (err, dept) => {
              if (err) {
                req.token = me;
                sails.log.error(err);
                return next();
              }
              if (!_.isEmpty(dept)) {
                me.dept_id = []
                _.forEach(dept,(d)=>{
                  var dept_id = {};
                  dept_id.dept_id = d.dept_id;
                  me.dept_id.push(dept_id);
                })
                req.token = me;
                return next();
              }
            });
          } else {
            return next();
          }
        })
      } else {
        return next();
      }
    }

    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests. By    *
    * default,Sails uses [skipper](http://github.com/balderdashy/skipper). See *
    * https://github.com/expressjs/body-parser for other options. Note that    *
    * Sails uses an internal instance of Skipper by default; to override it    *
    * and specify more options, make sure to "npm install                      *
    * skipper@for-sails-0.12 --save" in your app first. You can also specify a *
    * different body parser or a custom function with req, res and next        *
    * parameters (just like any other middleware function).                    *
    *                                                                          *
    ***************************************************************************/


    // bodyParser: require('skipper')({strict: true})

  },


  /***************************************************************************
  *                                                                          *
  * The number of milliseconds to cache static assets in production.         *
  * These are any flat files like images, scripts, styleshseets, etc.        *
  * that are served by the static middleware.  By default, these files       *
  * are served from `.tmp/public`, a hidden folder compiled by Grunt.        *
  *                                                                          *
  ***************************************************************************/

  // cache: 31557600000
};
