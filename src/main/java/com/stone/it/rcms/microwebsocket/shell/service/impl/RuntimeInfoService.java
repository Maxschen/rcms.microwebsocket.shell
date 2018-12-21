package com.stone.it.rcms.microwebsocket.shell.service.impl;

import com.stone.it.rcms.microwebsocket.shell.service.IRuntimeInfoService;
import com.stone.it.rcms.microwebsocket.shell.socket.WebSocketService;
import org.springframework.stereotype.Component;

import java.io.*;

/**
 * 获取运行时信息
 */
@Component
public class RuntimeInfoService implements IRuntimeInfoService {

    @Override
    public void processShell(WebSocketService socketService, String shell){
        try {
            final Process process = Runtime.getRuntime().exec(shell);
            processMessage(socketService, process.getInputStream());
            processMessage(socketService, process.getErrorStream());
        }catch (Exception e){
            socketService.sendMessage(e.getMessage());
        }
    }

    private void processMessage(WebSocketService socketService, InputStream inputStream) {
        new Thread(new Runnable() {
            public void run() {
                Reader reader = new InputStreamReader(inputStream);
                BufferedReader bf = new BufferedReader(reader);
                String line = null;
                try {
                    while ((line = bf.readLine()) != null) {
                        socketService.sendMessage(line);
                    }
                } catch (IOException e) {
                    socketService.sendMessage(e.getMessage());
                }
            }
        }).start();
    }
}
