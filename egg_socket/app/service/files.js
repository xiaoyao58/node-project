'use strict';

const Service = require('egg').Service;

class FilesService extends Service {
  async to_simple(x) {
    if (!x) {
        return {};
    }
    var result = {
        file_id: x.file_id,
        file_type: x.file_type,
        original_name: x.original_name,
        file_size: x.file_size,
        file_url: this.app.config.wdztcs.base + '/file/' + x.file_path + x.file_name,
        mime_type: x.mime_type,
        allow_down: x.allow_down,
        create_at: x.update_at ? moment(x.update_at).format('YYYY-MM-DD HH:mm:ss') : '',
        create_at_s: x.update_at ? moment(x.update_at).fromNow() : '',
        description: x.description,
        file_ext: x.file_name.substring(x.file_name.lastIndexOf('.') + 1)
    };
    if(x.file_type==1) {//图片
        var thumb_url = this.app.config.wdztcs.base + '/file/' + x.file_path + 'thumb_' + x.file_name;
        if(x.mime_type=='image/tiff'){
            thumb_url = thumb_url + '.png';
        }
        result.thumb_url = thumb_url;
    }
    else if(x.file_type==2){//OWA文档
        result.file_owa = sails.config.wdzt.owa_app_server + encodeURI(sails.config.wdzt.owa_doc_server + x.file_path + x.file_name);
    }
    else if(x.file_type==3) {//音频
        result.media_length = x.media_length;
        result.file_mp3 =  (x.mime_type=='audio/mp3' || x.mime_type=='audio/mpeg') ? result.file_url : (result.file_url + '.mp3');
    }
    else if(x.file_type==4) {//视频
        result.thumb_url = this.app.config.wdztcs.base + '/file/' + x.file_path + 'thumb_' + x.file_name + '.gif';
        result.media_length = x.media_length;
        result.file_mp4 = (x.mime_type == 'video/mp4' || x.mime_type == 'video/ext-mp4') ? result.file_url : (result.file_url + '.mp4');
    }
    return result;
  }
}

module.exports = FilesService;
