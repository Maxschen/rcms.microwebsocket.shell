package com.stone.it.rcms.microwebsocket.shell.service;


import com.stone.it.rcms.microwebsocket.shell.socket.WebSocketService;

/**
 * 获取运行时信息
 */
public interface IRuntimeInfoService {


    /**
     * runtime exec 命令
     * @param socketService
     * @param shell
     * @throws Exception
     */
    public void processShell(WebSocketService socketService,String shell);


}
