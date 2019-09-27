/**
 * WapiService
 *  get_token
 *  get_user_badge
 *  get_user_detail
 *  get_depts
 *  get_flow_flows
 *  get_flow_activities
 *  get_flow_operations
 *  get_flow_posts
 *  get_flow_activity_opeation_post
 *  post_flow_save
 *
 * @description :: Server-side logic for WAPI and WRPS
 * @help        :: See http://links.sailsjs.org/docs/services
 */

var wdzt_uri = 'http://127.0.0.1:1337/';
var flow_uri = 'http://127.0.0.1:1338/';
var token_uri = wdzt_uri + 'common/get_token?key={app_key}&secret={app_secret}&username={username}&password={password}';
var app_key = '935527506';
var app_secret = '4fb83603c7904cd9861895a17ce1530d';
var flows = 'https://wdzt5.wondersgroup.com/wrps/flow/flows';
var activities = 'https://wdzt5.wondersgroup.com/wrps/flow/activities';
var request = require('request');
var log = sails.log;

function get_json(uri, cb) {
	request(uri, function(err, response, body) {
		if (err) {
			return cb(err);
		}
		if(_.isEmpty(body)) return cb(null, {});
		if (JSON.parse(body).error_code) {
			return cb(JSON.parse(body));
		}
		return cb(null, JSON.parse(body));
	});
}

function get_xml(uri, cb) {
	request(uri, function(err, response, body) {
		if (err) {
			return cb(err);
		}
		return cb(null, body);
	});
}

function post_json(uri, params, cb) {
	request({
		uri: uri,
		method: 'post',
		json: true,
		body: params
	}, function(err, response, body) {
		if (err) {
			return cb(err);
		}
		if (body.error_code) {
			return cb(body);
		}
		return cb(null, body);
	});
}

module.exports = {

	//获取用户详情
	get_user_detail: function (access_token, user_id, cb) {
		var sql = '', params = [];
		if (user_id) {
			sql = 'select user_id,name,avatar,email,mobile_phone,contact_phone work_phone,project_id from wdzt.users where user_id = ?;';
			params.push(user_id);
		}
		else {
			sql = 'select user_id,name,avatar,email,mobile_phone,contact_phone work_phone,project_id from wdzt.users where user_id in(select create_user from wdzt.app_token where access_token = ?);';
			if(_.isArray(access_token)){
				params.push(access_token[1]);
			}
			else{
				params.push(access_token);
			}
		}

		BaseService.exec_sql(sql, params, function (err, rss) {
			if (err) {
				log.warn('WapiService.get_user_detail', access_token, user_id, err);
				return cb(err);
			}
			if(_.isEmpty(rss)) return cb(null, {});
			var url = sails.config.wapp.userAvatarBig;
			console.log(rss[0]);
			rss[0].avatar = rss[0].avatar ? (url + rss[0].avatar) : (url + 'default.gif');
			return cb(null, rss[0]);
		});
	},

	//获取指定级别的部门列表
	get_depts: function(project_id, level, cb) {
		if(!level){
			level = 2;
		}
		BaseService.exec_sql('select dept_id, dept_name as name, if(parent_id="",null,parent_id) as parent_id, concat(path_simple, ifnull(simple_name, dept_name)) as dept_name from wdzt.dept where project_id=? and length(path_id)<=? order by length(path_id), dept_sort, dept_name', [project_id, 37 * level - 1], function(err, rs){
			if(err){
				log.warn('WapiService.get_depts', project_id, level, err);
				return cb(err);
			}
			return cb(null, rs);
		});
	},

	//推送到智通移动端
	push_to_zt: function(access_token, user_id, project_id, message, note, cb) {
		get_json(wdzt_uri + 'sundry/push_to?access_token=' + access_token + '&user_id=' + user_id + '&project_id=' + project_id + '&m=' + encodeURIComponent(message) + '&t=' + note, cb);
	},

	//创建日程
	create_calendar: function(access_token, calendar_name, start_time, end_time, description, user_id, cb) {
		var params = {
			access_token:access_token,
			calendar_name:calendar_name,
			start_time:start_time,
			end_time:end_time,
			description:description,
			user_id:user_id
		}
		post_json(wdzt_uri + 'calendar/create', params, cb);
		//get_json(wdzt_uri + 'calendar/create?access_token=' + access_token + '&calendar_name=' + encodeURIComponent(calendar_name) + '&start_time=' + start_time + '&end_time=' + end_time + '&description=' + encodeURIComponent(description) + '&user_id=' + user_id, cb);
	},

	//移除日程
	remove_calendar: function(access_token, calendar_id, cb) {
		var params = {
			access_token:access_token,
			calendar_id:calendar_id
		}
		post_json(wdzt_uri + 'calendar/remove', params, cb);
		//get_json(wdzt_uri + 'calendar/remove?access_token=' + access_token + '&calendar_id=' + calendar_id, cb);
	},

	//获取流程定义列表
	get_flow_flows: function(cb) {
		get_json(flow_uri + 'flow/flows', cb);
	},

	//获取活动定义列表
	get_flow_activities: function(flow_id, cb) {
		get_json(activities + '?flow_id=' + flow_id, cb);
	},

	//获取操作结果列表
	get_flow_operations: function(query_string, cb) {
		get_json(flow_uri + 'flow/operations?' + query_string, cb);
	},

	//获取后续操作环节列表
	get_flow_posts: function(query_string, cb) {
		get_json(flow_uri + 'flow/posts?' + query_string, cb);
	},

	get_flow_activity_opeation_post: function(query_string, cb) {
		get_json(flow_uri + 'flow/activity_operation_post?' + query_string, cb);
	},

	//流程提交
	post_flow_save: function(params, cb) {
		post_json(flow_uri + 'flow/save', params, cb);
	},

	//流程撤回
	flow_with_draw: function(params, cb) {
		post_json(flow_uri + 'flow/withdraw', params, cb);
	},

	//获取令牌
	get_token: function(username, password, cb) {
		var uri = token_uri.replace('{app_key}', app_key).replace('{app_secret}', app_secret).replace('{username}', username).replace('{password}', password);
		get_json(uri, cb);
	},

	//获取流程定义列表
	get_design_flows: function(cb) {
		get_json(flow_uri + 'design/flows', cb);
	},
    //获取流程定义数据
	get_design_flow_data: function(query_string, res) {
		request.get(flow_uri + 'design/flow_data?' + query_string).pipe(res)
	},
    //保存流程定义数据
	post_design_save_save: function(params, cb) {
		post_json(flow_uri + 'design/save', params, cb);
	},
    //检查流程定义
	get_design_flow_check: function(query_string, cb) {
		get_json(flow_uri + 'design/check?' + query_string, cb);
	},
    //发布流程定义
	release_design_flow: function(query_string, cb) {
		get_json(flow_uri + 'design/release?' + query_string, cb);
	},

	//删除流程定义
	remove_design_flow: function (query_string, cb) {
		get_json(flow_uri + 'design/remove?' + query_string, cb);
	},

	//复制流程定义
	copy_design_flow: function (query_string, cb) {
		get_json(flow_uri + 'design/copy?' + query_string, cb);
	}

};
