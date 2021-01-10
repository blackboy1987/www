var Common = function () {
};
var version = 1;
var siteName = '算力蜂';
var basePath = "http://api.suanlifeng.com";//生产/
// basePath = "http://api.test.suanlifeng.com";//测试服务器
// basePath = "http://192.168.0.122:8113";//小谢机器
// basePath = "http://192.168.1.124:8113";//崔佳俊机器

var device_uuid = ''

mui.plusReady(function () {
    // 获取软件版本号
    var vs = plus.storage.getItem('version')
    if (vs) version = vs
    // 获取储存中uuid
    device_uuid = plus.storage.getItem('uuid')
    if (!device_uuid) {
        var info = ''
        // 获取设备uuid
        plus.device.getInfo({
            success: function (e) {
                uuidStr = e.uuid
                device_uuid = uuidStr.indexOf(',') != -1 ? uuidStr.slice(0, uuidStr.indexOf(',')) : uuidStr
            },
            fail: function (e) {
                device_uuid = getUuid()
            },
            complete: function (e) {
                plus.storage.setItem('uuid', JSON.stringify(device_uuid))
            }
        })
    }
    var day = (new Date().getDate()+'');
    // 设置ipfs产品活动弹窗
    if (
        !(plus.storage.getItem("ipfsDate")) ||
        plus.storage.getItem("ipfsDate") != day
    ) { 
        plus.storage.setItem("ipfsPopActivity", "true");
        plus.storage.setItem("ipfsDate", day)
    }
})

function getUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
//加载动画
var Loading = function () { if (document.readyState == "complete") { $(".Loading").fadeOut(400, function () { $(this).remove() }) } };
document.onreadystatechange = Loading;


function ajax() {
    var ajaxData = {
        type: (arguments[0].type || "GET").toUpperCase(),
        url: arguments[0].url || "",
        async: arguments[0].async || "true",
        data: arguments[0].data || null,
        dataType: arguments[0].dataType || "json",
        contentType: arguments[0].contentType || "application/x-www-form-urlencoded; charset=utf-8",
        beforeSend: arguments[0].beforeSend || function () {
        },
        success: arguments[0].success || function () {
        },
        error: arguments[0].error || function () {
        },
        version: version,
        uuid: device_uuid
    }
    ajaxData.beforeSend()
    var xhr = new plus.net.XMLHttpRequest();
    xhr.responseType = ajaxData.dataType;

    xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
    xhr.setRequestHeader("Content-Type", ajaxData.contentType);
    xhr.setRequestHeader('App-Version', ajaxData.version)
    xhr.setRequestHeader('Device-Id', ajaxData.uuid)
    xhr.send(convertData(ajaxData.data));

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                ajaxData.success(xhr.response)
            } else {
                ajaxData.error()
            }
        }
    }
}

function convertData(data) {
    if (typeof data === 'object') {
        var convertResult = "";
        for (var c in data) {
            convertResult += c + "=" + data[c] + "&";
        }
        convertResult = convertResult.substring(0, convertResult.length - 1)
        return convertResult;
    } else {
        return data;
    }
}

// get请求
Common.muiget = function (url, params, callback, errCallBack, index) { 
    var baseApi = basePath + url;
    ajax({
        type: 'GET',
        url: baseApi,
        dataType: 'json',
        data: params,
        beforeSend: function () { 
            try {
                mui.hideLoading();
            } catch (e) { 
                mui.toast('网络异常');
            }
        },
        success: function (data) { 
            if (data.type == 200) { 
                callback(data)
            } else if (data.type == 0) {
                mui.toast(data.content);
                //登录过期
                plus.runtime.restart();
            } else if (data.type == 400) {
                // 400 error
                mui.toast(data.content);
            } else if (data.type == 401) {
                mui.toast(data.content + '\nexceptionId:' + data.exceptionId);
            } else {
                // mui.toast(data.content);
                // 500 warn
                errCallBack(data);
            }
        },
        error: function () {
            try {
                mui.hideLoading();
            } catch (err) {}
            mui.toast('网络异常，无法访问');
        }
    });
}

