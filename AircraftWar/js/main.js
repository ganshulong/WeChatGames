import Player from './player/index'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'

let ctx = canvas.getContext('2d')
let databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0
    
    this.restart()
  }

  restart() {
    databus.reset()

    //移除 重新对 开始按钮 的碰触监听
    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    //从pool中获取item
    let enemy = databus.pool.getItemByClass('enemy', Enemy)
    //初始化iten
    enemy.init(5)
    //将item push 进容器
    databus.enemys.push(enemy)
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this
    //遍历所有子弹 
    databus.bullets.forEach((bullet) => {
      if (bullet.bIsPlayerBullet)
      {
        //玩家子弹 遍历所有敌机
        for (let i = 0, il = databus.enemys.length; i < il; i++) {
          let enemy = databus.enemys[i]

          //判断敌机是否碰撞玩家子弹
          if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
            // 定义在那：enemy (extends Animation)含有playAnimation（）
            enemy.playAnimation()
            that.music.playExplosion()

            bullet.visible = false
            databus.score += 10
            if (this.player.getBulletCount() < databus.score / 100) {
              this.player.setBulletCount(this.player.getBulletCount() + 1)
            }
            break
          }
        }
      }
      else
      {
        //敌机子弹是否碰撞玩家
        if (this.player.isCollideWith(bullet)) {
          this.visible = false
          databus.gameOver = true
          return
        }
      }
    })

    //遍历所有敌机
    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]
      //判断玩家是否碰撞到敌机
      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true

        break
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY)
      this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    //清空屏幕
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //重绘背景
    this.bg.render(ctx)

    //重绘所有子弹
    databus.bullets
      .concat(databus.enemys)//？？？？？？？？？？
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })
    
    //重绘玩家
    this.player.drawToCanvas(ctx)

    //播放动画
    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    //重绘积分
    this.gameinfo.renderGameScore(ctx, databus.score)

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      //绘制结束界面
      this.gameinfo.renderGameOver(ctx, databus.score)

      //重开 重新 开始按钮 的碰触监听
      if (!this.hasEventBind) {
        this.hasEventBind = true
        //绑定 重新开始按钮 碰触监听
        this.touchHandler = this.touchEventHandler.bind(this)
        //将监听加入canvas
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
    //判断是否结束
    if (databus.gameOver)
      return;

    //更新背景
    this.bg.update()

    //更新子弹
    console.warn(databus.pool.getItemNum('bullet')+"     "+databus.bullets.length)
    
    databus.bullets
      .forEach((item) => {
        item.update()
      })

    //更新敌机
    databus.enemys
      .forEach((item) => {
        item.update()
        if (databus.frame % 60 === 0) {
          item.shoot()
        }
      })

    //产生敌人
    if (databus.frame % 30 === 0) {
      this.enemyGenerate()
    }

    //碰撞检测
    this.collisionDetection()

    //玩家自动射击 每20帧一次
    if (databus.frame % 20 === 0) {
      this.player.shoot()
      this.music.playShoot()
    }
  }

  // 实现游戏帧循环
  loop() {
    ++databus.frame

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
