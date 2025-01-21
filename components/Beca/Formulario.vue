<template>
  <form @submit.prevent="validarYEnviar" class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <div class="mb-4">
      <label for="nombreBeca" class="block text-gray-700 font-bold mb-2">Nombre de la Beca:</label>
      <input type="text" id="nombreBeca" v-model="nombreBeca" required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :class="{ 'border-red-500': nombreError }" />
      <p v-if="nombreError" class="text-red-500 text-sm mt-1">El nombre debe comenzar con mayúscula</p>
    </div>
    <div class="mb-4">
      <label for="jefeBeca" class="block text-gray-700 font-bold mb-2">Jefe de Beca:</label>
      <input type="text" id="jefeBeca" v-model="jefeBeca" required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :class="{ 'border-red-500': jefeError || jefeFormatoError }" />
      <p v-if="jefeError" class="text-red-500 text-sm mt-1">El nombre del jefe debe comenzar con mayúscula</p>
      <p v-if="jefeFormatoError" class="text-red-500 text-sm mt-1">No se admiten números ni símbolos</p>
    </div>
    <div class="flex justify-end space-x-2">
      <button type="button" @click="cancelarFormulario"
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Cancelar
      </button>
      <button type="submit"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {{ isEditing ? 'Actualizar Beca' : 'Crear Beca' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
const { token } = useAuth()

const props = defineProps({
  initialData: Object,
  isEditing: Boolean
});

const emit = defineEmits(['becaCreada', 'becaActualizada', 'cerrarFormulario']);


const config = useRuntimeConfig();
const nombreBeca = ref(props.initialData?.nombre_beca || '');
const jefeBeca = ref(props.initialData?.jefe_beca || '');
const nombreError = ref(false);
const jefeError = ref(false);
const jefeFormatoError = ref(false);

const validarMayuscula = (texto) => {
  return texto.charAt(0) === texto.charAt(0).toUpperCase();
};

const validarSoloLetras = (texto) => {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(texto);
};

// Guardar en localStorage cada vez que los campos cambien
watch([nombreBeca, jefeBeca], () => {
  if (!props.isEditing) {
    localStorage.setItem('becaData', JSON.stringify({
      nombre_beca: nombreBeca.value,
      jefe_beca: jefeBeca.value
    }));
  }
});

// Cargar datos de localStorage solo si no está editando
if (!props.isEditing) {
  const storedData = JSON.parse(localStorage.getItem('becaData'));
  if (storedData) {
    nombreBeca.value = storedData.nombre_beca || '';
    jefeBeca.value = storedData.jefe_beca || '';
  }
}

const cancelarFormulario = () => {
  localStorage.removeItem('becaData');
  emit('cerrarFormulario');
};

const enviarFormulario = async () => {
  const url = props.isEditing
    ? `${config.public.backend_url}/becas/update/${props.initialData.id}`
    : `${config.public.backend_url}/becas/create`;
  const method = props.isEditing ? 'PUT' : 'POST';

  try {
    const response = await $fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token.value

      },
      body: JSON.stringify({
        nombre_beca: nombreBeca.value,
        jefe_beca: jefeBeca.value
      })
    });

    const data = await response;

    // Guardar en localStorage solo si no está editando
    if (!props.isEditing) {
      localStorage.setItem('becaData', JSON.stringify({
        nombre_beca: nombreBeca.value,
        jefe_beca: jefeBeca.value
      }));
    }

    // Primero emitimos los eventos de actualización
    if (props.isEditing) {
      emit('becaActualizada', data);
    } else {
      emit('becaCreada', data);
    }

    // Cerramos el formulario
    emit('cerrarFormulario');

    // Mostramos el mensaje de éxito después de cerrar
    setTimeout(() => {
      alert(props.isEditing ? 'Beca actualizada exitosamente' : 'Beca creada exitosamente');
    }, 100);

    // Limpiar localStorage después de crear
    if (!props.isEditing) {
      localStorage.removeItem('becaData');
    }

  } catch (error) {
    console.error('Error:', error);
    // En caso de error, mostramos el mensaje pero no cerramos el formulario
    alert(`Error: ${error.message}\nPor favor, verifique los datos e intente nuevamente.`);
  }
};

const validarYEnviar = () => {
  nombreError.value = !validarMayuscula(nombreBeca.value);
  jefeError.value = !validarMayuscula(jefeBeca.value);
  jefeFormatoError.value = !validarSoloLetras(jefeBeca.value);

  if (!nombreError.value && !jefeError.value && !jefeFormatoError.value) {
    enviarFormulario();
  }
};

watch(() => props.initialData, (newData) => {
  nombreBeca.value = newData?.nombre_beca || '';
  jefeBeca.value = newData?.jefe_beca || '';
  nombreError.value = false;
  jefeError.value = false;
  jefeFormatoError.value = false;
});
</script>
