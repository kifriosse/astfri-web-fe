<script setup lang="ts">
import { ref, watch, computed } from "vue";

type ConfigOption = {
  id: string;
  label: string;
  type: "boolean" | "string" | "number" | "select" | "color";
  cols?: number;
  defaultValue: any;
  description?: string;
  options?: { value: string | number; label: string }[];
};

interface Props {
  config?: ConfigOption[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (event: "update:config", value: Record<string, any>): void;
}>();

const configValues = ref<Record<string, any>>({});

// Initialize config values from defaults
watch(
  () => props.config,
  (newConfig) => {
    if (!newConfig) {
      configValues.value = {};
      return;
    }
    configValues.value = newConfig.reduce(
      (acc, option) => {
        acc[option.id] = option.defaultValue;
        return acc;
      },
      {} as Record<string, any>
    );
    emit("update:config", configValues.value);
  },
  { immediate: true, deep: true }
);

const handleInputChange = () => {
  emit("update:config", configValues.value);
};

const getInputId = (optionId: string) => `output-config-${optionId}`;

// Maps 12-column grid value to Tailwind width class for md and up
const getColClass = (cols?: number): string => {
  const colValue = cols ?? 12;
  const colMap: Record<number, string> = {
    1: "md:w-1/12",
    2: "md:w-1/6",
    3: "md:w-1/4",
    4: "md:w-1/3",
    5: "md:w-5/12",
    6: "md:w-1/2",
    8: "md:w-2/3",
    9: "md:w-3/4",
    10: "md:w-5/6",
    12: "md:w-full",
  };
  return colMap[colValue] || "md:w-full";
};

// Maps 12-column grid value to Tailwind grid column class
const getGridColClass = (cols?: number): string => {
  const colValue = cols ?? 12;
  const colMap: Record<number, string> = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    8: "md:col-span-8",
    9: "md:col-span-9",
    10: "md:col-span-10",
    12: "md:col-span-12",
  };
  return `col-span-12 ${colMap[colValue] || "md:col-span-12"}`;
};
</script>

<template>
  <div v-if="props.config && props.config.length > 0" class="space-y-4">
    <h3 class="text-sm font-headline font-bold uppercase tracking-widest text-muted-foreground">
      Output Configuration
    </h3>

    <div class="bg-muted/20 rounded-lg p-4 border border-border">
      <div class="grid grid-cols-12 gap-4">
        <div v-for="option in props.config" :key="option.id" :class="getGridColClass(option.cols)" class="flex flex-col gap-2">
          <!-- Boolean Input -->
          <div v-if="option.type === 'boolean'" class="flex items-start gap-2">
            <input
              :id="getInputId(option.id)"
              v-model="configValues[option.id]"
              type="checkbox"
              class="w-4 h-4 rounded border-input focus:ring-2 focus:ring-ring mt-1 flex-shrink-0"
              @change="handleInputChange"
            />
            <div class="flex-1">
              <label :for="getInputId(option.id)" class="text-sm font-medium cursor-pointer block">
                {{ option.label }}
              </label>
              <p v-if="option.description" class="text-xs text-muted-foreground mt-1">
                {{ option.description }}
              </p>
            </div>
          </div>

          <!-- Select Input -->
          <div v-else-if="option.type === 'select'" class="flex flex-col gap-1">
            <label :for="getInputId(option.id)" class="text-sm font-medium">
              {{ option.label }}
            </label>
            <select
              :id="getInputId(option.id)"
              v-model="configValues[option.id]"
              class="flex h-9 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              @change="handleInputChange"
            >
              <option v-for="opt in option.options" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <p v-if="option.description" class="text-xs text-muted-foreground">
              {{ option.description }}
            </p>
          </div>

          <!-- Color Input -->
          <div v-else-if="option.type === 'color'" class="flex flex-col gap-1">
            <label :for="getInputId(option.id)" class="text-sm font-medium">
              {{ option.label }}
            </label>
            <div class="flex items-center gap-2">
              <input
                :id="getInputId(option.id)"
                v-model="configValues[option.id]"
                type="color"
                class="w-10 h-9 rounded-md border border-input cursor-pointer"
                @change="handleInputChange"
              />
              <input
                v-model="configValues[option.id]"
                type="text"
                class="flex-1 h-9 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="#000000"
                @change="handleInputChange"
              />
            </div>
          </div>

          <!-- Text/Number Input -->
          <div v-else class="flex flex-col gap-1">
            <label :for="getInputId(option.id)" class="text-sm font-medium">
              {{ option.label }}
            </label>
            <input
              :id="getInputId(option.id)"
              v-model="configValues[option.id]"
              :type="option.type"
              class="flex h-9 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              @change="handleInputChange"
            />
            <p v-if="option.description" class="text-xs text-muted-foreground">
              {{ option.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
