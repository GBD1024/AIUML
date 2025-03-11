const getUserInfo = async (tokenStore, axios) => {
    try {
        const token = tokenStore.token;
        console.log(token);
        const response = await axios.get('/user/userInfo', {
            headers: {
                Authorization: token,
            }
        });

        if (!response.data.code) {
            console.log('获取用户信息成功:', response.data.info);
            return response.data.info;
        } else {
            console.error('获取用户信息失败:', response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('请求用户信息出错:', error);
        throw error;
    }
};
export default getUserInfo;