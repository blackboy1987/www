//验证验证码
function sms () {
    var phonecode = $("#yzmip").val()
    if (Common.isNull(phonecode)) {
        mui.toast("短信验证码不能为空");
        return false;
    }
    Common.muipost("/common/verifier/phone/code", {phone: phone, phonecode: phonecode}, function (data) {
        mui.hideLoading();
        $("#yzm").addClass("mui-hidden")
        $("#subs").removeClass("mui-hidden")
    }, function (data) {
        mui.alert(data.content);
        $("#yzm").addClass("mui-hidden")
        mui.hideLoading();
    })
}
//发送验证码
function sendSms() {
    var checkurl = "/common/obtain/phone/code";
    mui.showLoading("短信发送中", "body");
    Common.muipost(checkurl, {tel: phone}, function (data) {
        $("#sendsms").css("color", "#F20B0B");
        mui.hideLoading();
        reget(60);
    }, function (data) {
        mui.hideLoading();
        mui.alert(data.content);
    })
}
function reget(count) {
    var btn = $("#sendsms");
    var count = count;
    btn.html("60s后重发");
    var resend = setInterval(function() {
        count--;
        if (count > 0) {
            btn.css('pointer-events','none')
            btn.html(count + "s后重发");
        } else {
            btn.css('pointer-events','unset')
            clearInterval(resend);
            $("#sendsms").css("color", "#00CDB9");
            btn.html("重获验证码");
        }
    }, 1000);
}