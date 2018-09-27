let audio1 = require( 'AudiuControl' );

cc.Class({
    extends: cc.Component,

    properties: {
        //rankingScrollView: cc.Sprite,//显示排行榜
        ClickAudio: {
            url: cc.AudioClip,
            default: null
        },
        circleTouchAudio: {
            url: cc.AudioClip,
            default: null
        },
    },
    onLoad () {},

    start () {
        this.SubmitScoreFunc(0);
    },

    // 提交分数
    SubmitScoreFunc(score){
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "rankscore",
                score: score
            });
        } else {
            cc.log("提交得分:rankscore : " + score)
        }
        // 设置本地最高分
        var localinfo = JSON.parse(cc.sys.localStorage.getItem('userSuitData'));
        var maxscore = localinfo.MaxScore;
        if (score > maxscore)
        {
            localinfo.MaxScore = score;
        }
        // 设置各个模式的最高分
        var modeIdx = audio1.GameModeIndex;
        if (modeIdx == 1)
        {
            if (score > localinfo.Mode1Score)
            {
                localinfo.Mode1Score = score;
            }
        }else if (modeIdx == 2)
        {
            if (score > localinfo.Mode2Score)
            {
                localinfo.Mode2Score = score;
            }
        }else if (modeIdx == 3)
        {
            if (score > localinfo.Mode3Score)
            {
                localinfo.Mode3Score = score;
            }
        };
        cc.sys.localStorage.setItem('userSuitData', JSON.stringify(localinfo));
    },

    // 好友排行榜
    FriendRankClick:function(toggle, customEventData){
        var isCheck = toggle.isChecked;
        // 播放声音
        cc.audioEngine.play(this.ClickAudio, false, audio1.SoundVolum);
        if (isCheck)
        {
             if (CC_WECHATGAME) {
                window.wx.postMessage({
                    messageType: 4,
                    MAIN_MENU_NUM:true
                });
                // 发消息给子域
                window.wx.postMessage({
                    messageType: 1,
                    MAIN_MENU_NUM: "rankscore"
                });
            } else {
                cc.log("获取好友排行榜数据。");
            }
        }
    },

    // 全国排行榜
    CountryRankClick:function(toggle, customEventData){
        // 播放声音
        cc.audioEngine.play(this.ClickAudio, false, audio1.SoundVolum);
        var isCheck = toggle.isChecked;
        if (isCheck)
        {
            if (CC_WECHATGAME) {
                window.wx.postMessage({
                    messageType: 4,
                    MAIN_MENU_NUM:true
                });
                // 发消息给子域
                window.wx.postMessage({
                    messageType: 1,
                    MAIN_MENU_NUM: "rankscore"
                });
            } else {
                cc.log("获取全国排行榜数据。");
            }
        }
    },

    // 刷新子域的纹理
    // _updateSubDomainCanvas() {
    //     if (window.sharedCanvas != undefined) {
    //         this.tex.initWithElement(window.sharedCanvas);
    //         this.tex.handleLoadedTexture();
    //         this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
    //     }
    // },

    // 关闭按钮回调
    CloseBtnClick:function()
    {
        // 播放声音
        cc.audioEngine.play(this.circleTouchAudio, false, audio1.SoundVolum);
        this.node.active = false;
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 4,
                MAIN_MENU_NUM:false
            });
            window.wx.postMessage({
                messageType: 5,
                MAIN_MENU_NUM:true
            });
        }
    },

    // update (dt) {
    //     //this._updateSubDomainCanvas();
    // },
});
