<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Settings2, Sparkles, Wand2 } from "lucide-vue-next";
import Header from "@/components/Header.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import OutputViewer from "@/components/OutputViewer.vue";
import Toaster from "@/components/ui/Toaster.vue";
import UiButton from "@/components/ui/UiButton.vue";
import { transformSourceCode, type TransformResponse } from "@/lib/api";
import config from "@/lib/config.json";

type InputLib = {
  id: string;
  label: string;
  monacoEditorId: string;
  defaultExample: string;
};

type OutputLib = {
  id: string;
  label: string;
};

const inputLibs = config.InputLibs as InputLib[];
const outputLibs = config.OutputLibs as OutputLib[];
const selectedLanguage = ref<string>(inputLibs[0].id);
const selectedOutput = ref<string>(outputLibs[0].id);
const sourceCode = ref<string>(inputLibs[0].defaultExample);
const transformationResult = ref<TransformResponse | null>(null);
const isTransforming = ref(false);

const currentLib = computed(() => inputLibs.find((lib) => lib.id === selectedLanguage.value));

const transformationAttempted = computed(() => transformationResult.value !== null);

watch(selectedLanguage, (newLangId) => {
  const lib = inputLibs.find((l) => l.id === newLangId);
  if (lib) {
    sourceCode.value = lib.defaultExample;
  }
});

const handleTransform = async () => {
  isTransforming.value = true;
  transformationResult.value = null;

  try {
    const response = await transformSourceCode({
      inputText: sourceCode.value,
      inputLib: selectedLanguage.value,
      outputLib: selectedOutput.value,
    });
    transformationResult.value = response;
  } catch (error) {
    transformationResult.value = {
      result: "",
      error: "Nastala neoakavana chyba pri komunikacii so serverom.",
    };
  } finally {
    isTransforming.value = false;
  }
};

const isUml = computed(() => selectedOutput.value === "uml");
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background selection:bg-accent/30">
    <Header />

    <main class="flex-1 flex flex-col p-6 max-w-[1600px] mx-auto w-full space-y-6">
      <div class="bg-white rounded-xl border p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div class="flex flex-col space-y-1.5 w-full sm:w-48">
            <label class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Source Library
            </label>
            <select
              v-model="selectedLanguage"
              class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option v-for="lib in inputLibs" :key="lib.id" :value="lib.id">
                {{ lib.label }}
              </option>
            </select>
          </div>

          <div class="flex flex-col space-y-1.5 w-full sm:w-48">
            <label class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Output Library
            </label>
            <select
              v-model="selectedOutput"
              class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option v-for="lib in outputLibs" :key="lib.id" :value="lib.id">
                {{ lib.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex items-center space-x-3 w-full md:w-auto">
          <UiButton variant="outline" class="flex-1 md:flex-none border-dashed border-2">
            <Settings2 class="w-4 h-4 mr-2" />
            Config
          </UiButton>
          <UiButton
            size="lg"
            :disabled="isTransforming"
            class="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95"
            @click="handleTransform"
          >
            <Sparkles v-if="isTransforming" class="w-4 h-4 mr-2 animate-spin" />
            <Wand2 v-else class="w-4 h-4 mr-2" />
            {{ isTransforming ? "Transforming..." : "Execute Transformation" }}
          </UiButton>
        </div>
      </div>

      <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        <div class="flex flex-col animate-in slide-in-from-left duration-500 overflow-hidden h-full">
          <CodeEditor v-model="sourceCode" :language="currentLib?.monacoEditorId || 'cpp'" />
        </div>

        <div class="flex flex-col animate-in slide-in-from-right duration-700 overflow-hidden h-full">
          <OutputViewer
            :content="transformationResult?.result || ''"
            :is-loading="isTransforming"
            :error="transformationResult?.error"
            :is-uml="isUml"
            :transformation-attempted="transformationAttempted"
          />
        </div>
      </div>
    </main>

    <footer class="p-6 text-center text-xs text-muted-foreground border-t bg-white">
      <p>© 2026 ASTFRI Transformation Engine. Powering automated software analysis.</p>
    </footer>

    <Toaster />
  </div>
</template>
