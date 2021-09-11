<template>
  <div class="app">
    <h1>App</h1>
<!--    <button @click="changeMsg">{{message}}</button>-->
    <p
        :class="['container', flag ? 'hello' : 'world']"
        :style="{'font-size': flag ? '12px' : '20px'}"
        @click="changeFlag">changeFlag - {{flag}}</p>
    <bar :msg="message" @changeMessage="changeMessage"></bar>
  </div>
</template>

<script>
import Bar from './Bar.vue';
export default {
  name: 'App',
  data() {
    return {
      message: 'hello world',
      flag: true,
      array: [1, 2, 3]
    }
  },
  components: {
    Bar
  },
  methods: {
    changeFlag() {
      this.flag = false;
      console.log('>>>>> changeFlag', this.flag);
    },
    clickHandler() {},
    changeMessage(msg) {
      this.message = msg;
    },
    changeMsg() {
      this.message = 'base!!!';
    }
  }
}
</script>

<style>
.app {
  width: 200px;
  height: 200px;
  color: red;
  background-size: cover;
  background-image: url("https://momentum.photos/img/89af9ef6-9a09-49de-a085-fd6b91f86c64.jpg?momo_cache_bg_uuid=d101afda-b9ff-4130-a371-50f9ffea64bf");
}

.hello {
  color: blue;
}
.world {
  color: green;
}
.container {
  border: 1px solid #ccc;
}
</style>
