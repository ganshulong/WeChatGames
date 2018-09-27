//index.js贪吃蛇主程序
//获取应用实例
var app = getApp()
//控制蛇头当前移动的位置
var l = 60;
var t = 0;
//蛇头的大小
var w = 10;
var h = 10;

//手指的坐标
var startX = 0;
var startY = 0;
var moveEndX = 0;
var moveEndY = 0;
var X = 0;
var Y = 0;
//蛇头移动的方向
var direction = null;
var snakeDirection = "right";
//窗口的宽度和高度
var windowWidth = 0;
var windowHeight = 0;

//存放身体的位置信息
var snakeBodys = [];

//存放食物的位置信息
var foods = [];

//蛇头对象
var snakeHead = {};

//蛇头长度
var snakeInitLenght = 5;

//是否删除蛇的身体
var removeBodyBol = true;

Page({

  canvasStart: function (e) {
    startX = e.touches[0].x;
    startY = e.touches[0].y;
  },

  canvasMove: function (e) {
    moveEndX = e.touches[0].x;
    moveEndY = e.touches[0].y;
    X = moveEndX - startX;
    Y = moveEndY - startY;

    if (Math.abs(X) > Math.abs(Y)) {
      if (X > 0) {
        direction = "right";
      }
      else if (X < 0) {
        direction = "left";
      }
    }
    else if (Math.abs(Y) > Math.abs(X)) {
      if (Y > 0) {
        direction = "bottom";
      }
      else if (Y < 0) {
        direction = "top";
      }
    }
  },

  clickMeBtn: function () {
    this.setData({ msg: "click you sister" })
  },

  canvasEnd: function (e) {
    switch (direction) {
      case "left":
        if (snakeDirection != "right") {
          snakeDirection = direction;
        }
        break;
      case "right":
        if (snakeDirection != "left") {
          snakeDirection = direction;
        }
        break;
      case "top":
        if (snakeDirection != "bottom") {
          snakeDirection = direction;
        }
        break;
      case "bottom":
        if (snakeDirection != "top") {
          snakeDirection = direction;
        }
        break;
    }
    console.log(snakeDirection);
  },

  onLoad: function () {

    //随机函数
    function rand(min, max) {
      return parseInt(Math.random() * (max - min) + min);
    }
    //碰撞函数
    function collide(obj1, obj2) {

      var l1 = obj1.x;
      var r1 = l1 + obj1.w;
      var t1 = obj1.y;
      var b1 = t1 + obj1.h;

      var l2 = obj2.x;
      var r2 = l2 + obj2.w;
      var t2 = obj2.y;
      var b2 = t2 + obj2.h;

      if (r1 > l2 && l1 < r2 && b1 > t2 && t1 < b2) {
        return true;
      } else {
        return false;
      }
    }

    //食物的构造函数
    function Food() {
      this.x = rand(0, windowWidth - 10);
      this.y = rand(0, windowHeight - 10);
      this.w = 8;
      this.h = 8;
      this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")";
      this.color = "rgb(200,0,0)";
      this.resetPos = function () {
        this.x = rand(0, windowWidth - 10);
        this.y = rand(0, windowHeight - 10);
      }
    }

    //使用wx.createContext获取绘图上下文context
    var context = wx.createContext();

    var frameTime = 0;

    function move() {
      switch (snakeDirection) {
        case "left":
          l -= w;
          break;
        case "right":
          l += w;
          break;
        case "top":
          t -= h;
          break;
        case "bottom":
          t += h;
          break;
      }
    }

    function animate() {
      frameTime++;
      if (frameTime % 60 == 0) {

        //初始化蛇身
        if (0 == snakeBodys.length) {
          for (var i = snakeInitLenght - 1; i > 0; --i) {
            snakeBodys.push({
              x: l - i * w,
              y: t,
              w: w,
              h: h
            });
          };
        }
        //加入当前位置
        snakeBodys.push({
          x: l,
          y: t,
          w: w,
          h: h
        });

        //控制舌头的位置移动
        move();

        //修改蛇头大小 位置
        snakeHead = {
          x: l,
          y: t,
          w: w,
          h: h
        }

        //超出边界检测
        if (0 > l || windowWidth <= l) {
          window.cancelAnimationFrame(animate);
        }
        if (0 > t || windowHeight <= t) {
          window.cancelAnimationFrame(animate);
        }

        //绘制食物
        for (var i = 0; i < foods.length; i++) {
          var food = foods[i];
          context.setFillStyle(food.color);
          context.beginPath();
          context.rect(food.x, food.y, food.w, food.h);
          context.closePath();
          context.fill();

          //食物跟蛇头碰撞检测
          if (collide(food, snakeHead)) {
            console.log('装上了');
            food.resetPos();
            removeBodyBol = false;
          }
        }

        //绘制蛇头
        context.setFillStyle("#ff00ff");
        context.beginPath();
        context.rect(l, t, w, h);
        context.closePath();
        context.fill();

        //如果超过4截身体就删除最老的那一截
        if (snakeBodys.length > snakeInitLenght) {
          if (removeBodyBol) {
            snakeBodys.shift();
          } else {
            removeBodyBol = true;
          }
        }

        //绘制身体
        for (var i = 0; i < snakeBodys.length; i++) {
          var snakeBodyObj = snakeBodys[snakeBodys.length - i - 1];
          context.setFillStyle("#000000");
          context.beginPath();
          context.rect(snakeBodyObj.x, snakeBodyObj.y, snakeBodyObj.w, snakeBodyObj.h);
          context.closePath();
          context.fill();
        }

        wx.drawCanvas({
          canvasId: "firstCanvas",
          actions: context.getActions()
        });
      }

      requestAnimationFrame(animate);
    }
    //获取页面的宽度
    wx.getSystemInfo({
      success: function (res) {

        windowWidth = res.windowWidth;
        windowHeight = res.windowHeight;

        //在页面中随机初始化创建30个食物
        for (var i = 0; i < 30; i++) {
          var foodObj = new Food();
          foods.push(foodObj);
        }
        animate();
      }
    })
  }
})
