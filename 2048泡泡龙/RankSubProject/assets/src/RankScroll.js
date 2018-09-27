
cc.Class({
    extends: cc.Component,

    properties: {
        rankingScrollView: cc.ScrollView,
        scrollViewContent: cc.Node,
    },

   
    onLoad () {},

    start () {
        let self = this;
        self.removeChild();
        if (CC_WECHATGAME) {
            window.wx.onMessage(data => {
                cc.log("接收主域发来消息：", data)
                if (data.messageType == 0) {//移除排行榜
                    self.removeChild();
                } else if (data.messageType == 1) {//获取好友排行榜
                    self.fetchFriendData(data.MAIN_MENU_NUM);
                } else if (data.messageType == 3) {//提交得分
                    self.submitScore(data.MAIN_MENU_NUM, data.score);
                } else if (data.messageType == 4) {//显示排行
                    self.showRank(data.MAIN_MENU_NUM);
                }else if (data.messageType == 5) {//显示皇冠
                    self.showKingSp(data.MAIN_MENU_NUM);
                }else if (data.messageType == 6) {//隐藏所有
                    self.hidAll();
                }
                
            });
        }
    },
    showRank:function(ac)
    {
        this.node.getChildByName("RankItem_Tips").active = ac;
        this.node.getChildByName("MainPlayerItem").active = ac;
        this.node.getChildByName("RankScrollView").active = ac;
        
    },
    showKingSp:function(ac)
    {
        this.node.getChildByName("KinLine").active = ac;
    },
    hidAll:function()
    {
        this.node.getChildByName("RankItem_Tips").active = false;
        this.node.getChildByName("MainPlayerItem").active = false;
        this.node.getChildByName("RankScrollView").active = false;
        this.node.getChildByName("KinLine").active = false;
    },
    removeChild() {
        //this.node.removeChildByTag(1000);
        this.node.getChildByName("MainPlayerItem").active = false;
        this.rankingScrollView.node.active = false;
        this.scrollViewContent.removeAllChildren();
    },
    // 得到好友排行榜数据
    fetchFriendData(MAIN_MENU_NUM) {
        let self = this;
        this.removeChild();
        this.rankingScrollView.node.active = true;
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],// 获取当前用户信息 就用 selfOpenId
                success: (userRes) => {// 如果获取当前玩家信息成功
                    console.log('success userRes.data ', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            console.log("wx.getFriendCloudStorage success", res);
                            let data = res.data;
                            // 大小排序
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            let itemHeight = self.node.getChildByName("PlayerItemTemp").height;
                            let itemCount = data.length;
                            // if (itemCount > 6)
                            // {
                            //     itemCount = 6;
                            // }
                            let scrolMaxHeight = self.scrollViewContent.getContentSize().height;
                            let nowTotalHeight = itemCount*(itemHeight + 10);
                            if (nowTotalHeight > scrolMaxHeight)
                            {
                                scrolMaxHeight = nowTotalHeight;
                            }
                            self.scrollViewContent.height = scrolMaxHeight;
                            // 遍历所有好友玩家
                            for (let i = 0; i < itemCount; i++) {
                                var playerInfo = data[i];
                                var item = cc.instantiate(self.node.getChildByName("PlayerItemTemp"));
                                item.active = true;
                                if (i == 0)
                                {
                                    item.y = -itemHeight/2;
                                }else
                                {
                                    item.y = -itemHeight/2 -(itemHeight + 10)*i;
                                }
                                item.getComponent('RankItem').init(i, playerInfo);
                                self.scrollViewContent.addChild(item);
                                // 如果是自己 添加到上部分的自己的节点上去
                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    let userItem = self.node.getChildByName("MainPlayerItem");
                                    userItem.active = true;
                                    userItem.getComponent('RankItem').init(i, playerInfo);
                                }
                            }
                            // for (let i = 0; i < data.length; i++) {
                            //     var playerInfo = data[i];
                                
                            // }
                            
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                        },
                    });
                },
                fail: res => {
                    console.log("wx.getUserInfo fail", res);
                },
            });
        }
    },
    submitScore(MAIN_MENU_NUM, score)
    {
        if (CC_WECHATGAME) {
            window.wx.getUserCloudStorage({
                // 以key/value形式存储
                keyList: [MAIN_MENU_NUM],
                success: function (getres) {
                    console.log('getUserCloudStorage', 'success', getres)
                    if (getres.KVDataList.length != 0) {
                        // 判断是否大过
                        if (getres.KVDataList[0].value > score) {
                            cc.find("Canvas/KinLine/MaxScoreLab").getComponent(cc.Label).string = getres.KVDataList[0].value;
                            console.log('AAAAAAAAAAAAAAAAAAAAAAAAA', getres.KVDataList[0].value)
                            return;
                        }
                    }
                    // 对用户托管数据进行写数据操作
                    window.wx.setUserCloudStorage({
                        KVDataList: [{key: MAIN_MENU_NUM, value: "" + score}],
                        success: function (res) {
                            cc.find("Canvas/KinLine/MaxScoreLab").getComponent(cc.Label).string = score.toString();
                            console.log('setUserCloudStorage', 'success', res)
                        },
                        fail: function (res) {
                            console.log('setUserCloudStorage', 'fail')
                        },
                        complete: function (res) {
                            console.log('setUserCloudStorage', 'ok')
                        }
                    });
                },
                fail: function (res) {
                    console.log('getUserCloudStorage', 'fail')
                },
                complete: function (res) {
                    console.log('getUserCloudStorage', 'ok')
                }
            });
        }
    },
    // update (dt) {},
});
