var productId = 0;
var type = 0;
var excision = 0;
var page = 1;
// 列表数据
var listInfo = {};
var isEnd = false;
// 当前日期
const nowDay = new Date(Common.dateFtt('yyyy-MM-dd', new Date())).getTime();
// 24小时毫秒数
const step = 3600 * 24 * 1000;
// 收益开始日期
var startTime = 0;
// 收益结束日期
var endTime = 0;
// 最大天数
var maxDay = 0;
var list = [];
var totalRow = 0;
var totalPage = 0;
var size = 0;
var currentStart = null;
var keyTime = nowDay;
var requestType = 0;
function createList(data, page, tag) {
    try {
        if (data != null) {
            // 收益开始日期
            startTime = new Date(data.startTime.substring(0, 10)).getTime();
            // 收益结束日期
            endTime = new Date(data.endTime.substring(0, 10)).getTime();
            // 最大天数
            maxDay = (endTime - startTime) / step;
            list = data.list;
            size = data.size;
        }
        if (keyTime > endTime) {
            keyTime = endTime;
        }
        // 当前页开始时间
        currentStart = nowDay - ((page - 1) * size * step);
        // 当前页结束时间
        let currentEnd = currentStart - size * step;
        // 初始化列表
        if (!Object.getOwnPropertyNames(listInfo).length) {
            for (let index = 0; index < maxDay; index++) {
                keyTime = currentStart - (index * step);
                let key = Common.dateFtt('yyyy-MM-dd', new Date(keyTime));
                if (keyTime < startTime || index >= maxDay) {
                    break;
                }
                listInfo[key] = null;
            }
        }
        if (list.length > 0) {
            list.map(function (item, index) {
                let key = item.createDate.substring(0, 10);
                listInfo[key] = item;
            })
        }
        let options = {
            listInfo: listInfo,             //数据列表
            currentStart: currentStart,     //当前页开始时间
            currentEnd: currentEnd,         //当前页结束时间
            startTime: startTime,           //产品收益开始时间
            tag: tag
        };
        createToDomFromList(options);
    } catch (e) {
        console.log(e)
    }
}
function createToDomFromList (data) {
    let content = '';
    mui.each(data.listInfo, function(index, item) {
        let time = new Date(index).getTime();
        if (time <= data.currentStart && time > data.currentEnd) {
            if (time <= data.startTime) {
                isEnd = true;
            }
            let investBtc = Common.moneyFormatByDecimals(0, 8);
            let investHpt = Common.moneyFormat(0);
          if (item != null) {
              investBtc = Common.moneyFormatByDecimals(data.tag == 'BTC' ? item.investBtc : item.investEth, 8);
              investHpt = Common.moneyFormat(item.investHpt);
            }
            let tmpTime = index;
            let tmpText = '<div class="mui-row">' +
                '<div class="mui-col-xs-4"><span class="finan-date">' + tmpTime + '</span></div>' +
                '<div class="mui-col-xs-4">' +
                '<p class="finan-title">'+data.tag+'算力奖励</p>' +
                '<p class="finan-title">HBT算力奖励</p>' +
                '</div>' +
                '<div class="mui-col-xs-4">' +
                '<p class="finan-stats">' + investBtc + data.tag +'</p>' +
                '<p class="finan-stats">' + investHpt + 'HBT</p>' +
                '</div>' +
                '</div>';
            content += '<li class="mui-table-view-cell invest-list" >' +
            tmpText +
            '</li>';
        }
    })
    if ($("#detailed > li.invest-list").length > 0) {
        $("#detailed > li.invest-list:last").after(content);
    } else {
        $("#detailed").prepend(content);
    }
}