// muipost提交
Common.muipost = function (url, params, callback, errCallBack, index) {
    var baseApi = basePath + url;
	callback = callback || function(){};
	errCallBack = errCallBack || function(){};
    if (mui.os.ios) {
        ajax({
            type: "POST",
            url: baseApi,
            dataType: "json",
            data: params,
            beforeSend: function () {
                try {
                    mui.hideLoading();
                } catch (err) {
                    // mui.toast('请求失败，' + err);
                }
            },
            success: function (data) {
                if (data.type == 200) {
                    callback(data);
                } else if (data.type == 0) {
                    mui.toast(data.content);
                    //登录过期
                    plus.runtime.restart();
                } else if (data.type == 400) {
                    // 400 error
                    errCallBack(data);
                    mui.toast(data.content);
                } else if (data.type == 401) {
                    errCallBack(data)
                    mui.toast(data.content + '\nexceptionId:' + data.exceptionId);
                } else {
                    // mui.toast(data.content);
                    // 500 warn
                    errCallBack(data);
                }
            },
            error: function (e) {
                //异常处理；
                try {
                    mui.hideLoading();
                } catch (err) {
                }
                mui.toast('网络异常，无法访问');
            }
        });
    } else {
        mui.ajax(baseApi, {
            data: params,
            dataType: 'json', //服务器返回json格式数据
            type: 'POST',
            timeout: 8000, //超时时间设置为10秒；
            headers: {'App-Version': version, 'Device-Id': device_uuid},
            success: function (data) {
                try {
                    mui.hideLoading();
                } catch (err) {
                    // mui.toast('请求失败，' + err);
                }
                if (data.type == 200) {
                    callback(data);
                } else if (data.type == 0) {
                    mui.toast(data.content);
                    //登录过期
                    plus.runtime.restart();
                } else if (data.type == 400) {
                    // 400 error
                    errCallBack(data);
                    // mui.toast(data.content);
                } else if (data.type == 401) {
                    errCallBack(data);
                    mui.toast(data.content + '\nexceptionId:' + data.exceptionId);
                } else {
                    // mui.toast(data.content);
                    // 500 warn
                    errCallBack(data);
                }
            },
            error: function () {
                //异常处理；
                try {
                    mui.hideLoading();
                } catch (err) {
                }
                mui.toast('网络异常，无法访问');
            }
        });
    }

}

// 判断银行卡号
Common.isCard = function (str) {
    str = str.replace(/\s+/g, "");
    var pattern = /^([1-9]{1})(\d{15,18})$/;
    if (!pattern.test(str)) {
        return true;
    } else {
        return false;
    }
}
// 判断是否为空
Common.isNull = function (str) {
    if (str == null || str == '') {
        return true;
    } else {
        return false;
    }
}

