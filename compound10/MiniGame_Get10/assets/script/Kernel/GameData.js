let Util = require( "Util");
let wechatButton = null;

function _IsWechatGame(){
    return cc.sys.browserType == cc.sys.BROWSER_TYPE_WECHAT_GAME;
}

module.exports = {
    Share( title, imageUrl, query ,successFunc ){
        if( _IsWechatGame() ){
            wx.shareAppMessage( { title:title, imageUrl:imageUrl, query:query ,success:successFunc} )
        }
    },
    // 截图分享
    ShareScreenShot( x, y, width, height, title, query,successFunc ){
        var canvas = cc.game.canvas;
        canvas.toTempFilePath({
            x: x,
            y: y,
            width: width,
            height: height,
            destWidth: width,
            destHeight: height,
            success (res) {
                wx.shareAppMessage({
                    title:title, imageUrl: res.tempFilePath, query:query,success:successFunc
                })
            }
        });
    },
    // 返回电量 1-100
    GetBatteryLevel(){
        return _BatteryLevel;
    },
    // 返回网络类型 "wifi", "2g", "3g", "4g", "unknown", "none"
    GetNetworkType(){
        return _NetworkType;
    },
    createGameClubButton()
    {
        if(_IsWechatGame())
        { 
            if(!wechatButton)
            {
                var systeminfo = wx.getSystemInfoSync();
                wechatButton = wx.createGameClubButton({
                    icon:'green',
                    //type:'image',
                    //image:'res/raw-assets/res/btn_game.png',
                    style: {
                        left: -1,//systeminfo.screenWidth * 0.4,
                        top: systeminfo.screenHeight * 0.5,
                        width: 46,
                        height: 46
                    }
                });
            }
            else
            {
                wechatButton.show();
            }
        }
    },

    hideGameClubButton()
    {
        if(wechatButton)
        {
            wechatButton.hide();
        }
    },  

    // 提交分数
    SubmitScoreFunc(score){
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "rankscore",
                score: score,
            });
        } else {
            cc.log("提交得分:rankscore : " + score)
        }
    },

    IsWechatGame: _IsWechatGame,
};