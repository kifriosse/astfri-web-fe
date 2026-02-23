<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  AlertCircle,
  CheckCircle2,
  Code as CodeIcon,
  Copy,
  Image as ImageIcon,
  Terminal,
} from "lucide-vue-next";
import UiButton from "@/components/ui/UiButton.vue";
import UiProgress from "@/components/ui/UiProgress.vue";
import { useToast } from "@/composables/useToast";
import { extractPlantUML, getPlantUMLUrl } from "@/lib/plantuml";

const props = defineProps<{
  content: string;
  isLoading: boolean;
  error?: string;
  isUml?: boolean;
  transformationAttempted?: boolean;
}>();

const { toast } = useToast();

const activeTab = ref<"diagram" | "source">("diagram");

watch(
  () => props.isUml,
  () => {
    activeTab.value = "diagram";
  }
);

const pumlCode = computed(() => {
  if (!props.content) {
    return null;
  }
  return extractPlantUML(props.content);
});

const pumlUrl = computed(() => {
  if (!pumlCode.value) {
    return "";
  }
  return getPlantUMLUrl(pumlCode.value);
});

const showUmlTabs = computed(() => Boolean(props.isUml && pumlCode.value));

const handleCopy = async () => {
  if (!props.content) {
    return;
  }

  await navigator.clipboard.writeText(props.content);
  toast({
    title: "Copied",
    description: "Output copied to clipboard.",
  });
};
</script>

<template>
  <div class="flex flex-col h-full space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <Terminal class="w-5 h-5 text-accent" />
        <label class="text-lg font-headline tracking-tight">Transformation Result</label>
      </div>
      <UiButton
        v-if="content && !isLoading && !error"
        variant="ghost"
        size="sm"
        class="text-muted-foreground hover:text-accent"
        @click="handleCopy"
      >
        <Copy class="w-4 h-4 mr-2" />
        Copy
      </UiButton>
    </div>

    <div class="relative flex-1">
      <div
        v-if="isLoading"
        class="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-background/50 z-30 rounded-lg"
      >
        <div class="w-full max-w-xs space-y-2">
          <UiProgress :value="logs?.length ? (logs.length / 4) * 100 : 33" />
          <p class="text-sm text-center text-muted-foreground animate-pulse">
            {{ logs?.[logs.length - 1] || "Processing..." }}
          </p>
        </div>
      </div>

      <div class="h-full border-none shadow-sm overflow-hidden bg-white rounded-lg">
        <div class="p-0 h-full flex flex-col">
          <div v-if="error" class="flex flex-col items-center justify-center flex-1 p-12 text-center">
            <AlertCircle class="w-12 h-12 text-destructive mb-4" />
            <h3 class="text-lg font-headline font-bold text-destructive">Chyba</h3>
            <p class="text-muted-foreground mt-2">{{ error }}</p>
          </div>

          <template v-else-if="content">
            <div v-if="showUmlTabs" class="flex-1 flex flex-col h-full">
              <div class="px-6 pt-4 border-b bg-muted/20">
                <div class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all"
                    :class="activeTab === 'diagram' ? 'bg-background text-foreground shadow-sm' : ''"
                    @click="activeTab = 'diagram'"
                  >
                    <ImageIcon class="w-4 h-4 mr-2" />
                    Diagram
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all"
                    :class="activeTab === 'source' ? 'bg-background text-foreground shadow-sm' : ''"
                    @click="activeTab = 'source'"
                  >
                    <CodeIcon class="w-4 h-4 mr-2" />
                    Source
                  </button>
                </div>
              </div>

              <div v-if="activeTab === 'diagram'" class="flex-1 p-0 m-0 overflow-hidden h-full">
                <div class="w-full h-full flex items-center justify-center bg-white p-8 overflow-auto">
                  <img
                    :src="pumlUrl"
                    alt="PlantUML Diagram"
                    class="max-w-full h-auto shadow-md rounded border border-border/50"
                  />
                </div>
              </div>

              <div v-else class="flex-1 p-0 m-0 overflow-hidden h-full">
                <pre class="flex-1 p-6 font-mono text-sm overflow-auto whitespace-pre-wrap leading-relaxed h-full">{{ content }}</pre>
              </div>
            </div>

            <pre v-else class="flex-1 p-6 font-mono text-sm overflow-auto whitespace-pre-wrap leading-relaxed">{{ content }}
            </pre>
          </template>

          <div v-else-if="!isLoading && transformationAttempted" class="flex flex-col items-center justify-center flex-1 p-12 text-center">
            <AlertCircle class="w-12 h-12 text-warning mb-4" />
            <h3 class="text-lg font-headline font-bold text-muted-foreground">No Content</h3>
            <p class="text-muted-foreground mt-2">Transformation completed but returned empty output.</p>
          </div>

          <div v-else-if="!isLoading" class="flex flex-col items-center justify-center flex-1 p-12 text-center text-muted-foreground">
            <CheckCircle2 class="w-12 h-12 mb-4 opacity-20" />
            <p>Run transformation to see results</p>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>
