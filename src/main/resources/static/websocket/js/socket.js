//方法对象主体
var autoWebSocket = {};
//webSocket 服务路径
var wsUrl = "ws://localhost:8080/ws";
//webSocket对象
var ws = null;
//初始化页面实现
autoWebSocket.init=function () {
    autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(autoWebSocket.getCurrentDateTime()+"  ws初始化开始......................................."));
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
        switch (ws.readyState) {
            case 0:
                autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(autoWebSocket.getCurrentDateTime()+"  ws连接为建立......................................."));
                break;
            case 1:
                autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(autoWebSocket.getCurrentDateTime()+"  ws连接创建成功......................................."));
                break;
            case 2:
                autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(autoWebSocket.getCurrentDateTime()+"  ws连接正在进行关闭......................................."));
                break;
            case 3:
                autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(autoWebSocket.getCurrentDateTime()+"  ws连接已经关闭或者连接不能打开......................................."));
                break;
            default:
                autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(autoWebSocket.getCurrentDateTime()+"  ws未知状态......................................."));
                break;
        }
    });
};
//初始化webSocket
autoWebSocket.initWebSocket=function(){
    //初始化webSocket
    ws = new WebSocket(wsUrl);
    //建立连接时触发
    ws.onopen = function () {
        autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(autoWebSocket.getCurrentDateTime()+"  ws正在建立连接，请稍后......................................."));
    }
};
//校验ws初始化是否成功
autoWebSocket.checkWSInit=function (checkCallBack) {
    autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(autoWebSocket.getCurrentDateTime()+"  ws连接检测中，请稍后......................................."));
    if(ws.readyState != 1 && ws.readyState != 3){
        setTimeout(function(){
            autoWebSocket.checkWSInit(checkCallBack);
        }, 1000);
    }else{
        checkCallBack();
    }
};
//获取当前时间信息
autoWebSocket.getCurrentDateTime=function () {
    let d = new Date();
    return d.getFullYear() + "-" +
        (d.getMonth() < 9 ? "0"+(d.getMonth() + 1) : d.getMonth()+1) + "-"+
        (d.getDate() < 10 ? "0"+d.getDate() : d.getDate()) + " "+
        (d.getHours() < 10 ? "0"+d.getHours() : d.getHours()) + ":"+
        (d.getMinutes() < 10 ? "0"+d.getMinutes() : d.getMinutes()) + ":"+
        (d.getSeconds() < 10 ? "0"+d.getSeconds() : d.getSeconds()) +"  DATE-TIME  ";
};
//获取输出控制台的<p>
autoWebSocket.getInputStreamP=function(message){
    let renderMess = "<p>";
    let messages = message.split("DATE-TIME");
    //处理时间显示
    renderMess = renderMess + "<span style='color: #00BCD4;'>" + messages[0] + "</span>";
    //处理内容显示
    let context = messages[1];
    context = autoWebSocket.highLightSpecialWord(context,autoWebSocket.e0BCD4,"#ff7b52");
    context = autoWebSocket.highLightSpecialWord(context,autoWebSocket.e0e100,"#00e100");
    context = autoWebSocket.highLightSpecialWord(context,autoWebSocket.FF9800,"#FF9800");
    renderMess = renderMess + context + "</p>";
    return renderMess;
};
//显示高亮语句方法
autoWebSocket.highLightSpecialWord=function (message,words,color) {
    for (let i = 0; i < words.length; i++) {
        if(message.indexOf(words[i])){
            message = message.replace(words[i],"<span style='color:"+color+";'>"+words[i]+"</span>")
        }
    }
    return message;
};
autoWebSocket.e0BCD4 = [
    "WARM","ERROR","EXCEPTION","请输入需要执行的命令.......................................","" +
    "重新初始化ws失败，请检查服务是否正常运行.......................................",
    "调用时发生错误"
];
autoWebSocket.e0e100 = [
    "您输入的内容"
];
autoWebSocket.FF9800 = [
    "执行返回信息"
];

//获取输入点击事件
autoWebSocket.sendInputStreamShell=function(e){
    let ev = window.event||e;
    if(ev.keyCode == 13){
        //执行发送代码
        autoWebSocket.sendInputStreamToServer();
    }
};
//发送消息
autoWebSocket.sendInputStreamToServer=function(){
    //获取输入信息
    let input = $("#console-input").val();
    if(input == ""){
        let mess = autoWebSocket.getCurrentDateTime()+"请输入需要执行的命令.......................................";
        autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(mess));
        return;
    }
    //清空输入框
    $("#console-input").val("");
    let mess = autoWebSocket.getCurrentDateTime()+"您输入的内容："+input;
    autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(mess));
    //检查ws是否连接
    if(ws.readyState != 1){
        autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(autoWebSocket.getCurrentDateTime()+"  ws连接已经关闭或者连接不能打开......................................."));
        //重新创建ws连接
        autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(autoWebSocket.getCurrentDateTime()+"  正在重新创建ws连接，请稍后......................................."));
        //初始化webSocket
        autoWebSocket.initWebSocket();
        //检查连接
        autoWebSocket.checkWSInit(function () {
            if(ws.readyState != 1){
                autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(autoWebSocket.getCurrentDateTime()+"  重新初始化ws失败，请检查服务是否正常运行......................................."));
                return;
            }
            autoWebSocket.sendInputStreamToServerImpl(input);
        });
    }else if(ws.readyState == 1){
        autoWebSocket.sendInputStreamToServerImpl(input);
    }
};
autoWebSocket.sendInputStreamToServerImpl=function(message){
    //发送消息
    ws.send(message);
    //接收消息
    ws.onmessage=function(evt){
        autoWebSocket.setMessageToConsole(autoWebSocket.getInputStreamP(autoWebSocket.getCurrentDateTime()+" 执行返回信息："+evt.data));
    };
};
autoWebSocket.setMessageToConsole=function(message){
    //设置到页面
    $("#console-div-context").append(message);
    //执行设置滚动底部
    document.documentElement.scrollTop = document.documentElement.scrollHeight
};
//初始化页面
autoWebSocket.init();