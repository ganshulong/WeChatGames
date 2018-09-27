


let _MusicVolume = 0.5;
let _SoundVolume = 0.5;
let _MusicID = null;

let _MusicPath = null;
let _SoundID = null;


function playMusic(strPath)
{
    var isMusic = cc.sys.localStorage.getItem("isMusic");
    if(isMusic == "0")return;
 
    strPath = strPath || "resources/sound/music_game.mp3";
    if( strPath != _MusicPath )
    {
        _MusicPath = strPath;
        if( _MusicID != null )
            cc.audioEngine.stop( _MusicID );
        _MusicID = cc.audioEngine.play( cc.url.raw(strPath), true, _MusicVolume );
    }
    else if( _MusicID != null )
    {
        cc.audioEngine.resume(_MusicID);
    }
}
function playSound( strPath )
{
    var isSound = cc.sys.localStorage.getItem("isSound");
    if(isSound == "0")return;

    // if(_SoundID){
    //     cc.audioEngine.stop( _SoundID );
    // }

    _SoundID = cc.audioEngine.play(cc.url.raw(strPath), false, _SoundVolume);
}

function pauseMusic()
{
    if( _MusicID != null )
    {
        cc.audioEngine.pause(_MusicID);
    }
}


module.exports = {

    preLoad()
    {
        cc.audioEngine.preload("resources/sound/efx_combine_1.mp3");
        cc.audioEngine.preload("resources/sound/efx_combine_2.mp3");
        cc.audioEngine.preload("resources/sound/efx_combine_3.mp3");
        cc.audioEngine.preload("resources/sound/efx_combine_4.mp3");
        cc.audioEngine.preload("resources/sound/efx_combine_5.mp3");
        cc.audioEngine.preload("resources/sound/efx_combine_6.mp3");
        cc.audioEngine.preload("resources/sound/efx_combine_7.mp3");
        cc.audioEngine.preload("resources/sound/efx_combine_8.mp3");
        cc.audioEngine.preload("resources/sound/efx_combine_9.mp3");
        cc.audioEngine.preload("resources/sound/sfx_bean_lv1.mp3");
        cc.audioEngine.preload("resources/sound/sfx_bean_lv2.mp3");
        cc.audioEngine.preload("resources/sound/sfx_bean_lv3.mp3");
        cc.audioEngine.preload("resources/sound/sfx_bean_lv4.mp3");
        cc.audioEngine.preload("resources/sound/sfx_bean_lv5.mp3");
        cc.audioEngine.preload("resources/sound/sfx_bean_lv6.mp3");
        cc.audioEngine.preload("resources/sound/sfx_bean_lv7.mp3");

        cc.audioEngine.preload("resources/sound/sfx_menu_buttonclick.mp3");
    },

    playButtonSound()
    {
        playSound("resources/sound/sfx_menu_buttonclick.mp3");
    },

    openMusic()
    {
        cc.sys.localStorage.setItem("isMusic",1);
        playMusic();
    },
    closeMusic()
    {
        cc.sys.localStorage.setItem("isMusic",0);
        pauseMusic();
    },

    openSound()
    {
        cc.sys.localStorage.setItem("isSound",1);
    },
    closeSound()
    {
        cc.sys.localStorage.setItem("isSound",0);
    },

    playMusic:playMusic,
    playSound:playSound,
    pauseMusic:pauseMusic,
}