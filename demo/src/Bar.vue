<template>
  <div class="bar">
    <h2>bar-{{msg}}</h2>
    <button @click="changeMessage">change parent message</button>
  </div>
</template>

<script>
export default {
  name: 'bar',
  props: ['msg'],
  methods: {
    changeMessage() {
      this.emit('changeMessage', this.msg + ' 1');
    }
  }
}
</script>

<style>
.bar {
  color: orange;
}
</style>