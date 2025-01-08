<template>
  <form @submit.prevent="validarYEnviar" class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <div class="mb-4">
      <label for="numeroPiso" class="block text-gray-700 font-bold mb-2">Número de Piso:</label>
      <select id="numeroPiso" v-model="numeroPiso" required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :class="{ 'border-red-500': numeroError }">
        <option value="">Seleccione un piso</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <p v-if="numeroError" class="text-red-500 text-sm mt-1">Debe seleccionar un número de piso válido (2, 3 o 4)</p>
    </div>
    <div class="mb-4">
      <label for="jefePiso" class="block text-gray-700 font-bold mb-2">Jefe de Piso:</label>
      <input type="text" id="jefePiso" v-model="jefePiso" required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :class="{ 'border-red-500': jefeError || jefeFormatoError }" />
      <p v-if="jefeError" class="text-red-500 text-sm mt-1">El nombre del jefe debe comenzar con mayúscula</p>
      <p v-if="jefeFormatoError" class="text-red-500 text-sm mt-1">No se admiten números ni símbolos</p>
    </div>
    <div class="mb-4">
      <label for="becaId" class="block text-gray-700 font-bold mb-2">Beca:</label>
      <select id="becaId" v-model="becaId" required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <option value="">Seleccione una beca</option>
        <option v-for="beca in becas" :key="beca.id" :value="beca.id">
          {{ beca.nombre_beca }}
        </option>
      </select>
    </div>
    <div class="flex justify-end space-x-2">
      <button type="submit"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {{ isEditing ? 'Actualizar Piso' : 'Crear Piso' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  initialData: Object,
  isEditing: Boolean
});

const emit = defineEmits(['pisoCreado', 'pisoActualizado', 'cerrarFormulario']);

const config = useRuntimeConfig();
const numeroPiso = ref(props.initialData?.numero_piso?.toString() || '');
const jefePiso = ref(props.initialData?.jefe_piso || '');
const becaId = ref(props.initialData?.becaid || props.initialData?.becaId || '');
const becas = ref([]);
const numeroError = ref(false);
const jefeError = ref(false);
const jefeFormatoError = ref(false);

// Función para cargar las becas
const cargarBecas = async () => {
  try {
    const response = await $fetch(`${config.public.backend_url}/becas`);
    becas.value = response;
  } catch (error) {
    console.error('Error al cargar las becas:', error);
    alert('Error al cargar las becas');
  }
};

const validarMayuscula = (texto) => {
  return texto.charAt(0) === texto.charAt(0).toUpperCase();
};

const validarSoloLetras = (texto) => {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(texto);
};

const validarNumeroPiso = (numero) => {
  const pisosValidos = ['2', '3', '4'];
  return pisosValidos.includes(numero);
};

const validarYEnviar = () => {
  numeroError.value = !validarNumeroPiso(numeroPiso.value);
  jefeError.value = !validarMayuscula(jefePiso.value);
  jefeFormatoError.value = !validarSoloLetras(jefePiso.value);

  if (!numeroError.value && !jefeError.value && !jefeFormatoError.value) {
    enviarFormulario();
  }
};

const enviarFormulario = async () => {
  const url = props.isEditing
    ? `${config.public.backend_url}/pisos/update/${props.initialData.id}`
    : `${config.public.backend_url}/pisos/create`;
  const method = props.isEditing ? 'PUT' : 'POST';

  const formData = {
    numero_piso: parseInt(numeroPiso.value),
    jefe_piso: jefePiso.value,
    becaId: parseInt(becaId.value)
  };

  try {
    const response = await $fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = response;
    const becaActualizada = becas.value.find(b => b.id === parseInt(becaId.value));

    // Primero emitimos los eventos de actualización
    if (props.isEditing) {
      emit('pisoActualizado', {
        id: props.initialData.id,
        numero_piso: parseInt(numeroPiso.value),
        jefe_piso: jefePiso.value,
        becaId: parseInt(becaId.value),
        beca: becaActualizada
      });
    } else {
      emit('pisoCreado', {
        ...data,
        becaId: parseInt(becaId.value),
        beca: becaActualizada
      });
    }

    // Cerramos el formulario automáticamente
    emit('cerrarFormulario');

    // Mostramos el mensaje después de cerrar
    setTimeout(() => {
      alert(props.isEditing ? 'Piso actualizado exitosamente' : 'Piso creado exitosamente');
    }, 100);

  } catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}\nPor favor, verifique los datos e intente nuevamente.`);
  }
};






//AQUIIII




// Modificar el watch para mostrar la beca actual al editar
watch(() => props.initialData, (newData) => {
  if (newData) {
    console.log('Datos recibidos para edición:', newData);
    numeroPiso.value = newData.numero_piso?.toString() || '';
    jefePiso.value = newData.jefe_piso || '';
    becaId.value = newData.becaid?.toString() || newData.becaId?.toString() || '';

    // Log para debug
    console.log('Beca ID seleccionada:', becaId.value);
    console.log('Becas disponibles:', becas.value);
  }
  numeroError.value = false;
  jefeError.value = false;
  jefeFormatoError.value = false;
});

// Asegurarnos de cargar las becas al inicio
onMounted(async () => {
  await cargarBecas();
  if (props.initialData) {
    console.log('Datos iniciales:', props.initialData);
  }
});
</script>