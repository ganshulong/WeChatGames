let audio = require( 'AudiuControl' );

cc.Class({
    extends: cc.Component,

    properties: {
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

    },
    initMaxScoreLabel:function()
    {
        var localinfo = JSON.parse(cc.sys.localStorage.getItem('userSuitData'));
        this.node.getChildByName("ModeLayer_ModeBtn1").getChildByName("KingLabel").getComponent(cc.Label).string = localinfo.Mode1Score.toString();
        this.node.getChildByName("ModeLayer_ModeBtn2").getChildByName("KingLabel").getComponent(cc.Label).string = localinfo.Mode2Score.toString();
        this.node.getChildByName("ModeLayer_ModeBtn3").getChildByName("KingLabel").getComponent(cc.Label).string = localinfo.Mode3Score.toString();
    },
    Mode1Click:function()
    {
        cc.log("标准模式");
        this.SelectedGameMode(1);
    },
    Mode2Click:function()
    {
        cc.log("大师模式");
        this.SelectedGameMode(2);
    },
    Mode3Click:function()
    {
        cc.log("无尽模式");
        this.SelectedGameMode(3);
    },
    SelectedGameMode:function(index)
    {
        // 播放声音
        cc.audioEngine.play(this.ClickAudio, false, audio.SoundVolum);
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 6,
            });
        }
        // 设置模式标记
        audio.GameModeIndex = index;
        // 隐藏子玉节点
        this.node.parent.getChildByName("subMainScript").active = false;
        // 重置一下游戏
        cc.find("Game").getComponent("Game").Reset();
        this.node.active = false;
        cc.find("Canvas/HallLayer").active = false;
        this.node.parent.getChildByName("bg_body").active = true;
        cc.find("Canvas/HallLayer").getComponent("Hall").DestroyBtn();
    },
    ModeCloseClick:function()
    {
        // 播放声音
        cc.audioEngine.play(this.circleTouchAudio, false, audio.SoundVolum);
        this.node.active = false;
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 5,
                MAIN_MENU_NUM:true
            });
        }
    },
});
