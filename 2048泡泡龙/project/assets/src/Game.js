const BALL_NUM = 6;
const BALL_LAYER = 9;
const BODY_WIDTH = 602;
const BODY_HEIGHT = 1022;
const MAX_POWER = 11;
const BALL_RADIUS = 55;
const LAYER_HEIGHT = BALL_RADIUS * Math.sqrt( 3 );

let BALL_COLOR = { 2:new cc.Color(197,191,183), 4:new cc.Color(175,164,146), 8:new cc.Color(87,223,185), 16:new cc.Color(85,224,139), 32:new cc.Color(65,220,112),
    64:new cc.Color(45,178,83), 128:new cc.Color(250,185,45), 256:new cc.Color(251,142,43), 512:new cc.Color(232,20,46), 1024:new cc.Color(150,40,110), 2048:new cc.Color(104,41,150) };
let GAMEBG_COLOR = new cc.Color(207,195,183);
let GAMEBTN_SCORE_COLOR = new cc.Color(142,129,114);

let line0 = null;
let line1 = null;
let ballSprite = null;
let offset = 0;
let g_values = new Array();
let g_FireBall = null;
let g_FireValue = 0;
let g_PreBall = null;
let PreviewBall = null;
let ScoreLabel = null;
let g_PreValue = 0;

let g_BallPool = new cc.NodePool();
let g_PreBallPool = new cc.NodePool();
let g_ScorePool = new cc.NodePool();

let g_Running = false;
let g_Time = 0;
let g_MaxTime = 15;
let g_LastPoint = null;
let g_LastPrePos = null;
let g_Score = 0;

