<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
    @click.self="closeModal">
    <div class="bg-white rounded-lg shadow-lg p-6 mx-4 relative" style="width: auto; max-width: 100%;">
      <button @click="closeModal" class="absolute top-2 right-2 text-black py-1 px-2 rounded hover:bg-black-600">
        Cerrar
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>
