<template>
    <form @submit.prevent="validarYEnviar" class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div class="mb-4">
            <label for="numeroCuarto" class="block text-gray-700 font-bold mb-2">Número de Cuarto:</label>
            <input type="text" id="numeroCuarto" v-model="numeroCuarto" :disabled="isShowing" required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div class="mb-4">
            <label for="capacidadMaxima" class="block text-gray-700 font-bold mb-2">Capacidad Máxima:</label>
            <input type="number" id="capacidadMaxima" v-model="capacidadMaxima" :disabled="isShowing" required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div class="mb-4">
            <label for="becaId" class="block text-gray-700 font-bold mb-2">Beca:</label>
            <select id="becaId" v-model="becaId" :disabled="isShowing" required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">Seleccione una beca</option>
                <option v-for="beca in becas" :key="beca.id" :value="beca.id">
                    {{ beca.nombre_beca }}
                </option>
            </select>
        </div>
        <div class="mb-4">
            <label for="pisoId" class="block text-gray-700 font-bold mb-2">Piso:</label>
            <select id="pisoId" v-model="pisoId" :disabled="isShowing" required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">Seleccione un piso</option>
                <option v-for="piso in pisosFiltrados" :key="piso.id" :value="piso.id">
                    {{ piso.numero_piso }}
                </option>
            </select>
        </div>
        <div class="mb-4">
            <label for="torreId" class="block text-gray-700 font-bold mb-2">Torre:</label>
            <select id="torreId" v-model="torreid" :disabled="isShowing" required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">Seleccione una torre</option>
                <option v-for="torre in torresFiltradas" :key="torre.id" :value="torre.id">
                    {{ torre.nombre_torre }}
                </option>
            </select>
        </div>
        <div class="flex justify-end space-x-2">
            <button v-if="!isShowing" type="button" @click="cancelarFormulario"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Cancelar
            </button>
            <button v-if="!isShowing" type="submit"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {{ isEditing ? 'Actualizar Cuarto' : 'Crear Cuarto' }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const { token } = useAuth()

const props = defineProps({
    initialData: Object,
    isEditing: Boolean,
    isShowing: Boolean
});

const emit = defineEmits(['cuartoCreado', 'cuartoActualizado', 'cerrarFormulario']);

const config = useRuntimeConfig();
const numeroCuarto = ref(props.initialData?.numero_cuarto || '');
const capacidadMaxima = ref(props.initialData?.capacidad_maxima || '');
const becaId = ref(props.initialData?.becaId || '');
const pisoId = ref(props.initialData?.pisoId || '');
const torreid = ref(props.initialData?.torreid || '');
const becas = ref([]);
const pisos = ref([]);
const torres = ref([]);

// Validaciones
const validarNumeroCuarto = (numero) => /^[0-9]+(\.[0-9]+)?$/.test(numero);
const validarCapacidadMaxima = (capacidad) => /^[0-9]+$/.test(capacidad);

// Computed para filtrar los pisos y torres
const pisosFiltrados = computed(() => pisos.value.filter(piso => piso.becaId === becaId.value));
const torresFiltradas = computed(() => torres.value.filter(torre => torre.pisoId === pisoId.value));

// Funciones para cargar datos
const cargarDatos = async (url, refData) => {
    try {
        const response = await $fetch(url, {
            headers: {
                'Authorization': token.value
            },
        });
        refData.value = response;
    } catch (error) {
        console.error(`Error al cargar datos de ${url}:`, error);
        toast.error(`Error al cargar datos de ${url}`);
    }
};

// Función para validar y enviar el formulario
const validarYEnviar = () => {
    if (!validarNumeroCuarto(numeroCuarto.value)) {
        toast.error('El número de cuarto debe ser un número entero o decimal.');
        return;
    }
    if (!validarCapacidadMaxima(capacidadMaxima.value)) {
        toast.error('La capacidad máxima debe ser un número entero.');
        return;
    }
    enviarFormulario();
};

// Guardar en localStorage solo si no se está editando
watch([numeroCuarto, capacidadMaxima, becaId, pisoId, torreid], ([newNumeroCuarto, newCapacidadMaxima, newBecaId, newPisoId, newTorreid]) => {
    if (!props.isEditing) {
        localStorage.setItem('cuartoData', JSON.stringify({
            numero_cuarto: newNumeroCuarto,
            capacidad_maxima: newCapacidadMaxima,
            becaId: newBecaId,
            pisoId: newPisoId,
            torreid: newTorreid
        }));
    }
});

// Cargar datos de localStorage al montar el componente solo si no se está editando
onMounted(() => {
    if (!props.isEditing) {
        const storedData = localStorage.getItem('cuartoData');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                numeroCuarto.value = parsedData.numero_cuarto || '';
                capacidadMaxima.value = parsedData.capacidad_maxima || '';
                becaId.value = parsedData.becaId || '';
                pisoId.value = parsedData.pisoId || '';
                torreid.value = parsedData.torreid || '';
            } catch (error) {
                console.error('Error al parsear los datos de localStorage:', error);
            }
        }
    }
});

const cancelarFormulario = () => {
    localStorage.removeItem('cuartoData');
    emit('cerrarFormulario');
};

const enviarFormulario = async () => {
    const url = props.isEditing
        ? `${config.public.backend_url}/cuartos/update/${props.initialData.id}`
        : `${config.public.backend_url}/cuartos/create`;
    const method = props.isEditing ? 'PUT' : 'POST';

    const formData = {
        numero_cuarto: numeroCuarto.value,
        capacidad_maxima: capacidadMaxima.value,
        torreid: torreid.value,
        pisoId: pisoId.value,
        becaId: becaId.value
    };

    if (!formData.numero_cuarto || !formData.capacidad_maxima || !formData.torreid || !formData.pisoId || !formData.becaId) {
        toast.error('Por favor, complete todos los campos requeridos.');
        return;
    }

    try {
        const response = await $fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.value
            },
            body: JSON.stringify(formData)
        });

        const data = response;

        if (props.isEditing) {
            emit('cuartoActualizado', data);
            toast.success('Cuarto actualizado exitosamente');
        } else {
            emit('cuartoCreado', data);
            localStorage.removeItem('cuartoData');
            toast.success('Cuarto creado exitosamente');
        }

        emit('cerrarFormulario');

    } catch (error) {
        console.error('Error:', error);
        toast.error(`Error: ${error.message}\nPor favor, verifique los datos e intente nuevamente.`);
    }
};

onMounted(async () => {
    await cargarDatos(`${config.public.backend_url}/becas`, becas);
    await cargarDatos(`${config.public.backend_url}/pisos`, pisos);
    await cargarDatos(`${config.public.backend_url}/torres`, torres);

    if (props.isEditing || props.isShowing) {
        becaId.value = props.initialData.torre.piso.beca.id;
        pisoId.value = props.initialData.torre.piso.id;
        torreid.value = props.initialData.torre.id;
    }
});
</script>