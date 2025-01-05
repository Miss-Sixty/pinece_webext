<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  icon: string;
  percentage?: number;
}>();
</script>

<template>
  <img class="size-20" :src="icon" alt="pinece logo" />
  <ElProgress
    class="mt-8 w-full"
    v-if="percentage"
    text-inside
    :stroke-width="18"
    :percentage="percentage"
  />
  <h1 class="text-2xl font-bold py-4">{{ title }}</h1>
  <p class="text-base text-gray-500">
    {{ description }}
  </p>
</template>
