package com.example.roadmllm.Controller;

import com.example.roadmllm.DTO.ResponseModel;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/aiuml")
public class ExplainCodeController {

    @PostMapping("/explainCode")
    public ResponseModel explainCode(@RequestBody String data) {
        return new ResponseModel("success", "代码解释成功", data);
    }
}