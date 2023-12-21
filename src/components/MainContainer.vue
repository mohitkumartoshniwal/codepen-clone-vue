<script setup lang="ts">
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import JSONWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import CSSWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HTMLWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import TSWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import Editor from "./Editor.vue";
import { LANGUAGES, type PAYLOAD } from "@/types";
import { ref } from "vue";
import { generateHTML } from "@/utils";

let htmlCode = ref("");
let cssCode = ref("");
let jsCode = ref("");

let iframe = ref<HTMLIFrameElement>();

function onChange(payload: PAYLOAD) {
  if (payload.type === LANGUAGES.HTML) {
    htmlCode.value = payload.code;
  } else if (payload.type === LANGUAGES.CSS) {
    cssCode.value = payload.code;
  } else if (payload.type === LANGUAGES.JS) {
    jsCode.value = payload.code;
  }

  iframe.value!.srcdoc = generateHTML({
    html: htmlCode.value,
    css: cssCode.value,
    js: jsCode.value,
  });
}

self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === "json") return new JSONWorker();

    if (label === "css" || label === "scss" || label === "less")
      return new CSSWorker();

    if (label === "html" || label === "handlebars" || label === "razor")
      return new HTMLWorker();

    if (label === "typescript" || label === "javascript") return new TSWorker();

    return new EditorWorker();
  },
};
</script>
<template>
  <main>
    <Splitpanes horizontal class="w-full h-full">
      <Pane min-size="20" class="border-b border-gray-700">
        <Splitpanes vertical>
          <Pane min-size="5">
            <Editor
              class="w-full h-full"
              :type="LANGUAGES.HTML"
              :display-name="LANGUAGES.HTML"
              @code-change="onChange"
            />
          </Pane>

          <Pane min-size="5">
            <Editor
              class="w-full h-full"
              :type="LANGUAGES.CSS"
              :display-name="LANGUAGES.CSS"
              @code-change="onChange"
            />
          </Pane>
          <Pane min-size="5">
            <Editor
              class="w-full h-full"
              :type="LANGUAGES.JS"
              :display-name="LANGUAGES.shortJs"
              @code-change="onChange"
            />
          </Pane>
        </Splitpanes>
      </Pane>
      <Pane
        ><iframe
          class="w-full h-full"
          ref="iframe"
          sandbox="allow-scripts"
          frameborder="0"
        ></iframe
      ></Pane>
    </Splitpanes>
  </main>
</template>
<style>
main {
  height: calc(100vh - var(--nav-height));
}

.splitpanes--horizontal > .splitpanes__splitter {
  min-height: 0.5rem;
  background: black;
}

.splitpanes--vertical > .splitpanes__splitter {
  min-width: 0.5rem;
  background: black;
}
</style>
