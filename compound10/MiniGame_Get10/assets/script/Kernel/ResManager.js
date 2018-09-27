let ResCache = {};
let loadFinish = false;









module.exports = {
    
    PreLoad()
    {
        cc.loader.loadResDir( "res", cc.SpriteFrame, function( err, assets ){
            // TODO: 保存资源
            for( var key in assets )
            {
                var name = assets[key].name;
                ResCache[name] = assets[key];
            }
        } );

        cc.loader.loadResDir( "prefabs", function( err, assets ){
            // TODO: 保存资源
            for( var key in assets )
            {
                var name = assets[key].name;
                ResCache[name] = assets[key];
            }
        } );
    },

    getResCache()
    {
        return ResCache;
    },
};
