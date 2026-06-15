<template>
  <div class="app-container">
    <header class="app-header">
      <router-link to="/" class="app-title">
        <span>🎮</span> PickPick
      </router-link>
      <router-link to="/history" class="pixel-btn pixel-btn--purple" style="font-size:14px;padding:6px 12px;">
        📋 记录
      </router-link>
    </header>

    <main>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
// App shell - layout shared across all pages
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
