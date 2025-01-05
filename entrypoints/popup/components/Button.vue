<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean;
  onClick?: () => void;
}>();

const handleClick = () => {
  if (!props.onClick || props.disabled) return;
  props.onClick();
};
</script>

<template>
  <button
    class="flex items-center justify-center gap-2 w-full bg-blue-500 text-white px-5 py-3 rounded-full text-lg transition-colors"
    :disabled="disabled"
    :class="{
      'cursor-not-allowed': disabled,
      'opacity-50': disabled,
      'hover:bg-blue-600': !disabled,
    }"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>
