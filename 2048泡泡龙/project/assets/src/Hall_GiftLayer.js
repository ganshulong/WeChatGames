let audio1 = require( 'AudiuControl' );
cc.Class({
    extends: cc.Component,

    properties: {
        circleTouchAudio: {
            url: cc.AudioClip,
            default: null
        },
    },

    // onLoad () {},

    start () {

    },

    closeCall:function()
    {
        // 播放声音
        cc.audioEngine.play(this.circleTouchAudio, false, audio1.SoundVolum);
        this.node.active = false;
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 5,
                MAIN_MENU_NUM:true
            });
        }
    }
    // update (dt) {},
});
