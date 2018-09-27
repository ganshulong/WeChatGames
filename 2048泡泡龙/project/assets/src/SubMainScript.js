let sec = 0;
let audio = require( 'AudiuControl' );

cc.Class({
    extends: cc.Component,

    properties: {
        rankingScrollView: cc.Sprite,//显示排行榜
    },

    // onLoad () {},

    start () {
        if (CC_WECHATGAME) {

            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
            
            // window.wx.postMessage({
            //     messageType: 5,
            //     MAIN_MENU_NUM:true
            // });
            
            window.wx.postMessage({
                messageType: 6
            });
            window.wx.postMessage({
                messageType: 5,
                MAIN_MENU_NUM:true
            });
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "rankscore",
                score: 0
            });
            this._updateSubDomainCanvas();
        }
    },
    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update (dt) {
        // sec = sec + dt;
        // if (sec >= 0.33)
        // {
        //     sec = 0;
            this._updateSubDomainCanvas();
        // }
    },
});