let audio = require( 'AudiuControl' );
let isShareing = 0; // 一局游戏只能分享一次标记
let isNeedGuid = false;
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
        fireAudio: {
            url: cc.AudioClip,
            default: null
        },
        BigAudio: {
            url: cc.AudioClip,
            default: null
        },
        lightAudio: {
            url: cc.AudioClip,
            default: null
        },
        progresLeftArray :{
            default:[],
            type:[cc.SpriteFrame],
        },
        progresRighArray :{
            default:[],
            type:[cc.SpriteFrame],
        },
        gameBgArray :{
            default:[],
            type:[cc.SpriteFrame],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        // cc.find( "Canvas/Game_PauseBtnLayer/Game_PauseBg" ).on(cc.Node.EventType.TOUCH_END,function(event){
        //     cc.find( "Canvas/Game_PauseBtnLayer" ).active = false;
        //     self.resumeGameFunc();
        // });
        this.onLoaded();
    },

    onLoaded(){
        line0 = cc.find( "Canvas/bg_body/line0" );
        line1 = cc.find( "Canvas/bg_body/line1" );
        PreviewBall = cc.find( "Canvas/bg_body/preview" );
        ballSprite = cc.find( "Canvas/ball" );
        ScoreLabel = cc.find( "Canvas/ball/num" );
        for( var i = 0; i < 60; i ++ )
        {
            var ball = cc.instantiate( ballSprite );
            g_BallPool.put( ball );
        }
        for( var i = 0; i < 30; i ++ )
        {
            var ball = cc.instantiate( PreviewBall );
            g_PreBallPool.put( ball );
        }
        for( var i = 0; i < 30; i ++ )
        {
            var label = cc.instantiate( ScoreLabel );
            g_ScorePool.put( label );
        }

        // this.Reset();
    },

    Reset( booRelive ){
        BALL_COLOR = audio.getCurrentBallColor(audio.SuitIndex);
        GAMEBG_COLOR = audio.getCurrentGameBgCorlor(audio.SuitIndex);
        GAMEBTN_SCORE_COLOR = audio.getGameBackBtnAndScoreColor(audio.SuitIndex);
        
        for( var i = 0; i < BALL_LAYER + 1; i ++ )
        {
            g_values[i] = new Array();
            for( var j = 0; j < BALL_NUM; j ++ )
            {
                g_values[i][j] = 0;
            }
        }
        offset = 0;
        var balls = cc.find( "Canvas/bg_body/balls" );
        while( balls.getChildren().length > 0 )
        {
            balls.getChildren()[0].stopAllActions();
            g_BallPool.put( balls.getChildren()[0] );
        }
        if( !booRelive )
            this.Grow( 4 );
        this.RefreshBalls();
        if( g_FireBall != null )
        {
            g_FireBall.stopAllActions();
            g_BallPool.put( g_FireBall );
        }
        if( g_PreBall != null )
        {
            g_PreBall.stopAllActions();
            g_BallPool.put( g_PreBall );
        }
        var body = cc.find( "Canvas/bg_body" );
        g_FireValue = this.RandomNum( MAX_POWER );
        g_FireBall = this.NewBall( g_FireValue );
        g_FireBall.setPosition( 0, 0 );
        g_FireBall.setScale( 1 );
        body.addChild( g_FireBall );
        g_PreValue = this.RandomNum( MAX_POWER );
        g_PreBall = this.NewBall( g_PreValue );
        g_PreBall.setScale( 0.5 );
        g_PreBall.setPosition( -200, -40 );
        body.addChild( g_PreBall );
        g_Running = true;
        g_Time = 0;
        if( !booRelive )
        {
            g_MaxTime = 15;
            g_Score = 0;
            isShareing = 0;// 初始化分享状态
            var localinfo = JSON.parse(cc.sys.localStorage.getItem('userSuitData'));
            // 判断第一次游戏标记
            if(localinfo.isFinishFirstGame == false)
            {
                var guidAniNode = cc.find("Canvas/Guid_Layer");
                guidAniNode.active = true;
                guidAniNode.getComponent(cc.Animation).play();
                isNeedGuid = true;
            }
        }
        cc.find( "Game_ScoreLabel", body ).getComponent( cc.Label ).string = g_Score;
        cc.find( "Game_ScoreLabel", body ).color = GAMEBTN_SCORE_COLOR;
        cc.find( "Game_Quit/GameQUitSp", body ).color = GAMEBTN_SCORE_COLOR;
        cc.find( "BigBg", body ).color = GAMEBG_COLOR;
        cc.find( "SmallBg", body ).getComponent(cc.Sprite).spriteFrame = this.gameBgArray[audio.SuitIndex-1];
        cc.find( "Game_ProgressBarLef", body ).getComponent(cc.ProgressBar).barSprite.spriteFrame = this.progresLeftArray[audio.SuitIndex-1];
        cc.find( "Game_ProgressBarRig", body ).getComponent(cc.ProgressBar).barSprite.spriteFrame = this.progresRighArray[audio.SuitIndex-1];

    },

    RandomNum( max ){
        return Math.pow( 2, Math.floor( Math.random() * max ) + 1 );
    },

    Grow( num ){
        for( var loop = 0; loop < num; loop ++ )
        {
            for( var i = BALL_LAYER; i > 0; i -- )
            {
                for( var j = 0; j < BALL_NUM; j ++ )
                {
                    g_values[i][j] = g_values[i-1][j];
                }
            }
            for( var i = 0; i < BALL_NUM; i ++ )
            {
                g_values[0][i] = this.RandomNum( MAX_POWER - 4 );
            }
            offset = ( ++offset & 1 );
            var balls = cc.find( "Canvas/bg_body/balls" );
            var children = balls.getChildren();
            for( var i = 0; i < children.length; i ++ )
            {
                children[i].setLocalZOrder( children[i].getLocalZOrder() + 1 );
                children[i].runAction( cc.moveBy( 0.1, 0, -LAYER_HEIGHT ) );
            }
            for( var i = 0; i < BALL_NUM; i ++ )
            {
                var ball = this.NewBall( g_values[0][i] )
                balls.addChild( ball );
                ball.setScale( 0 );
                ball.setPosition( this.GetBallPos( 0, i ) );
                ball.setLocalZOrder( 0 );
//                body.pauseSystemEvents();
                g_Running = false;        
                ball.runAction( cc.scaleTo( 0.15, 1 ) );
            }
        }
        var body = cc.find( "Canvas/bg_body" );
        var self = this;
        this.scheduleOnce( function(){
            body.resumeSystemEvents();
            g_Running = true;
            self.CheckLose();
        }, 0.15 );
        if( g_LastPoint )
            this.RefreshPreview( g_LastPoint );


        this.RefreshBalls();
    },
    
    GetBallNode( x, y ){
        var balls = cc.find( "Canvas/bg_body/balls" );
        var p0 = this.GetBallPos( x, y );
        var children = balls.getChildren();
        for( var i = 0; i < children.length; i ++ )
        {
            var p1 = children[i].getPosition();
            if( ( Math.abs( p0.x - p1.x ) < 10 ) && ( Math.abs( p0.y - p1.y ) < 10 ) )
                return children[i];
        }

        return null;
    },

    GetPaste( x, y, list ){
        var neighbor = this.GetNeighbor( x, y );
        for( var i in neighbor )
        {
            if( (list[neighbor[i].x][neighbor[i].y] == 0) && (g_values[neighbor[i].x][neighbor[i].y] > 0) )
            {
                list[neighbor[i].x][neighbor[i].y] = 1;
                this.GetPaste( neighbor[i].x, neighbor[i].y, list );
            }
        }
    },

    CheckDrop(){
        var list = new Array();
        for( var i = 0; i < BALL_LAYER + 1; i ++ )
        {
            list[i] = new Array();
            for( var j = 0; j < BALL_NUM; j ++ )
            {
                list[i][j] = 0;
            }
        }
        for( var j = 0; j < BALL_NUM; j ++ )
        {
            if( g_values[0][j] > 0 )
            {
                list[0][j] = 1;
                this.GetPaste( 0, j, list );
            }
        }
        for( var i = 0; i < BALL_LAYER + 1; i ++ )
        {
            for( var j = 0; j < BALL_NUM; j ++ )
            {
                if( (list[i][j] <= 0 ) && ( g_values[i][j] > 0 ) )
                {
                    this.DropBall( i, j );
                }
            }
        }        
    },

    DropBall( x, y )
    {
        var node = cc.find( "Canvas/bg_body/effect" );
        var value = g_values[x][y];
        g_Score += value * 2;
        var ball = this.NewBall( value );
        node.addChild( ball );
        var pos = this.GetBallPos( x, y );
        ball.setPosition( pos );
        const speed = 1000;
        ball.runAction( cc.sequence( cc.moveTo( pos.y / speed, pos.x, 0 ).easing(cc.easeIn(5.0)), cc.jumpBy( 0.2, Math.random() * 200 - 100, 0, Math.random() * 100, 1 ), cc.callFunc( function ( ball ){
            // jump score label
            var node = cc.find( "Canvas/bg_body/effect" );
            var lab;
            if( g_ScorePool.size() > 0 )
                lab = g_ScorePool.get();
            else
                lab = cc.instantiate( ScoreLabel );
            node.addChild( lab );
            lab.getComponent( cc.Label ).string = value * 2;
            lab.setPosition( ball.x, ball.y + 40 );
            lab.opacity = 255;
            lab.runAction( cc.sequence( cc.moveBy( 0.15, 0, 20 ), cc.fadeOut( 1.0 ), cc.callFunc( function ( lab ){
                g_ScorePool.put( lab );
            } ) ) );

            ball.stopAllActions();
            g_BallPool.put( ball ); 

        }  ) ) );

        g_values[x][y] = 0;
        node = this.GetBallNode( x, y );
        if( node != null )
        {
            node.stopAllActions();
            g_BallPool.put( node );
        }
    },

    CheckLose(){
        for( var i = 0; i < BALL_NUM; i ++ )
        {
            if( g_values[BALL_LAYER - 1][i] > 0 )
            {
                var ball = this.GetBallNode( BALL_LAYER - 1, i );
                if( ball && ( ball.getActionByTag( 99 ) == null ) )
                {
                    var color = ball.color;
                    var act1 = cc.tintTo( 0.2, 255, 255, 255 );
                    var act2 = cc.tintTo( 0.2, color.getR(), color.getG(), color.getB() );
                    var acts = cc.repeatForever( cc.sequence( act1, act2 ) );
                    acts.setTag( 99 );

                    ball.runAction( acts );
                }
            }
            if( g_values[BALL_LAYER][i] > 0 )
            {
                var balls = cc.find( "Canvas/bg_body/balls" );
                for( var j in balls.getChildren() )
                {
                    var ball = balls.getChildren()[j];
                    const speed = 1000;
                    ball.runAction( cc.sequence( cc.moveTo( ball.y / speed, ball.x, 0 ).easing(cc.easeIn(5.0)), cc.jumpBy( 0.2, Math.random() * 200 - 100, 0, Math.random() * 100, 1 ), cc.callFunc( function ( ball ){
                        ball.stopAllActions();
                        g_BallPool.put( ball ); 
                    }  ) ) );
                }
                // 提交分数
                cc.find("Canvas/RankingLayer").getComponent("Rank").SubmitScoreFunc(g_Score);
                var localinfo = JSON.parse(cc.sys.localStorage.getItem('userSuitData'));
                // 判断第一次游戏标记
                if(localinfo.isFinishFirstGame == false)
                {
                    localinfo.isFinishFirstGame = true;
                }
                cc.sys.localStorage.setItem('userSuitData', JSON.stringify(localinfo));
                this.scheduleOnce( function(){
                    // 暂停
                    this.pauseGameFunc();
                    var resultLayer = cc.find("Canvas/Game_EndResultLayer");
                    resultLayer.active = true;
                    // 刷新界面函数
                    resultLayer.getComponent("EndResultLayer").initWithMode(g_Score);
                }, 1.5 );
                g_Running = false;
                return;
            }
        }
    },

    Fire( point ){
        var ret = this.GetTrack( point );
        if( ret == null || ret.ball == null )
            return;

        var body = cc.find( "Canvas/bg_body" );
        function AnimEnd( ball, point ){
            // ball.stopAllActions();
            // g_BallPool.put( ball );
            var balls = cc.find( "Canvas/bg_body/balls" );
            ball.removeFromParent(false);
            balls.addChild( ball );
            this.Process( point, true );
            this.CheckLose();    
            this.RefreshBalls();
        }

        const moveSpeed = 4000;
        var dis, v;
        var fin = this.GetBallPos( ret.ball.x, ret.ball.y );
        // 计算运行轨迹
        if( ret.p.length > 2 )
        {
            var step1, step2;
            step1 = cc.moveTo( ret.p[1].mag() / moveSpeed, ret.p[1] );
            v = ret.p[3].sub( ret.p[1] );
            dis = v.mag() - BALL_RADIUS;
            v.mulSelf( dis / v.mag() );
            v.addSelf( ret.p[2] );
            step2 = cc.moveTo( dis / moveSpeed, v );

            g_FireBall.runAction( cc.sequence( step1, step2, cc.moveTo( v.sub( fin ).mag() / moveSpeed, fin ), cc.callFunc( AnimEnd, this, ret.ball ) ) );
        }
        else
        {
            dis = ret.p[1].mag() - BALL_RADIUS;
            v = ret.p[1].mul( dis / ret.p[1].mag() );
            g_FireBall.runAction( cc.sequence( cc.moveTo( dis / moveSpeed, v ), cc.moveTo( v.sub( fin ).mag() / moveSpeed, fin ), cc.callFunc( AnimEnd, this, ret.ball ) ) );
        }
        g_FireBall.setLocalZOrder( ret.ball.y );
        // 赋值
        g_values[ret.ball.x][ret.ball.y] = g_FireValue;

        // 产生下一个新球
        g_FireBall = g_PreBall;
        g_FireValue = g_PreValue;

        g_PreBall.runAction( cc.scaleTo(0.3, 1) );
        g_PreBall.runAction( cc.moveTo(0.3, cc.p(0,0) ) );

        if( Math.random() < 0.02 )
            g_PreValue = 2048
        else
            g_PreValue = this.RandomNum( MAX_POWER - 1 );
        g_PreBall = this.NewBall( g_PreValue );
        g_PreBall.setScale( 0 );
        g_PreBall.setPosition( -200, -40 );
        body.addChild( g_PreBall );
        g_PreBall.runAction( cc.scaleTo(0.3,0.5) );

        body.pauseSystemEvents();
        g_Running = false;
    },

    GetSameValue( pt, v, list ){
        if( g_values[pt.x][pt.y] != v )
            return;
        
        list.push( pt.x * 100 + pt.y );
        var neighbor = this.GetNeighbor( pt.x, pt.y );
        for( var i in neighbor )
        {
            var e = neighbor[i];
            if( (g_values[e.x][e.y] == v) && (list.indexOf( e.x * 100 + e.y ) < 0) )
            {
                this.GetSameValue( e, v, list );
            }
        }
    },

    Process( pt, first ){
        var neighbor, erases;
        var body = cc.find( "Canvas/bg_body" );
        if( g_values[pt.x][pt.y] >= 2048 )
        {//big
            // 播放声音
            cc.audioEngine.play(this.BigAudio, false, audio.SoundVolum);
            neighbor = this.GetNeighbor( pt.x, pt.y );
            erases = new Array();
            for( var i in neighbor )
            {
                if( g_values[neighbor[i].x][neighbor[i].y] > 0 )
                {
                    this.EraseBall( neighbor[i], null );
                }
                var subs = this.GetNeighbor( neighbor[i].x, neighbor[i].y );
                for( var j in subs )
                {
                    if( g_values[subs[j].x][subs[j].y] > 0 )
                        this.EraseBall( cc.p(subs[j].x, subs[j].y), null );
                }
            }
            this.EraseBall( pt, null );
            body.resumeSystemEvents();
            g_Running = true;
            this.CheckDrop();
        }
        else if( g_values[pt.x][pt.y] > 0 )
        {
            erases = new Array();
            this.GetSameValue( pt, g_values[pt.x][pt.y], erases );
            // no balls to erase
            if( erases.length <= 1 )
            {
                if( first )
                {
                    var pos0 = this.GetBallPos( pt.x, pt.y );
                    neighbor = this.GetNeighbor( pt.x, pt.y );
                    for( var i in neighbor )
                    {
                        if( g_values[neighbor[i].x][neighbor[i].y] > 0 )
                        {
                            var pos1 = this.GetBallPos( neighbor[i].x, neighbor[i].y );
                            var nodeN = this.GetBallNode( neighbor[i].x, neighbor[i].y );
                            var act = cc.moveBy( 0.05, pos1.sub( pos0 ).mul( 0.15 ) );
                            act = act.easing(cc.easeOut(5.0));
                            if( nodeN != null )
                                nodeN.runAction( cc.sequence( act, act.clone().reverse() ) );
                        }
                    }
                    var self = this;
                    this.scheduleOnce( function(){
                        body.resumeSystemEvents();
                        g_Running = true;
                        this.CheckDrop();
                    }, 0.1 );    
                    return;
                }
                else
                {
                    body.resumeSystemEvents();
                    g_Running = true;
                    this.CheckDrop();                
                }
                return;
            }
            if( first )
            {
                //light
                 // 播放声音
                cc.audioEngine.play(this.lightAudio, false, audio.SoundVolum);
                var pos0 = this.GetBallPos( pt.x, pt.y );
                neighbor = this.GetNeighbor( pt.x, pt.y );
                for( var i in neighbor )
                {
                    if( (g_values[neighbor[i].x][neighbor[i].y] > 0) && (g_values[neighbor[i].x][neighbor[i].y] !=g_values[pt.x][pt.y]) )
                    {
                        var pos1 = this.GetBallPos( neighbor[i].x, neighbor[i].y );
                        var nodeN = this.GetBallNode( neighbor[i].x, neighbor[i].y );
                        var act = cc.moveBy( 0.05, pos1.sub( pos0 ).mul( 0.15 ) );
                        act = act.easing(cc.easeOut(5.0));
                        if( nodeN != null )
                            nodeN.runAction( cc.sequence( act, act.clone().reverse() ) );
                    }
                }
            }

            var v = g_values[pt.x][pt.y] * 2;//Math.pow( 2, erases.length - 1 );
            v = Math.min( v, 2048 );
            var find = null;
            var min = 0;
            var secondList = new Array();
            for( var i in erases )
            {
                var num = 0;
                var x = Math.floor( erases[i] / 100 );
                var y = erases[i] % 100;
                
                neighbor = this.GetNeighbor( x, y );
                var booPaste = false;
                for( var j in neighbor )
                {
                    var nv = g_values[neighbor[j].x][neighbor[j].y];
                    if( nv == v )
                        num++;
                    else if( (nv != g_values[pt.x][pt.y]) && (nv>0) )
                        booPaste = true;
                }
                if( num > min )
                {
                    min = num;
                    find = cc.p( x, y );
                }
                else if( booPaste )
                {
                    secondList.push( erases[i] );
                }
            }
            if( find == null )
            {
                var top = 9999;
                for( var i in secondList )
                {
                    var x = Math.floor( secondList[i] / 100 );
                    var y = secondList[i] % 100;

                    if( x < top )
                    {
                        find = cc.p( x, y );
                        top = x;
                    }
                }
            }
            if( find == null )
            {
                var top = 9999;
                for( var i in erases )
                {
                    var x = Math.floor( erases[i] / 100 );
                    var y = erases[i] % 100;

                    if( x < top )
                    {
                        find = cc.p( x, y );
                        top = x;
                    }
                }
            }
            var ev = g_values[pt.x][pt.y];
            g_values[find.x][find.y] = v;
            var node = this.GetBallNode( find.x, find.y );
            for( var i in erases )
            {
                var x = Math.floor( erases[i] / 100 );
                var y = erases[i] % 100;

                if( g_values[x][y] == ev )
                {
                    this.EraseBall( cc.p( x, y ), cc.p( find ) );
                }
            }
            var self = this;
            this.scheduleOnce( function(){ 
                if( node != null )
                {
                    cc.find( "num", node ).getComponent( cc.Label ).string = v;
                    node.setColor( this.GetColor(v) );                        
                }    
                self.Process( find, false ); }, 0.2 );
        }
        cc.find( "Game_ScoreLabel", body ).getComponent( cc.Label ).string = g_Score;
    },

    EraseBall( pt, dest ){
        var value = g_values[pt.x][pt.y];
        if( value == 0 )
            return;
        var color = this.GetColor( value );
        var pos = this.GetBallPos( pt.x, pt.y );
        var node = cc.find( "Canvas/bg_body/effect" );
        var ball = null;
        if( g_PreBallPool.size() > 0 )
            ball = g_PreBallPool.get();
        else
            ball = cc.instantiate( PreviewBall );
        node.addChild( ball );
        ball.active = true;
        ball.setPosition( pos );
        ball.setColor( color );
        ball.setScale( 1 );
        ball.opacity = 255;
        ball.runAction( cc.sequence( cc.fadeOut( 0.5 ), cc.callFunc( function ( ball ){
            ball.stopAllActions();
            g_PreBallPool.put( ball ); } ) ) );
        ball.runAction( cc.scaleTo( 0.5, 1.5 ) );

        if( dest != null )
        {
            if( g_PreBallPool.size() > 0 )
                ball = g_PreBallPool.get();
            else
                ball = cc.instantiate( PreviewBall );
            node.addChild( ball );
            ball.active = true;
            ball.setPosition( pos );
            ball.setScale( 1 );
            ball.opacity = 255;
            ball.setColor( color );
            ball.runAction( cc.sequence( cc.moveTo( 0.2, this.GetBallPos( dest.x, dest.y ) ), cc.callFunc( function ( ball ){
                ball.stopAllActions();
                g_PreBallPool.put( ball );
            } ) ) );
        }

        for( var i = 0; i < 5; i ++ )
        {
            if( g_PreBallPool.size() > 0 )
                ball = g_PreBallPool.get();
            else
                ball = cc.instantiate( PreviewBall );
            node.addChild( ball );
            ball.active = true;
            ball.setPosition( pos );
            ball.setScale( Math.random() / 2 + 0.1 );
            ball.opacity = 255;
            ball.setColor( color );
            ball.runAction( cc.sequence( cc.jumpBy( Math.random(), Math.random() * 200 - 100, -Math.random() * 200, Math.random() * 100, 1 ), cc.callFunc( function ( selector ){
                selector.stopAllActions();
                g_PreBallPool.put( selector ); } ) ) );
        }

        // TODO: score animation
        g_Score += value;
        var lab;
        if( g_ScorePool.size() > 0 )
            lab = g_ScorePool.get();
        else
            lab = cc.instantiate( ScoreLabel );
        node.addChild( lab );
        lab.getComponent( cc.Label ).string = value;
        lab.setPosition( pos.x, pos.y + 40 );
        lab.opacity = 255;
        lab.runAction( cc.sequence( cc.moveBy( 0.15, 0, 20 ), cc.fadeOut( 0.6 ), cc.callFunc( function ( lab ){
            g_ScorePool.put( lab );
        } ) ) );

        g_values[pt.x][pt.y] = 0;

        ball = this.GetBallNode( pt.x, pt.y );
        if( ball != null )
        {
            ball.stopAllActions();
            g_BallPool.put( ball );
        }
    },

    start () {
        var body = cc.find( "Canvas/bg_body" );
        var self = this;
        body.on(cc.Node.EventType.TOUCH_START, function(event){
            if( !event.getCurrentTarget().active )
                return;
            var localPoint = body.convertTouchToNodeSpaceAR(event.touch);
            self.RefreshPreview( localPoint );
        });
        body.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            if( !event.getCurrentTarget().active )
                return;
            var localPoint =  body.convertTouchToNodeSpaceAR(event.touch);
            self.RefreshPreview( localPoint );
        });
        body.on(cc.Node.EventType.TOUCH_END, function(event){
            if( !event.getCurrentTarget().active )
                return;
            if( g_Running )
            {
                // 播放声音
                cc.audioEngine.play(self.fireAudio, false, audio.SoundVolum);
                var localPoint =  body.convertTouchToNodeSpaceAR(event.touch);
                self.Fire( localPoint );
                
            }
            line0.active = false;
            line1.active = false;
            PreviewBall.active = false;
            g_LastPoint = null;
            g_LastPrePos = null;
            if (isNeedGuid)
            {
                isNeedGuid = false;
                var guidAniNode = cc.find("Canvas/Guid_Layer");
                guidAniNode.active = false;
                guidAniNode.getComponent(cc.Animation).stop();
            }
        });
    },

    GetBallPos( y, x ){
        return cc.p( ((y+offset) & 1) * BALL_RADIUS + ( x * BALL_RADIUS * 2 ) - ( BODY_WIDTH / 2 ), BODY_HEIGHT - BALL_RADIUS - ( BALL_RADIUS * 1.7320508075689 ) * y );
    },

    GetColor( v ){
        return BALL_COLOR[v];
    },

    NewBall( v ){
        var ball = null;
        if( g_BallPool.size() > 0 )
            ball = g_BallPool.get();
        else
            ball = cc.instantiate( ballSprite );
        cc.find( "num", ball ).getComponent( cc.Label ).string = v;
        ball.setColor( this.GetColor(v) );
        ball.opacity = 255;
        return ball;
    },

    RefreshBalls(){
        if( true )
            return;
        var balls = cc.find( "Canvas/bg_body/balls" );
        // balls.removeAllChildren();
        while( balls.getChildren().length > 0 )
        {
            g_BallPool.put( balls.getChildren()[0] );
        }
        for( var i = 0; i < BALL_LAYER + 1; i ++ )
        {
            for( var j = 0; j < BALL_NUM; j ++ )
            {
                var v = g_values[i][j];
                if( v <= 0 )
                    continue;
                var ball = this.NewBall( v );
                ball.setPosition( this.GetBallPos( i, j ) );
                balls.addChild( ball );
            }
        }
    },

    RefreshLines( point ){
        line0.active = true;
        var c = 0;

        if( (point.y / point.x) > ( BODY_HEIGHT / (BODY_WIDTH / 2) ) )
        {
            var b = Math.abs( BODY_HEIGHT * point.x / point.y );
            c = Math.sqrt( BODY_HEIGHT * BODY_HEIGHT + b * b );
        }
        else
        {
            var a = Math.abs( (BODY_WIDTH/2) * point.y / point.x );
            c = Math.sqrt( a * a + (BODY_WIDTH/2) * (BODY_WIDTH/2) );
        }

        line0.width = c / line0.scaleX;
        var Angle = Math.atan( point.y / point.x );
        line0.rotation = -( Angle / 2 / Math.PI * 360 );

//        line0.setPosition( point );
    },

    RefreshPreview( point ){
        g_LastPoint = point;
        var ret = this.GetTrack( point );
        if( ret != null )
        {
            var wheelpos = point.normalize().neg().mul( 60 );
            wheelpos = wheelpos.y > 0 ? wheelpos.neg() : wheelpos;
            g_FireBall.setPosition( wheelpos );
            var dis = ret.p[1].mag() - 20;
            var ang = -ret.p[1].angle( cc.p( 1, 0 ) );
            if( audio.GameModeIndex == 2 )
                dis = 200;
            line0.width = dis / line0.scaleX;
            line0.rotation = ang / 2 / Math.PI * 360;
            line0.active = true;

            if( (ret.p.length > 2) && ( audio.GameModeIndex != 2 ) )
            {
                line1.setPosition( ret.p[2] );
                var v = ret.p[3].sub( ret.p[2] );
                dis = v.mag() - 20;
                line1.width = dis / line1.scaleX;
                ang = -v.angle( cc.p( 1, 0 ) );
                line1.rotation = ang / 2 / Math.PI * 360;
                line1.active = true;
            }
            else
                line1.active = false;

            if( ret.ball != null )
            {
                if( audio.GameModeIndex == 2 )
                    PreviewBall.active = false;
                else if( g_LastPrePos == null || ( !g_LastPrePos.equals( ret.ball ) ) )
                {
                    PreviewBall.active = true;
                    PreviewBall.setPosition( this.GetBallPos( ret.ball.x, ret.ball.y ) );
                    PreviewBall.runAction( cc.scaleTo( 0.2, 1 ) );
                    PreviewBall.opacity = 0;
                    PreviewBall.runAction( cc.spawn( cc.scaleTo( 0.3, 1 ), cc.fadeIn( 0.5 ) ) );
                }
                g_LastPrePos = ret.ball;
            }
            else
            {
                PreviewBall.active = false;
                g_LastPrePos = null;
                g_FireBall.setPosition( 0, 0 );
            }
        }
        else
        {
            g_FireBall.setPosition( 0, 0 );
            line0.active = false;
            line1.active = false;
            PreviewBall.active = false;
            g_LastPrePos = null;
        }
    },

    GetTrack( point ){
        var p0 = cc.p( 0, 0 );
        var p1 = point;
        var res = {};
        res.p = new Array();
        res.ball = null;
        for( var loop = 0; loop < 2; loop ++)
        {
            var ret = this.GetInterBall( p0, p1 );
            if( ret != null )
            {
                var neighbor = this.GetNeighbor( ret.row, ret.col );
                var min = 99999;
                var find = null;
                for( var i in neighbor )
                {
                    if( g_values[neighbor[i].x][neighbor[i].y] != 0 )
                        continue;
                    var check = this.GetBallPos( neighbor[i].x, neighbor[i].y );
                    var dis = check.sub( ret.inter ).magSqr();
                    if( dis < min )
                    {
                        find = cc.p( neighbor[i].x, neighbor[i].y );
                        min = dis;
                    }
                }
    
                res.ball = find;
                res.p.push( p0 );
                res.p.push( ret.inter );
                return res;
            }

            var vs = cc.p( 0, 0 );
            var ip = cc.pLineIntersect( p0, p1, cc.p( -BODY_WIDTH / 2, BODY_HEIGHT ), cc.p( BODY_WIDTH / 2, BODY_HEIGHT ), vs );
            if( ip )
            {
                if( vs.y < 0 )
                {
                    ip = cc.pLineIntersect( p0, p1, cc.p( -BODY_WIDTH / 2, 0 ), cc.p( -BODY_WIDTH / 2, BODY_HEIGHT ), vs );
                    if( !ip )
                        return null;
                    res.p.push( p0 );
                    p0 = cc.p( -BODY_WIDTH / 2, 0 ).addSelf( cc.p( 0, BODY_HEIGHT ).mulSelf( vs.y ) );
                    res.p.push( p0 );
                    p1 = cc.p( BODY_WIDTH / 2, p0.y * 3 );
                }
                else if( vs.y > 1 )
                {
                    ip = cc.pLineIntersect( p0, p1, cc.p( BODY_WIDTH / 2, 0 ), cc.p( BODY_WIDTH / 2, BODY_HEIGHT ), vs );
                    if( !ip )
                        return null;
                    res.p.push( p0 );
                    p0 = cc.p( BODY_WIDTH / 2, 0 ).addSelf( cc.p( 0, BODY_HEIGHT ).mulSelf( vs.y ) );
                    res.p.push( p0 );
                    p1 = cc.p( -BODY_WIDTH / 2, p0.y * 3 );
                }
                else
                {
                    var pa = cc.p( -BODY_WIDTH / 2, BODY_HEIGHT ).addSelf( cc.p( BODY_WIDTH, 0 ).mulSelf( vs.y ) );
                    var devide = ( pa.x + BODY_WIDTH / 2 + ( 1 - offset ) * BALL_RADIUS ) / 2 / BALL_RADIUS;
                    res.p.push( p0 );
                    res.p.push( pa );
                    var fit = Math.max( Math.min( Math.floor(devide), BALL_NUM - 1 ), 0 );
                    if( g_values[0][fit] != 0 )
                    {
                        neighbor = this.GetNeighbor( 0, fit );
                        min = 99999;
                        for( var i in neighbor )
                        {
                            if( g_values[neighbor[i].x][neighbor[i].y] != 0 )
                            continue;
                            check = this.GetBallPos( neighbor[i].x, neighbor[i].y );
                            dis = check.sub( pa ).magSqr();
                            if( dis < min )
                            {
                                find = cc.p( neighbor[i].x, neighbor[i].y );
                                min = dis;
                            }
                        }
                        res.ball = find;
                    }
                    else
                        res.ball = cc.p( 0, fit );
                    return res;
                }
            }
            else
                return null;
        }
        return res;
    },

    GetInterBall( p0, p1 ){
        if( p0.x == p1.x )
            p1.x += 0.00001;
        if( p0.y == p1.y )
            p1.y += 0.00001;
        var min = 999999999999;
        var inter = null;
        var ret = { row:-1, col:-1 };
        for( var i = BALL_LAYER - 1; i >= 0; i -- )
        {
            for( var j = 0; j < BALL_NUM; j ++ )
            {
                if( g_values[i][j] <= 0 )
                    continue;
                var o = this.GetBallPos( i, j );
                
                var a = p1.x - p0.x;
                var b = p1.y - p0.y;

                var c = b / a;
                var d = -c * p0.x + p0.y - o.y;

                var A = 1 + c * c;
                var B = 2 * ( c * d - o.x );
                var C = o.x * o.x + d * d - ( BALL_RADIUS + (( g_values[i+1][j] > 0 ) ? 0 : 15) ) * ( BALL_RADIUS + (g_values[i+1][j] > 0 ? 0 : 15) );

                var delta = B * B - 4 * A * C;
                if( delta < 0 )
                    continue;
                
                var x1 = ( -B + Math.sqrt( delta ) ) / 2 / A;
                var y1 = ( x1 - p0.x ) / a * b + p0.y;

                var x2 = ( -B - Math.sqrt( delta ) ) / 2 / A;
                var y2 = ( x2 - p0.x ) / a * b + p0.y;

                if( y1 < y2 )
                {
                    inter = cc.p( x1, y1 );
                }
                else
                {
                    inter = cc.p( x2, y2 );
                }
                var dis = inter.sub( p0 ).magSqr();
                if( dis <  min )
                {
                    ret.row = i;
                    ret.col = j;
                    ret.inter = inter;
                    min = dis;
                }
            }
            if( ret.row != -1 )
                return ret;
        }
        return null;
    },

    GetNeighbor( y, x ){
        var Raise = ((y+offset) & 1);
        var ret = new Array();
        if( x > 0 )
            ret.push( cc.p( y, x - 1 ) );
        if( x < ( BALL_NUM - 1 ) )
            ret.push( cc.p( y, x + 1 ) );

        if( Raise == 1 )
        {
            if( y > 0 )
            {
                ret.push( cc.p( y - 1, x ) );
                if( x < ( BALL_NUM - 1 ) )
                    ret.push( cc.p( y - 1, x + 1 ) );
            }
            if( y < BALL_LAYER )
            {
                ret.push( cc.p( y + 1, x ) );
                if( x < ( BALL_NUM - 1 ) )
                    ret.push( cc.p( y + 1, x + 1 ) );
            }
        }
        else
        {
            if( y > 0 )
            {
                ret.push( cc.p( y - 1, x ) );
                if( x > 0 )
                    ret.push( cc.p( y - 1, x - 1 ) );
            }
            if( y < BALL_LAYER )
            {
                ret.push( cc.p( y + 1, x ) );
                if( x > 0 )
                    ret.push( cc.p( y + 1, x - 1 ) );
            }
        }
        return ret;
    },

    update (dt) {
        if( !g_Running )
            return;
        if( audio.GameModeIndex != 3 )
            g_Time += dt;

        var a = line0.getComponent(cc.Sprite).spriteFrame;
        var rect = a.getRect();
        rect.x -= dt*200;
        rect.x %= 100;
        if( rect.x < 0 )
            rect.x += 100;
        a.setRect( rect );
        line0.getComponent(cc.Sprite).spriteFrame = a.clone();
        line1.getComponent(cc.Sprite).spriteFrame = a.clone();

        if( g_Time > g_MaxTime )
        {
            if( g_MaxTime > 5 )
                g_MaxTime -= 0.5;
            this.Grow( 1 );
            g_Time = 0;
        }
        //刷新进度条
        this.refreshProgressing();
    },
    // 刷新进度条相关代码
    refreshProgressing:function()
    {
        // 进度条
        var leftPro = cc.find("Canvas/bg_body/Game_ProgressBarLef");
        var righPro = cc.find("Canvas/bg_body/Game_ProgressBarRig");
        var perCent = 1 - g_Time/g_MaxTime;
        leftPro.getComponent(cc.ProgressBar).progress = perCent;
        righPro.getComponent(cc.ProgressBar).progress = perCent;
        if (perCent <= 0.4)
        {
            if (!leftPro.getComponent(cc.Animation).getAnimationState("BarCorlorAni").isPlaying)
            {
                leftPro.getComponent(cc.Animation).play();
                righPro.getComponent(cc.Animation).play();
            }
        }else
        {
            if (leftPro.getComponent(cc.Animation).getAnimationState("BarCorlorAni").isPlaying)
            {
                leftPro.getComponent(cc.Animation).setCurrentTime(0);
                righPro.getComponent(cc.Animation).setCurrentTime(0);
                leftPro.getComponent(cc.Animation).stop();
                righPro.getComponent(cc.Animation).stop();
            }
        }
    },
    // 暂停游戏
    pauseGameFunc:function()
    {
        var body = cc.find( "Canvas/bg_body" );
        body.pauseSystemEvents();
        g_Running = false;
    },
    // 恢复游戏
    resumeGameFunc:function()
    {
        var body = cc.find( "Canvas/bg_body" );
        body.resumeSystemEvents();
        g_Running = true;        
    },
    // 不玩了按钮回调
    GameNoPlayClick:function()
    {
        // 播放声音
        cc.audioEngine.play(this.circleTouchAudio, false, audio.SoundVolum);
        cc.log("GameQuitClick");
        cc.find("Canvas/bg_body").active = false;
        cc.find("Canvas/HallLayer").active = true;
        cc.find("Canvas/Game_QuitBtnLayer").active = false;
        // cc.find("Canvas/HallLayer/Hall_Line").active = false;
        cc.find("Canvas/HallLayer").getComponent("Hall").CreateShareBtn();
       // this.Reset();
        this.pauseGameFunc();
        // 显示子玉节点
        let ziyu = cc.find("Canvas/subMainScript");
        ziyu.active = true;
        // 引导动画节点
        isNeedGuid = false;
        var guidAniNode = cc.find("Canvas/Guid_Layer");
        guidAniNode.active = false;
        guidAniNode.getComponent(cc.Animation).stop();
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 5,
                MAIN_MENU_NUM:true
            });
        }
    },
    GameWrongClickFun:function()
    {
        // 播放声音
        cc.audioEngine.play(this.circleTouchAudio, false, audio.SoundVolum);
        cc.find("Canvas/Game_QuitBtnLayer").active = false;
        this.resumeGameFunc();
    },
    // 退出按钮回调
    GameQuitClick:function()
    {
        // 播放声音
        cc.audioEngine.play(this.ClickAudio, false, audio.SoundVolum);
        cc.find("Canvas/Game_QuitBtnLayer").active = true;
        this.pauseGameFunc();
    },
    // 暂停按钮回调
    GamePauseClick:function()
    {
        cc.log("GamePauseClick");
        this.pauseGameFunc();
        cc.find("Canvas/Game_PauseBtnLayer").active = true;
    },
    setIsShareing:function()
    {
        isShareing = isShareing + 1;
    },
    getIsShareing:function()
    {
        return isShareing;
    }
});
