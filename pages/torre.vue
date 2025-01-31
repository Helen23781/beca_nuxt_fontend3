<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Lista de Torres</h1>
    <div class="flex justify-end mb-6">
      <button @click="abrirFormulario()"
        class="bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
        Insertar Torre
      </button>
    </div>

    <!-- Tabla de torres con piso asignado -->
    <div class="mb-8">
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Nombre de la Torre</th>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Jefe de Torre</th>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">
              Número de Piso</th>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">
              Nombre de Beca</th>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="torre in torres" :key="torre.id" class="hover:bg-gray-50">
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ torre.nombre_torre }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ torre.jefe_torre }}</td>
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">{{ torre.piso?.numero_piso
              }}</td>
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">{{
              torre.piso?.beca?.nombre_beca }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">
              <button @click="abrirFormulario(torre)" class="text-blue-500 hover:underline mr-2">Editar</button>
              <button @click="deleteTorre(torre.id)" class="text-red-500 hover:underline mr-2">Borrar</button>
              <button @click="abrirFormulario(torre, true)" class="text-green-500 hover:underline">Mostrar</button>
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <Modal :visible="showModal" @close="showModal = false">
      <TorreFormulario :initialData="torreSeleccionada" :isEditing="isEditing" :isShowing="isShowing"
        @torreCreada="agregarTorre" @torreActualizada="actualizarTorre" @cerrarFormulario="showModal = false" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TorreFormulario from '../components/Torre/Formulario.vue';
import Modal from '../components/Modal.vue';
import { useToast } from 'vue-toastification';

const config = useRuntimeConfig();
const { token } = useAuth();

const torres = ref([]);
const showModal = ref(false);
const torreSeleccionada = ref(null);
const isEditing = ref(false);
const isShowing = ref(false);

const toast = useToast();

useSeoMeta({
  title: 'Gestión de torres universitarias',
  ogTitle: 'Gestión de torres universitarias',
  description: 'Sistema integral para la gestión de torres y pisos en residencias universitarias.',
  ogDescription: 'Sistema integral para la gestión de torres y pisos en residencias universitarias.',
  ogImage: '/images/logo.jpg',
  keywords: 'gestión de torres, residencias universitarias, administración de pisos, control de habitaciones'
});

const fetchTorres = async () => {
  try {
    torres.value = await $fetch(`${config.public.backend_url}/torres`, {
      headers: {
        'Authorization': token.value
      },
    });
  } catch (error) {
    console.error('Error al obtener las torres:', error);
    const errorMessage = error.response?._data?.message || 'Ha ocurrido un error inesperado';
    const errorCode = error.response?.status || 500;
    toast.error(`Error ${errorCode}: ${errorMessage}`);
  }
};

const abrirFormulario = (torre = null, mostrar = false) => {
  torreSeleccionada.value = torre;
  isEditing.value = !!torre && !mostrar;
  isShowing.value = mostrar;
  showModal.value = true;
};

const agregarTorre = (nuevaTorre) => {
  torres.value.push(nuevaTorre);
  localStorage.removeItem('torreData');
  fetchTorres();
};

const actualizarTorre = (torreActualizada) => {
  const index = torres.value.findIndex(torre => torre.id === torreActualizada.id);
  if (index !== -1) {
    torres.value[index] = torreActualizada;
  }
  fetchTorres();
};

const deleteTorre = async (id) => {
  try {
    await $fetch(`${config.public.backend_url}/torres/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token.value
      }
    });

    toast.success('Torre eliminada exitosamente');
    fetchTorres();
  } catch (error) {
    console.error('Error al eliminar la torre:', error);
    const errorMessage = error.response?._data?.message || 'Ha ocurrido un error inesperado';
    const errorCode = error.response?.status || 500;
    toast.error(`Error ${errorCode}: ${errorMessage}`);
  }
};

onMounted(async () => {
  await fetchTorres();
});
</script>