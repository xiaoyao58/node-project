
'use strict';
const sharp = require('sharp');
const Controller = require('egg').Controller;

class SharpController extends Controller {
  async sharp() {
    // var local = "C:\\Users\\xiab\\Desktop\\image\\1021972.jpg";
    const target = 'C:\\Users\\xiab\\Desktop\\image\\target.jpg';
    const target1 = 'C:\\Users\\xiab\\Desktop\\image\\target1.jpg';
    // sharp(local).resize(1920/4,1736/4).toFile(target).then(data=>console.log(data));

    sharp(target).sharpen().toFile(target1)
      .then(data => console.log(data));
  }
}

module.exports = SharpController;
