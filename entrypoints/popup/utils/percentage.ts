const progress = ref<number>(0); // 进度值（0-100）
let isRunning = false // 控制按钮状态
let animationFrameId: number | null = null; // 存储 requestAnimationFrame 的 ID
let asyncTaskCompleted = false; // 标记异步任务是否已完成
let isTaskRunning = false // 标记异步任务是否正在执行

export default <T>(callback: () => Promise<T>, success: (res: T) => void) => {
  return { progress, start: () => startProgress(callback, success) };
};

const startProgress = <T>(callback: () => Promise<T>, success: (res: T) => void) => {
  if (isRunning) return;
  isRunning = true;

  // 使用递归调用requestAnimationFrame更新进度
  const step = (): void => {
    // 达到100%时停止动画
    if (progress.value >= 100) {
      isRunning = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId); // 停止动画
      }
      return;
    }

    // 检查是否需要启动异步任务
    if (shouldStartAsyncTask()) {
      startAsyncTask(callback, success);
    }

    // 根据是否正在执行异步任务决定进度增长步长
    const increment = isTaskRunning ? 0.5 : 2;
    progress.value = Number((Math.min(progress.value + increment, 95)).toFixed(1)); // 确保进度不超过100%，并保留一位小数

    // 递归调用下一帧
    animationFrameId = requestAnimationFrame(step);
  };

  // 启动动画
  animationFrameId = requestAnimationFrame(step);
};


// 判断是否需要启动异步任务
const shouldStartAsyncTask = (): boolean => {
  return progress.value >= 50 && !asyncTaskCompleted && !isTaskRunning;
};

// 启动异步任务
const startAsyncTask = <T>(callback: () => Promise<T>, success: (res: T) => void): void => {
  isTaskRunning = true; // 标记任务为运行中
  callback().then((res) => {
    asyncTaskCompleted = true; // 标记任务完成
    isTaskRunning = false; // 恢复任务状态
    progress.value = 100;
    success(res);
  });
};