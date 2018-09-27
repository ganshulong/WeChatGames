let rule = require("RuleDefine");









cc.Class({
    extends: require("WindowBase"),

    OnLoaded(parm)
    {

    },

    Onbtn_continue()
    {
        this.CloseSelf();
    },
    Onbtn_backMain()
    {
        cc.director.loadScene("MainScene");
    },
    Onbtn_restart()
    {
        rule.loadGameScene(this);
    }
});