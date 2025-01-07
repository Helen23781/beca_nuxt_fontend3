<template>
    <form @submit.prevent="validarYEnviar" class="max-w-lg mx-auto bg-white p-4 rounded-lg shadow-md max-h-screengap-4">
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="nombreEstudiante" class="block text-gray-700 font-bold mb-1">Nombre:</label>
                <input type="text" id="nombreEstudiante" v-model="nombreEstudiante" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
                <label for="apellidoEstudiante" class="block text-gray-700 font-bold mb-1">Apellido:</label>
                <input type="text" id="apellidoEstudiante" v-model="apellidoEstudiante" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
                <label for="anioAcademico" class="block text-gray-700 font-bold mb-1">Año Académico:</label>
                <input type="number" id="anioAcademico" v-model="anioAcademico" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
                <label for="edad" class="block text-gray-700 font-bold mb-1">Edad:</label>
                <input type="number" id="edad" v-model="edad" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
                <label for="carrera" class="block text-gray-700 font-bold mb-1">Carrera:</label>
                <input type="text" id="carrera" v-model="carrera" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
                <label for="facultad" class="block text-gray-700 font-bold mb-1">Facultad:</label>
                <input type="text" id="facultad" v-model="facultad" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div>
                <label for="becaId" class="block text-gray-700 font-bold mb-1">Beca:</label>
                <select id="becaId" v-model="becaId" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="">Seleccione una beca</option>
                    <option v-for="beca in becas" :key="beca.id" :value="beca.id">
                        {{ beca.nombre_beca }}
                    </option>
                </select>
            </div>
            <div>
                <label for="pisoId" class="block text-gray-700 font-bold mb-1">Piso:</label>
                <select id="pisoId" v-model="pisoId" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="">Seleccione un piso</option>
                    <option v-for="piso in pisosFiltrados" :key="piso.id" :value="piso.id">
                        {{ piso.numero_piso }}
                    </option>
                </select>
            </div>
            <div>
                <label for="torreId" class="block text-gray-700 font-bold mb-1">Torre:</label>
                <select id="torreId" v-model="torreId" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="">Seleccione una torre</option>
                    <option v-for="torre in torresFiltradas" :key="torre.id" :value="torre.id">
                        {{ torre.nombre_torre }}
                    </option>
                </select>
            </div>
            <div>
                <label for="cuartoId" class="block text-gray-700 font-bold mb-1">Cuarto:</label>
                <select id="cuartoId" v-model="cuartoId" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="">Seleccione un cuarto</option>
                    <option v-for="cuarto in cuartos" :key="cuarto.id" :value="cuarto.id">
                        {{ cuarto.numero_cuarto }}
                    </option>
                </select>
            </div>
            <div>
                <label for="foto" class="block text-gray-700 font-bold mb-1">Foto:</label>
                <input type="file" id="foto" @change="handleFileChange"
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                <img v-if="foto" :src="foto" alt="Vista previa de la foto" class="mt-2 max-w-xs rounded-lg shadow-md">
            </div>
        </div>
        <div class="flex justify-end space-x-2 mt-4">
            <button type="submit"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {{ isEditing ? 'Actualizar Estudiante' : 'Crear Estudiante' }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';

const props = defineProps({
    initialData: Object,
    isEditing: Boolean
});

const emit = defineEmits(['estudianteCreado', 'estudianteActualizado', 'cerrarFormulario']);

const config = useRuntimeConfig();
const nombreEstudiante = ref(props.initialData?.nombre_estudiante || '');
const apellidoEstudiante = ref(props.initialData?.apellido_estudiante || '');
const anioAcademico = ref(props.initialData?.anio_academico || '');
const edad = ref(props.initialData?.edad || '');
const carrera = ref(props.initialData?.carrera || '');
const facultad = ref(props.initialData?.facultad || '');
const becaId = ref(props.initialData?.becaId || '');
const pisoId = ref(props.initialData?.pisoId || '');
const torreId = ref(props.initialData?.torreId || '');
const cuartoId = ref(props.initialData?.cuartoId || '');
const foto = ref(props.initialData?.foto || '');
const becas = ref([]);
const pisos = ref([]);
const torres = ref([]);
const cuartos = ref([]);

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

// Función para cargar los cuartos
const cargarCuartos = async () => {
    try {
        const response = await $fetch(`${config.public.backend_url}/cuartos`);
        cuartos.value = response;
        console.log(response)
    } catch (error) {
        console.error('Error al cargar los cuartos:', error);
        alert('Error al cargar los cuartos');
    }
};

// Función para cargar los cuartos por torre
const cargarCuartosPorTorre = async (torreId) => {
    try {
        const response = await $fetch(`${config.public.backend_url}/cuartos/torre/${torreId}`);
        cuartos.value = response;
    } catch (error) {
        console.error('Error al cargar los cuartos por torre:', error);
        alert('Error al cargar los cuartos por torre');
    }
};

// Observa cambios en torreId para cargar cuartos
watch(torreId, (newTorreId) => {
    if (newTorreId) {
        cargarCuartosPorTorre(newTorreId);
    }
});

// Función para manejar el cambio de archivo
const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            foto.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

// Función para validar y enviar el formulario
const validarYEnviar = () => {
    enviarFormulario();
};

const enviarFormulario = async () => {
    const url = props.isEditing
        ? `${config.public.backend_url}/estudiantes/update/${props.initialData.id}`
        : `${config.public.backend_url}/estudiantes/create`;
    const method = props.isEditing ? 'PUT' : 'POST';

    const formData = new FormData();
    formData.append('nombre_estudiante', nombreEstudiante.value);
    formData.append('apellido_estudiante', apellidoEstudiante.value);
    formData.append('anio_academico', anioAcademico.value);
    formData.append('edad', edad.value);
    formData.append('carrera', carrera.value);
    formData.append('facultad', facultad.value);
    formData.append('cuartoId', cuartoId.value);
    
    if (foto.value) {
        const fileInput = document.getElementById('foto');
        if (fileInput && fileInput.files.length > 0) {
            formData.append('foto', fileInput.files[0]);
        }
    }

    console.log('Datos enviados:', formData);

    try {
        const response = await $fetch(url, {
            method,
            body: formData
        });

        const data = response;

        if (props.isEditing) {
            emit('estudianteActualizado', data);
        } else {
            emit('estudianteCreado', data);
        }

        emit('cerrarFormulario');

        setTimeout(() => {
            alert(props.isEditing ? 'Estudiante actualizado exitosamente' : 'Estudiante creado exitosamente');
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
    await cargarCuartos();
    if (props.initialData) {
        console.log('Datos iniciales:', props.initialData);
    }
});
</script>