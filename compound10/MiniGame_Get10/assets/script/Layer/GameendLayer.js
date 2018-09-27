let GData = require("GameData");
let Audio = require("Audio");
let rule  = require("RuleDefine");
let GameController = require("GameController");

cc.Class({
    extends: require("WindowBase"),

    OnLoaded(param)
    {
        Audio.playSound("resources/sound/sfx_over_1.mp3");

        this.param = param;

        this.score.getComponent(cc.Label).string = this.param.curScore;
        

        this.gird.getComponent("Gird").setNumber(this.param.maxNumber);

        for (let i = 0; i < 3; i++) 
        {
            this["model_text" + i].active = (i === param.gameModel);
            this["girdNode" + i].active = (i === param.gameModel);
            this["scoreBg" + i].active = (i === param.gameModel);
        }

        var bestScore = parseInt(cc.sys.localStorage.getItem("GameModel"+param.gameModel)) || 0;
        if(bestScore < this.param.curScore)
        {
            bestScore = this.param.curScore;
            cc.sys.localStorage.setItem("GameModel"+param.gameModel,bestScore);
        }
        this.score_best.getComponent(cc.Label).string = bestScore;

        this.shareTipsText.active = false;
        //this.shareTipsText.active = GameController.isCanShareContinue();

        // if (Math.random() < 0.7)            //给出一定几率 强制分享
        //     rule.setCanStart(false);
    },

    // update(dt)
    // {
    //     var btn = this.btn_restart;
    //     btn.getComponent(cc.Button).interactable = (rule.getShareLeftTime() <= 0);
    // },

    Onbtn_close()
    {
        cc.director.loadScene("MainScene");
    },
    Onbtn_restart()
    {
        rule.loadGameScene(this);
    },
    Onbtn_share()
    {
        // GameController.GameShareContinue();
        // this.CloseSelf();

        //var btn = this.btn_restart;
        var self = this;
        GData.Share("单手合十，点击进入","http://p9l3k4x4g.bkt.clouddn.com/lADPBbCc1hviItfNAYDNAeA_480_384.jpg_620x10000q90g.jpg",null,function(){
            //rule.setCanStart(true);
            //btn.getComponent(cc.Button).interactable = true;
            if(GameController.GameShareContinue())
            {
                self.CloseSelf();
            }
        });
    }
});