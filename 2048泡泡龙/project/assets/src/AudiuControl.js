let SuitBallCorlorLis = [
    { 2:new cc.Color(197,191,183), 4:new cc.Color(175,164,146), 8:new cc.Color(87,223,185), 16:new cc.Color(85,224,139), 32:new cc.Color(65,220,112),
        64:new cc.Color(45,178,83), 128:new cc.Color(250,185,45), 256:new cc.Color(251,142,43), 512:new cc.Color(232,20,46), 1024:new cc.Color(150,40,110), 2048:new cc.Color(104,41,150) },
    { 2:new cc.Color(88,99,115), 4:new cc.Color(68,72,102), 8:new cc.Color(234,116,171), 16:new cc.Color(228,83,151), 32:new cc.Color(244,63,96),
        64:new cc.Color(250,32,80), 128:new cc.Color(56,207,253), 256:new cc.Color(48,151,252), 512:new cc.Color(41,97,203), 1024:new cc.Color(181,115,226), 2048:new cc.Color(114,71,143) },
    { 2:new cc.Color(68,88,83), 4:new cc.Color(46,68,63), 8:new cc.Color(249,134,115), 16:new cc.Color(230,105,81), 32:new cc.Color(230,65,65),
        64:new cc.Color(206,16,28), 128:new cc.Color(84,234,170), 256:new cc.Color(46,193,135), 512:new cc.Color(35,159,110), 1024:new cc.Color(194,149,87), 2048:new cc.Color(152,105,42) },
    { 2:new cc.Color(187,115,124), 4:new cc.Color(200,86,100), 8:new cc.Color(74,192,188), 16:new cc.Color(33,157,153), 32:new cc.Color(27,147,101),
        64:new cc.Color(79,171,98), 128:new cc.Color(246,80,102), 256:new cc.Color(236,50,112), 512:new cc.Color(192,11,124), 1024:new cc.Color(64,51,103), 2048:new cc.Color(40,32,63) },
    { 2:new cc.Color(154,102,160), 4:new cc.Color(146,81,153), 8:new cc.Color(250,198,117), 16:new cc.Color(250,164,116), 32:new cc.Color(249,131,115),
        64:new cc.Color(249,110,115), 128:new cc.Color(120,205,251), 256:new cc.Color(117,145,250), 512:new cc.Color(98,85,234), 1024:new cc.Color(251,109,149), 2048:new cc.Color(193,58,97) },
    { 2:new cc.Color(169,94,152), 4:new cc.Color(137,71,122), 8:new cc.Color(196,143,228), 16:new cc.Color(217,140,231), 32:new cc.Color(245,169,233),
        64:new cc.Color(249,194,241), 128:new cc.Color(142,235,196), 256:new cc.Color(109,189,155), 512:new cc.Color(71,163,145), 1024:new cc.Color(227,215,73), 2048:new cc.Color(243,189,113) },
];
let GameBgCorlorLis = [
    new cc.Color(207,195,183),
    new cc.Color(35,42,53),
    new cc.Color(72,99,95),
    new cc.Color(130,56,66),
    new cc.Color(81,54,84),
    new cc.Color(63,41,58)
];
let GameBackBtnAndScoreColorLis = [
    new cc.Color(142,129,114),
    new cc.Color(74,89,113),
    new cc.Color(43,69,63),
    new cc.Color(103,18,30),
    new cc.Color(160,117,164),
    new cc.Color(124,74,113)
];

module.exports = {
    SoundVolum:1,
    SuitIndex:1,// 皮肤标记
    GameModeIndex:1,//1、标准 2、大师 3、无尽
    getCurrentBallColor:function(tag)
    {
        return SuitBallCorlorLis[tag-1];
    },
    getCurrentGameBgCorlor:function(tag)
    {
        return GameBgCorlorLis[tag-1];
    },
    getGameBackBtnAndScoreColor:function(tag)
    {
        return GameBackBtnAndScoreColorLis[tag-1];
    }
};
