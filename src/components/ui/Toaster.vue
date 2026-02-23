<script setup lang="ts">
import { useToast } from "@/composables/useToast";
import { X } from "lucide-vue-next";

const { toasts, dismiss } = useToast();
</script>

<template>
  <div class="fixed top-0 z-[100] flex w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
    <div v-for="toast in toasts" :key="toast.id" class="pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border bg-background p-6 pr-8 shadow-lg">
      <div class="grid gap-1">
        <p v-if="toast.title" class="text-sm font-semibold">
          {{ toast.title }}
        </p>
        <p v-if="toast.description" class="text-sm opacity-90">
          {{ toast.description }}
        </p>
      </div>
      <button
        type="button"
        class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 hover:text-foreground"
        @click="dismiss(toast.id)"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
