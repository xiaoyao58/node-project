'use strict';

/** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
  
// };
exports.mysql= {
  enable:true,
  package: 'egg-mysql',
};

exports.io = {
  enable: true,
  package: 'egg-socket.io',
}
