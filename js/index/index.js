// 轮播图
function adversite() {
	url = '/app/common/adversite';
	Common.muipost(url, {'code': 1001}, function(data) {
		if (data.date != '') {
			var content = '<div class="mui-slider-item mui-slider-item-duplicate">' + 
								'<a href="javascript:void(0);" data-linkurl="' + data.date[data.date.length - 1].linkurl + '" data-title="' + data.date[data.date.length - 1].title + '" onclick="openImg(this)">' + 
									'<img src="' + data.date[data.date.length - 1].picurl + '" style="padding: 0 3px;margin-left:4.2%;border-radius: 8px!important;" height="100%" onerror="this.src=\'images/zhanweifu.jpg\'">' +
								'</a>' + 
							'</div>';
			var indicator = '<div class="mui-indicator mui-active"></div>';
			// 样式
			var adversite_indicator = "";
			mui.each(data.date, function(index, item) {
				content += '<div class="mui-slider-item">' + 
								'<a href="javascript:void(0);" data-linkurl="' + item.linkurl + '" data-title="' + item.title + '" onclick="openImg(this)">' + 
									'<img src="' + item.picurl + '" style="padding: 0 3px;margin-left:4.2%; border-radius: 8px!important;" height="100%" onerror="this.src=\'images/zhanweifu.jpg\'">' + 
								'</a>' + 
							'</div>';
				if (index = 0) {
					adversite_indicator += '<div class="mui-indicator mui-active"></div>'; 
				} else {
					adversite_indicator += '<div class="mui-indicator"></div>'; 
				}
				indicator += '<div class="mui-indicator"></div>'
			});
			content += '<div class="mui-slider-item mui-slider-item-duplicate">' +
							'<a  href="javascript:void(0);" data-linkurl="' + data.date[0].linkurl + '" data-title="' + data.date[0].title + '" onclick="openImg(this)">' + 
								'<img src="' + data.date[0].picurl + '" style="padding: 0 3px;margin-left:4.2%; border-radius: 8px!important;" height="100%" onerror="this.src=\'images/zhanweifu.jpg\'">' +
							'</a>' + 
						'</div>';
						
			$('#adversite').html(content);
			$('#adversite_indicator').html(indicator);
			$(".mui-indicator:last").remove()
		}
	}, function(data) {
		mui.alert("加载失败")
	});
}


// 公告
function notice() {
	var url = '/app/common/notice';
	var num = 3;
	Common.muipost(url, {'n': num}, function(data) {
		var html = "";
		var content = "";
		mui.each(data.date, function(index, item) {
			html += '<li class="notice_active_ch" title="' + item.title + '" content="' + item.content+ '" id="' + item.id + '"><span>' + item.title + '</span></li>';
		});
		$('.notice_active').find('ul').html(html);
		$(".huadong").removeClass("mui-hidden");
		newsCarousel();
	});
}

// 广告图
function adversite_news() {
	var url = '/app/common/adversite';
	var code = 1002;
	Common.muipost(url, {'code': code}, function(data) {
		if (data.date != '') {
			$("#adversite_news").html('<img src="' + basePath + data.date[0].picurl + '" width="100%" />');	
		}
	}, function(data) {
		mui.alert("网络异常，无法访问")
	});
}

