let audio = require( 'AudiuControl' );

cc.Class({
    extends: cc.Component,

    properties: {
        ClickAudio: {
            url: cc.AudioClip,
            default: null
        }
        
    },
    
    onLoad(res)
    {
        var thatt = this;
        if (CC_WECHATGAME) {
            wx.onShow(res=>{
                console.log(res);
                thatt.myMiniGameFunc(res.scene);
            });
            thatt.myMiniGameFunc();
        }
        var date = new Date();
                var year = date.getTime();
                cc.log("now date = " + year);
        var gift = cc.find("Canvas/HallLayer/Hall_MyMiniGameAniNode");
        gift.on(cc.Node.EventType.TOUCH_END, function(event){
            if( !event.getCurrentTarget().active )
                return;
            var giftLayer = cc.find("Canvas/Hall_giftTips");
            giftLayer.active = true;
        });
    },

    myMiniGameFunc:function(scenenum)
    {
        var is = cc.sys.localStorage.getItem("openedMyMiniGame");
        var thatt = this;
        console.log("onLoadonLoadonLoadonLoadonLoadonLoad");
        var lauchOpt = wx.getLaunchOptionsSync();
        thatt.node.getChildByName("Hall_Scene").getComponent(cc.Label).string = "场景值";//lauchOpt.scene.toString();
        console.log(lauchOpt.scene);
        var finalSceneNum = lauchOpt.scene;
        if (scenenum)
        {
            finalSceneNum = scenenum;
        }
        var gift = cc.find("Canvas/HallLayer/Hall_MyMiniGameAniNode");
        
        if (finalSceneNum != 1104 && finalSceneNum != 1023)
        {
            console.log("is = " + is);
            if (is == "" || is == null)
            {
                // 沒有添加到我的小程序这个字段
                // thatt.node.getChildByName("Hall_Scene").getComponent(cc.Label).string = "显示动画提示";
                var date = new Date();
                var year = date.getTime();
                cc.log("now date = " + year);
                console.log("now date = " + year);
                if (year >= 1536028502637 + 10888888)
                {
                    gift.active = true;
                    gift.getComponent(cc.Animation).play();
                }else{
                    gift.active = false;
                }
                
            }else
            {
                console.log("else No");
                // 有添加到我的小程序字段
                // thatt.node.getChildByName("Hall_Scene").getComponent(cc.Label).string = "隐藏动画提示";
                gift.active = false;
                gift.getComponent(cc.Animation).stop();
            }
        }
        else
        {
            // 如果第一次我的小程序进入
            if (is == "" || is == null)
            {
                // 我的小程序入口进入
                cc.sys.localStorage.setItem("openedMyMiniGame",0);
            }
            
            // thatt.node.getChildByName("Hall_Scene").getComponent(cc.Label).string = "隐藏动画提示";
            gift.active = false;
            gift.getComponent(cc.Animation).stop();
        }
    },

    start () {
        this.sharebutton = null;
        this.CreateShareBtn();
        //测试用 删除
        // cc.sys.localStorage.removeItem("userSuitData");
        // 刷新数据
        this.node.parent.getChildByName("SuitLayer").getComponent("SuitLayer").refreshLockState();
        
    },
    // 创建游戏圈按钮
    CreateShareBtn:function()
    {
        if (CC_WECHATGAME) {
        //开启右上角的分享
        wx.showShareMenu();
        //监听右上角的分享调用 
        cc.loader.loadRes("ShareImg",function(err,data){
            wx.onShareAppMessage(function(res){
                return {
                    title: "不怕，就来PK！",
                    imageUrl: data.url,
                        success(res){
                        console.log("转发成功!!!")
                    },
                    fail(res){
                        console.log("转发失败!!!")
                    } 
                }
            })
        });
    
            this.sharebutton = wx.createGameClubButton({
                type:"image",
                icon: 'green',
                style: {
                    left: 0,
                    top: 280,
                    width: 50,
                    height: 50,
                }
            })
        }
    },
    // 删除游戏圈按钮
    DestroyBtn:function()
    {
        if (this.sharebutton)
        {
            this.sharebutton.destroy();
            this.sharebutton = null;
        }
    },
    // 开始游戏回调
    playGameClick:function()
    {
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 6,
            });
        }
        // 播放声音
        cc.audioEngine.play(this.ClickAudio, false, audio.SoundVolum);
         // 重置一下游戏
         cc.find("Game").getComponent("Game").Reset();
         cc.find("Canvas/HallLayer").active = false;
         this.node.parent.getChildByName("bg_body").active = true;
         this.DestroyBtn();
         // 隐藏子玉节点
         this.node.parent.getChildByName("subMainScript").active = false;
    },
    // 排行榜按钮回调
    RankClick:function()
    {
        // 播放声音
        cc.audioEngine.play(this.ClickAudio, false, audio.SoundVolum);
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 5,
                MAIN_MENU_NUM:false
            });
            window.wx.postMessage({
                messageType: 4,
                MAIN_MENU_NUM:true
            });
            // 发送给子域 获取好友列表分数
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "rankscore"
            });
        }
        this.node.parent.getChildByName("RankingLayer").active = true;
    },
    // 换皮肤按钮糊掉
    SuitClick:function()
    {
        // 播放声音
        cc.audioEngine.play(this.ClickAudio, false, audio.SoundVolum);
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 5,
                MAIN_MENU_NUM:false
            });
        }
        
        this.node.parent.getChildByName("SuitLayer").active = true;
        this.node.parent.getChildByName("SuitLayer").getComponent("SuitLayer").refreshLockState();
    },
    // 声音按钮回调
    SoundClick:function(toggle, customEventData)
    {
        
        var isCheck = toggle.isChecked;
        if (isCheck)
        {
            // cc.audioEngine.setEffectsVolume(1);
            audio.SoundVolum = 1.0;
        }else
        {
            // cc.audioEngine.setEffectsVolume(0);
            audio.SoundVolum = 0;
        }
        // 播放声音
        cc.audioEngine.play(this.ClickAudio, false, audio.SoundVolum);
    },
    // 更多游戏按钮回调
    MoreGameClick:function()
    {
        // 播放声音
        cc.audioEngine.play(this.ClickAudio, false, audio.SoundVolum);
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 5,
                MAIN_MENU_NUM:false
            });
        }
        this.node.parent.getChildByName("GameMode").active = true;
        this.node.parent.getChildByName("GameMode").getComponent("GameModeLayer").initMaxScoreLabel();
    },
    // 显示的时候调用
    onEnable:function()
    {
        this.node.getChildByName("animaRoot").getComponent(cc.Animation).play();
    },
    // 隐藏的时候调用
    onDisable:function()
    {
        this.node.getChildByName("animaRoot").getComponent(cc.Animation).stop();
    },
});
