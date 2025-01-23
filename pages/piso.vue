<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Lista de Pisos</h1>
    <div class="flex justify-end mb-6">
      <button @click="abrirFormulario()"
        class="bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
        Insertar Piso
      </button>
    </div>

    <!-- Tabla de pisos con beca asignada -->
    <div class="mb-8">

      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Número de Piso</th>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Jefe de Piso</th>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Beca</th>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="piso in pisosConBecaAsignada" :key="piso.id" class="hover:bg-gray-50">
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ piso.numero_piso }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ piso.jefe_piso }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ piso.beca?.nombre_beca }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">
              <button @click="abrirFormulario(piso)" class="text-blue-500 hover:underline mr-2">Editar</button>
              <button @click="deletePiso(piso.id)" class="text-red-500 hover:underline">Borrar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :visible="showModal" @close="showModal = false">
      <PisoFormulario :initialData="pisoSeleccionado" :isEditing="isEditing" @pisoCreado="agregarPiso"
        @pisoActualizado="actualizarPiso" @cerrarFormulario="showModal = false" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import PisoFormulario from '../components/Piso/Formulario.vue';
import Modal from '../components/Modal.vue';

const config = useRuntimeConfig();
const { token } = useAuth()

// Configuración de SEO
useSeoMeta({
  title: 'Administración de pisos universitarios',
  ogTitle: 'Administración de pisos universitarios',
  description: 'Sistema integral para la gestión de pisos y becas en residencias universitarias.',
  ogDescription: 'Sistema integral para la gestión de pisos y becas en residencias universitarias.',
  ogImage: '/images/logo.jpg', // Puedes agregar la URL de una imagen aquí
  keywords: 'administración de pisos, residencias universitarias, gestión de becas, control de habitaciones'
});

const pisos = ref([]);
const becas = ref([]);
const showModal = ref(false);
const pisoSeleccionado = ref(null);
const isEditing = ref(false);

// Computed property para pisos con beca asignada
const pisosConBecaAsignada = computed(() => {
  return pisos.value
    .filter(piso => {
      const becaAsociada = becas.value.find(beca => beca.id === (piso.becaid || piso.becaId));
      return becaAsociada != null;
    })
    .map(piso => ({
      ...piso,
      beca: becas.value.find(beca => beca.id === (piso.becaid || piso.becaId)),
      becaId: piso.becaid || piso.becaId
    }))
    .sort((a, b) => a.numero_piso - b.numero_piso);
});

const fetchBecas = async () => {
  try {
    becas.value = await $fetch(`${config.public.backend_url}/becas`, {

      headers: {

        'Authorization': token.value

      },
    }
    );
  } catch (error) {
    console.error('Error al obtener las becas:', error);
  }
};

const fetchPisos = async () => {
  try {
    const data = await $fetch(`${config.public.backend_url}/pisos`, {

      headers: {

        'Authorization': token.value

      },
    }
    );
    console.log('Pisos actualizados:', data);
    pisos.value = data;
  } catch (error) {
    console.error('Error al obtener los pisos:', error);
    alert('Error al cargar los pisos');
  }
};

const abrirFormulario = (piso = null) => {
  if (piso) {
    console.log('Opening edit form with piso:', piso);
    pisoSeleccionado.value = {
      id: piso.id,
      numero_piso: piso.numero_piso,
      jefe_piso: piso.jefe_piso,
      becaId: piso.becaid || piso.becaId,
      beca: piso.beca
    };
    console.log('Datos preparados para edición:', pisoSeleccionado.value);
  } else {
    pisoSeleccionado.value = null;
  }
  isEditing.value = !!piso;
  showModal.value = true;
};

const agregarPiso = (nuevoPiso) => {
  pisos.value.push(nuevoPiso);
  localStorage.removeItem('pisoData');
};

const actualizarPiso = async (pisoActualizado) => {
  try {
    // Actualizamos el array local inmediatamente
    const index = pisos.value.findIndex(p => p.id === pisoActualizado.id);
    if (index !== -1) {
      pisos.value[index] = {
        ...pisoActualizado,
        becaid: pisoActualizado.becaId
      };
    }

    // Recargamos los datos para asegurar sincronización
    await fetchPisos();
  } catch (error) {
    console.error('Error al actualizar piso:', error);
    alert('Error al actualizar el piso');
  }
};

const deletePiso = async (id) => {
  const confirmacion = confirm('¿Está seguro de que desea eliminar este piso?');
  if (!confirmacion) {
    return; // Si el usuario cancela, no hacemos nada
  }

  try {
    await $fetch(`${config.public.backend_url}/pisos/delete/${id}`, {
      method: 'DELETE',
      headers: {

        'Authorization': token.value
      }

    });

    alert('Piso eliminado exitosamente');
    await fetchPisos(); // Recargar los datos después de eliminar
  } catch (error) {
    console.error('Error al eliminar el piso:', error);
    alert('Hubo un problema al eliminar el piso');
  }
};

onMounted(async () => {
  try {
    await fetchBecas();
    await fetchPisos();
  } catch (error) {
    console.error('Error en la carga inicial:', error);
  }
});
</script>