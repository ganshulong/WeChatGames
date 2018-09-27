let audio = require( 'AudiuControl' );
let OpenedList = [1];// 解锁的列表

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
    onLoad () {
        var self = this;
        var funcLis = [this.suit1Click,this.suit2Click,this.suit3Click,this.suit4Click,this.suit5Click,this.suit6Click]
        for(var i = 1;i < 7;i++)
        {
            var nod = self.node.getChildByName("Suit_Select" + i).getChildByName("Suit_Sprite");
            // 注册触摸监听
            nod.on(cc.Node.EventType.TOUCH_END,funcLis[i-1],self);
        }

        this.selectSuit = audio.SuitIndex;// 当前选中的
        this.Selected(this.selectSuit);
    },
    refreshLockState:function()
    {
        var s = cc.sys.localStorage.getItem('userSuitData');
        cc.log("-------- userSuitData ---------");
        cc.log(typeof(s));
        if (s == "" || s == null)
        {
            // 如果没设置 设置一哈初始值
            var day = new Date();
            var infoTemp = {
                isFinishFirstGame:false,
                isFinishSecondLogin:false,
                ShareTimes:0,
                MaxScore:0,
                FirstLoginYear:day.getFullYear(),
                FirstLoginMonth:day.getMonth(),
                FirstLoginDay:day.getDate(),
                Mode1Score:0,
                Mode2Score:0,
                Mode3Score:0
            };
            cc.sys.localStorage.setItem('userSuitData', JSON.stringify(infoTemp));
            return;
        }
        var localinfo = JSON.parse(s);
        cc.log("-------- localinfo ---------");
        cc.log(localinfo);
        var finishSecondLoginTemp = false;
        if (localinfo == null)
        {// 如果没设置 设置一哈初始值
        }else
        {
            if (localinfo.isFinishFirstGame)
            {
                OpenedList.push(2);
            }
            if (localinfo.isFinishSecondLogin)
            {
                OpenedList.push(3);
            }else
            {
                var day = new Date();
                var fyear = localinfo.FirstLoginYear;
                var fMonth = localinfo.FirstLoginMonth;
                var fday = localinfo.FirstLoginDay;
                var nyear = day.getFullYear();
                var nMonth = day.getMonth();
                var nday = day.getDate();
                if (fyear != nyear)
                {
                    finishSecondLoginTemp = true;
                }else if (fMonth != nMonth)
                {
                    finishSecondLoginTemp = true;
                }else if (fday != nday)
                {
                    finishSecondLoginTemp = true;
                }
                if (finishSecondLoginTemp)
                {
                    OpenedList.push(3);
                    localinfo.isFinishSecondLogin = true;
                    cc.sys.localStorage.setItem('userSuitData', JSON.stringify(localinfo));
                }
            }

            if (localinfo.ShareTimes >= 5)
            {
                OpenedList.push(4);
            }
            if (localinfo.MaxScore >= 100000)
            {
                OpenedList.push(5);
            }
            if (localinfo.MaxScore >= 200000)
            {
                OpenedList.push(6);
            }
            
            for (var i = 1;i < 7;i++)
            {
                // 锁
                for (var j = 0;j < OpenedList.length;j++)
                {
                    if (OpenedList[j] == i)
                    {
                        this.node.getChildByName("Suit_Select" + i).getChildByName("Suit_Lock").active = false;
                    }
                }
            }
        }
    },
    start () {
        
    },
    Selected:function(index)
    {
        for (var i = 1;i < 7;i++)
        {
            if (i == index)
            {
                // 播放声音
                cc.audioEngine.play(this.ClickAudio, false, audio.SoundVolum);
                this.node.getChildByName("Suit_Select" + i).getChildByName("Suit_Nike").active = true;
                this.node.getChildByName("Suit_Select" + i).x = 50;
                this.selectSuit = i;
            }else
            {
                this.node.getChildByName("Suit_Select" + i).getChildByName("Suit_Nike").active = false;
                this.node.getChildByName("Suit_Select" + i).x = 0;
            }
        }
    },
    isCanSelect:function(index)
    {
        for (var i = 0;i < OpenedList.length;i++)
        {
            if (OpenedList[i] == index)
            {
                return true;
            }
        }
        return false;
    },
    suit1Click:function()
    {
        if (this.isCanSelect(1))
        {

            this.Selected(1);
        }else
        {
            var unlock = this.node.getChildByName("SuitUnlock_Node");
            unlock.getComponent("SuitUnLockLayer").initWithTag(0);
            unlock.active = true;
        }
    },
    suit2Click:function()
    {
        if (this.isCanSelect(2))
        {

            this.Selected(2);
        }else
        {
            var unlock = this.node.getChildByName("SuitUnlock_Node");
            unlock.getComponent("SuitUnLockLayer").initWithTag(1);
            unlock.active = true;
        }
    },
    suit3Click:function()
    {
        if (this.isCanSelect(3))
        {
            this.Selected(3);
        }else
        {
            var unlock = this.node.getChildByName("SuitUnlock_Node");
            unlock.getComponent("SuitUnLockLayer").initWithTag(2);
            unlock.active = true;
        }
    },
    suit4Click:function()
    {
        if (this.isCanSelect(4))
        {
            this.Selected(4);
        }else
        {
            var unlock = this.node.getChildByName("SuitUnlock_Node");
            unlock.getComponent("SuitUnLockLayer").initWithTag(3);
            unlock.active = true;
        }
    },
    suit5Click:function()
    {
        if (this.isCanSelect(5))
        {
            this.Selected(5);
        }else
        {
            var unlock = this.node.getChildByName("SuitUnlock_Node");
            unlock.getComponent("SuitUnLockLayer").initWithTag(4);
            unlock.active = true;
        }
    },
    suit6Click:function()
    {
        if (this.isCanSelect(6))
        {
            this.Selected(6);
        }else
        {
            var unlock = this.node.getChildByName("SuitUnlock_Node");
            unlock.getComponent("SuitUnLockLayer").initWithTag(5);
            unlock.active = true;
        }
    },
    CheckBtnClick:function()
    {
        // 播放声音
        cc.audioEngine.play(this.circleTouchAudio, false, audio.SoundVolum);
        this.node.active = false;
        audio.SuitIndex = this.selectSuit;
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 5,
                MAIN_MENU_NUM:true
            });
        }
        //测试用 删除
        // cc.sys.localStorage.removeItem("userSuitData");
    }
    // update (dt) {},
});
