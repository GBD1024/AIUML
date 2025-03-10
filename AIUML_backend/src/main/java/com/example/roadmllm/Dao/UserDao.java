package com.example.roadmllm.Dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.roadmllm.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface UserDao extends BaseMapper{
    @Insert("INSERT INTO 用户 (username, password, phonenumber) VALUES (#{username}, #{password}, #{phonenumber})")
    void insertUser(User user);

    @Select("SELECT * FROM 用户 WHERE username = #{username}")
    User findByUsername(String username);

    @Select("SELECT * FROM 用户 WHERE phonenumber = #{phonenumber}")
    User findByPhoneNumber(String phonenumber);

    @Update("UPDATE 用户 SET password = #{password} WHERE phonenumber = #{phonenumber}")
    void updateUser(User user);
}
