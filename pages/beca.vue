<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Lista de Becas</h1>
    <div class="flex justify-end mb-6">
      <button @click="abrirFormulario()"
        class="bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
        Insertar Beca
      </button>
    </div>
    <table class="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Nombre de la Beca</th>
          <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Jefe de Beca</th>
          <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="beca in becas" :key="beca.id" class="hover:bg-gray-50">
          <td class="px-4 py-2 border-b border-gray-200 text-center">{{ beca.nombre_beca }}</td>
          <td class="px-4 py-2 border-b border-gray-200 text-center">{{ beca.jefe_beca }}</td>
          <td class="px-4 py-2 border-b border-gray-200 text-center">
            <button @click="abrirFormulario(beca)" class="text-blue-500 hover:underline mr-2">Editar</button>
            <button @click="deleteBeca(beca.id)" class="text-red-500 hover:underline">Borrar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <Modal :visible="showModal" @close="showModal = false">
      <BecaFormulario :initialData="becaSeleccionada" :isEditing="isEditing" @becaCreada="agregarBeca"
        @becaActualizada="actualizarBeca" @cerrarFormulario="showModal = false" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BecaFormulario from '../components/Beca/Formulario.vue';

import { useToast } from 'vue-toastification'

// Agregar el toast
const toast = useToast()


// Configuración de SEO
useSeoMeta({
  title: 'Gestión de Becas - UNISS',
  ogTitle: 'Gestión de Becas - UNISS',
  description: 'Administra y visualiza la lista de becas disponibles en las residencias universitarias de UNISS.',
  ogDescription: 'Administra y visualiza la lista de becas disponibles en las residencias universitarias de UNISS.',
  ogImage: '/images/logo.jpg', // Puedes agregar la URL de una imagen aquí
  keywords: 'gestión de becas, UNISS, residencias universitarias, administración de becas'
});

const config = useRuntimeConfig();
const { token } = useAuth()

const becas = ref([]);
const showModal = ref(false);
const becaSeleccionada = ref(null);
const isEditing = ref(false);

const fetchBecas = async () => {
  try {
    const data = await $fetch(`${config.public.backend_url}/becas`, {

      headers: {

        'Authorization': token.value

      },
    }
    );
    becas.value = data;
  } catch (error) {
    console.error('Error fetching books:', error);
    // Mostrar mensaje de error
    const errorMessage = error.response?._data?.message || 'Ha ocurrido un error inesperado';
    const errorCode = error.response?.status || 500;
    toast.error(`Error ${errorCode}: ${errorMessage}`);
  }
};

const abrirFormulario = (beca = null) => {
  becaSeleccionada.value = beca;
  isEditing.value = !!beca;
  showModal.value = true;
};

const agregarBeca = (nuevaBeca) => {
  becas.value.push(nuevaBeca);
  localStorage.removeItem('becaData');
};

const actualizarBeca = (becaActualizada) => {
  const index = becas.value.findIndex(beca => beca.id === becaActualizada.id);
  if (index !== -1) {
    becas.value[index] = becaActualizada;
  }
};

const deleteBeca = async (id) => {
  try {
    await $fetch(`${config.public.backend_url}/becas/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token.value
      }
    });
    toast.success('Beca eliminada exitosamente');
    fetchBecas();
  } catch (error) {
    console.error('Error fetching books:', error);
    // Mostrar mensaje de error
    const errorMessage = error.response?._data?.message || 'Ha ocurrido un error inesperado';
    const errorCode = error.response?.status || 500;
    toast.error(`Error ${errorCode}: ${errorMessage}`);
  }
};

onMounted(() => {
  fetchBecas();
});
</script>
