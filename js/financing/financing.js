function investIndex() {
	var url = '/app/user/invest/index';
	var defer = $.Deferred();
	Common.muipost(url, {}, function(data) {		// 余额
		$("#money").val(Common.moneyFormat(data.date.money));
		// 累计收益额
		$("#dataNums").text(Common.moneyFormat(data.date.invest.allprofit));
		// ETH收益
		$("#ethprofit").text(Common.moneyFormat(data.date.invest.ethprofit));
		// DIAO收益
		$("#diaoprofit").text(Common.moneyFormat(data.date.invest.diaoprofit));
		// DC收益
		$("#dcprofit").text(Common.moneyFormat(data.date.invest.dcprofit));
		
		// 本轮收益
		$("#lastprofit").text(Common.moneyFormat(data.date.invest.lastprofit));
		// 本轮收益 ETH
		$("#lastethprofit").text(Common.moneyFormat(data.date.invest.lastethprofit));
		// 本轮收益 DIAO
		$("#lastdiaoprofit").text(Common.moneyFormat(data.date.invest.lastdiaoprofit));
		// 本轮收益 DC
		$("#lastdcprofit").text(Common.moneyFormat(data.date.invest.lastdcprofit));
		// 投资说明
		$("#memo").text(data.date.memo);
		// 本轮投资金额
		$("#amount").text(Common.moneyFormat(data.date.invest.amount) + " ETH");
		// 当前投资
		$("#currentInvestment").text(Common.moneyFormat(data.date.invest.amount) + " ETH");
		// 当前累计收益
		$("#currentLastprofit").text(Common.moneyFormat(data.date.invest.lastprofit) + " ETH");
		var repeat = $("#repeat").val();
		var total = Common.moneyFormat(parseFloat(repeat) + parseFloat(data.date.invest.amount));
		$("#investmentTotal").text(total + " ETH");
		if(data.date.invest.state == 1) {
			$("#stop-css").removeClass("stop");
		} else {
			$("#stop-css").addClass("stop");
		}
		
		defer.resolve(data.date);
	});
	return defer.promise();
}

$("#recording").click(function() {
	$.when(investIndex()).done(function(result){
		var responseData = result;
		console.log(result);
		mui.openWindow({
            url: 'financialTz.html',
            id: 'financialTz.html',
            extras: {
                target: responseData
            }
        });
	});
});

// 收益明细
$(document).on('tap', "#income", function(){
	$.when(investIndex()).done(function(result){
		var responseData = result;
		mui.openWindow({
            url: 'financialSy.html',
            id: 'financialSy.html',
            extras: {
                target: responseData
            }
        });
	});
});

mui("#repeat")[0].addEventListener('change', function () {
	var repeat = $("#repeat").val();
	var reg__ = /^(\.\d*)?$/;
	if(reg__.test(repeat)) {
		repeat = 1;
		$("#repeat").val(1);
		mui.toast("输入不合法")
		var currentInvestment = $("#currentInvestment").text();
		var total = Common.moneyFormat(parseFloat(repeat) + parseFloat(currentInvestment));
		$("#investmentTotal").text(total + " ETH");
		return false;
	}
	
	var reg_ =  /^[1-9]?[0-9]*\.[0]*$/;
	if (reg_.test(repeat)) {
		repeat = parseInt(repeat);
	}

	if (parseInt(repeat) <= 0) {
		repeat = 1;
		repeat = 1;
		$("#repeat").val(1);
		mui.toast("只能输入正整数")
		var currentInvestment = $("#currentInvestment").text();
		var total = Common.moneyFormat(parseFloat(repeat) + parseFloat(currentInvestment));
		$("#investmentTotal").text(total + " ETH");
		return false;
	}
	var reg =  /^[1-9]?[0-9]*\.[0-9]*$/;
	if (reg.test(repeat)) {
		repeat = parseInt(repeat);
		$("#repeat").val(repeat);
		mui.toast("只能输入正整数");
	}
	var currentInvestment = $("#currentInvestment").text();
	var total = Common.moneyFormat(parseFloat(repeat) + parseFloat(currentInvestment));
	$("#investmentTotal").text(total + " ETH");
});   
	
// 确定
$("#queding").click(function() {
	var money = $("#money").val();
	var repeat = $("#repeat").val();
	console.log(repeat);
	if (parseFloat(money) < parseFloat(repeat)) {
		mui.toast("复投金额不能大于余额");
		return false;
	}
	var url = "/app/user/invest/invest";
	Common.muipost(url, {'money': repeat}, function(data) {
		console.log(data.content);
		mui.toast("复投成功");
		investIndex();
		flag = true;
        mask.close();
        mui("#popover").popover('hide', document.getElementById("div-add"));
	}, function(data) {
		//
	});
});
