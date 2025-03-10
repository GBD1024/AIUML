package com.example.roadmllm.Service;

import com.example.roadmllm.Dao.UserDao;
import com.example.roadmllm.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String username, String password, String phonenumber) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhonenumber(phonenumber);

        userDao.insertUser(user);
        return user;
    }

    public User findByUsername(String username) {
        return userDao.findByUsername(username);
    }

    public User findByPhoneNumber(String phonenumber) {
        return userDao.findByPhoneNumber(phonenumber);
    }

    @Override
    public UserDetails loadUserByUsername(String phonenumber) throws UsernameNotFoundException {
        User user = userDao.findByPhoneNumber(phonenumber);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with phonenumber: " + phonenumber);
        }

        return new org.springframework.security.core.userdetails.User(user.getPhonenumber(), user.getPassword(), Collections.emptyList());
    }

    public void updatePassword(String phoneNumber, String newPassword) {
        User user = userDao.findByPhoneNumber(phoneNumber);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with phonenumber: " + phoneNumber);
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userDao.updateUser(user);
    }
}