//判断是否相同
Common.isEqual = function (str1, str2) {
    if (str1 != str2) {
        return true;
    } else {
        return false;
    }
}
// 手机号码验证
Common.isPhoneAvailable = function (phone) {
    var reg = /^1[3-9]\d{9}$/;
    if (reg.test(phone)) {
        return false;
    } else {
        return true;
    }
}
// 邮箱验证
Common.isEmail = function (obj) {
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
    if (!reg.test(obj)) {
        return true;
    } else {
        return false;
    }
}
// 密码验证：支持数字，英文字母和下划线
Common.numletter_ = function (obj) {
    var reg = "^[0-9a-zA-Z\_]+$";
    if (!reg.test(obj)) {
        return true;
    } else {
        return false;
    }
}
// 密码验证：支持数字，英文字母
Common.numletter = function (obj) {
    var reg = "^[0-9a-zA-Z]+$";
    if (!reg.test(obj)) {
        return true;
    } else {
        return false;
    }
}
//资金密码验证：6位数字组合
Common.isCash = function (obj) {
    var reg = /^\d{6}$/;
    if (!reg.test(obj)) {
        return true;
    } else {
        return false;
    }
}
// 密码校验
Common.passWord = function (obj) {
    var reg = /^[a-zA-Z\d_]{8,}$/;
    if (!reg.test(obj)) {
        return true;
    } else {
        return false;
    }
}
// 只能输入字母
Common.english = function (obj) {
    var reg = "[a-zA-Z]";
    if (!reg.test(obj)) {
        return true;
    } else {
        return false;
    }
}
// 只能输中文
Common.china = function (obj) {
    var reg = "^[\u0391-\uFFE5]+$";
    if (!reg.test(obj)) {
        return true;
    } else {
        return false;
    }
}
// 金额：格式定义为带小数的正数，小数点最多有三位
Common.money = function (obj) {
    var reg = "^[0-9]+[\.][0-9]{0,3}$";
    if (!reg.test(obj)) {
        return true;
    } else {
        return false;
    }
}
//货币：格式定义为保留小数点后二位
Common.moneyFormat = function (number) {
    // 默认2位小数
    return Common.moneyFormatByDecimals(number, 2);
}
Common.moneyFormatByDecimals = function (number, decimals) {
    var tempStr = new String(number);
    if ((tempStr.indexOf('E') != -1) || (tempStr.indexOf('e') != -1)) {
        tempStr = Common.scientificToNumber(tempStr);
    }
    // var decimals = 6;
    var dec_point = ".";
    var thousands_sep = "";
    /*
     * 参数说明：
     * number：要格式化的数字
     * decimals：保留几位小数
     * dec_point：小数点符号
     * thousands_sep：千分位符号
     * */
    /* var n = !isFinite(+number) ? 0 : +number;

    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    var s = '';
    var toFixedFix = function(n, prec) {
        return n + "";
    };*/
    var prec = Math.abs(decimals);
    if (tempStr.indexOf(".") == -1) {
        tempStr = tempStr + ".00";
    }

    var s = tempStr.split('.');
    var tempNum = '';
    if (s[1].length < prec) {
        s[1] += new Array(prec - s[1].length + 1).join('0');
    } else if (s[1].length > prec && s[1][2] > 0) {
        for (var i = 0; i < s[1].length; i++) {
            tempNum += s[1][i] == 0 ? '0' : ''
            if (s[1][i] != 0) s[1] = Math.ceil((s[1].substr(i, prec + 1)) / 10);
        }
        if (tempNum.length) s[1] = Math.ceil(s[1] / (Math.pow(10, tempNum.length)));
        s[1] = tempNum + s[1];
    } else {
        s[1] = s[1].substr(0, prec);
        // s[1] = Math.ceil((s[1].substr(0, 3)) / 10)
    }
    return s.join(dec_point);
}
Common.scientificToNumber = function (num) {
    var tempValueStr = new String(num);
    if ((tempValueStr.indexOf('E') != -1) || (tempValueStr.indexOf('e') != -1)) {
        var reg = /^(\d+[\.]?\d+|\d+)(e|E)([\-]?\d+)$/;
        if (reg.test(tempValueStr)) {
            /*6e-7 需要手动转换*/
            var arr, len, zero = '';
            arr = reg.exec(tempValueStr);
            len = Math.abs(arr[3]) - 1;
            for (var i = 0; i < len; i++) {
                zero += '0';
            }
            var arr_first = arr[1];

            if (arr_first.indexOf(".") != -1) {
                arr_first = arr_first.replace(".", "");
            }
            return '0.' + zero + arr_first;
        } else {
            var regExp = new RegExp('^((\\d+.?\\d+)[Ee]{1}(\\d+))$', 'ig');
            var result = regExp.exec(tempValueStr);
            var resultValue = "";
            var power = "";
            if (result != null) {
                resultValue = result[2];
                power = result[3];
                result = regExp.exec(tempValueStr);
            }
            if (resultValue != "") {
                if (power != "") {
                    var powVer = Math.pow(10, power);
                    resultValue = resultValue * powVer;
                }
            }
            return resultValue;
        }
    }
    return tempValueStr;
}
Common.accMul = function (arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
// 时间格式化
Common.dateFtt = function (fmt, date) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
// 时间加减
Common.dateAdd = function (days, date) {
    if (days == undefined || days == '') {
        days = 1;
    }
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    return date;
}

    // JQuery方法定制
    (function ($) {
        $.ajaxSetup({
            type: 'POST',
            async: true,
            dataType: "json",
            timeout: 30000
        });

        /**
         * 获取form表单数据
         */
        $.fn.getFormData = function (isValid) {
            var fieldElem = $(this).find('input,select,textarea'); //获取所有表单域
            var data = {};
            layui.each(fieldElem, function (index, item) {
                if (!item.name) return;
                if (/^checkbox|radio$/.test(item.type) && !item.checked) return;
                var value = item.value;
                if (item.type == "checkbox") { //如果多选
                    if (data[item.name]) {
                        value = data[item.name] + "," + value;
                    }
                }
                if (isValid) {
                    //如果为true,只需要处理有数据的值
                    if (!$.isEmpty(value)) {
                        data[item.name] = value;
                    }
                } else {
                    data[item.name] = value;
                }
            });
            return data;
        };

        $.fn.serializeJson = function () {
            var serializeObj = {};
            var array = this.serializeArray();
            var str = this.serialize();
            $(array).each(
                function () {
                    if (serializeObj[this.name]) {
                        if ($.isArray(serializeObj[this.name])) {
                            serializeObj[this.name].push(this.value);
                        } else {
                            serializeObj[this.name] = [
                                serializeObj[this.name], this.value
                            ];
                        }
                    } else {
                        serializeObj[this.name] = this.value;
                    }
                });
            return serializeObj;
        };


        $.extend({
            //非空判断
            isEmpty: function (value) {
                if (value === null || value == undefined || value === '') {
                    return true;
                }
                return false;
            },
            //获取对象指
            result: function (object, path, defaultValue) {
                var value = "";
                if (!$.isEmpty(object) && $.isObject(object) && !$.isEmpty(path)) {
                    var paths = path.split('.');
                    var length = paths.length;
                    $.each(paths, function (i, v) {
                        object = object[v];
                        if (length - 1 == i) {
                            value = object;
                        }
                        if (!$.isObject(object)) {
                            return false;
                        }
                    })

                }

                if ($.isEmpty(value) && !$.isEmpty(defaultValue)) {
                    value = defaultValue;
                }
                return value;
            },
            //判断是否obj对象
            isObject: function (value) {
                var type = typeof value;
                return value != null && (type == 'object' || type == 'function');
            },
            //是否以某个字符开头
            startsWith: function (value, target) {
                return value.indexOf(target) == 0;
            },
            //设置sessionStorage
            setSessionStorage: function (key, data) {
                sessionStorage.setItem(key, data);
            },
            //获取sessionStorage
            getSessionStorage: function (key) {
                return sessionStorage.getItem(key) == null ? "" : sessionStorage.getItem(key);
            },
            //删除sessionStorage
            removeSessionStorage: function (key) {
                sessionStorage.removeItem(key);
            },
            //清除sessionStorage
            clearSessionStorage: function () {
                sessionStorage.clear();
            },
            uuid: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },
            getUrlParam: function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            }
        });

    }(jQuery));
; (function () {
    /**
     * 滑块验证码
     */
    window.popVerify = function (option) {
        option.rootEl = option.rootEl || '';
        option.clickEl = option.clickEl || '';
        option.beforeCheck = option.beforeCheck || function () { return true };
        option.successCallback = option.successCallback || function () { };
        option.errCallBack = option.errCallBack || function () { };
        $(option.rootEl).html('');
        option.rootEl.pointsVerify({
            baseUrl: basePath,
            mode:'pop',     //展示模式
            containerId: option.clickEl,//pop模式 必填 被点击之后出现行为验证码的元素id
            imgSize : {       //图片的大小对象,有默认值{ width: '310px',height: '155px'},可省略
                width: (document.documentElement.clientWidth - 80)+'px',
                height: '200px',
            },
            barSize:{          //下方滑块的大小对象,有默认值{ width: '310px',height: '50px'},可省略
                width: (document.documentElement.clientWidth - 80)+'px',
                height: '40px',
            },
            phone: option.phone,
            beforeCheck: option.beforeCheck,
            success : option.successCallback,
            error : option.errorCallback
        });
    }
})();