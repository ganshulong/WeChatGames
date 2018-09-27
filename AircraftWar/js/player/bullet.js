import Sprite   from '../base/sprite'
import DataBus  from '../databus'

const BULLET_IMG_SRC = 'images/bullet.png'
const BULLET_DOWN_IMG_SRC = 'images/bullet-down.png'
const BULLET_WIDTH   = 16
const BULLET_HEIGHT  = 30

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

export default class Bullet extends Sprite {
  // constructor({ direction } = { direction: 'up' }) {
  //   super(direction == 'up' ? BULLET_IMG_SRC : BULLET_DOWN_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)
  //   this.direction = direction

    constructor() {
      super(BULLET_IMG_SRC, BULLET_WIDTH, BULLET_HEIGHT)
  }

    SetIsPlayerBullet(bIsPlayerBullet){
      this.bIsPlayerBullet = bIsPlayerBullet
  }

  init(x, y, speed) {
    this.x = x
    this.y = y
    this[__.speed] = speed
    this.visible = true
  }

getVisable(){
  return this.visible
}

  // 每一帧更新子弹位置
  update() {
    if (this.bIsPlayerBullet) {
      this.y -= this[__.speed]
      if (this.y < -this.height)
        databus.removeBullets(this)
    }
    else {
      this.y += this[__.speed]
      // 对象回收
      if (this.y > window.innerHeight + this.height)
        databus.removeBullets(this)
    }
  }
}
