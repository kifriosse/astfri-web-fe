<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ value?: number }>();

const indicatorStyle = computed(() => ({
  transform: `translateX(-${100 - (props.value ?? 0)}%)`,
}));
</script>

<template>
  <div class="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
    <div class="h-full w-full flex-1 bg-primary transition-all" :style="indicatorStyle" />
  </div>
</template>
