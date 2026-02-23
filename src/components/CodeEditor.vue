<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { Code, Upload } from "lucide-vue-next";
import loader from "@monaco-editor/loader";
import UiButton from "@/components/ui/UiButton.vue";
import type * as Monaco from "monaco-editor";

const props = defineProps<{ modelValue: string; language: string }>();
const emit = defineEmits<{ (event: "update:modelValue", value: string): void }>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const editorContainer = ref<HTMLDivElement | null>(null);
let editor: Monaco.editor.IStandaloneCodeEditor | null = null;
let monaco: typeof Monaco | null = null;

const characterCount = computed(() => props.modelValue.length);

// Initialize Monaco Editor
onMounted(async () => {
  if (!editorContainer.value) return;

  monaco = await loader.init();

  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: getLanguageId(props.language),
    theme: "vs-light",
    automaticLayout: true,
    minimap: { enabled: true },
    fontSize: 14,
    fontFamily: "Monaco, monospace",
  });

  // Listen to editor changes
  editor.onDidChangeModelContent(() => {
    const value = editor!.getValue();
    emit("update:modelValue", value);
  });
});

// Watch for external modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor && editor.getValue() !== newValue) {
      editor.setValue(newValue);
    }
  }
);

// Watch for language changes
watch(
  () => props.language,
  (newLanguage) => {
    if (editor && monaco) {
      monaco.editor.setModelLanguage(editor.getModel()!, getLanguageId(newLanguage));
    }
  }
);

// Map display language to Monaco language ID
function getLanguageId(language: string): string {
  const map: Record<string, string> = {
    cpp: "cpp",
    csharp: "csharp",
    java: "java",
  };
  return map[language] || language.toLowerCase();
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !editor) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const content = String(reader.result ?? "");
    editor!.setValue(content);
    emit("update:modelValue", content);
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
      <div class="flex items-center space-x-2">
        <div class="text-xs text-muted-foreground">
          {{ characterCount }} characters
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
    </div>

    <div ref="editorContainer" class="flex-1 rounded-lg border border-input overflow-hidden shadow-sm" />
  </div>
</template>
