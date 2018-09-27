let ResCache = require("ResManager").getResCache();
let Util = require("Util");
let rule = require("RuleDefine");
let GData = require("GameData");
let Audio = require("Audio");


let GameModel = 0;          //游戏模式 0正常  1闪电  2限时

let MapPannel = null;

let row = 5;
let col = 5;
let MapInfo = [];

let GirdWidth = 124;         
let GirdHeith = 123;         

let GirdsDownTime = 0.03;

let game = null;

let NewbGuideTouchEnabled = false;

//需要初始化的变量 游戏参数
let UpGirds = [];
let GirdTouchEnabled = true;
let IsGameOver = false;
let MaxRandNum = 4;         //当前生成的最大数----影响掉落的格子数字
let GameScore = 0;


//游戏模式相关

let m_IsStartGame = false;
//闪电模式
let m_OneTime = 2;
let m_Timer = 2;
let m_progressBar = null;
//限时模式
let TotalTime = 180;
let m_LeftTime = 0;
let m_TimeLabel = null;

let isShareContinue = true;

//新手引导加速
let NewbGuideSpeed = 0.5;

let self = null;
module.exports = {

    Start(map_node,gamescene)
    {
        MapPannel = map_node;
        game = gamescene;
        self = this;
        this.GameInit();
        this.MapsInit();
        this.getNewGirdsStart();
        if(this.isNewbGuide())
        {
            this.StartNewbGuide();
        }
        //this.getNewGirds();
    },

    getGameModel: function () {
        return GameModel;
    },
    setGameModel: function (model) {
        GameModel = model;
        if(this.isNewbGuide())
        {
            GameModel = 0;
        }  
    },

    GameInit()
    {
        isShareContinue = (GameModel === 0);

        GirdTouchEnabled = true;
        IsGameOver = false;
        MaxRandNum = 4;         //当前生成的最大数----影响掉落的格子数字
        GameScore = 0;
        UpGirds = [];

        m_IsStartGame = false;

        game.textTip.active = true;
        game.textTipEnd.active = false;

        //闪电模式
        if(GameModel === 1)
        {     
            m_Timer = m_OneTime;
            m_progressBar = game.prossBar;
            m_progressBar.getComponent(cc.Sprite).fillRange = 1;
        }//限时模式
        else if(GameModel === 2)
        {
            m_LeftTime = TotalTime;
            m_TimeLabel = game.labelTime;

            m_TimeLabel.getComponent(cc.Label).string = Math.floor(m_LeftTime / 60) + ":" + Util.MytoString(m_LeftTime % 60, 2);
        }

        if(!this.isNewbGuide())
        {
            for(let i = 0;i<3;i++){
                let node = game["modelNode"+i];
                node.active = (i === GameModel);
            }
        }
    },

    isCanShareContinue()
    {
        return isShareContinue;
    },

    //分享继续游戏
    GameShareContinue()
    {
        if(!isShareContinue)return false;
        isShareContinue = false;
        GirdTouchEnabled = true;
        IsGameOver = false;
        UpGirds = [];
        m_IsStartGame = false;

        game.textTip.active = true;
        game.textTipEnd.active = false;

        //动画
        game.StartAnimation();

        //清除格子
        for (let i = 0; i < row; i++) 
        {
            for (let j = 0; j < col; j++) 
            {
                MapInfo[i][j].gird.node.removeFromParent();
                if(MapInfo[i][j].num != MaxRandNum)
                {
                    this.DeleteGird(MapInfo[i][j]);
                }
                else
                {
                    MapInfo[i][j].gird = null;
                }
            }
        }
        this.getNewGirdsStart(true);

        return true;
    },

    OnUpdate(dt)
    {
        this.NewbGuideUpdate(dt);
        if(IsGameOver)return;
        if(!m_IsStartGame)return;
        if(GameModel === 1 && GirdTouchEnabled)
        {
            m_Timer -= dt;
            if(m_Timer <= 0)
            {
                m_Timer = 0;
                //gameover
                self.GameOver();
            }
            m_progressBar.getComponent(cc.Sprite).fillRange = m_Timer / m_OneTime;
        }
        else if(GameModel === 2)
        {
            m_LeftTime -= dt;
            if(m_LeftTime <= 0)
            {
                m_LeftTime = 0;
                //gameover
                self.GameOver();
            }
            m_TimeLabel.getComponent(cc.Label).string = Math.floor(m_LeftTime / 60) + ":" + Util.MytoString(Math.floor(m_LeftTime % 60), 2);
        }
    },

    MapsInit()
    {
        cc.log("init");
        for (let i = 0; i < row; i++) 
        {
            MapInfo[i] = [];
            for (let j = 0; j < col; j++) 
            {
                var info = {};

                info.map = {};
                info.map.i = i;
                info.map.j = j;

                info.pos = {};
                info.pos.x = i * GirdWidth;
                info.pos.y = j * GirdHeith;

                info.gird = null;
                info.num = 0;

                MapInfo[i][j] = info;
            }
        }
    },


    //开场掉落动画不一样
    getNewGirdsStart(isContinue)
    {
        GirdTouchEnabled = false;

        var FourRandI = Math.floor(Math.random() * (row-1));
        var FourRandJ = Math.floor(Math.random() * (col-1));
        var delayTime = 0;
        var disDelayTime = 0.05;
        for (let j = 0; j < col; j++)       
        {
            for (let i = 0; i < row; i++) 
            {
                var gridInfo = MapInfo[i][j];
                if(!gridInfo.gird)
                {
                    var num = gridInfo.num || this.getRandomNum();
                    if(!isContinue)
                    {
                        if(this.isNewbGuide())            //新手引导的时候固定一个模板
                        {
                            num = rule.NewbGuide[j][i];
                        }
                        else if(FourRandI === i && FourRandJ === j)      //开场必有一个4
                        {
                            num = 4;
                        }
                    }
                    var gird = this.getOneNewGird(num).getComponent("Gird");

                    this.setGirdInfo(gridInfo,gird,num);

                    //掉落动画
                    gird.node.setPosition(gridInfo.pos.x, GirdHeith * col * 2);

                    gird.node.setOpacity(0);
                    let time = GirdsDownTime * (col * 2 - j);
                    let moveto = cc.moveTo(time,gridInfo.pos);
                    let fadein = cc.fadeIn(time);
                    gird.node.runAction(cc.sequence(
                        cc.delayTime(delayTime),
                        cc.spawn(moveto,fadein)
                    ));            

                    if(i === row - 1&& j === col - 1)
                    {
                        Util.performWithDelay(gird.node,function(){
                            GirdTouchEnabled = true;
                        },delayTime + time + 0.1);
                    }

                    delayTime += disDelayTime;
                }
            }
        }
    },

    getNewGirds() 
    {
        var newGirdsMaxTime = 0;
        let newGirdPosJ = [col,col,col,col,col];
        for (let i = 0; i < row; i++) 
        {
            for (let j = 0; j < col; j++) 
            {
                var gridInfo = MapInfo[i][j];
                if(!gridInfo.gird)
                {
                    var num = this.getRandomNum();
                    var gird = this.getOneNewGird(num).getComponent("Gird");

                    this.setGirdInfo(gridInfo,gird,num);

                    //掉落动画
                    gird.node.setPosition(gridInfo.pos.x, GirdHeith * newGirdPosJ[i]++);

                    gird.node.setOpacity(0);
                    let time = GirdsDownTime * (newGirdPosJ[i] - j);
                    if(newGirdsMaxTime < time) newGirdsMaxTime = time;
                    let moveto = cc.moveTo(time,gridInfo.pos);
                    let fadein = cc.fadeIn(time);
                    gird.node.runAction(cc.spawn(moveto,fadein));
                }
            }
        }
        return newGirdsMaxTime;
    },

    getOneNewGird(num)
    {
        var gird = cc.instantiate(ResCache["gird"]);
        gird.getComponent("Gird").Init(num);
        MapPannel.addChild(gird);

        gird.on(cc.Node.EventType.TOUCH_END,this.TouchCallBack);

        return gird;
    },

    getRandomNum()
    {
        //return 3;

        var num = 1;
        var randIdx = Math.random();
        var nRule = rule.NewGirdsRule[MaxRandNum];
        var ruleIdx = 0;
        for (let i = 0; i < nRule.length; i++) 
        {
            ruleIdx += nRule[i];
            if(randIdx < ruleIdx)
            {
                num = i + 1;
                break;
            }
        }
        return num;

        //return Math.floor(Math.random() * 10 + 1);
    },

    SetGameScore(score)
    {
        GameScore += score || 0;
        game.Score_Atlas.getComponent(cc.Label).string = GameScore;
    },

    DeleteGird(girdInfo)
    {
        girdInfo.num = 0;
        girdInfo.gird = null;
    },

    setGirdInfo(girdInfo,gird,num)
    {
        girdInfo.gird = gird;
        girdInfo.num = num;

        gird.setInfo(girdInfo.pos, girdInfo.map);
        gird.node.setLocalZOrder(col - girdInfo.map.j);
    },

    TouchCallBack(event)
    {
        if(self.isNewbGuide())return;

        if(!GirdTouchEnabled)return;

        //点击以后正式开始游戏
        if(!m_IsStartGame)m_IsStartGame = true;

        var touchGird = event.target.getComponent("Gird");

        self.TouchTheGird(touchGird);
    },

    TouchTheGird(touchGird)
    {
        if(touchGird.getStatus() === 1)
        {
            //合并
            self.Merge(touchGird);

            m_Timer = m_OneTime;
            UpGirds = [];
        }
        else
        {
            if (UpGirds.length > 0) 
            {
                for (let i = 0; i < UpGirds.length; i++) 
                {
                    UpGirds[i].setStatus(0);
                }
            }

            if(self.FindTouchGirds(touchGird))
            {
                for(let i = 0;i<UpGirds.length;i++)
                {
                    let gird = UpGirds[i];
                    gird.setStatus(1);
                }
                var num = UpGirds.length;
                if(num > 1)
                {
                    num--;
                    if(num > 7)num = 7;
                    Audio.playSound("resources/sound/sfx_bean_lv" + num + ".mp3");
                }
                
            }
        }
    },
    

    FindTouchGirds(gird)
    {
        UpGirds = [];
        function findOne(map) 
        {
            UpGirds.push(MapInfo[map.i][map.j].gird);
            MapInfo[map.i][map.j].catch = true;
            //up
            if (map.j + 1 < col && !MapInfo[map.i][map.j + 1].catch && MapInfo[map.i][map.j].num === MapInfo[map.i][map.j + 1].num) {
                findOne({ i: map.i, j: map.j + 1 });
            }
            //down
            if (map.j - 1 >= 0 && !MapInfo[map.i][map.j - 1].catch && MapInfo[map.i][map.j].num === MapInfo[map.i][map.j - 1].num) {
                findOne({ i: map.i, j: map.j - 1 });
            }
            //left
            if (map.i - 1 >= 0 && !MapInfo[map.i - 1][map.j].catch && MapInfo[map.i][map.j].num === MapInfo[map.i - 1][map.j].num) {
                findOne({ i: map.i - 1, j: map.j });
            }
            //right
            if (map.i + 1 < row && !MapInfo[map.i + 1][map.j].catch && MapInfo[map.i][map.j].num === MapInfo[map.i + 1][map.j].num) {
                findOne({ i: map.i + 1, j: map.j });
            }
        }
        
        findOne(gird.map);

        //clear state
        for (let i = 0; i < row; i++) 
        {
            for (let j = 0; j < col; j++) 
            {
                MapInfo[i][j].catch = false;
            }
        }

        if(UpGirds.length > 1)
        {
            return true;
        }
        else
        {
            UpGirds = [];
            return false;
        }
    },

    Merge(touchGird)
    {
        GirdTouchEnabled = false;
        
        ////按顺序找好动画移动路径
        var MergeGirds = [];
        var maxMoveIdx = 0;
        function findRound(map)
        {
            let tempG = [];
            MapInfo[map.i][map.j].catch = true;
            //up
            if (map.j + 1 < col && !MapInfo[map.i][map.j + 1].catch && MapInfo[map.i][map.j].num === MapInfo[map.i][map.j + 1].num) {
                tempG.push(MapInfo[map.i][map.j + 1].gird);
            }
            //down
            if (map.j - 1 >= 0 && !MapInfo[map.i][map.j - 1].catch && MapInfo[map.i][map.j].num === MapInfo[map.i][map.j - 1].num) {
                tempG.push(MapInfo[map.i][map.j - 1].gird);
            }
            //left
            if (map.i - 1 >= 0 && !MapInfo[map.i - 1][map.j].catch && MapInfo[map.i][map.j].num === MapInfo[map.i - 1][map.j].num) {
                tempG.push(MapInfo[map.i - 1][map.j].gird);
            }
            //right
            if (map.i + 1 < row && !MapInfo[map.i + 1][map.j].catch && MapInfo[map.i][map.j].num === MapInfo[map.i + 1][map.j].num) {
                tempG.push(MapInfo[map.i + 1][map.j].gird);
            }
            return tempG;
        }

        function pushGird(gird,desGird)
        {
            var gd = gird;
            gd.desGird = desGird;
            if(desGird)
            {
                gd.moveIdx = desGird.moveIdx + 1;
                if(maxMoveIdx < gd.moveIdx)
                {
                    maxMoveIdx = gd.moveIdx;
                }
            }
            else
            {
                gd.moveIdx = 0;
            }

            MergeGirds.push(gd);
        }

        pushGird(touchGird);
        var tempGirds = [];
        tempGirds.push(touchGird);
        do
        {
            let tempGirds2 = [];
            for(let i = 0;i<tempGirds.length;i++)
            {
                let tempGd = findRound(tempGirds[i].map);
                for (let j = 0; j < tempGd.length; j++) 
                {
                    pushGird(tempGd[j],tempGirds[i]);
                }
                tempGirds2 = tempGirds2.concat(tempGd);
            }

            tempGirds = tempGirds2;         
        }while(tempGirds.length > 0)

        //clear state
        for (let i = 0; i < row; i++) 
        {
            for (let j = 0; j < col; j++) 
            {
                MapInfo[i][j].catch = false;
            }
        }



        //计算分数
        let MaxNumIdx = Math.pow(2,MaxRandNum);
        let girdNumber = Math.pow(2,touchGird.number - 1);
        let girdLenth = (MergeGirds.length - 1);
        if(girdLenth > 5)girdLenth = 5;
        this.SetGameScore((MaxNumIdx + girdNumber) * girdLenth);

        //开始合并动画
        var delayTime = 0;   
        var oneMoveTime = 0.05;

        for(let i = 0; i < MergeGirds.length; i++)
        {
            var gd = MergeGirds[i];
            if(gd.desGird)
            {
                var moveto = cc.moveTo(oneMoveTime, gd.desGird.pos);
                var delay = cc.delayTime(oneMoveTime * (maxMoveIdx - gd.moveIdx));
                var fadeout = cc.fadeOut(oneMoveTime);

                gd.node.runAction(cc.sequence(
                    delay,
                    cc.spawn(
                        moveto,
                        fadeout
                    ),
                    cc.removeSelf()
                ));

                this.DeleteGird(MapInfo[gd.map.i][gd.map.j]);
            }
        }
        delayTime = (maxMoveIdx + 2) * oneMoveTime;



        //合并动画完毕
        //开始掉落并且生成新的格子
        function GirdsDown()
        {
            var n = touchGird.getNumber();
            //音效
            let audioNum = n;
            if(audioNum > 9)audioNum = 9;  
            Audio.playSound("resources/sound/efx_combine_" + audioNum + ".mp3");

            //这里先生成新的格子 还有生成时的动画
            n = n + 1;
            touchGird.setNumber(n);
            MapInfo[touchGird.map.i][touchGird.map.j].num = n;
            touchGird.setStatus(0);

            if(MaxRandNum < n)MaxRandNum = n;

            //合成之后的动画           
            if(n >= 3 && n <= 4)
            {
                var animation = touchGird.node.getChildByName("aniNode1").getComponent(cc.Animation);
                animation.play();
            }else if(n >= 5 && n <= 7)
            {
                var animation1 = touchGird.node.getChildByName("aniNode1").getComponent(cc.Animation);

                animation1.ani_second = function()
                {
                    var animation = touchGird.node.getChildByName("aniNode2").getComponent(cc.Animation);
                    animation.play();
                }

                animation1.play();             
            }else if(n >= 8 && n <= 9)
            {
                var animation1 = touchGird.node.getChildByName("aniNode1").getComponent(cc.Animation);

                animation1.ani_second = function()
                {
                    var animation = touchGird.node.getChildByName("aniNode3").getComponent(cc.Animation);
                    animation.play();
                }

                animation1.play();
            }else if(n === 10)
            {
                var animation = touchGird.node.getChildByName("aniNode4").getComponent(cc.Animation);
                animation.play();
            }else if(n > 10)
            {
                var animation1 = touchGird.node.getChildByName("aniNode1").getComponent(cc.Animation);

                animation1.ani_second = function()
                {
                    var animation = touchGird.node.getChildByName("aniNode3").getComponent(cc.Animation);
                    animation.play();
                }

                animation1.play();
            }
            
            
            function findDownPos(i,top)
            {
                for (let j = top; j >= 0; j--)
                {
                    if(j === 0 || MapInfo[i][j - 1].gird)
                    {
                        return j;
                        break;
                    }
                }
            }

            var downMaxTime = 0;
            //掉落
            for (let i = 0; i < row; i++) 
            {
                for (let j = 0; j < col; j++) 
                {
                    if(MapInfo[i][j].gird && MapInfo[i][j].num)
                    {
                        let posJ = findDownPos(i,j);
                        if(posJ != j)
                        {
                            self.setGirdInfo(MapInfo[i][posJ],MapInfo[i][j].gird,MapInfo[i][j].num);
                            self.DeleteGird(MapInfo[i][j]);
    
                            //掉落动画
                            let time = GirdsDownTime * (j - posJ);
                            if(downMaxTime < time) downMaxTime = time;
                            var downAction = null;
                            let moveto = cc.moveTo(time,MapInfo[i][posJ].pos);
                            if(MapInfo[i][posJ].gird === touchGird)
                            {
                                let moveby = cc.moveBy(0.05,cc.p(0,10));        //合成的掉落给个抖动效果 一共是0.1秒
                                downAction = cc.sequence(moveto,moveby,moveby.reverse());
                            }
                            else
                            {
                                downAction = moveto;
                            }
                            MapInfo[i][posJ].gird.node.runAction(downAction);
                        }
                        else if(MapInfo[i][j].gird === touchGird)
                        {
                            let moveby = cc.moveBy(0.05,cc.p(0,10));        //合成的掉落给个抖动效果 一共是0.1秒
                            touchGird.node.runAction(cc.sequence(moveby,moveby.reverse()));
                        }
                    }
                }
            }

            let newGirdsMaxTime = self.getNewGirds();
            if(downMaxTime < newGirdsMaxTime) downMaxTime = newGirdsMaxTime;
            Util.performWithDelay(touchGird.node,self.CheckGameOver,downMaxTime + 0.1);
        }

        //合并动画完毕
        //开始掉落并且生成新的格子
        if(touchGird.getNumber() === 9)
        {
            Util.performWithDelay(touchGird.node, function(){
                //合成10的时候有个前置动画
                var animation = touchGird.node.getChildByName("aniNode5").getComponent(cc.Animation);
                animation.ani_end = GirdsDown;
                animation.play();
            }, delayTime);        
        }
        else
        {
            Util.performWithDelay(touchGird.node, GirdsDown, delayTime);
        }
    },

    //检查游戏结束
    CheckGameOver()
    {
        var gameOver = true;
        for (let i = 0; i < row; i++) 
        {
            for (let j = 0; j < col; j++) 
            {
                //up
                if (j + 1 < col && MapInfo[i][j].num === MapInfo[i][j + 1].num) {
                    gameOver = false;
                    break;
                }
                //down
                if (j - 1 >= 0 && MapInfo[i][j].num === MapInfo[i][j - 1].num) {
                    gameOver = false;
                    break;
                }
                //left
                if (i - 1 >= 0 && MapInfo[i][j].num === MapInfo[i - 1][j].num) {
                    gameOver = false;
                    break;
                }
                //right
                if (i + 1 < row && MapInfo[i][j].num === MapInfo[i + 1][j].num) {
                    gameOver = false;
                    break;
                }
            }
            if(!gameOver)break;
        }

        //gameOver = true;
        if(gameOver)
        {
            self.GameOver();
            GData.SubmitScoreFunc(GameScore);
        }
        else
        {
            GirdTouchEnabled = true;
        }
    },



    GameOver()
    {   
        GirdTouchEnabled = false;
        IsGameOver = true;

        game.GameOver({
            maxScore:0,
            maxNumber:MaxRandNum,
            curScore:GameScore,
            gameModel:GameModel
        });
        
        game.textTip.active = false;
        game.textTipEnd.active = true;

        Util.performWithDelay(game.node,function(){
            let width = Math.floor(Math.random()*2 + 2); //2-5
            //游戏结束时给格子加一个抖动的动画效果
            for (let j = 0; j < col; j++) 
            {
                let startI = Math.floor(Math.random()*4);           //0-2
                for (let i = startI; i < row && i < width + startI; i++) 
                {
                    let gird = MapInfo[i][j].gird.node;
                    let moveby = cc.moveBy(0.1,cc.p(0,30));
                    gird.runAction(cc.sequence(
                        cc.delayTime(0.15 * (j+1)),
                        moveby,
                        moveby.reverse()
                    ));
                }
            }
        },1);
    },


//-----------------开始新手引导

    
    NewbGuideUpdate(dt)
    {
        if(!this.isStartNewbGuide)return;

        this.NewbGuideTimer += dt;
        if(this.NewbGuideTimer < this.NewbGuideDelayTime)return;
        //渐隐上一句
        if(this.NewbGuideStatus === 0)
        {
            this.NewbGuideStatus++;
            var lastText = game["labelTips" + this.NewbGuideTextIdx++];
            if(lastText)
            {
                this.NewbGuideTimer = 0;
                lastText.runAction(cc.fadeOut(1 * NewbGuideSpeed));
            }
        }
        //渐现当前语句
        else if(this.NewbGuideStatus === 1)        //
        {
            if(this.NewbGuideTextIdx > 9)
            {
                //NewbGuideOver
                this.setNewbGuideFinish();
                return;
            }

            this.NewbGuideStatus++;
            //不用等待的语句
            if( this.NewbGuideTextIdx === 1 || 
                this.NewbGuideTextIdx === 3 ||
                this.NewbGuideTextIdx === 5 ||
                this.NewbGuideTextIdx === 8 ||
                this.NewbGuideTextIdx === 9 )
            {
                this.NewbGuideIsContinue = true;
            }

            if(this.NewbGuideTextIdx === 2)
            {
                var fade = cc.fadeIn(0.8 * NewbGuideSpeed);
                game.rect1.runAction(cc.sequence(
                    fade,
                    fade.reverse(),
                    fade,
                    cc.callFunc(function(){
                        NewbGuideTouchEnabled = true;
                    })
                ));
            }
            else if (this.NewbGuideTextIdx === 3)
            {
                var fade = cc.fadeIn(0.8 * NewbGuideSpeed);
                game.rect1.runAction(cc.sequence(
                    fade,
                    fade.reverse(),
                    fade,
                    fade.reverse()
                ));
            }
            else if (this.NewbGuideTextIdx === 4)
            {
                var fade = cc.fadeIn(0.8 * NewbGuideSpeed);
                game.rect_x.setPositionY(game.rect_x.getPositionY() + 11);
                game.rect_x.runAction(cc.sequence(
                    fade,
                    fade.reverse(),
                    fade,
                    cc.callFunc(function(){
                        NewbGuideTouchEnabled = true;
                    })
                ));

                var moveby = cc.moveBy(0.3 * NewbGuideSpeed,cc.p(0,15));
                game.finger.runAction(cc.sequence(
                    cc.delayTime(0.5 * NewbGuideSpeed),
                    cc.fadeIn(0.5 * NewbGuideSpeed),
                    moveby,
                    moveby.reverse(),
                    moveby
                ));
            }
            else if(this.NewbGuideTextIdx === 6)
            {
                var fade = cc.fadeIn(0.8 * NewbGuideSpeed);
                game.rect2.runAction(cc.sequence(
                    fade,
                    fade.reverse(),
                    fade,
                    cc.callFunc(function(){
                        NewbGuideTouchEnabled = true;
                    })
                ));
            }
            else if(this.NewbGuideTextIdx === 7)
            {
                var fade = cc.fadeIn(0.8 * NewbGuideSpeed);
                game.rect_x.setPositionY(game.rect_x.getPositionY() + 11);
                game.rect_x.runAction(cc.sequence(
                    fade,
                    fade.reverse(),
                    fade,
                    cc.callFunc(function(){
                        NewbGuideTouchEnabled = true;
                    })
                ));

                var moveby = cc.moveBy(0.3 * NewbGuideSpeed,cc.p(0,-15));
                game.finger.runAction(cc.sequence(
                    cc.delayTime(0.5 * NewbGuideSpeed),
                    cc.fadeIn(0.5 * NewbGuideSpeed),
                    moveby,
                    moveby.reverse(),
                    moveby
                ));
            }
            var curText = game["labelTips" + this.NewbGuideTextIdx];
            if(curText)
            {
                this.NewbGuideTimer = 0;
                curText.runAction(cc.fadeIn(1 * NewbGuideSpeed));
            }
        }
        //等待操作时间
        else if(this.NewbGuideStatus === 2 && this.NewbGuideIsContinue)
        {
            this.NewbGuideIsContinue = false;
            this.NewbGuideStatus = 0;
        }   
    },

    StartNewbGuide()
    {  
        this.NewbGuideTextIdx = 0;
        this.NewbGuideStatus = 0;       
        this.NewbGuideTimer = 0;
        this.NewbGuideDelayTime = 1.5 * NewbGuideSpeed;
        game.NewbLayer.active = true;
        this.NewbGuideIsContinue = false;

        Util.performWithDelay(game.node,function(){
            self.isStartNewbGuide = true;
        },1 * NewbGuideSpeed);
    },

    OnNewbLayer()
    {
        if(!NewbGuideTouchEnabled)return;
        if(this.NewbGuideTextIdx === 2)
        {
            NewbGuideTouchEnabled = false;
            this.NewbGuideIsContinue = true;

            var touchGird = MapInfo[1][0].gird;
            this.TouchTheGird(touchGird);
            game.rect1.setOpacity(0);
            game.rect1.setPositionY(game.rect1.getPositionY() + 11);
        }
        else if (this.NewbGuideTextIdx === 4)
        {
            NewbGuideTouchEnabled = false;
            this.NewbGuideIsContinue = true;
            var touchGird = MapInfo[1][0].gird;
            this.TouchTheGird(touchGird);   
            game.finger.setOpacity(0);
            game.rect_x.setPositionY(game.rect_x.getPositionY() - 11);
            game.rect_x.setOpacity(0);
        }
        else if(this.NewbGuideTextIdx === 6)
        {
            NewbGuideTouchEnabled = false;
            this.NewbGuideIsContinue = true;
            var touchGird = MapInfo[1][0].gird;
            this.TouchTheGird(touchGird);
            game.rect2.setOpacity(0);
            game.rect2.setPositionY(game.rect1.getPositionY() + 11);
        }
        else if(this.NewbGuideTextIdx === 7)
        {
            NewbGuideTouchEnabled = false;
            this.NewbGuideIsContinue = true;
            var touchGird = MapInfo[1][0].gird;
            this.TouchTheGird(touchGird);
            game.finger.setOpacity(0);
            game.rect_x.setPositionY(game.rect_x.getPositionY() - 11);
            game.rect_x.setOpacity(0);
        }
    },

    isNewbGuide()
    {
        var isNewbGuide = cc.sys.localStorage.getItem("isNewbGuide");
        if(!isNewbGuide)return true;

        return false;
    },

    setNewbGuideFinish()
    {
        cc.sys.localStorage.setItem("isNewbGuide",1);
        delete this.isStartNewbGuide;

        for(let i = 0;i<3;i++){
            let node = game["modelNode"+i];
            node.active = (i === GameModel);
        }

        game.NewbLayer.active = false;    
        game.StartAnimation();
    },

    
};