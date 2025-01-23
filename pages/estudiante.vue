<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Lista de Estudiantes</h1>
    <div class="flex justify-end mb-6">
      <button @click="abrirFormulario()"
        class="bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
        Insertar Estudiante
      </button>
    </div>

    <!-- Tabla de estudiantes -->
    <div class="mb-8">
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">
              Foto</th>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Nombre</th>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Apellido</th>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Año
              Académico</th>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">
              Edad</th>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">
              Carrera</th>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">
              Facultad</th>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">
              Nombre de Beca</th>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">
              Número de Piso</th>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">
              Nombre de Torre</th>
            <th class="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">
              Cuarto</th>
            <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="estudiante in estudiantes" :key="estudiante.id" class="hover:bg-gray-50">
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">
              <NuxtImg
                :src="estudiante.foto ? `${config.public.backend_url}/estudiantes/foto/${estudiante.foto}` : '/images/avatar.jpg'"
                alt="Foto del estudiante" class="w-10 h-10 rounded-full object-cover cursor-pointer"
                @click="mostrarFoto(estudiante.foto)" @error="event => event.target.src = '/images/avatar.jpg'" />
            </td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ estudiante.nombre_estudiante }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">{{ estudiante.apellido_estudiante }}</td>
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">{{ estudiante.anio_academico
              }}</td>
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">{{ estudiante.edad }}</td>
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">{{ estudiante.carrera }}
            </td>
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">{{ estudiante.facultad }}
            </td>
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">{{
              estudiante.cuarto?.torre?.piso?.beca?.nombre_beca }}</td>
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">{{
              estudiante.cuarto?.torre?.piso?.numero_piso }}</td>
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">{{
              estudiante.cuarto?.torre?.nombre_torre }}</td>
            <td class="hidden md:table-cell px-4 py-2 border-b border-gray-200 text-center">{{
              estudiante.cuarto?.numero_cuarto }}</td>
            <td class="px-4 py-2 border-b border-gray-200 text-center">
              <button @click="mostrarEstudiante(estudiante)" class="text-blue-500 hover:underline mr-2">Mostrar</button>
              <button @click="abrirFormulario(estudiante)" class="text-blue-500 hover:underline mr-2">Editar</button>
              <button @click="deleteEstudiante(estudiante.id)" class="text-red-500 hover:underline">Borrar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :visible="showModal" @close="cerrarFormulario">
      <EstudianteFormulario :initialData="estudianteSeleccionado" :isEditing="isEditing" :isReadOnly="isReadOnly"
        @estudianteCreado="handleEstudianteCreado" @estudianteActualizado="fetchEstudiantes"
        @cerrarFormulario="cerrarFormulario" />
    </Modal>

    <!-- Modal para mostrar la foto en grande -->
    <div v-if="fotoGrande" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="cerrarFoto">
      <img :src="fotoGrande" alt="Foto del estudiante" class="max-w-full max-h-full" />
    </div>

    <!-- Modal o componente para mostrar los detalles del estudiante -->
    <Formulario v-if="estudianteSeleccionado" :initialData="estudianteSeleccionado" :isEditing="false"
      @cerrarFormulario="cerrarFormulario" />
  </div>
</template>

<script setup>


// Configuración de SEO
useSeoMeta({
  title: 'Gestión de Estudiantes - UNISS',
  ogTitle: 'Gestión de Estudiantes - UNISS',
  description: 'Administra y visualiza la lista de estudiantes en las residencias universitarias de UNISS.',
  ogDescription: 'Administra y visualiza la lista de estudiantes en las residencias universitarias de UNISS.',
  ogImage: '/images/logo.jpg', // Puedes agregar la URL de una imagen aquí
  keywords: 'gestión de estudiantes, UNISS, residencias universitarias, administración de becas'
});

const config = useRuntimeConfig();
const { token } = useAuth()

const estudiantes = ref([]);
const showModal = ref(false);
const estudianteSeleccionado = ref(null);
const isEditing = ref(false);
const isReadOnly = ref(false);
const fotoGrande = ref(null);

const fetchEstudiantes = async () => {
  try {
    estudiantes.value = await $fetch(`${config.public.backend_url}/estudiantes`, {
      headers: {
        'Authorization': token.value
      },
    });
    console.log(estudiantes)
  } catch (error) {
    console.error('Error al obtener los estudiantes:', error);
  }
};

const abrirFormulario = (estudiante = null) => {
  estudianteSeleccionado.value = estudiante;
  isEditing.value = !!estudiante;
  showModal.value = true;
};

const deleteEstudiante = async (id) => {
  const confirmacion = confirm('¿Está seguro de que desea eliminar este estudiante?');
  if (!confirmacion) {
    return;
  }

  try {
    await $fetch(`${config.public.backend_url}/estudiantes/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token.value
      }
    });

    alert('Estudiante eliminado exitosamente');
    await fetchEstudiantes();
  } catch (error) {
    console.error('Error al eliminar el estudiante:', error);
    alert('Hubo un problema al eliminar el estudiante');
  }
};

const cerrarFormulario = () => {
  showModal.value = false;
  localStorage.removeItem('datosFormularioEstudiante');
};

const handleEstudianteCreado = () => {
  fetchEstudiantes();
  cerrarFormulario();
};

const mostrarEstudiante = (estudiante) => {
  estudianteSeleccionado.value = estudiante;
  isEditing.value = false;
  isReadOnly.value = true;
  showModal.value = true;
};

const mostrarFoto = (foto) => {
  if (foto) {
    fotoGrande.value = `${config.public.backend_url}/estudiantes/foto/${foto}`;
  }
};

const cerrarFoto = () => {
  fotoGrande.value = null;
};

onMounted(async () => {
  await fetchEstudiantes();
});
</script>