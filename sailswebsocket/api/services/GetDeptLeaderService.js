module.exports = {
    get_dept_leader: function (user_id, cb) {
        var result = [];
        var error = {};
        BaseService.exec_sql('select dept_id,dept_name,leader,fg_leader,parent_id from wdzt.dept where dept_id in (select du.dept_id from wdzt.dept_user du,wdzt.users u where u.user_id = du.user_id and u.user_id = ?)', [user_id], (err1, leaders) => {
            if (err1) {
                error.err1 = err1;
                return cb(error);
            }
            if (leaders && !_.isEmpty(leaders)) {
                var done = _.after(leaders.length, () => {
                    cb(null, result);
                })
                _.forEach(leaders, (l) => {
                    var leader = {};
                    leader.dept_id = l.dept_id;
                    leader.dept_name = l.dept_name;
                    leader.leader = l.leader;
                    leader.fg_leader = l.fg_leader;
                    BaseService.exec_sql('select dept_id,dept_name,leader from wdzt.dept where dept_id = ?', [l.parent_id], (err2, parent) => {
                        if (err2) {
                            error.err2 = err2;
                            return cb(error);
                        }
                        if (parent && !_.isEmpty(parent)) {
                            _.forEach(parent, (p) => {
                                leader.parent = {
                                    dept_id: p.dept_id,
                                    dept_name: p.dept_name,
                                    leader: p.leader
                                }
                            });
                        } else {
                            leader.parent = {
                                dept_id: '',
                                dept_name: '',
                                leader: ''
                            }
                        }
                        result.push(leader);
                        done();
                    });
                });
            }
        });
    }
}