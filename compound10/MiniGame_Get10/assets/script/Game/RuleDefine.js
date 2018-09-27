let GameController = null;
let timerFlag = null;
let shareLeftTime = 0;
let interval = 1;
let waitTime = 15;


module.exports = {
    NewGirdsRule: {
        [4]:    [0.4,   0.4,    0.2],
        [5]:    [0.3,   0.4,    0.3],
        [6]:    [0.25,  0.3,    0.35,   0.1],
        [7]:    [0.25,  0.25,   0.25,   0.15,   0.1],
        [8]:    [0.2,   0.25,   0.25,   0.15,   0.15],
        [9]:    [0.15,  0.15,   0.2,    0.25,   0.15,   0.1],
        [10]:   [0.1,   0.15,   0.2,    0.25,   0.15,   0.15],
        [11]:   [0.05,  0.1,    0.15,   0.3,    0.1,    0.2,    0.1],
        [12]:   [0.05,  0.05,   0.15,   0.3,    0.2,    0.2,    0.1],
        [13]:   [0,     0,      0.15,   0.2,    0.3,    0.15,   0.1,    0.1],
        [14]:   [0,     0,      0.15,   0.2,    0.3,    0.15,   0.1,    0.1],
    },

    NewbGuide:{
        [4]:[1,2,3,2,3,],
        [3]:[1,1,2,3,3,],
        [2]:[2,2,1,1,2,],
        [1]:[2,1,3,1,2,],
        [0]:[1,1,2,3,4,],
    },

    setGameController(ctr)
    {
        GameController = ctr;
    },

    getShareLeftTime()
    {
        return shareLeftTime;
    },

    setCanStart(isCan)
    {
        if(isCan)
        {
            if(timerFlag)
            {
                clearInterval(timerFlag);
                timerFlag = null;
            }
            shareLeftTime = 0;
        }
        else
        {
            if(shareLeftTime <= 0)
            {
                shareLeftTime = waitTime;
                timerFlag = setInterval(function(){
                    shareLeftTime -= interval;
                    if(shareLeftTime <= 0)
                    {
                        shareLeftTime = 0;             
                        if(timerFlag)
                        {
                            clearInterval(timerFlag);
                            timerFlag = null;
                        }
                    }
                },interval * 1000);       //单位毫秒
            }
        }
           
    },

    loadGameScene(window,model)
    {
        // if(shareLeftTime && window)
        // {
        //     window.OpenWindow("layer/shareTips_layer");
        //     return;
        // }
        if(typeof model === "number")
        {
            GameController.setGameModel(model);
        }
        cc.director.loadScene("GameScene");
    },
};