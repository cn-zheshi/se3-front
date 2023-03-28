<template>
  <!--示例登录页面，就是HTML-->
  <div class="login">
    <div>login</div>
    <div>
      <p>username</p>
      <input type="text" value="" placeholder="username" id="uid" />

      <p>password</p>
      <input type="password" value="" placeholder="password" id="pw" />

      <p>verification</p>
      <input type="text" value="" placeholder="verification" id="vcode" />

      <p>{{ verifycode }}</p>
      <div>
        <button id="loginbutton" v-on:click="submitlogin()">login</button>
      </div>
    </div>
    <router-link to="/register">register</router-link>
  </div>
</template>

<script>
export default {
  name: "Login", //注册在路由（router.js）里的就是这个
  props: {},
  data() {
    return {
      verifycode: "test",
    };
  },
  methods: {
    submitlogin() {
      this.verifycode = "hello";
    },
  },
  created() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- 样式写这里 -->
<style scoped lang="less"></style>
