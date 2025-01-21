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
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Número de Piso</th>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Nombre de Beca</th>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Nombre de Torre</th>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cuarto in cuartos" :key="cuarto.id" class="hover:bg-gray-50">
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ cuarto.numero_cuarto }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ cuarto.capacidad_maxima }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ cuarto.torre?.piso?.numero_piso }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ cuarto.torre?.piso?.beca?.nombre_beca }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ cuarto.torre?.nombre_torre }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">
              <button @click="abrirFormulario(cuarto)" class="text-blue-500 hover:underline mr-2">Editar</button>
              <button @click="deleteCuarto(cuarto.id)" class="text-red-500 hover:underline">Borrar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :visible="showModal" @close="showModal = false">
      <CuartoFormulario :initialData="cuartoSeleccionado" :isEditing="isEditing" @cuartoCreado="fetchCuartos"
        @cuartoActualizado="fetchCuartos" @cerrarFormulario="showModal = false" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CuartoFormulario from '../components/Cuarto/Formulario.vue';
import Modal from '../components/Modal.vue';

const config = useRuntimeConfig();
const { token } = useAuth()

const cuartos = ref([]);
const showModal = ref(false);
const cuartoSeleccionado = ref(null);
const isEditing = ref(false);

const fetchCuartos = async () => {
  try {
    cuartos.value = await $fetch(`${config.public.backend_url}/cuartos`, {

      headers: {

        'Authorization': token.value

      },
    }
    );
  } catch (error) {
    console.error('Error al obtener los cuartos:', error);
  }
};

const abrirFormulario = (cuarto = null) => {
  cuartoSeleccionado.value = cuarto;
  isEditing.value = !!cuarto;
  showModal.value = true;

};



const deleteCuarto = async (id) => {
  const confirmacion = confirm('¿Está seguro de que desea eliminar este cuarto?');
  if (!confirmacion) {
    return;
  }

  try {
    await $fetch(`${config.public.backend_url}/cuartos/delete/${id}`, {
      method: 'DELETE',
      headers: {

        'Authorization': token.value
      }

    });

    alert('Cuarto eliminado exitosamente');
    await fetchCuartos();
  } catch (error) {
    console.error('Error al eliminar el cuarto:', error);
    alert('Hubo un problema al eliminar el cuarto');
  }
};

onMounted(async () => {
  await fetchCuartos();
});
</script>