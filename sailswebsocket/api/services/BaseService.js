/**
 * BaseService
 *  exec_sql
 *  exec_sp
 *
 * @description :: Server-side logic for Base
 * @help        :: See http://links.sailsjs.org/docs/services
 */

 var uuid = require('node-uuid');
var mysql = require('mysql');
// var Hashids = require("hashids");
// var hashids = new Hashids("it is a good day to die.");
 var log = sails.log;
//开发
 var pool1 = mysql.createPool({
 	host: '10.1.64.217',
 	user: 'wdzt',
 	password: 'wdzt',
 	database: 'wapp',
 	multipleStatements: true
 });
 var wdzt = mysql.createPool({
	 host:'10.1.64.217',
	 user: 'wdzt',
	 password: 'wdzt',
	 database: 'wdzt',
	 multipleStatements: true
 });
 //测试
var pool = mysql.createPool({
 	host: '10.2.100.97',
 	user: 'root',
 	password: '123456',
	database: 'sails',
	//  timezone:"08:00",
 	multipleStatements: true
});
var connection = mysql.createConnection({
	host: '10.1.92.232',
	user: 'wdzt',
	password: 'Wdzt!@2016',
	database: 'wapp'
});
 //正式
var pool2 = mysql.createPool({
   host: '10.1.93.70',
   user: 'wdzt',
   password: 'Wdzt!@2016',
   database: 'wapp',
   multipleStatements: true
});

module.exports = {
    get_uuid : function(){
        return uuid.v4().replace(/-/g, '');
    },
	exec_sql: function (sql_text, params, cb) {
		pool.query(sql_text, params, cb);
	},
	exec_sql1: function(sql_text,params,cb){
		wdzt.query(sql_text,params,cb);
	},
	// short_id: function () {
	// 	return hashids.encode(new Date().getTime(), _.random(1000));
	// },
	exec_trs: function (sql, cb) {
		connection.beginTransaction(function (err) {
			if (err) return cb(err);
			async.each(sql, function (s, callback) {
				connection.query(s.sql, s.params, function (err, results, fields) {
					if (err) callback(err);
					else callback();
				});
			}, function (err) {
				if (err) {
					connection.rollback(function () {
						return cb(err);
					});
				} else {
					connection.commit(function (err) {
						if (err) {
							connection.rollback(function () {
								return cb(err);
							});
						}
						return cb();
					});
				}
			});
		});
	}
};
