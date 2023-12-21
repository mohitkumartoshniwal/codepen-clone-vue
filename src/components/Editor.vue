<template>
  <div class="flex flex-col w-full h-full">
    <div
      class="font-semibold text-xl text-white pb-1 pl-1 border-gray-700 border-b-2"
    >
      {{ displayName.toUpperCase() }}
    </div>

    <div ref="container" class="flex-1"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRefs } from "vue";
import * as monaco from "monaco-editor";

import { STORAGE_NAMES, type LANGUAGES, type PAYLOAD } from "@/types";
import {
  useDebounceFn,
  useLocalStorage,
  useResizeObserver,
} from "@vueuse/core/index.cjs";

const props = defineProps<{
  type: LANGUAGES;
  displayName: LANGUAGES;
}>();

const { type, displayName } = toRefs(props);

const emit = defineEmits<(e: "code-change", payload: PAYLOAD) => void>();

let container = ref<HTMLElement>();

let editor: monaco.editor.IStandaloneCodeEditor;

let code = useLocalStorage(`${STORAGE_NAMES.CODE}-${type.value}`, "");

onMounted(() => {
  editor = monaco.editor.create(container.value as HTMLElement, {
    language: type.value,
    theme: "vs-dark",
  });

  if (code.value) {
    editor.setValue(code.value);
  }

  emit("code-change", {
    type: type.value,
    code: code.value,
  });

  editor.onDidChangeModelContent(
    useDebounceFn(() => {
      if (code.value !== editor.getValue()) {
        code.value = editor.getValue();
        emit("code-change", {
          type: type.value,
          code: code.value,
        });
      }
    }, 500)
  );
});

let resizer = useResizeObserver(container, () => {
  editor.layout();
});

onUnmounted(() => {
  editor.dispose();
  resizer.stop();
});
</script>
