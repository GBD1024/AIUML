package com.example.roadmllm.Service;

import com.aliyun.dysmsapi20170525.Client;
import com.aliyun.dysmsapi20170525.models.SendSmsRequest;
import com.aliyun.dysmsapi20170525.models.SendSmsResponse;
import com.aliyun.teaopenapi.models.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${aliyun.sms.accessKeyId}")
    private String accessKeyId;

    @Value("${aliyun.sms.accessKeySecret}")
    private String accessKeySecret;

    @Value("${aliyun.sms.signName}")
    private String signName;

    @Value("${aliyun.sms.templateCode}")
    private String templateCode;

    public void sendSms(String phonenumber, String code) throws Exception{
        Config config = new Config()
                .setAccessKeyId(accessKeyId)
                .setAccessKeySecret(accessKeySecret);
        config.endpoint = "dysmsapi.aliyuncs.com";
        config.regionId = "dysmsapi.aliyuncs.com";

        Client client = new Client(config);

        SendSmsRequest sendSmsRequest = new SendSmsRequest()
                .setPhoneNumbers(phonenumber)
                .setSignName(signName)
                .setTemplateCode(templateCode)
                .setTemplateParam("{\"code\":\"" + code + "\"}");

        SendSmsResponse sendSmsResponse = client.sendSms(sendSmsRequest);
        System.out.println(sendSmsResponse.getBody().getMessage());
    }
}