//index.js
//获取应用实例
var app = getApp()

Page({

  data: {
    mineMap: {},
    timesGo: 0,
    minesLeft: 0,
    message:"msgtext1",
    array:[0,1,2],
    view:"c",
    staffA: { firstName: 'Hulk', lastName: 'Hu' },
    staffB: { firstName: 'shang', lastName: 'you' },
    staffC: { firstName: 'gideon', lastName: 'lin' },
    count:1,
    id: 2,
    bIsOK:false,
    x: 10,
    y: 20,
    hidden: false,
    a: 1,
    b: 2,
    c: 3,
    testStr:"12345",
    testObject1:{
      name1:'gsl1',
      age1:24,
    }, 
    testObject2: {
      name2: 'gsl2',
      age2: 25,
    },
    objectItem1: {
      name: 'gsl-1',
      age: 25,
    },
    objectItem2: {
      name: 'gsl-2',
      age: 25,
    },
    objectItem3: {
      name: 'gsl-3',
      age22: 25,
    },
    objectArray: [
      { id: 5, unique: 'unique_5' },
      { id: 4, unique: 'unique_4' },
      { id: 3, unique: 'unique_3' },
      { id: 2, unique: 'unique_2' },
      { id: 1, unique: 'unique_1' },
      { id: 0, unique: 'unique_0' },
    ],
    numberArray: [0, 1, 2, 3],

    msgArray:[
      {
        index: 0,
        msg: 'this is a message',
        time: '2016-09-15',
      },
      {
        index: 1,
        msg: 'this is a message',
        time: '2016-09-15',
      },
    ],
  },
tapName:function(event)
{
  console.log(event);
},
  randSwitch()
  {
    const length = this.data.objectArray.length
    for (let i = 0; i < length;++i)
    {
      let randValue = Math.floor(Math.random() * length)
      const tempItem = this.data.objectArray[i]
      this.data.objectArray[i] = this.data.objectArray[randValue]
      this.data.objectArray[randValue] = tempItem
    }
    this.data.objectArray = this.data.objectArray.concat([{ id: length, unique: 'unique_0' + length}])
    

    this.data.numberArray = this.data.numberArray.concat([this.data.numberArray.length+1 ])
    this.setData({
      objectArray: this.data.objectArray,
      numberArray: this.data.numberArray,
    })
  },
  addToFront: function (e) {
    const length = this.data.objectArray.length
    this.data.objectArray = [{ id: length, unique: 'unique_' + length }].concat(this.data.objectArray)
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addNumberToFront: function (e) {
    this.data.numberArray = [this.data.numberArray.length + 1].concat(this.data.numberArray)
    this.setData({
      numberArray: this.data.numberArray
    })
  },
  add(){
    this.setData({
      count: this.data.count + 1,
    })
  },

    mineMap: {},
    mineMapMapping: {},
    rowCount: 10,
    colCount: 8,
    mineCount: 10,
    minMineCount: 10,
    maxMineCount: 20,
    minesLeft: 0,
    timesGo: 0,
    timeInterval: null,
    flagOn: false,
    flags: 0,
    endOfTheGame: false,
    safeMinesGo: 0,

    onLoad: function() {

        this.setData({
            minesLeft: 0,
            timesGo: 0
        });
        this.drawMineField();
    },

    setGame: function() {

        this.drawMineField();
        this.createMinesMap();
        this.setMinesLeft();
        this.timeGoReset();
        this.timeGoClock();
        this.endOfTheGame = false;
        this.safeMinesGo = 0;
    },

    setMinesLeft: function() {
        this.minesLeft = this.mineCount;
        this.setData({minesLeft: this.minesLeft});
    },

    timeGoClock: function() {
        var self = this;
        this.timeInterval = setInterval(function () {
            // console.log(self.data.timesGo);
            self.timesGo = self.timesGo + 1;
            self.setData({timesGo: self.timesGo});
            
        }, 1000);
    },

    timeGoStop: function() {
    
        clearInterval(this.timeInterval);
    },

    timeGoReset: function() {
        clearInterval(this.timeInterval);
        this.timesGo = 0;
        this.setData({timesGo: this.timesGo});
    },

    createMinesMap: function() {

        var tmpMineMap = {};
        // initalize mine map with 0.
        for (var row = 0; row < this.rowCount; row++) {

            tmpMineMap[row] = [];
            for (var col = 0; col < this.colCount; col++) {

                tmpMineMap[row][col] = 0;
            }
        }
         //console.log(tmpMineMap);
        
        // laying mines with 9
        this.mineCount = this.rangeRandom(this.minMineCount, this.maxMineCount);

        var tmpCount = this.mineCount;
        //console.log("Mine count: ", tmpCount);
        while (tmpCount > 0) {

            var row = this.rangeRandom(0, this.rowCount - 1);
            var col = this.rangeRandom(0, this.colCount - 1);

            if (tmpMineMap[row][col] != 9) {

                tmpMineMap[row][col] = 9;
                tmpCount--;
            }
        }

        let dateTemp = new Date();
        let starTime = dateTemp.getMilliseconds() + dateTemp.getSeconds()*1000; 

        for (var row = 0; row < this.rowCount; row++) {
          for (var col = 0; col < this.colCount; col++) {
            if (tmpMineMap[row][col] == 9) {
              for (var r = row - 1; r < row + 2; r++) {
                for (var c = col - 1; c < col + 2; c++) {
                  if (c >= 0 && c < this.colCount &&
                    r >= 0 && r < this.rowCount &&
                    !(r === row && c === col) &&
                    tmpMineMap[r][c] != 9) {
                    tmpMineMap[r][c]++;
                  }
                }
              }
            }
          }
        }

        this.mineMapMapping = tmpMineMap;
        
        let dateTemp2 = new Date();
        let endTime = dateTemp2.getMilliseconds() + dateTemp2.getSeconds() * 1000; 
        
        let elapsedTime = endTime - starTime;
        console.log("test elapsedTime:" + elapsedTime+" /1000");
    },

    drawMineField: function() {

        var tmpMineMap = {};
        for (var row = 0; row < this.rowCount; row++) {

            tmpMineMap[row] = [];
            for (var col = 0; col < this.colCount; col++) {

                tmpMineMap[row][col] = -1;
            }
        }
        this.mineMap = tmpMineMap;
        //console.log(this.mineMap);

        this.setData({
            mineMap: this.mineMap 
        })

    },

    demining: function(event) {

        if (JSON.stringify(this.mineMapMapping) == "{}") return;


        var x = parseInt(event.target.dataset.x);
        var y = parseInt(event.target.dataset.y);
        var value = parseInt(event.target.dataset.value);
        //console.log("value:" + value +" x:"+x +" y:"+y);

        //flag this field as mine.
        if (this.flagOn) {

            this.flag(x, y, value);
            return;
        }

        // if field has been opened, return.
        if (value > 0) return;
        
        var valueMapping = this.mineMapMapping[x][y];
        //console.log(this.mineMapMapping);
        //console.log(valueMapping);

        if (valueMapping < 9) {
            this.mineMap[x][y] = valueMapping;
            this.setData({mineMap: this.mineMap});
            this.safeMinesGo++;
            console.log("Safe mine go: " + this.safeMinesGo);
            if ((this.safeMinesGo + this.mineCount) == (this.rowCount * this.colCount)) {
                this.success();
            }
        }

        // When digg the mine.
        if (valueMapping == 9) {
            this.failed();
        }

        // Open the fields with 0 mines arround.
        if (valueMapping == 0) {

            this.openZeroArround(x, y);
            this.setData({mineMap:this.mineMap});
        }
    },

    success: function() {

        wx.showToast({
            title: 'GOOD!',
            duration: 3000
        })
        this.timeGoStop();
        this.endOfTheGame = true;
    },

    failed: function() {
        wx.showToast({
            title: 'SORRY!',
            duration: 3000
        })

        this.showAll();
        this.timeGoStop();
        this.endOfTheGame = true;
    },

    // Open the fields arround 0 field recursively.
    openZeroArround: function(row, col) {
        //console.log("click" + row + " " + col)
        for (var r = (row-1); r < (row+2); r++) {
            for (var c = (col-1); c < (col+2); c++) {
                //console.log("go: r"+r+":c"+c);
                if (r >= 0 && r < this.rowCount
                    && c >= 0 && c < this.colCount
                && !(r === row && c === col) 
                && this.mineMap[r][c] < 0) {

                    this.mineMap[r][c] = this.mineMapMapping[r][c];
                    this.safeMinesGo++;

                    if (this.mineMapMapping[r][c] == 0) {
                        this.openZeroArround(r, c);
                    }

                }
            }
        }
        console.log("Safe mine go: " + this.safeMinesGo);
        if ((this.safeMinesGo + this.mineCount) == (this.rowCount * this.colCount)) {
            this.success();
        }

    },

    flagSwitch: function(e) {

        if (e.detail.value) {

            this.flagOn = true;
        } else {

            this.flagOn = false;
        }
    },

    flag: function(x, y, value) {

        if (value > 0 && value < 10) return;

        // if flaged already, set the original state.
        if (value == 10) {

            this.pullUpFlag(x, y);
            return;
        }

        if (this.minesLeft <= 0) return;

        this.minesLeft = this.minesLeft - 1;
        this.mineMap[x][y] = 10;

        this.setData({mineMap: this.mineMap, minesLeft: this.minesLeft});
    },

    pullUpFlag: function(x, y) {

        if (this.minesLeft < this.mineCount) {
            this.minesLeft = this.minesLeft + 1;
        }
        this.mineMap[x][y] = -1;
        this.setData({mineMap: this.mineMap, minesLeft: this.minesLeft});
    },

    rangeRandom: function(x, y) {
        var z = y - x + 1;
        return Math.floor(Math.random() * z + x);
    }, 

    showAll: function() {
        this.mineMap = this.mineMapMapping;
        this.setData({mineMap: this.mineMap});
    }

});



