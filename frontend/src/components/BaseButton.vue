<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    class="nice-btn"
    @click="!to && $emit('click')"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
defineProps<{
  to?: string
}>()
</script>

<style scoped>
.nice-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #fff;
  color: #7a4ccf;
  font-weight: 600;
  border: 2px solid #7a4ccf;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(122, 76, 207, 0.1);
}
.nice-btn:hover {
  background: #7a4ccf;
  color: #fff;
  box-shadow: 0 4px 12px rgba(122, 76, 207, 0.3);
}
</style>
