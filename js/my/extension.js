function generatePoster (){
	var url = '/app/user/relation/extend';
	var defer = $.Deferred();
	Common.muipost(url, {}, function(data) {
		$("#foo").val(data.date.code);
		$("#foo2").val(data.date.invite);
		defer.resolve(data.date);
	});
	return defer.promise();
}

$("#generatePoster").click(function() {
	$.when(generatePoster()).done(function(result){
		var responseData = result;
		mui.openWindow({
            url: 'generatingPoster.html',
            id: 'generatingPoster.html',
            extras: {
                target: result.target
            }
        });
	});
	
});

var clipboard = new ClipboardJS('#word');
clipboard.on('success', function(e) {
    e.clearSelection(); //选中需要复制的内容
    mui.toast("复制成功！");
});
clipboard.on('error', function(e) {
    alert("当前浏览器不支持此功能，请手动复制。")
});

var clipboard2 = new ClipboardJS('#link');
clipboard2.on('success', function(e) {
    e.clearSelection(); //选中需要复制的内容
    mui.toast("复制成功！");
});
clipboard2.on('error', function(e) {
    alert("当前浏览器不支持此功能，请手动复制。")
});
