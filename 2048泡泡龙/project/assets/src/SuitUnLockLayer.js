let audio = require( 'AudiuControl' );

cc.Class({
    extends: cc.Component,

    properties: {
       SuitUnLockDisplaySp:cc.Sprite,
       SuitUnLockGuiZeTxtLabel:cc.Sprite,
       SuitUnLockPercentLabel:cc.Label,
       SuitUnLockProgress:cc.ProgressBar,
       sprArray :{
            default:[],
            type:[cc.SpriteFrame],
        },
        GuizeArray :{
            default:[],
            type:[cc.SpriteFrame],
        },
        circleTouchAudio: {
            url: cc.AudioClip,
            default: null
        },
    },

    // onLoad () {},

    start () {
        // this.SuitUnLockDisplaySp.spriteFrame = this.sprArray[0];
    },
    initWithTag:function(tag)
    {
        var localinfo = JSON.parse(cc.sys.localStorage.getItem('userSuitData'));
        this.SuitUnLockDisplaySp.spriteFrame = this.sprArray[tag];
        this.SuitUnLockGuiZeTxtLabel.spriteFrame = this.GuizeArray[tag];
        if (tag == 0)
        {
            return;
        }else if (tag == 1)
        {
            this.SuitUnLockPercentLabel.string = "0/1"; 
            this.SuitUnLockProgress.progress = 0;
        }else if (tag == 2)
        {
            this.SuitUnLockPercentLabel.string = "1/2"; 
            this.SuitUnLockProgress.progress = 0.5;
        }else if (tag == 3)
        {
            var sharTimes = localinfo.ShareTimes;
            var percent = sharTimes/5;
            this.SuitUnLockPercentLabel.string = sharTimes + "/5";
            this.SuitUnLockProgress.progress = percent;
        }else if (tag == 4)
        {
            var maxScore = localinfo.MaxScore;
            var percent = maxScore/100000;
            this.SuitUnLockPercentLabel.string = maxScore + "/100000";
            this.SuitUnLockProgress.progress = percent;
        }else if (tag == 5)
        {
            var maxScore = localinfo.MaxScore;
            var percent = maxScore/200000;
            this.SuitUnLockPercentLabel.string = maxScore + "/200000";
            this.SuitUnLockProgress.progress = percent;
        }
    },
    checkClickF:function()
    {
        // 播放声音
        cc.audioEngine.play(this.circleTouchAudio, false, audio.SoundVolum);
        this.node.active = false;
    },
    // update (dt) {},
});
