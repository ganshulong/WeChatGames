


let ResManager = require("ResManager");
let GData = require("GameData");
let Audio = require("Audio");
let GameController = require("GameController");
let rule = require("RuleDefine");

let ResCache = require("ResManager").getResCache();
let Util = require("Util");
let satrtAnimationTime = 0;
let updateTimer = 0;

let buttonTimer = 0;

cc.Class({
    extends: require("WindowBase"),

    start () {    
        GData.createGameClubButton();
        Audio.playMusic();
        ResManager.PreLoad();
        Audio.preLoad();
        rule.setGameController(GameController);
    },

    Onbtn_start()
    {
        rule.loadGameScene(this,0);
    },

    Onbtn_setting()
    {
        this.OpenWindow("layer/setting_layer");
    },

    Onbtn_rank()
    {
        this.OpenWindow("layer/rank_layer");
    },

    Onbtn_more()
    {
        this.OpenWindow("layer/model_layer");
    },

    update (dt) {
        updateTimer += dt;
        if(updateTimer > satrtAnimationTime)
        {
            updateTimer = 0;
            satrtAnimationTime = Util.Random(1,3);      //生成频率随机

            //出生点随机
            let startX = Util.Random(-400,800);
            let startY = Util.Random(-1000,100);

            let node = new cc.Node();
            node.setPosition(startX,startY);
            node.addComponent(cc.Sprite).spriteFrame = ResCache["ani" + Util.Random(0,4)];
            this.mask.addChild(node);


            //出生点随机
            let endX = Util.Random(-400,800);
            let endY = Util.Random(1000,100);

            //漂浮时间随机
            let time = Util.Random(35,10);


            let rotate = cc.repeatForever(cc.rotateBy(Util.Random(2,3),30));        //旋转速度随机
            node.runAction(rotate);

            let moveby = cc.moveBy(Util.Random(5,10),cc.p(Util.Random(-100,100),0));
            node.runAction(cc.repeatForever(
                cc.sequence(
                    moveby,
                    moveby.reverse()
                )
            ));


            let moveto = cc.moveTo(time,cc.p(endX,endY));
            node.runAction(cc.sequence(
                moveto,
                cc.removeSelf()
            ));

        }

        buttonTimer += dt;
        if(buttonTimer > 3)
        {
            buttonTimer = 0;

            let speed = 0.015;
            this.btn_start.runAction(cc.sequence(
                cc.scaleTo(speed * 14,1.2),
                cc.scaleTo(speed * 9,1),
                cc.scaleTo(speed * 10,1.1),
                cc.scaleTo(speed * 7,1),
                cc.scaleTo(speed * 5,1.05),
                cc.scaleTo(speed * 3,1)
            ));
        }


        // var leftTime = rule.getShareLeftTime();
        // if(leftTime)
        // {
        //     this.shareLeftTimeText.active = true;
        //     this.shareLeftTimeText.getComponent(cc.Label).string = Math.floor(leftTime / 60) + ":" + Util.MytoString(leftTime % 60, 2);
        // }
        // else
        // {
        //     this.shareLeftTimeText.active = false;
        // }
    },
});
