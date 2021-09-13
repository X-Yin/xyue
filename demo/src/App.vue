<template>
  <div class="app">
    <p @click="setValue">setValue</p>
    <p @click="getValue">getValue</p>
    <input id="input" type="text" :value="value" @input="changeValue">
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
      value: 'case',
      array: ['a', 'b', 'c']
    }
  },
  mounted() {
    console.log('mounted');
    window.input = document.getElementById('input');
  },
  components: {
    Bar
  },
  methods: {
    setValue() {
      this.value = "hello value!!!";
    },
    getValue() {
      console.log('>>>> get value', this.value);
    },
    changeValue(e) {
      console.log('>>>> changeValue ', e);
      this.value = e.target.value;
    },
    changeFlag() {
      this.flag = !this.flag;
      console.log('>>>>> changeFlag', this.flag);
    },
    newItem() {
      this.array.push(1);
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
  /*background-image: url("https://momentum.photos/img/89af9ef6-9a09-49de-a085-fd6b91f86c64.jpg?momo_cache_bg_uuid=d101afda-b9ff-4130-a371-50f9ffea64bf");*/
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
