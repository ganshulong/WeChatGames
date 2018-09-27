
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start () {

    },

    init:function(rank,data)
    {
        let self = this;
        let avatarUrl = data.avatarUrl;
        let nick = data.nickname;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;

        this.node.getChildByName("RankItem_No1").active = false;
        this.node.getChildByName("RankItem_No2").active = false;
        this.node.getChildByName("RankItem_No3").active = false;
        if (rank < 3)
        {
            self.node.getChildByName("RankItem_NoTxt").active = false;
            //self.node.getChildByName("RankItem_NoSp").active = false;
        }
        if (rank == 0) {
            this.node.getChildByName("RankItem_No1").active = true;
        } else if (rank == 1) {
            this.node.getChildByName("RankItem_No2").active = true;
        } else if (rank == 2) {
            this.node.getChildByName("RankItem_No3").active = true;
        }
        // 设置相关数据
        self.node.getChildByName("RankItem_NoTxt").getComponent(cc.Label).string = "NO." + (rank + 1).toString();
        self.node.getChildByName("RankItem_Name").getComponent(cc.Label).string = nick;
        self.node.getChildByName("RankItem_Score").getComponent(cc.Label).string = grade.toString();
        self.createImage(avatarUrl);
    },
    createImage(avatarUrl) {
        let self = this;
        let avatarImgSprite = self.node.getChildByName("RankItem_HeadSp").getComponent(cc.Sprite);
        if (CC_WECHATGAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        cc.log(e);
                    }
                };
                image.src = avatarUrl;
            }catch (e) {
                cc.log(e);
            }
        }
    },
    // update (dt) {},
});
