import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: localStorage.getItem("token") || null, // 🚀 读取本地存储中的 token
    },
    mutations: {
        setToken(state, newToken) {
            state.token = newToken;
            localStorage.setItem("token", newToken); // 🚀 保存 token 到本地存储
        },
        removeToken(state) {
            state.token = null;
            localStorage.removeItem("token"); // 🚀 清除本地存储 token
        }
    },
    actions: {
        login({ commit }, token) {
            commit('setToken', token);
        },
        logout({ commit }) {
            commit('removeToken');
        }
    }
});
