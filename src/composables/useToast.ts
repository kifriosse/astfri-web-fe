import { computed, reactive } from "vue";

export type ToastItem = {
  id: number;
  title?: string;
  description?: string;
  duration?: number;
};

const state = reactive({
  toasts: [] as ToastItem[],
});

let counter = 0;
const TOAST_LIMIT = 1;
const DEFAULT_DURATION = 4000;

function toast(item: Omit<ToastItem, "id">) {
  const id = (counter + 1) % Number.MAX_SAFE_INTEGER;
  counter = id;

  const nextToast: ToastItem = {
    id,
    duration: DEFAULT_DURATION,
    ...item,
  };

  state.toasts = [nextToast, ...state.toasts].slice(0, TOAST_LIMIT);

  const duration = nextToast.duration ?? DEFAULT_DURATION;
  if (duration > 0) {
    window.setTimeout(() => dismiss(id), duration);
  }

  return id;
}

function dismiss(id?: number) {
  if (id === undefined) {
    state.toasts = [];
    return;
  }

  state.toasts = state.toasts.filter((toast) => toast.id !== id);
}

export function useToast() {
  return {
    toasts: computed(() => state.toasts),
    toast,
    dismiss,
  };
}
