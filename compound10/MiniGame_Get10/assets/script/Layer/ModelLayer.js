let GameController = require("GameController");
let rule = require("RuleDefine");








cc.Class({
    extends: require("WindowBase"),

    OnLoaded(parm)
    {

    },

    // Onbtn_continue()
    // {
    //     this.CloseSelf();
    // },

    //正常模式
    Onbtn_normal()
    {
        rule.loadGameScene(this,0);
    },

    //闪电模式
    Onbtn_shandian()
    {
        rule.loadGameScene(this,1);
    },

    //限时模式
    Onbtn_time()
    {
        rule.loadGameScene(this,2);
    },
});