<script setup>
import { Icon } from "@iconify/vue";

defineOptions({ name: "ComposeFab" });

defineProps({
  open: { type: Boolean, default: false },
});

defineEmits(["click"]);
</script>

<template>
  <button
    class="fab"
    @click="$emit('click')"
    :aria-label="open ? 'Close' : 'New post'"
  >
    <Transition name="fab-icon" mode="out-in">
      <Icon
        key="plus"
        icon="material-symbols:add-rounded"
        width="28px"
        height="28px"
      />
    </Transition>
  </button>
</template>

<style scoped>
.fab {
  position: fixed;
  bottom: 32px;
  right: 24px;
  /* Safe area for iPhone home bar */
  bottom: max(32px, calc(16px + env(safe-area-inset-bottom)));
  z-index: 900;

  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: #f66;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.fab:active {
  transform: scale(0.92);
  box-shadow:
    0 2px 6px rgba(255, 102, 102, 0.35),
    0 1px 2px rgba(0, 0, 0, 0.25);
}

/* Plus ↔ Close icon crossfade */
.fab-icon-enter-active,
.fab-icon-leave-active {
  transition:
    opacity 0.1s ease,
    transform 0.1s ease;
}

.fab-icon-enter-from {
  opacity: 0;
  transform: rotate(-45deg) scale(0.7);
}

.fab-icon-leave-to {
  opacity: 0;
  transform: rotate(45deg) scale(0.7);
}
</style>
