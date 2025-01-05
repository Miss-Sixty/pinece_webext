<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import BookmarksTree from "./components/BookmarksTree.vue";
import Button from "./components/Button.vue";
import Result from "./components/Result.vue";
import startProgress from "./utils/percentage";
import { recursiveFind } from "./utils/tree";
import type { BookmarkNode, ResultData, TreeDataNode } from "./types";
import download from "./utils/download";

const bookmarks = ref<TreeDataNode[]>([]); // 书签数据
const isExporting = ref<boolean>(false);
const type = ref<"home" | "progress" | "success">("home");
const exportedData = shallowRef<BookmarkNode[]>(); // 存储导出的数据

// 模拟异步操作
const performAsyncTask = async (): Promise<BookmarkNode[]> => {
  return recursiveFind(bookmarks.value) as unknown as BookmarkNode[];
};

const success = (res: BookmarkNode[]): void => {
  exportedData.value = res; // 保存导出的数据
  type.value = "success";
};

const { progress, start } = startProgress(performAsyncTask, success);

watch(type, (val: string) => {
  if (val === "progress") start();
});

const resultData = computed<ResultData>(() => {
  switch (type.value) {
    case "progress":
      return {
        title: "Exporting...",
        description: "Please wait a moment, this may take some time.",
        icon: "pinece.svg",
      };
    case "success":
      return {
        title: "Export Successful!",
        description: "Click the button to download the json file",
        icon: "pinece.svg",
      };
    default:
      return {
        title: "Pinece",
        description: "Export Your Bookmarks to JSON File",
        icon: "pinece.svg",
      };
  }
});
</script>

<template>
  <div v-if="!isExporting" class="flex flex-col items-center py-8 px-10 w-96">
    <Result
      :title="resultData.title"
      :description="resultData.description"
      :icon="resultData.icon"
      :percentage="progress"
    />
    <Button class="mt-8" v-if="type === 'home'" @click="isExporting = true">
      Export Bookmarks
    </Button>

    <Button
      class="mt-8"
      v-if="type === 'success'"
      @click="download(exportedData)"
    >
      <Icon icon="solar:download-minimalistic-linear" />
      Download
    </Button>
  </div>
  <BookmarksTree
    v-else
    v-model="bookmarks"
    v-model:isExporting="isExporting"
    v-model:type="type"
  />
</template>
