
// var initData = 'this is first line\nthis is second line'
var extraLine = [];
var count = 10;
Page({
  data: {
    text_test: ++count,
    BackBtn: true,
  },
  clickBackBtn: function (e) {
    var count2=2;
    count+=count2;;
    this.setData({
      text_test: ++count,
    })
  },
})
