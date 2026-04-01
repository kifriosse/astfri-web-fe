<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Activity, Github, ShieldCheck } from "lucide-vue-next";
import UiBadge from "@/components/ui/UiBadge.vue";
import { checkHealth } from "@/lib/api";

type HealthStatus = "Healthy" | "Error" | "Checking";

const healthStatus = ref<HealthStatus>("Checking");
let intervalId: number | undefined;

const fetchHealth = async () => {
  try {
    await checkHealth();
    healthStatus.value = "Healthy";
  } catch {
    healthStatus.value = "Error";
  }
};

onMounted(() => {
  fetchHealth();
  intervalId = window.setInterval(fetchHealth, 30000);
});

onBeforeUnmount(() => {
  if (intervalId) {
    window.clearInterval(intervalId);
  }
});
</script>

<template>
  <header class="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-2">
          <img src="/pwa-192x192.svg" alt="ASTFRI icon" class="w-10 h-10 rounded-lg" />
          <h1 class="text-xl font-headline font-bold tracking-tight text-primary">
            ASTFRI <span class="text-accent">Web</span>
          </h1>
        </div>

        <nav class="hidden md:flex items-center space-x-1">
          <UiBadge variant="secondary" class="bg-accent/10 text-accent border-none font-medium">
            v0.0.1
          </UiBadge>
        </nav>
      </div>

      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2 text-xs font-medium">
          <span class="text-muted-foreground uppercase tracking-widest">API Status:</span>
          <div class="flex items-center space-x-1">
            <Activity
              class="w-3 h-3"
              :class="
                healthStatus === 'Healthy'
                  ? 'text-green-500'
                  : healthStatus === 'Error'
                    ? 'text-red-500'
                    : 'text-yellow-500 animate-pulse'
              "
            />
            <span
              :class="
                healthStatus === 'Healthy'
                  ? 'text-green-600'
                  : healthStatus === 'Error'
                    ? 'text-red-600'
                    : 'text-yellow-600'
              "
            >
              {{ healthStatus }}
            </span>
          </div>
        </div>

        <div class="h-6 w-px bg-border mx-2" />

        <div class="flex items-center space-x-3">
            <a href="https://github.com/kifriosse/astfri" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-primary transition-colors">
                <Github class="w-5 h-5" />
            </a>
        </div>
      </div>
    </div>
  </header>
</template>
