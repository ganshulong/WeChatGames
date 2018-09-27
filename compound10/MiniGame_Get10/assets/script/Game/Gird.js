let ResCache = require("ResManager").getResCache();

let UpDis = 10;

cc.Class({
    extends: cc.Component,

    Init(num)
    {
        this.number = 1;
        this.status = 0;   //0 默认状态
        this.pos = {
            x:0,
            y:0
        };




        this.setNumber(num);
    },

    setNumber(num) {
        this.number = num;
        this.updateTexture();
    },
    getNumber()
    {
        return this.number || 1;
    },

    setStatus(sta)
    {
        this.status = sta;
        this.updateTexture();
    },
    getStatus()
    {
        return this.status || 0;
    },

    setInfo(pos,map)
    {
        this.pos = pos;
        this.map = map;
    },

    updateTexture()
    {
        var la = "";
        var posY = 0;
        if(this.status === 1)
        {
            la = "x";
            posY = -11;
        }

        this.node.getComponent(cc.Sprite).spriteFrame = ResCache["" + this.number + la];

        this.node.setAnchorPoint(0,posY/135);
        //this.node.setPositionY(posY);
    },

});
