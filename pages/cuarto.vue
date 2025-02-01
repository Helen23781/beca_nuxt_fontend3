<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Lista de Cuartos</h1>
    <div class="flex justify-end mb-6">
      <button @click="abrirFormulario()"
        class="bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
        Insertar Cuarto
      </button>
    </div>

    <!-- Tabla de cuartos -->
    <div class="mb-8">
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Número de Cuarto</th>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Capacidad Máxima</th>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">
              Número de Piso</th>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">
              Nombre de Beca</th>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">
              Nombre de Torre</th>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cuarto in cuartos" :key="cuarto.id" class="hover:bg-gray-50">
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ cuarto.numero_cuarto }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ cuarto.capacidad_maxima }}</td>
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">{{
              cuarto.torre?.piso?.numero_piso }}</td>
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">{{
              cuarto.torre?.piso?.beca?.nombre_beca }}</td>
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">{{
              cuarto.torre?.nombre_torre }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">
              <button @click="abrirFormulario(cuarto)" class="text-blue-500 hover:underline mr-2">Editar</button>
              <button @click="deleteCuarto(cuarto.id)" class="text-red-500 hover:underline mr-2">Borrar</button>
              <button @click="abrirFormulario(cuarto, true)" class="text-green-500 hover:underline">Mostrar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :visible="showModal" @close="showModal = false">
      <CuartoFormulario :initialData="cuartoSeleccionado" :isEditing="isEditing" :isShowing="isShowing"
        @cuartoCreado="fetchCuartos" @cuartoActualizado="fetchCuartos" @cerrarFormulario="showModal = false" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import Modal from '../components/Modal.vue';
import { useToast } from 'vue-toastification';

// Configuración de SEO
useSeoMeta({
  title: 'Gestión de Cuartos - UNISS',
  ogTitle: 'Gestión de Cuartos - UNISS',
  description: 'Administra y visualiza la lista de cuartos en las residencias universitarias de UNISS.',
  ogDescription: 'Administra y visualiza la lista de cuartos en las residencias universitarias de UNISS.',
  ogImage: '/images/logo.jpg', // Puedes agregar la URL de una imagen aquí
  keywords: 'gestión de cuartos, UNISS, residencias universitarias, administración de habitaciones'
});

const config = useRuntimeConfig();
const { token } = useAuth()

const cuartos = ref([]);
const showModal = ref(false);
const cuartoSeleccionado = ref(null);
const isEditing = ref(false);
const isShowing = ref(false);

// Agregar el toast
const toast = useToast();

const fetchCuartos = async () => {
  try {
    cuartos.value = await $fetch(`${config.public.backend_url}/cuartos`, {
      headers: {
        'Authorization': token.value
      },
    });
  } catch (error) {
    console.error('Error al obtener los cuartos:', error);
    toast.error('Error al obtener los cuartos');
  }
};

const abrirFormulario = (cuarto = null, mostrar = false) => {
  cuartoSeleccionado.value = cuarto;
  isEditing.value = !!cuarto && !mostrar;
  isShowing.value = mostrar;
  showModal.value = true;
};

const deleteCuarto = async (id) => {
  try {
    await $fetch(`${config.public.backend_url}/cuartos/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token.value
      }
    });

    toast.success('Cuarto eliminado exitosamente');
    fetchCuartos();
  } catch (error) {
    console.error('Error al eliminar el cuarto:', error);
    // Mostrar mensaje de error
    const errorMessage = error.response?._data?.message || 'Ha ocurrido un error inesperado';
    const errorCode = error.response?.status || 500;
    toast.error(`Error ${errorCode}: ${errorMessage}`);
  }
};

onMounted(async () => {
  await fetchCuartos();
});
</script>