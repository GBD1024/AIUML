import axios from 'axios';

const getUserInfo = async (token) => {
    try {
        const response = await axios.get('/api/user/userInfo', {
            headers: {
                Authorization: token,
            }
        });

        if (response.data && response.data.code === 0) { // 假设成功状态码为0
            console.log('获取用户信息成功:', response.data.info);
            return response.data.info;
        } else {
            console.error('获取用户信息失败:', response.data.message || '未知错误');
            throw new Error(response.data.message || '未知错误');
        }
    } catch (error) {
        if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.error('请求用户信息出错:', error.response.data);
            throw new Error(error.response.data.message || '请求用户信息失败');
        } else {
            // 其他错误（如网络问题）
            console.error('请求用户信息出错:', error.message);
            throw new Error('请求用户信息失败');
        }
    }
};

export default getUserInfo;