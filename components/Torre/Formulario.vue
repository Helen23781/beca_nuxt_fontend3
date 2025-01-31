<template>
  <form @submit.prevent="validarYEnviar" class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <div class="mb-4">
      <label for="nombreTorre" class="block text-gray-700 font-bold mb-2">Nombre de la Torre:</label>
      <input type="text" id="nombreTorre" v-model="nombreTorre" required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :class="{ 'border-red-500': nombreError }" :disabled="props.isShowing" />
      <p v-if="nombreError" class="text-red-500 text-sm mt-1">El nombre debe comenzar con una letra mayúscula y solo
        contener letras</p>
    </div>
    <div class="mb-4">
      <label for="jefeTorre" class="block text-gray-700 font-bold mb-2">Jefe de Torre:</label>
      <input type="text" id="jefeTorre" v-model="jefeTorre" required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :class="{ 'border-red-500': jefeError || jefeFormatoError }" :disabled="props.isShowing" />
      <p v-if="jefeError" class="text-red-500 text-sm mt-1">El nombre del jefe debe comenzar con mayúscula</p>
      <p v-if="jefeFormatoError" class="text-red-500 text-sm mt-1">No se admiten números ni símbolos</p>
    </div>
    <div class="mb-4">
      <label for="becaId" class="block text-gray-700 font-bold mb-2">Beca:</label>
      <select id="becaId" v-model="becaId" required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :disabled="props.isShowing">
        <option value="">Seleccione una beca</option>
        <option v-for="beca in becas" :key="beca.id" :value="beca.id">
          {{ beca.nombre_beca }}
        </option>
      </select>
    </div>
    <div class="mb-4">
      <label for="pisoId" class="block text-gray-700 font-bold mb-2">Piso:</label>
      <select id="pisoId" v-model="pisoId" required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        :disabled="props.isShowing">
        <option value="">Seleccione un piso</option>
        <option v-for="piso in pisosFiltrados" :key="piso.id" :value="piso.id">
          {{ piso.numero_piso }}
        </option>
      </select>
    </div>
    <div class="flex justify-end space-x-2" v-if="!isShowing">
      <button type="submit"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        :disabled="props.isShowing">
        {{ isEditing ? 'Actualizar Torre' : 'Crear Torre' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const { token } = useAuth();

const props = defineProps({
  initialData: Object,
  isEditing: Boolean,
  isShowing: Boolean
});

const emit = defineEmits(['torreCreada', 'torreActualizada', 'cerrarFormulario']);

const config = useRuntimeConfig();
const nombreTorre = ref(props.initialData?.nombre_torre || '');
const jefeTorre = ref(props.initialData?.jefe_torre || '');
const becaId = ref(props.initialData?.piso?.becaId || '');
const pisoId = ref(props.initialData?.pisoId || '');
const becas = ref([]);
const pisos = ref([]);
const nombreError = ref(false);
const jefeError = ref(false);
const jefeFormatoError = ref(false);

// Computed para filtrar los pisos según la beca seleccionada
const pisosFiltrados = computed(() => {
  return pisos.value.filter(piso => piso.becaId === becaId.value);
});

// Función para cargar las becas
const cargarBecas = async () => {
  try {
    const response = await $fetch(`${config.public.backend_url}/becas`, {
      headers: {
        'Authorization': token.value
      },
    });
    becas.value = response;
  } catch (error) {
    console.error('Error al cargar las becas:', error);
    toast.error('Error al cargar las becas');
  }
};

// Función para cargar los pisos
const cargarPisos = async () => {
  try {
    const response = await $fetch(`${config.public.backend_url}/pisos`, {
      headers: {
        'Authorization': token.value
      },
    });
    pisos.value = response;
  } catch (error) {
    console.error('Error al cargar los pisos:', error);
    toast.error('Error al cargar los pisos');
  }
};

// Funciones de validación
const validarMayuscula = (texto) => {
  return /^[A-Z][a-zA-Z]*$/.test(texto);
};

const validarSoloLetras = (texto) => {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(texto);
};

// Función para validar y enviar el formulario
const validarYEnviar = () => {
  nombreError.value = !validarMayuscula(nombreTorre.value);
  jefeError.value = !validarMayuscula(jefeTorre.value);
  jefeFormatoError.value = !validarSoloLetras(jefeTorre.value);

  if (!nombreError.value && !jefeError.value && !jefeFormatoError.value) {
    enviarFormulario();
  }
};

// Guardar en localStorage cada vez que los campos cambien
watch([nombreTorre, jefeTorre, becaId, pisoId], () => {
  if (!props.isEditing) {
    localStorage.setItem('torreData', JSON.stringify({
      nombre_torre: nombreTorre.value,
      jefe_torre: jefeTorre.value,
      becaId: becaId.value,
      pisoId: pisoId.value
    }));
  }
});

// Cargar datos de localStorage solo si no está editando
if (!props.isEditing) {
  const storedData = JSON.parse(localStorage.getItem('torreData'));
  if (storedData) {
    nombreTorre.value = storedData.nombre_torre || '';
    jefeTorre.value = storedData.jefe_torre || '';
    becaId.value = storedData.becaId || '';
    pisoId.value = storedData.pisoId || '';
  }
}

const cancelarFormulario = () => {
  localStorage.removeItem('torreData');
  emit('cerrarFormulario');
};

const enviarFormulario = async () => {
  const url = props.isEditing
    ? `${config.public.backend_url}/torres/update/${props.initialData.id}`
    : `${config.public.backend_url}/torres/create`;
  const method = props.isEditing ? 'PUT' : 'POST';

  const formData = {
    nombre_torre: nombreTorre.value,
    jefe_torre: jefeTorre.value,
    pisoId: parseInt(pisoId.value),
    becaId: parseInt(becaId.value)
  };

  try {
    const response = await $fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token.value
      },
      body: JSON.stringify(formData)
    });

    const data = await response;

    if (props.isEditing) {
      emit('torreActualizada', data);
      toast.success('Torre actualizada exitosamente');
    } else {
      emit('torreCreada', data);
      localStorage.removeItem('torreData'); // Limpiar localStorage después de la creación
      toast.success('Torre creada exitosamente');
    }

    emit('cerrarFormulario');

  } catch (error) {
    console.error('Error:', error);
    toast.error(`Error: ${error.message}\nPor favor, verifique los datos e intente nuevamente.`);
  }
};

onMounted(async () => {
  await cargarBecas();
  await cargarPisos();
  if (props.initialData) {
    console.log('Datos iniciales:', props.initialData);
  }
});
</script>