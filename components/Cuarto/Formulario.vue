<template>
    <form @submit.prevent="validarYEnviar" class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div class="mb-4">
            <label for="numeroCuarto" class="block text-gray-700 font-bold mb-2">Número de Cuarto:</label>
            <input type="text" id="numeroCuarto" v-model="numeroCuarto" required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div class="mb-4">
            <label for="capacidadMaxima" class="block text-gray-700 font-bold mb-2">Capacidad Máxima:</label>
            <input type="number" id="capacidadMaxima" v-model="capacidadMaxima" required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
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
        <div class="mb-4">
            <label for="pisoId" class="block text-gray-700 font-bold mb-2">Piso:</label>
            <select id="pisoId" v-model="pisoId" required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">Seleccione un piso</option>
                <option v-for="piso in pisosFiltrados" :key="piso.id" :value="piso.id">
                    {{ piso.numero_piso }}
                </option>
            </select>
        </div>
        <div class="mb-4">
            <label for="torreId" class="block text-gray-700 font-bold mb-2">Torre:</label>
            <select id="torreId" v-model="torreid" required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">Seleccione una torre</option>
                <option v-for="torre in torresFiltradas" :key="torre.id" :value="torre.id">
                    {{ torre.nombre_torre }}
                </option>
            </select>
        </div>
        <div class="flex justify-end space-x-2">
            <button type="submit"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {{ isEditing ? 'Actualizar Cuarto' : 'Crear Cuarto' }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
    initialData: Object,
    isEditing: Boolean
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
const validarNumeroCuarto = (numero) => {
    return /^[0-9]+(\.[0-9]+)?$/.test(numero);
};

const validarCapacidadMaxima = (capacidad) => {
    return /^[0-9]+$/.test(capacidad);
};

// Computed para filtrar los pisos según la beca seleccionada
const pisosFiltrados = computed(() => {
    return pisos.value.filter(piso => piso.becaId === becaId.value);
});

const torresFiltradas = computed(() => {
    return torres.value.filter(torre => torre.pisoId === pisoId.value);
});

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

// Función para cargar los pisos
const cargarPisos = async () => {
    try {
        const response = await $fetch(`${config.public.backend_url}/pisos`);
        pisos.value = response;
    } catch (error) {
        console.error('Error al cargar los pisos:', error);
        alert('Error al cargar los pisos');
    }
};

// Función para cargar las torres
const cargarTorres = async () => {
    try {
        const response = await $fetch(`${config.public.backend_url}/torres`);
        torres.value = response;
    } catch (error) {
        console.error('Error al cargar las torres:', error);
        alert('Error al cargar las torres');
    }
};

// Función para validar y enviar el formulario
const validarYEnviar = () => {
    if (!validarNumeroCuarto(numeroCuarto.value)) {
        alert('El número de cuarto debe ser un número entero o decimal.');
        return;
    }
    if (!validarCapacidadMaxima(capacidadMaxima.value)) {
        alert('La capacidad máxima debe ser un número entero.');
        return;
    }
    enviarFormulario();
};

const enviarFormulario = async () => {
    const url = props.isEditing
        ? `${config.public.backend_url}/cuartos/update/${props.initialData.id}`
        : `${config.public.backend_url}/cuartos/create`;
    const method = props.isEditing ? 'PUT' : 'POST';

    const formData = {
        numero_cuarto: numeroCuarto.value,
        capacidad_maxima: capacidadMaxima.value,
        torreid: parseInt(torreid.value)
    };

    console.log('Datos enviados:', formData);

    try {
        const response = await $fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = response;

        if (props.isEditing) {
            emit('cuartoActualizado', data);
        } else {
            emit('cuartoCreado', data);
        }

        emit('cerrarFormulario');

        setTimeout(() => {
            alert(props.isEditing ? 'Cuarto actualizado exitosamente' : 'Cuarto creado exitosamente');
        }, 100);

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}\nPor favor, verifique los datos e intente nuevamente.`);
    }
};


onMounted(async () => {
    await cargarBecas();
    await cargarPisos();
    await cargarTorres();

    if(props.isEditing){
        console.log(props.initialData)
        console.log(props.initialData.torre.piso.beca.id)
        becaId.value = props.initialData.torre.piso.beca.id
        pisoId.value = props.initialData.torre.piso.id
        torreid.value = props.initialData.torre.id

    }
    
    
});
</script> 