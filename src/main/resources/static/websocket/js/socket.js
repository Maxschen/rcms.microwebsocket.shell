//方法对象主体
var autoWebSocket = {};
//webSocket 服务路径
var wsUrl = "";
//webSocket对象
var ws = null;
//初始化页面
autoWebSocket.init();
//初始化页面实现
autoWebSocket.init=function () {
    //初始化webSocket
    autoWebSocket.initWebSocket();

};
//初始化webSocket
autoWebSocket.initWebSocket=function(){
    //初始化webSocket
    ws = new WebSocket(wsUrl);
    //建立连接时触发
    ws.open = function () {
        var ds = autoWebSocket.getCurrentDateTime();
        console.log(ds+"  正在建立ws连接，请稍后.......................................");
    }
};
//校验ws初始化是否成功
autoWebSocket.checkWSInit=function (checkCallBack) {
    /**
     * 0 - 表示连接尚未建立。
     * 1 - 表示连接已建立，可以进行通信。
     * 2 - 表示连接正在进行关闭。
     * 3 - 表示连接已经关闭或者连接不能打开。
     */
    setTimeout(function(){
        if(ws.readyState !=3){
            autoWebSocket.checkWSInit(checkCallBack);
        }
    }, 100);
};
//获取当前时间信息
autoWebSocket.getCurrentDateTime=function () {
    var d = new Date();
    return
        d.getFullYear() + "-"+
        d.getMonth() + "-"+
        d.getDay() + " "+
        d.getHours() + ":"+
        d.getMinutes() + ":"+
        d.getSeconds();

};
