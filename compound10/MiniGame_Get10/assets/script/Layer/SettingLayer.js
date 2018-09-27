let Audio = require("Audio");
let rule = require("RuleDefine");


cc.Class({
    extends: require("WindowBase"),

    OnLoaded(parm)
    {
        var isMusic = cc.sys.localStorage.getItem("isMusic");
        if(isMusic == "0")
        {
            this.btn_music.active = false;
            this.btn_musicx.active = true;
        }
        else
        {
            this.btn_musicx.active = false;
            this.btn_music.active = true;
        }


        var isSound = cc.sys.localStorage.getItem("isSound");
        if(isSound == "0")
        {
            this.btn_sound.active = false;
            this.btn_soundx.active = true;
        }
        else
        {
            this.btn_soundx.active = false;
            this.btn_sound.active = true;
        }
    },

    Onbtn_close()
    {
        this.CloseSelf();
    },

    Onbtn_music()
    {
        this.btn_music.active = false;
        this.btn_musicx.active = true;

        //关闭背景音乐
        Audio.closeMusic();
        
    },
    Onbtn_musicx()
    {
        this.btn_musicx.active = false;
        this.btn_music.active = true;

        //打开背景音乐
        Audio.openMusic();
    },

    Onbtn_sound()
    {
        this.btn_sound.active = false;
        this.btn_soundx.active = true;

        //关闭音效
        Audio.closeSound();
    },
    Onbtn_soundx()
    {
        this.btn_soundx.active = false;
        this.btn_sound.active = true;

        //打开音效
        Audio.openSound();
    },

    Onbtn_rule()
    {
        cc.sys.localStorage.removeItem("isNewbGuide");
        rule.loadGameScene(this,0);
    },

    
});