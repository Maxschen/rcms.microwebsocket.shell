package com.stone.it.rcms.microwebsocket.shell.socket;


import com.stone.it.rcms.microwebsocket.shell.service.IRuntimeInfoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * webSocket
 *
 */
@Component
@ServerEndpoint("/ws")
public class WebSocketService {

    @Resource
    private IRuntimeInfoService runtimeInfoService;

    //日志记录器
    private Logger logger = LoggerFactory.getLogger(WebSocketService.class);

    //记录在线连接数
    private static Long onlineCount = 0L;

    //concurrent包的线程安全Set，用来存放每个客户端对应的WebSocket对象。
    private static CopyOnWriteArraySet<WebSocketService> webSocketSet = new CopyOnWriteArraySet<WebSocketService>();

    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;

    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session) {
        logger.info("新建连接");
        //设置Session
        this.session = session;
        //添加到线程安全
        webSocketSet.add(this);
        //在线数加1
        addOnlineCount();
        logger.info("当前连接数："+getOnlineCount()+"");
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        logger.info("关闭当前连接");
        //从set中删除
        webSocketSet.remove(this);
        //在线数减1
        subOnlineCount();
        logger.info("当前连接数："+getOnlineCount()+"");
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     */
    @OnMessage
    public void onMessage(String message, Session session) {
        logger.info("接收客户端消息："+message);
        //执行收到信息
        runtimeInfoService.processShell(this,message);
    }

    /**
     * 发生错误时调用
     */
     @OnError
     public void onError(Session session, Throwable error) {
         logger.info("调用时发生错误："+error.getMessage());
         this.sendMessage("调用时发生错误："+error.getMessage());
     }


    /**
     * 发送消息返回客户端
     * @param message
     * @throws IOException
     */
     public void sendMessage(String message) {
         try{
             this.session.getBasicRemote().sendText(message);
         }catch (IOException e){
             logger.info("返回客户端消息发生异常：："+e.getMessage());
         }
     }


    public static synchronized Long getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        WebSocketService.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        WebSocketService.onlineCount--;
    }

}
