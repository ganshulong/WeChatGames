//index.js
//获取应用实例
var app = getApp()

Page({
    rowNum: 10,
    colNum: 8,
    mineNum: 5,

    openBlockNum: 0,
    time: 0,
    showMap: {},
    dataMap: {},
    timeInterval: null,
    bIsGameEnd: false,
    bIsOpenFlag: false,
    checkAroundArray: [],

    onLoad: function () {
        this.openBlockNum = 0;
        this.time = 0;
        this.bIsGameEnd = false;
        this.bIsOpenFlag = false,
        this.setData({
            mineNum: this.mineNum,
            time: this.time,
        });
        this.initMap();
        this.startTimekeeping();
    },
    initMap() {
        this.showMap=[]
        this.dataMap=[]
        for (let r = 0; r < this.rowNum; ++r) {
            this.showMap[r] = []
            this.dataMap[r] = []
            for (let c = 0; c < this.colNum; ++c) {
                this.showMap[r][c] = -1;
                this.dataMap[r][c] = 0;
            }
        }
        this.setData({
            showMap: this.showMap
        })

        let tempMineNum = this.mineNum
        while (0 < tempMineNum) {
            let randPosR = Math.floor(Math.random() * this.rowNum)
            let randPosC = Math.floor(Math.random() * this.colNum)
            if (9 != this.dataMap[randPosR][randPosC]) {
                this.dataMap[randPosR][randPosC] = 9
                --tempMineNum
            }
        }
        for (var row = 0; row < this.rowNum; ++row) {
            for (var col = 0; col < this.colNum; ++col) {
                if (this.dataMap[row][col] == 9) {
                    for (var r = row - 1; r < row + 2; ++r) {
                        for (var c = col - 1; c < col + 2; ++c) {
                            if (0 <= r && r < this.rowNum &&
                                0 <= c && c < this.colNum &&
                                !(r === row && c === col) &&
                                9 != this.dataMap[r][c]) {
                                ++this.dataMap[r][c];
                            }
                        }
                    }
                }
            }
        }
    },
    startTimekeeping() {
        let tempThis = this
        this.timeInterval = setInterval(function () {
            tempThis.setData({
                time: ++tempThis.time,
            })
        }, 1000);
    },
    stopTimekeeping() {
        clearInterval(this.timeInterval);
    },
    clickBlock: function (event) {
        if (this.bIsGameEnd) {
            return
        }
        let r = parseInt(event.target.dataset.x)
        let c = parseInt(event.target.dataset.y)
        if (this.bIsOpenFlag) {
            if (10 == this.showMap[r][c]) {
                this.showMap[r][c] = -1;
                this.setData({
                    showMap: this.showMap,
                })
                return
            } else if(-1 == this.showMap[r][c]) {
                this.showMap[r][c] = 10;
                this.setData({
                    showMap: this.showMap,
                })
                return
            }
        }
        if (9 === this.dataMap[r][c]) {
            this.gameEnd(false)
        } else if(-1 == this.showMap[r][c] || 10 == this.showMap[r][c]){
            this.showMap[r][c] = this.dataMap[r][c];
            ++this.openBlockNum;
            if (0 == this.dataMap[r][c]) {
                this.checkAround(r, c)
            }
            this.setData({
                showMap: this.showMap,
                openBlockNum: this.openBlockNum
            })
            if (this.openBlockNum+this.mineNum==this.rowNum*this.colNum) {
                this.gameEnd(true);
            }
        }
    },
    checkAround(r, c) {
        this.checkAroundArray = []
        this.checkAroundArray[this.checkAroundArray.length] = { row: r, col: c };
        let index = 0;
        while (index < this.checkAroundArray.length) {
            let r = this.checkAroundArray[index].row;
            let c = this.checkAroundArray[index].col;
            let upR = r-1;
            let downR = r+1;
            let leftC = c-1;
            let rightC = c+1;
            if (0 <= upR && 0 == this.dataMap[upR][c] && this.checKIsNew(upR, c)) {   //up
                this.checkAroundArray[this.checkAroundArray.length] = { row: upR, col: c };
                this.showMap[upR][c] = this.dataMap[upR][c];
                ++this.openBlockNum;
            }
            if (this.rowNum > downR && 0 == this.dataMap[downR][c] && this.checKIsNew(downR, c)) {   //up
                this.checkAroundArray[this.checkAroundArray.length] = { row: downR, col: c };
                this.showMap[downR][c] = this.dataMap[downR][c];
                ++this.openBlockNum;
            }
            if (0 <= leftC && 0 == this.dataMap[r][leftC] && this.checKIsNew(r, leftC)) {   //up
                this.checkAroundArray[this.checkAroundArray.length] = { row: r, col: leftC };
                this.showMap[r][leftC] = this.dataMap[r][leftC];
                ++this.openBlockNum;
            }
            if (this.colNum > rightC && 0 == this.dataMap[r][rightC] && this.checKIsNew(r, rightC)) {   //up
                this.checkAroundArray[this.checkAroundArray.length] = { row: r, col: rightC };
                this.showMap[r][rightC] = this.dataMap[r][rightC];
                ++this.openBlockNum;
            }
            ++index;
        }
    },
    checKIsNew(r, c) {
        for (let i = 0; i < this.checkAroundArray.length; i++) {
            if (this.checkAroundArray[i].row == r && this.checkAroundArray[i].col == c) {
                return false
            }
        }
        return true
    },
    gameEnd(bisSuccess) {
        if (bisSuccess) {
            wx.showToast({
                title: 'Game Success!',
                duration: 100000,
            }) 
        } else {
            wx.showToast({
                title: 'Game Failed!',
                duration: 100000,
            })
        }
        this.bIsGameEnd = true;
        this.stopTimekeeping();
        this.showFullMap();
    },
    showFullMap() {
        this.showMap = this.dataMap;
        this.setData({
            showMap: this.showMap
        })
    },
    restart: function () {
        this.onLoad();
    },
    setFlagSwitch: function (event) {
        this.bIsOpenFlag = event.detail.value;
    },
});
   