let audio1 = require( 'AudiuControl' );

cc.Class({
    extends: cc.Component,

    properties: {
        Game_endRewardSp:cc.Sprite,
        Game_endModeLabel:cc.Sprite,
        Game_endCurrentScore:cc.Label,
        Game_endModeMaxScoreLabel:cc.Label,
        RewardSpArray :{
            default:[],
            type:[cc.SpriteFrame],
        },
        ModeLabelArray :{
            default:[],
            type:[cc.SpriteFrame],
        },
        ClickAudio: {
            url: cc.AudioClip,
            default: null
        },
        circleTouchAudio: {
            url: cc.AudioClip,
            default: null
        },
    },
    // onLoad () {},

    start () {
        //this.scoreTemp = 0;
    },
    // 根据模式刷新界面
    initWithMode:function(score)
    {
        this.scoreTemp = score;
        var modeIdx = audio1.GameModeIndex;
        this.Game_endRewardSp.spriteFrame = this.RewardSpArray[modeIdx-1];
        this.Game_endModeLabel.spriteFrame = this.ModeLabelArray[modeIdx-1];
        // 判断是否分享过
        var isShared = cc.find("Game").getComponent("Game").getIsShareing();
        // 判断是否第一次添加到我的小程序中
        var is = cc.sys.localStorage.getItem("openedMyMiniGame");
        console.log("is = " + is);
        console.log("isshared = " + isShared);
        if (is === 0)
        {
            console.log("is == 0");
            this.node.getChildByName("Game_endShareFrien").active = false;
            this.node.getChildByName("Game_endReborn").active = true;
            this.node.getChildByName("Game_endTips").active = false;
        }
        else if (isShared == 1)
        {
            console.log("isShared == 1");
            this.node.getChildByName("Game_endShareFrien").active = false;
            this.node.getChildByName("Game_endReborn").active = true;
            this.node.getChildByName("Game_endTips").active = false;
        }else if (isShared == 0)
        {
            console.log("isShared == 0");
            this.node.getChildByName("Game_endShareFrien").active = true;
            this.node.getChildByName("Game_endReborn").active = true;
            this.node.getChildByName("Game_endTips").active = false;
        }else
        {
            console.log("isShared > 1");
            this.node.getChildByName("Game_endShareFrien").active = false;
            this.node.getChildByName("Game_endReborn").active = false;
            this.node.getChildByName("Game_endTips").active = false;
        }
        // 分数相关填充
        var localinfo = JSON.parse(cc.sys.localStorage.getItem('userSuitData'));
        var ModeMaxScore = 0;
        this.Game_endCurrentScore.string = score.toString();
        if (modeIdx == 1)
        {
            ModeMaxScore = localinfo.Mode1Score;
        }else if (modeIdx == 2)
        {
            ModeMaxScore = localinfo.Mode2Score;
        }else if (modeIdx == 3)
        {
            ModeMaxScore = localinfo.Mode3Score;
        }
        this.Game_endModeMaxScoreLabel.string = ModeMaxScore.toString();
    },
    // 复活按钮回调
    RebornBtnClick:function()
    {
        // 播放声音
        cc.audioEngine.play(this.ClickAudio, false, audio1.SoundVolum);
        cc.find("Game").getComponent("Game").Reset( true );
        cc.find("Game").getComponent("Game").resumeGameFunc();
        this.node.active = false;
        // 判断是否第一次添加到我的小程序中
        var is = cc.sys.localStorage.getItem("openedMyMiniGame");
        if(is === 0)
        {
            cc.sys.localStorage.setItem("openedMyMiniGame",1);
        }else
        {
            cc.find("Game").getComponent("Game").setIsShareing();
            this.initWithMode(this.scoreTemp);
        }
        
    },
    // 重新开始
    restartClick:function()
    {
        // 播放声音
        cc.audioEngine.play(this.ClickAudio, false, audio1.SoundVolum);
        this.node.active = false;
        cc.find("Game").getComponent("Game").Reset();
    },
    // 分享
    endShareClick:function()
    {
        // 播放声音
        cc.audioEngine.play(this.ClickAudio, false, audio1.SoundVolum);
        cc.log("点击分享按钮");
        var self = this;
        if (CC_WECHATGAME) {
            //主动拉起分享接口
            cc.loader.loadRes("ShareImg",function(err,data){
                wx.shareAppMessage({
                    title: "不怕，就来PK！",
                    imageUrl: data.url,
                    success(res){
                        console.log("转发成功!!!")
                        // 设置分享次数
                        var localinfo = JSON.parse(cc.sys.localStorage.getItem('userSuitData'));
                        localinfo.ShareTimes = localinfo.ShareTimes + 1;
                        if (localinfo.ShareTimes > 5)
                        {
                            localinfo.ShareTimes = 5;
                        }
                        cc.sys.localStorage.setItem('userSuitData', JSON.stringify(localinfo));
                        cc.find("Game").getComponent("Game").setIsShareing();
                        self.initWithMode(self.scoreTemp);
                    },
                    fail(res){
                        console.log("转发失败!!!")
                    } 
                })
            });
        }else
        {
            cc.find("Game").getComponent("Game").setIsShareing();
            self.initWithMode(self.scoreTemp);
        }
    },
    endCloseClick:function()
    {
        this.node.active = false;
        // 播放声音
        cc.audioEngine.play(this.circleTouchAudio, false, audio1.SoundVolum);
        var lineNod = cc.find("Canvas/HallLayer/Hall_Line");
        lineNod.active = true;
        lineNod.getChildByName("currentScoreLabel").getComponent(cc.Label).string = this.scoreTemp.toString();
        cc.find("Game").getComponent("Game").GameNoPlayClick(); 
    }
    // update (dt) {},
});
