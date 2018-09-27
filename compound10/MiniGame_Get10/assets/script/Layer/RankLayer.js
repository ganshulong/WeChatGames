let GData = require("GameData");



cc.Class({
    extends: require("WindowBase"),

    properties: {
        rankingScrollView: cc.Sprite,//显示排行榜
    },

    // Onbtn_back()
    // {
    //     this.CloseSelf();
    // },

    start () {
        if (CC_WECHATGAME) {
            //this.SubmitScoreFunc(0);
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;

            // 发送给子域 获取好友列表分数
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "rankscore"
            });

            this.btn_friend.getComponent(cc.Button).interactable = false;
            this.btn_country.getComponent(cc.Button).interactable = true;
        }
    },

    // // 提交分数
    // SubmitScoreFunc(score){
    //     if (CC_WECHATGAME) {
    //         window.wx.postMessage({
    //             messageType: 3,
    //             MAIN_MENU_NUM: "rankscore",
    //             score: score,
    //         });
    //     } else {
    //         cc.log("提交得分:rankscore : " + score)
    //     }
    // },

    // 好友排行榜
    Onbtn_friend:function(toggle, customEventData){
        var isCheck = toggle.isChecked//this.node.getChildByName("Toggle_GamesNums").getChildByName("toggle1").getComponent( cc.Toggle ).isChecked;
        if (isCheck)
        {
             if (CC_WECHATGAME) {
                // 发消息给子域
                window.wx.postMessage({
                    messageType: 1,
                    MAIN_MENU_NUM: "rankscore"
                });
            } else {
                cc.log("获取好友排行榜数据。");
            }
        }

        this.btn_friend.getComponent(cc.Button).interactable = false;
        this.btn_country.getComponent(cc.Button).interactable = true;
    },

    // 全国排行榜
    Onbtn_country:function(toggle, customEventData){
        var isCheck = toggle.isChecked//this.node.getChildByName("Toggle_GamesNums").getChildByName("toggle1").getComponent( cc.Toggle ).isChecked;
        if (isCheck)
        {
            if (CC_WECHATGAME) {
                // 发消息给子域
                window.wx.postMessage({
                    messageType: 1,
                    MAIN_MENU_NUM: "rankscore"
                });
            } else {
                cc.log("获取全国排行榜数据。");
            }
        }

        this.btn_friend.getComponent(cc.Button).interactable = true;
        this.btn_country.getComponent(cc.Button).interactable = false;
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },

    // 关闭按钮回调
    CloseBtnClick:function()
    {
        // this.SubmitScoreFunc(0);
        this.node.active = false;
    },

    update (dt) {
        this._updateSubDomainCanvas();
    },
});
