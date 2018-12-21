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
    //校验ws初始化是否成功
    autoWebSocket.checkWSInit(function () {
        /**
         * 0 - 表示连接尚未建立。
         * 1 - 表示连接已建立，可以进行通信。
         * 2 - 表示连接正在进行关闭。
         * 3 - 表示连接已经关闭或者连接不能打开。
         */
        var ds = autoWebSocket.getCurrentDateTime();
        switch (ws.readyState) {
            case 0:
                console.log(ds+"  ws连接为建立.......................................");
                break;
            case 1:
                console.log(ds+"  ws连接创建成功.......................................");
                break;
            case 2:
                console.log(ds+"  ws连接正在进行关闭.......................................")；
                break;
            case 3:
                console.log(ds+"  ws连接已经关闭或者连接不能打开.......................................");
                break;
            default:
                console.log(ds+"  ws未知状态.......................................");
                break;
        }
    });
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
    setTimeout(function(){
        if(ws.readyState !=3){
            autoWebSocket.checkWSInit(checkCallBack);
        }else{
            checkCallBack();
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
        d.getSeconds() +"<DATE-TIME>";
};
//获取输出控制台的<p>
autoWebSocket.getInputStreamP=function(message){
    var renderMess = "<p>";
    var messages = message.split("<DATE-TIME>");
    //处理时间显示
    renderMess = renderMess + "<span style='color: #fffefe;'>" + messages[0] + "</span>":
    //处理内容显示
    var context = messages[1];
    autoWebSocket.highLightSpecialWord(context.redHighLightSpecWord);
    autoWebSocket.highLightSpecialWord(context.yellowHighLightSpecWord);
    renderMess = renderMess + context + "</p>";
    return renderMess;
};
//显示高亮语句方法
autoWebSocket.highLightSpecialWord=function (message,words) {

    return message;
};
autoWebSocket.redHighLightSpecWord = [
    "WARM","ERROR","EXCEPTION"
];
autoWebSocket.yellowHighLightSpecWord = [

];
