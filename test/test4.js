const styleReg = /<style>[\n\s\t]*([\s\S]*?)[\n\s\t]*<\/style>/;
const templateReg = /<template>[\n\s\t]*([\s\S]*?)[\n\s\t]*<\/template>/;
const scriptReg = /<script>[\n\s\t]*([\s\S]*?)[\n\s\t]*<\/script>/;

const content = `
<template>
  <div class="app">
    <h1>App</h1>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: 'hello world'
    }
  },
  methods: {
    clickHandler() {}
  }
}
</script>

<style>
.app {
  width: 200px;
  height: 200px;
  background-size: cover;
  background-image: url("https://momentum.photos/img/89af9ef6-9a09-49de-a085-fd6b91f86c64.jpg?momo_cache_bg_uuid=d101afda-b9ff-4130-a371-50f9ffea64bf");
}
</style>
`;

let res = content.match(styleReg);
const reg = /^[\n\s\t]*([\s\S]*?)[\n\s\t]*$/;
console.log(res);
// const res1 = res[1].match(reg);
// console.log(res1);
