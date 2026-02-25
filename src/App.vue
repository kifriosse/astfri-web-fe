<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Settings2, Sparkles, Wand2 } from "lucide-vue-next";
import Header from "@/components/Header.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import OutputViewer from "@/components/OutputViewer.vue";
import OutputConfigForm from "@/components/OutputConfigForm.vue";
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
  config?: any[];
};

const inputLibs = config.InputLibs as InputLib[];
const outputLibs = config.OutputLibs as OutputLib[];
const selectedLanguage = ref<string>(inputLibs[0].id);
const selectedOutput = ref<string>(outputLibs[0].id);
const sourceCode = ref<string>(inputLibs[0].defaultExample);
const outputConfig = ref<Record<string, any>>({});
const showConfigForm = ref<boolean>(false);
const transformationResult = ref<TransformResponse | null>(null);
const isTransforming = ref(false);

const currentLib = computed(() => inputLibs.find((lib) => lib.id === selectedLanguage.value));

const currentOutputLib = computed(() => outputLibs.find((lib) => lib.id === selectedOutput.value));

const hasOutputConfig = computed(() => Boolean(currentOutputLib.value?.config && currentOutputLib.value.config.length > 0));

const transformationAttempted = computed(() => transformationResult.value !== null);

watch(selectedLanguage, () => {
  sourceCode.value = currentLib.value?.defaultExample || "";
});

watch(selectedOutput, () => {
  showConfigForm.value = false;
});

const toggleConfigForm = () => {
  showConfigForm.value = !showConfigForm.value;
};

const handleTransform = async () => {
  isTransforming.value = true;
  transformationResult.value = null;

  try {
    const response = await transformSourceCode({
      inputText: sourceCode.value,
      inputLib: selectedLanguage.value,
      outputLib: selectedOutput.value,
      outputConfig: Object.keys(outputConfig.value).length > 0 ? outputConfig.value : undefined,
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
      <div class="bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-4">
        <div :class="['flex flex-col sm:flex-row items-end gap-4', showConfigForm && 'sticky top-16 z-40 bg-white -mx-4 -mt-4 px-4 pt-4 pb-4 rounded-t-xl border-b']">
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

          <div class="flex items-center space-x-3 w-full sm:w-auto">
            <UiButton
              v-if="hasOutputConfig"
              variant="outline"
              class="flex-1 sm:flex-none border-dashed border-2"
              @click="toggleConfigForm"
            >
              <Settings2 class="w-4 h-4 mr-2" />
              {{ showConfigForm ? "Hide Config" : "Show Config" }}
            </UiButton>
            <UiButton
              size="lg"
              :disabled="isTransforming"
              class="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95"
              @click="handleTransform"
            >
              <Sparkles v-if="isTransforming" class="w-4 h-4 mr-2 animate-spin" />
              <Wand2 v-else class="w-4 h-4 mr-2" />
              {{ isTransforming ? "Transforming..." : "Execute Transformation" }}
            </UiButton>
          </div>
        </div>

        <OutputConfigForm
          v-if="showConfigForm && hasOutputConfig"
          :config="currentOutputLib?.config"
          @update:config="(cfg) => (outputConfig = cfg)"
        />
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
