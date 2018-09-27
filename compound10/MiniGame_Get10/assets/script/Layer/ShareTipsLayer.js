let rule = require("RuleDefine");
let GData = require("GameData");








cc.Class({
    extends: require("WindowBase"),

    OnLoaded(parm)
    {

    },

    update(dt)
    {
        if(rule.getShareLeftTime() <= 0)
        {
            this.CloseSelf();
        }
    },

    Onbtn_share()
    {
        GData.Share("单手合十，点击进入","http://p9l3k4x4g.bkt.clouddn.com/lADPBbCc1hviItfNAYDNAeA_480_384.jpg_620x10000q90g.jpg",null,function(){
            rule.setCanStart(true);
        });
    },
});