// 推荐产品
function products() {
	var url = "/app/user/v2/product/recommend";
	Common.muipost(url, {'excision': 0}, function(data) {
		var html = "";
		if(data.date != null){
			$(".index-recommend").removeClass("mui-hidden");
			var curTime = new Date();
			var tempTime = data.date.expirationDate.replace(/-/g, '/').substr(0, 10);
			var expirationtime = new Date(tempTime);
			
			var texts = ""
			//console.log(curTime.getTime() + "：" + expirationtime.getTime());
			//console.log("aaa:" + data.date.expirationDate);
			if(curTime < expirationtime){
				texts = '<div class="mui-row recommend" _id="' + data.date.id + '" _isTime = "1">'
			}else{
				texts = '<div class="mui-row recommend" _id="' + data.date.id + '" _isTime = "2">'
			}
			var prictHtml = "";
			if (data.date.type == 2 || data.date.type == 4) {
				prictHtml = '<p>'+Common.moneyFormat(data.date.price)+'<i class="dw"> 元</i> <i class="ydy mui-hidden">≈'+Common.moneyFormat(data.date.money)+'</i></p>';
			} else {
				prictHtml = '<p>'+Common.moneyFormat(data.date.price)+'<i class="dw"> USDT</i> <i class="ydy">≈ '+Common.moneyFormat(data.date.money)+'</i></p>';
			}
			html += ''+texts+'' +
						'<div class=" mui-text-center" style="width: 50px; float: left; margin-right: 10px;">' +
							'<img src="' + basePath + data.date.icon + '" width="45px" height="45px"  onerror="this.src=\'images/hashbox/product.png\'" />' +								
						'</div>' +			
						'<div class="mui-col-sm-8">' +
							'<p>'+data.date.name+'</p>' +
							prictHtml +
						'</div>' +		
					'</div>' +				
					'<p>购买算力合约，下单到上架完成大约需要48小时</p>'		
			$(".recommend-production").html(html);
			
		}else{
			$(".index-recommend").addClass("mui-hidden");
		}
		
	}, function(data) {
		mui.alert("网络异常，无法访问")
	});
}

function news() {
	var url = '/app/common/news';
	Common.muipost(url, {'n': 5}, function(data) {
		var html = "";
		var content = "";		
		mui.each(data.date, function(index, item) {
			var createDate = "";
			if (item.createDate != null && item.createDate != "") {				
				createDate = item.createDate.substr(0, 10);
			}
			html += '<li class="mui-table-view-cell mui-media">'
					+ '<a href="javascript:void(0);" onclick="newsDetail(\'' + basePath + item.linkUrl + '\', \'' + item.title + '\')" >'
					+ '<img class="mui-media-object mui-pull-left" src="' + basePath + item.thumb + '">'
					+ '<div class="mui-media-body">'
					+ item.title
					+ '</div>'
					+ '<p>' + createDate + '</p>'
					+ '</a>'
					+ '</li>';
		});
		if (html != "") {
			$('.yun-news').find('ul').html(html);
			$(".yun-news").removeClass("mui-hidden");
		}
	});
}

function newsDetail(_url, _title) {
	mui.openWindow({
		url: '/link/link.html',
		id: '/link/link.html',
		extras: {
			linkUrl: _url,
			title: _title
		}
	});
}

// 懒加载
function lazyLoad(id) {
	mui('#' + id).imageLazyload({
	    placeholder: 'images/60x60.gif',
	    destroy: false
	});
};

function timer(opj) {
	$(opj).find('ul').animate({
		marginTop: "-3.5rem"
	}, 1500, function() {
		$(this).css({
			marginTop: "0.7rem"
		}).find("li:first").appendTo(this);
	})
}

function newsCarousel() {
	var num = $('.notice_active').find('li').length;
	if(num > 1) {
		var time = setInterval('timer(".notice_active")', 3500);
		$('.gg_more a').mousemove(function() {
			clearInterval(time);
		}).mouseout(function() {
			time = setInterval('timer(".notice_active")', 3500);
		});
	}
}

(function($) {
	 //轮播图自动切换
    setTimeout(function(){
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval:1800//自动轮播周期，若为0则不自动播放，默认为0；
    	});
	},300);
})(mui);

function openImg(e){
	var linkurl = $(e).attr("data-linkurl");
	if(!Common.isNull(linkurl)) {
		if ("person:poster" == linkurl) {
			mui.openWindow({
				url: '/info/invite.html',
				id: '/info/invite.html'
			});
		} else {
			plus.runtime.openURL(linkurl);
			// linkurl = linkurl;
			// mui.openWindow({
			// 	url: '/link/link.html',
			// 	id: '/link/link.html',
			// 	extras: {
			// 		linkUrl: linkurl,
			// 		title: $(e).attr("data-title")
			// 	}
			// });
		}
	}
	
}
