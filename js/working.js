// get the dom from dxy

//https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
// var ExternalURL = "https://cors-anywhere.herokuapp.com/https://www.gutenberg.org/files/3600/3600-h/3600-h.htm#chap12"


//getTimelineService
//getAreaStat
//getListByCountryTypeService1
//getListByCountryTypeService2


var dxyurl = "https://cors-anywhere.herokuapp.com/https://ncov.dxy.cn/ncovh5/view/pneumonia"
var getlinks = d3.html(dxyurl, d => {

    console.log(d)

    // turn the dom (d) into a d3 object
    var thedomobj = d3.select(d)

    var dataobj1= thedomobj.select("#getAreaStat")
    console.log(dataobj1.text())

}) // end d3.html
