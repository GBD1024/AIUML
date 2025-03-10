package com.example.roadmllm.Controller;

import com.example.roadmllm.Config.JwtUtil;
import com.example.roadmllm.DTO.PhoneCheckResponse;
import com.example.roadmllm.DTO.ResetPasswordRequest;
import com.example.roadmllm.DTO.UserRequest;
import com.example.roadmllm.Service.SmsService;
import com.example.roadmllm.Service.Test.MsmService;
import com.example.roadmllm.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private SmsService smsService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;


    @Autowired
    private MsmService msmService;
    private Map<String, String> verificationCodes = new HashMap<>();

    @PostMapping("/sendCode")
    public ResponseEntity<?> sendVerificationCode(@RequestBody UserRequest userRequest) throws Exception {
        String phonenumber = userRequest.getPhonenumber();
        String code = generateVerificationCode();
        verificationCodes.put(phonenumber, code);
        smsService.sendSms(phonenumber, code);
        verificationCodes.put("code",code);
        msmService.send(verificationCodes,phonenumber);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequest userRequest) {
        String phoneNumber = userRequest.getPhonenumber();
        String code = userRequest.getCode();
        String username = userRequest.getUsername();
        String password = userRequest.getPassword();

        String storedCode = verificationCodes.get(phoneNumber);
        if (storedCode == null || !storedCode.equals(code)) {
            return ResponseEntity.badRequest().body("验证码错误！");
        }

        if (userService.findByUsername(username) != null) {
            return ResponseEntity.badRequest().body("用户名已被注册！");
        }
        if (userService.findByPhoneNumber(phoneNumber) != null) {
            return ResponseEntity.badRequest().body("手机号已被注册！");
        }

        userService.registerUser(username, password, phoneNumber);
        verificationCodes.remove(phoneNumber);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequest userRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userRequest.getPhonenumber(),
                            userRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            String jwt = jwtUtil.generateToken(userDetails);

            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid phonenumber or password");
        }
    }

    // 发送验证码接口（手机号验证）
    @PostMapping("/sendResetCode")
    public ResponseEntity<?> sendResetCode(@RequestBody UserRequest userRequest) throws Exception {
        String phonenumber = userRequest.getPhonenumber();

        // 检查手机号是否已注册
        if (userService.findByPhoneNumber(phonenumber) == null) {
            return ResponseEntity.badRequest().body("该手机号未注册！");
        }

        // 生成验证码并发送
        String code = generateVerificationCode();
        verificationCodes.put(phonenumber, code);
        smsService.sendSms(phonenumber, code);
        verificationCodes.put("code",code);
        msmService.send(verificationCodes,phonenumber);
        return ResponseEntity.ok().build();
    }

    // 验证验证码接口（用户输入验证码后，验证其有效性）
    @PostMapping("/verifyCode")
    public ResponseEntity<?> verifyCode(@RequestBody UserRequest userRequest) {
        String phoneNumber = userRequest.getPhonenumber();
        String code = userRequest.getCode();

        // 校验验证码是否匹配
        String storedCode = verificationCodes.get(phoneNumber);
        if (storedCode == null || !storedCode.equals(code)) {
            return ResponseEntity.badRequest().body("验证码错误或已过期！");
        }

        verificationCodes.remove(phoneNumber);

        return ResponseEntity.ok().build();
    }

    // 重置密码接口（通过验证码重置密码）
    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetRequest) {
        String phoneNumber = resetRequest.getPhonenumber();
        String newPassword = resetRequest.getNewPassword();

        userService.updatePassword(phoneNumber, newPassword);

        return ResponseEntity.ok().build();
    }



    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    @PostMapping("/checkUsername")
    public ResponseEntity<?> checkUsername(@RequestBody UserRequest userRequest) {
        String username = userRequest.getUsername();

        if (username == null || username.isEmpty()) {
            return ResponseEntity.badRequest().body("用户名不能为空");
        }

        // 检查用户名是否已被注册
        boolean isUsed = userService.findByUsername(username) != null;

        return ResponseEntity.ok().body("{\"used\":" + isUsed + "}");
    }
    @PostMapping("/checkPhone")
    public ResponseEntity<?> checkPhone(@RequestBody UserRequest request) {
        String phoneNumber = request.getPhonenumber();

        boolean isRegistered = userService.findByPhoneNumber(phoneNumber) != null;

        return ResponseEntity.ok().body(new PhoneCheckResponse(isRegistered));
    }
}