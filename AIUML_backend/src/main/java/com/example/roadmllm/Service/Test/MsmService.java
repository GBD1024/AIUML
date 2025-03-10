package com.example.roadmllm.Service.Test;

import java.util.Map;

/**
 * @author Eric
 * @create 2022-05-22 15:08
 */
public interface MsmService {
    //发送验证码
    boolean send(Map<String, String> param, String phone);
}

