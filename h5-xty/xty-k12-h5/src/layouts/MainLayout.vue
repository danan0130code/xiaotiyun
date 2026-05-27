<template>
  <div class="main-layout">
    <div class="content">
      <router-view />
    </div>
    <van-tabbar v-model="activeTab" fixed placeholder @change="onTabChange">
      <van-tabbar-item icon="home-o" name="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="flag-o" name="/sports-goal">运动目标</van-tabbar-item>
      <van-tabbar-item icon="contact" name="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeTab = ref(route.path)

watch(() => route.path, (newPath) => {
  activeTab.value = newPath
})

const onTabChange = (path) => {
  router.push(path)
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: #f8f8fb;
}
.content {
  padding-bottom: 50px;
}
</style>
