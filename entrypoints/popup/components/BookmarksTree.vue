<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { getChromeBookmarks } from "../utils/bookmark/chrome";
import { recursiveChange, transformBookmark } from "../utils/tree";
import type { ChangedTreeData, TreeDataNode, CheckedInfo } from "../types";
import Button from "./Button.vue";
import { ref, shallowRef } from "vue";
import type { TreeInstance } from "element-plus";

const emit = defineEmits<{
  "update:isExporting": [value: boolean];
  "update:type": [value: "home" | "progress" | "success"];
}>();

const modelValue = defineModel<TreeDataNode[]>("modelValue", {
  type: Array as () => TreeDataNode[],
  default: () => [],
});

const treeRef = ref<TreeInstance>();
const loading = ref<boolean>(false);
const bookmarks = shallowRef<TreeDataNode[]>([]);
const checkedBookmarks = ref<TreeDataNode[]>([]);

const treeProps = {
  value: "id",
  label: "title",
  children: "children",
  icon: "icon",
} as const;

/**
 * 导出书签
 */
const handleExportBookmarks = (): void => {
  emit("update:type", "progress");
  emit("update:isExporting", false);
  const allBookmarks = treeRef.value?.getCheckedNodes(false, true) || [];
  modelValue.value = JSON.parse(JSON.stringify(allBookmarks)) as TreeDataNode[];
};

/**
 * 选择书签
 */
const handleCheck = (_data: TreeDataNode, info: CheckedInfo): void => {
  checkedBookmarks.value = info.checkedNodes;
};

/**
 * 获取书签
 */
const getBookmarks = async (): Promise<void> => {
  loading.value = true;
  try {
    const result = (await getChromeBookmarks()) as TreeDataNode[];
    bookmarks.value = await recursiveChange<TreeDataNode, ChangedTreeData>(
      result[0].children!,
      transformBookmark
    );
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

getBookmarks();
</script>

<template>
  <div class="w-96 max-h-[600px] min-h-[300px] flex flex-col overflow-hidden">
    <div
      @click="$emit('update:isExporting', false)"
      class="m-4 w-fit flex items-center hover:bg-gray-100 py-2 pl-3 pr-4 rounded-full cursor-pointer gap-1 transition-colors"
    >
      <Icon
        class="size-7"
        icon="material-symbols-light:arrow-left-alt-rounded"
      />
      <h1 class="text-lg">Home | Select Bookmarks</h1>
    </div>
    <el-tree
      v-loading="loading"
      :data="bookmarks"
      ref="treeRef"
      class="px-4 min-h-44 overflow-y-auto"
      node-key="id"
      show-checkbox
      :props="treeProps"
      @check="handleCheck"
    >
      <template #default="{ node }">
        <Icon
          class="text-black flex-shrink-0"
          :icon="
            node.data.type === 'link'
              ? 'solar:earth-linear'
              : 'solar:folder-2-linear'
          "
        />
        <span :title="node.label" class="ml-0.5 text-black truncate">
          {{ node.label }}
        </span>
      </template>
    </el-tree>

    <div class="py-8 px-10">
      <Button
        @click="handleExportBookmarks"
        :disabled="!checkedBookmarks.length"
      >
        Continue
      </Button>
    </div>
  </div>
</template>
