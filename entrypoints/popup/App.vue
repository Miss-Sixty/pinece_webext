<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import BookmarksTree from "./components/BookmarksTree.vue";
import Button from "./components/Button.vue";
import Result from "./components/Result.vue";
import startProgress from "./utils/percentage";
import { recursiveFind } from "./utils/tree";
import type { BookmarkNode, ResultData, TreeDataNode } from "./types";
import download from "./utils/download";
import { useI18n } from "vue-i18n";
import { Download } from "./components/icons";

const { t } = useI18n({ useScope: "global" });

const bookmarks = ref<TreeDataNode[]>([]); // 书签数据
const isExporting = ref<boolean>(false);
const type = ref<"home" | "progress" | "success">("success");
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
        title: t("progress.title"),
        description: t("progress.description"),
        icon: "pinece.svg",
      };
    case "success":
      return {
        title: t("success.title"),
        description: t("success.description"),
        icon: "pinece.svg",
      };
    default:
      return {
        title: t("home.title"),
        description: t("home.description"),
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
      {{ t("home.exportButton") }}
    </Button>

    <Button
      class="mt-8"
      v-if="type === 'success'"
      @click="download(exportedData)"
    >
      <Download style="height: 1em; width: 1em" />
      {{ t("success.downloadButton") }}
    </Button>
  </div>
  <BookmarksTree
    v-else
    v-model="bookmarks"
    v-model:isExporting="isExporting"
    v-model:type="type"
  />
</template>
