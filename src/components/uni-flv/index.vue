<template>
  <view style="width:200px;height:300px;"><web-view  :src="path"></web-view> </view>
</template>

<script>
export default {
  name: 'UniFlv',
  data() {
    return {
    }
  },
  props: {
    path: {
      type: String,
      default: ""
    },
    
  },

  onLoad(options) {},

  onShow() {},

  created() {},

  methods: {}
}
</script>

<style scoped></style>
