<template>
    <div class="max-w-xl mx-auto bg-white p-4 rounded-lg shadow-md max-h-screen overflow-y-auto">
        <form @submit.prevent="validarYEnviar"
            class="max-w-xl mx-auto bg-white p-4 rounded-lg shadow-md max-h-screengap-4">
            <div class="flex justify-center mb-4">
                <NuxtImg :src="fotoUrl" alt="Vista previa de la foto"
                    class="rounded-full h-24 w-24 object-cover cursor-pointer" @click="mostrarFotoGrande" />
            </div>

            <!-- Modal para mostrar la foto en grande -->
            <div v-if="fotoGrande" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                @click="cerrarFotoGrande">
                <img :src="fotoGrande" alt="Foto del estudiante" class="max-w-full max-h-full" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label for="facultad" class="block text-gray-700 font-bold mb-1">Facultad:</label>
                    <select id="facultad" v-model="facultad" required
                        :class="['shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', { 'border-red-500': !facultad }]"
                        :disabled="isReadOnly">
                        <option value="">Seleccione una facultad</option>
                        <option value="Ciencias Tecnicas y Economicas">Ciencias Técnicas y Económicas</option>
                        <option value="Ciencias Pedagogicas">Ciencias Pedagógicas</option>
                        <option value="Humanidades">Humanidades</option>
                        <option value="Cultura Fisica">Cultura Física</option>
                        <option value="Ciencias Agropecuarias">Ciencias Agropecuarias</option>
                    </select>
                </div>
                <div>
                    <label for="carrera" class="block text-gray-700 font-bold mb-1">Carrera:</label>
                    <select id="carrera" v-model="carrera" required
                        :class="['shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', { 'border-red-500': !carrera }]"
                        :disabled="isReadOnly">
                        <option value="">Seleccione una carrera</option>
                        <option v-for="c in carrerasFiltradas" :key="c" :value="c">{{ c }}</option>
                    </select>
                </div>
                <div>
                    <label for="nombreEstudiante" class="block text-gray-700 font-bold mb-1">Nombre:</label>
                    <input type="text" id="nombreEstudiante" v-model="nombreEstudiante" required
                        :class="['shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', { 'border-red-500': !nombreEstudiante }]"
                        :disabled="isReadOnly" />
                </div>
                <div>
                    <label for="apellidoEstudiante" class="block text-gray-700 font-bold mb-1">Apellido:</label>
                    <input type="text" id="apellidoEstudiante" v-model="apellidoEstudiante" required
                        :class="['shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', { 'border-red-500': !apellidoEstudiante }]"
                        :disabled="isReadOnly" />
                </div>
                <div>
                    <label for="ci" class="block text-gray-700 font-bold mb-1 mr-4">CI:</label>

                    <div class="flex items-center">
                        <input type="text" id="ci" v-model="ci" @input="determinarSexo" required maxlength="11"
                            class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            :disabled="isReadOnly" />

                    </div>
                </div>
                <div>

                    <label class="block text-gray-700 font-bold mb-1">Género:</label>
                    <div class="ml-4">
                        <label class="inline-flex items-center">
                            <input type="radio" :checked="sexo === 'Femenino'" disabled
                                class="form-radio text-pink-600" />
                            <span class="ml-2 text-gray-700">Femenino</span>
                        </label>
                        <label class="inline-flex items-center ml-4">
                            <input type="radio" :checked="sexo === 'Masculino'" disabled
                                class="form-radio text-blue-600" />
                            <span class="ml-2 text-gray-700">Masculino</span>
                        </label>
                    </div>

                </div>
                <div>
                    <label for="edad" class="block text-gray-700 font-bold mb-1">Edad:</label>
                    <input type="number" id="edad" v-model="edad" required min="1"
                        :class="['shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', { 'border-red-500': !edad }]"
                        :disabled="isReadOnly" />
                </div>
                <div>
                    <label for="anioAcademico" class="block text-gray-700 font-bold mb-1">Año Académico:</label>
                    <select id="anioAcademico" v-model="anioAcademico" required
                        :class="['shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', { 'border-red-500': !anioAcademico }]"
                        :disabled="isReadOnly">
                        <option value="">Seleccione un año</option>
                        <option v-for="anio in [1, 2, 3, 4, 5, 6]" :key="anio" :value="anio">{{ anio }}</option>
                    </select>
                </div>
                <div>
                    <label for="becaId" class="block text-gray-700 font-bold mb-1">Beca:</label>
                    <select id="becaId" v-model="becaId" required
                        :class="['shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', { 'border-red-500': !becaId }]"
                        :disabled="isReadOnly">
                        <option value="">Seleccione una beca</option>
                        <option v-for="beca in becas" :key="beca.id" :value="beca.id">
                            {{ beca.nombre_beca }}
                        </option>
                    </select>
                </div>
                <div>
                    <label for="pisoId" class="block text-gray-700 font-bold mb-1">Piso:</label>
                    <select id="pisoId" v-model="pisoId" required
                        :class="['shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', { 'border-red-500': !pisoId }]"
                        :disabled="isReadOnly">
                        <option value="">Seleccione un piso</option>
                        <option v-for="piso in pisosFiltrados" :key="piso.id" :value="piso.id">
                            {{ piso.numero_piso }}
                        </option>
                    </select>
                </div>
                <div>
                    <label for="torreid" class="block text-gray-700 font-bold mb-1">Torre:</label>
                    <select id="torreid" v-model="torreid" required
                        :class="['shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', { 'border-red-500': !torreid }]"
                        :disabled="isReadOnly">
                        <option value="">Seleccione una torre</option>
                        <option v-for="torre in torresFiltradas" :key="torre.id" :value="torre.id">
                            {{ torre.nombre_torre }}
                        </option>
                    </select>
                </div>
                <div>
                    <label for="cuartoId" class="block text-gray-700 font-bold mb-1">Cuarto:</label>
                    <select id="cuartoId" v-model="cuartoId" required
                        :class="['shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline', { 'border-red-500': !cuartoId }]"
                        :disabled="isReadOnly">
                        <option value="">Seleccione un cuarto</option>
                        <option v-for="cuarto in cuartosFiltrados" :key="cuarto.id" :value="cuarto.id">
                            {{ cuarto.numero_cuarto }}
                        </option>
                    </select>
                </div>
                <div>
                    <label for="foto" class="block text-gray-700 font-bold mb-1">Foto:</label>
                    <input type="file" id="foto" @change="handleFileChange"
                        class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        :disabled="isReadOnly" />
                </div>
            </div>
            <div class="flex justify-end space-x-2 mt-4">
                <button type="button" @click="cancelarFormulario"
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancelar
                </button>
                <button type="submit" v-if="!isShowing"
                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    {{ isEditing ? 'Actualizar Estudiante' : 'Crear Estudiante' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRuntimeConfig } from '#app';
const { token } = useAuth()

const toast = useToast();

// Define `emit` para emitir eventos desde el componente
const emit = defineEmits(['estudianteCreado', 'estudianteActualizado', 'cerrarFormulario']);

const props = defineProps({
    initialData: Object,
    isEditing: Boolean,
    isShowing: Boolean,

});

const isReadOnly = ref(props.isShowing)

const config = useRuntimeConfig();
const nombreEstudiante = ref(props.initialData?.nombre_estudiante || '');
const apellidoEstudiante = ref(props.initialData?.apellido_estudiante || '');
const ci = ref(props.initialData?.ci || '');
const anioAcademico = ref(props.initialData?.anio_academico || '');
const edad = ref(props.initialData?.edad || '');
const carrera = ref(props.initialData?.carrera || '');
const facultad = ref(props.initialData?.facultad || '');
const becaId = ref(props.initialData?.cuarto?.torre?.piso?.beca?.id || '');
const pisoId = ref(props.initialData?.cuarto?.torre?.piso?.id || '');
const torreid = ref(props.initialData?.cuarto?.torre?.id || '');
const cuartoId = ref(props.initialData?.cuarto?.id || '');
const foto = ref(props.initialData?.foto || '');
const becas = ref([]);
const pisos = ref([]);
const torres = ref([]);
const cuartos = ref([]);

const fotoGrande = ref(null);
const sexo = ref('');

// Opciones de carreras por facultad
const opcionesCarreras = {
    "Ciencias Pedagogicas": [
        "Licenciatura en Psicopedagogia", "Licenciatura en Logopedia", "Licenciatura en Enseñanza especial", "Licenciatura en Educacion Primaria",
        "Licenciatura en Historia", "Licenciatura en Geografia", "Licenciatura en Matematicas",
        "Licenciatura en Quimica", "Licenciatura en Español", "Licenciatura en Lenguas Extranjeras", "Licenciatura en Biologia", "Marxismo Leninismo", "Licenciatura en Filosofia"
    ],
    "Ciencias Tecnicas y Economicas": [
        "Ingieneria informatica", "Ingieneria Industrial", "Contabilidad y Finanzas",
        "Licenciatura Informatica", "Licenciatura en electicidad"
    ],
    "Humanidades": [
        "Licenciatura en Derecho", "Psicologia", "Licenciatura en Educacion Artistica"
    ],
    "Ciencias Agropecuarias": [
        "Ingeniería Agrónoma", "Ingeniería Forestal"
    ],
    "Cultura Física": [
        "Licenciatura en Cultura Física"
    ],
    // Agrega más facultades y sus carreras aquí si es necesario
};

// Computed para filtrar las carreras según la facultad seleccionada
const carrerasFiltradas = computed(() => {
    return opcionesCarreras[facultad.value] || [];
});

// Computed para filtrar los pisos según la beca seleccionada
const pisosFiltrados = computed(() => {
    return pisos.value.filter(piso => piso.becaId === becaId.value);
});

const torresFiltradas = computed(() => {
    return torres.value.filter(torre => torre.pisoId === pisoId.value);
});

// Computed para filtrar los cuartos según la torre seleccionada
const cuartosFiltrados = computed(() => {
    return cuartos.value.filter(cuarto => cuarto.torreid === torreid.value);
});

// Computed para obtener la URL de la foto desde el backend o Supabase
const fotoUrl = computed(() => {
    if (foto.value && foto.value.includes('supabase.co')) {
        // Si la URL ya es de Supabase, la usamos directamente
        return foto.value;
    }
    return foto.value && !foto.value.startsWith('data:')
        ? `${config.public.backend_url}/estudiantes/foto/${foto.value}`
        : foto.value || '/images/avatar.jpg';
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

// Función para cargar las torres
const cargarTorres = async () => {
    try {
        const response = await $fetch(`${config.public.backend_url}/torres`, {
            headers: {
                'Authorization': token.value
            },
        });
        torres.value = response;
    } catch (error) {
        console.error('Error al cargar las torres:', error);
        toast.error('Error al cargar las torres');
    }
};

// Función para cargar los cuartos
const cargarCuartos = async () => {
    try {
        const response = await $fetch(`${config.public.backend_url}/cuartos`, {
            headers: {
                'Authorization': token.value
            },
        });
        cuartos.value = response;
    } catch (error) {
        console.error('Error al cargar los cuartos:', error);
        toast.error('Error al cargar los cuartos');
    }
};

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

// Función para determinar el sexo basado en el último dígito del CI
const determinarSexo = () => {
    if (ci.value.length === 11) {
        const ultimoDigito = parseInt(ci.value[ci.value.length - 1], 10);
        sexo.value = ultimoDigito % 2 === 0 ? 'Femenino' : 'Masculino';
    } else {
        sexo.value = '';
    }
};

// Validaciones
const validarNombreApellido = (nombre) => /^[A-Z][a-zA-Z\s]*$/.test(nombre);
const validarAnioAcademico = (anio) => /^[1-5]$/.test(anio);
const validarEdad = (edad) => /^[1-9][0-9]?$/.test(edad);

// Actualización de la validación para el CI
const validarCI = (ci) => {
    return /^\d{11}$/.test(ci); // Verifica que tenga 11 dígitos
};

const validarYEnviar = () => {
    if (!ci.value) {
        toast.error('Seleccione un carnet de identidad primero.');
        return;
    }
    if (!validarNombreApellido(nombreEstudiante.value)) {
        toast.error('El nombre debe contener solo letras y comenzar con mayúscula.');
        return;
    }
    if (!validarNombreApellido(apellidoEstudiante.value)) {
        toast.error('El apellido debe contener solo letras y comenzar con mayúscula.');
        return;
    }
    if (!validarAnioAcademico(anioAcademico.value)) {
        toast.error('El año académico debe ser un número entre 1 y 5.');
        return;
    }
    if (!validarEdad(edad.value)) {
        toast.error('La edad debe ser un número entero menor que 100.');
        return;
    }
    if (!validarCI(ci.value)) {
        toast.error('El CI debe tener 11 dígitos.');
        return;
    }
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
    formData.append('ci', ci.value);
    formData.append('anio_academico', anioAcademico.value);
    formData.append('edad', edad.value);
    formData.append('carrera', carrera.value);
    formData.append('facultad', facultad.value);
    formData.append('becaId', becaId.value);
    formData.append('pisoId', pisoId.value);
    formData.append('torreid', torreid.value);
    formData.append('cuartoId', cuartoId.value);

    if (foto.value) {
        const fileInput = document.getElementById('foto');
        if (fileInput && fileInput.files.length > 0) {
            formData.append('foto', fileInput.files[0]);
        }
    }

    try {
        const response = await $fetch(url, {
            method,
            headers: {
                'Authorization': token.value
            },
            body: formData
        });

        const data = response;

        if (props.isEditing) {
            emit('estudianteActualizado', data);
            toast.success('Estudiante actualizado exitosamente');
        } else {
            emit('estudianteCreado', data);
            localStorage.removeItem('datosFormularioEstudiante');
            toast.success('Estudiante creado exitosamente');
        }

        emit('cerrarFormulario');

    } catch (error) {
        console.error('Error:', error);

        toast.error(`Error: ${error.response._data.message}`);
    }
};

// Guardar en localStorage cada vez que los campos cambien
watch([nombreEstudiante, apellidoEstudiante, anioAcademico, edad, carrera, facultad, becaId, pisoId, torreid, cuartoId, foto, ci], () => {
    if (!props.isEditing) {
        localStorage.setItem('datosFormularioEstudiante', JSON.stringify({
            nombre_estudiante: nombreEstudiante.value,
            apellido_estudiante: apellidoEstudiante.value,
            ci: ci.value,
            anio_academico: anioAcademico.value,
            edad: edad.value,
            carrera: carrera.value,
            facultad: facultad.value,
            becaId: becaId.value,
            pisoId: pisoId.value,
            torreid: torreid.value,
            cuartoId: cuartoId.value,
            foto: foto.value
        }));
    }
});

// Cargar datos de localStorage solo si no está editando
if (!props.isEditing) {
    const storedData = JSON.parse(localStorage.getItem('datosFormularioEstudiante'));
    if (storedData) {
        nombreEstudiante.value = storedData.nombre_estudiante || '';
        apellidoEstudiante.value = storedData.apellido_estudiante || '';
        ci.value = storedData.ci || '';
        anioAcademico.value = storedData.anio_academico || '';
        edad.value = storedData.edad || '';
        carrera.value = storedData.carrera || '';
        facultad.value = storedData.facultad || '';
        becaId.value = storedData.becaId || '';
        pisoId.value = storedData.pisoId || '';
        torreid.value = storedData.torreid || '';
        cuartoId.value = storedData.cuartoId || '';
        foto.value = storedData.foto || '';
    }
}

const cancelarFormulario = () => {
    localStorage.removeItem('datosFormularioEstudiante');
    emit('cerrarFormulario');
};

onMounted(async () => {
    await cargarBecas();
    await cargarPisos();
    await cargarTorres();
    await cargarCuartos();
    determinarSexo()

    if (props.isEditing || props.isShowing) {
        becaId.value = props.initialData?.cuarto?.torre?.piso?.beca?.id || '';
        pisoId.value = props.initialData?.cuarto?.torre?.piso?.id || '';
        torreid.value = props.initialData?.cuarto?.torre?.id || '';
        cuartoId.value = props.initialData?.cuarto?.id || '';
    }
});

// Observa cambios en la selección de la torre
watch(torreid, (newTorreId) => {
    if (newTorreId && cuartosFiltrados.value.length === 0) {
        toast.error('La torre no tiene cuartos asociados');
    }
});

// Observa cambios en la selección de la beca
watch(becaId, (newBecaId) => {
    if (newBecaId && pisosFiltrados.value.length === 0) {
        toast.error('Esta beca no tiene pisos asociados');
    }
});

// Observa cambios en la selección del piso
watch(pisoId, (newPisoId) => {
    if (newPisoId && torresFiltradas.value.length === 0) {
        toast.error('El piso no tiene torres asociadas');
    }
});

// Observa cambios en la selección de la carrera
watch(carrera, (newCarrera) => {
    if (newCarrera && !facultad.value) {
        toast.error('Primero seleccione una facultad');
        carrera.value = ''; // Resetea la selección de carrera
    }
});

const mostrarFotoGrande = () => {
    if (fotoUrl.value) {
        fotoGrande.value = fotoUrl.value;
    }
};

const cerrarFotoGrande = () => {
    fotoGrande.value = null;
};

const handleImageError = (event) => {
    if (event.target.src !== '/images/avatar.jpg') {
        event.target.src = '/images/avatar.jpg';
    }
};

</script>
