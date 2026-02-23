<script setup lang="ts">
import { computed, ref } from "vue";
import { Code, Upload } from "lucide-vue-next";
import UiButton from "@/components/ui/UiButton.vue";

const props = defineProps<{ modelValue: string; language: string }>();
const emit = defineEmits<{ (event: "update:modelValue", value: string): void }>();

const fileInputRef = ref<HTMLInputElement | null>(null);

const characterCount = computed(() => props.modelValue.length);

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    emit("update:modelValue", String(reader.result ?? ""));
  };
  reader.readAsText(file);
};

const openFilePicker = () => {
  fileInputRef.value?.click();
};
</script>

<template>
  <div class="flex flex-col h-full space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <Code class="w-5 h-5 text-accent" />
        <label class="text-lg font-headline tracking-tight">Source Code Input</label>
      </div>
      <div class="relative">
        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          @change="handleFileUpload"
          accept=".cpp,.java,.cs,.txt"
        />
        <UiButton variant="outline" size="sm" class="flex items-center space-x-2" @click="openFilePicker">
          <Upload class="w-4 h-4" />
          <span>Upload File</span>
        </UiButton>
      </div>
    </div>

    <div class="relative flex-1 group">
      <div class="absolute inset-0 bg-accent/5 rounded-lg border-2 border-dashed border-accent/20 transition-all group-focus-within:border-accent/50 group-focus-within:bg-accent/[0.02]" />
      <textarea
        class="relative z-10 w-full h-full min-h-[500px] p-6 font-mono text-sm bg-transparent border-none resize-none focus-visible:outline-none"
        :value="modelValue"
        :placeholder="`Enter your ${language} code here...`"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      />
      <div class="absolute bottom-4 right-4 text-xs text-muted-foreground z-20 pointer-events-none">
        {{ characterCount }} characters
      </div>
    </div>
  </div>
</template>
