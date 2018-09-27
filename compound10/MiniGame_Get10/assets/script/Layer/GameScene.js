let GameController = require("GameController");
let ResCache = require("ResManager").getResCache();
let Util = require("Util");
let GData = require("GameData");
let satrtAnimationTime = 3;
let updateTimer = 0;

cc.Class({
    extends: require("WindowBase"),

    // onLoad () {},

    start () {
        GData.hideGameClubButton();
        GameController.Start(this.MapNode,this);

        //按钮添加一个开场动画
        if(!GameController.isNewbGuide())
        {
            this.StartAnimation();
        }   
    },

    StartAnimation()
    {
        var moveDis = 800;
        var speed = 0.9; 
        var boom = 15;
        var speedBoom = 0.2;   
        function LeftMoveAction(node)
        {
            var desPosX = node.getPositionX();
            var strPosX = desPosX - moveDis;
            var dis = desPosX - strPosX;
            var moveby = cc.moveBy(speed,cc.p(dis,0));

            node.setPositionX(strPosX);

            var moveby2 = cc.moveBy(speedBoom,cc.p(boom,0));
            moveby2.easing(cc.easeSineOut());
            var moveby3 = cc.moveBy(speedBoom,cc.p(-boom,0));

            node.runAction(cc.sequence(
                moveby,
                moveby2,
                moveby3
            ));
        }
        function RightMoveAction(node)
        {
            var desPosX = node.getPositionX();
            var strPosX = desPosX + moveDis;
            var dis = desPosX - strPosX;
            var moveby = cc.moveBy(speed,cc.p(dis,0));

            node.setPositionX(strPosX);

            var moveby2 = cc.moveBy(speedBoom,cc.p(-boom,0));
            moveby2.easing(cc.easeSineOut());
            var moveby3 = cc.moveBy(speedBoom,cc.p(boom,0));

            node.runAction(cc.sequence(
                moveby,
                moveby2,
                moveby3
            ));
        }
        function TopMoveAction(node)
        {
            var desPosY = node.getPositionY();
            var strPosY = desPosY + moveDis;
            var dis = desPosY - strPosY;
            var moveby = cc.moveBy(speed,cc.p(0,dis));

            node.setPositionY(strPosY);

            var moveby2 = cc.moveBy(speedBoom,cc.p(0,-boom));
            moveby2.easing(cc.easeSineOut());
            var moveby3 = cc.moveBy(speedBoom,cc.p(0,boom));

            node.runAction(cc.sequence(
                moveby,
                moveby2,
                moveby3
            ));
        }


        
        this.btn_pause.active = true;
        this.btn_share.active = true;
        this.Score_Atlas.active = true;
        LeftMoveAction(this.btn_pause);
        RightMoveAction(this.btn_share);
        TopMoveAction(this.Score_Atlas);
        //TopMoveAction(this.line);

        TopMoveAction(this.modelNode0);
        TopMoveAction(this.modelNode1);
        TopMoveAction(this.modelNode2);
    },


    GameOver(param)
    {
        var self = this;

        Util.performWithDelay(this.node,function(){
            self.OpenWindow("layer/gameend_layer",param);
        },2.5);
    },
    // OnBtn_GameEnd()
    // {
    //     cc.director.loadScene("MainScene");
    // },
    Onbtn_pause()
    {
        this.OpenWindow("layer/pausing_layer");
    },

    Onbtn_share()
    {
        GData.Share("单手合十，点击进入","http://p9l3k4x4g.bkt.clouddn.com/lADPBbCc1hviItfNAYDNAeA_480_384.jpg_620x10000q90g.jpg");
    },

    OnNewbLayer()
    {
        GameController.OnNewbLayer();
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


        GameController.OnUpdate(dt);
    },
});

