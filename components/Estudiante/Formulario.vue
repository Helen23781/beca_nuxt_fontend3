<template>
    <form @submit.prevent="validarYEnviar" class="max-w-lg mx-auto bg-white p-4 rounded-lg shadow-md max-h-screengap-4">
        <div class="flex justify-center mb-4">
            <NuxtImg :src="fotoUrl" alt="Vista previa de la foto"
                class="rounded-full h-24 w-24 object-cover cursor-pointer" @click="mostrarFotoGrande" />
        </div>

        <!-- Modal para mostrar la foto en grande -->
        <div v-if="fotoGrande" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            @click="cerrarFotoGrande">
            <img :src="fotoGrande" alt="Foto del estudiante" class="max-w-full max-h-full" />
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="nombreEstudiante" class="block text-gray-700 font-bold mb-1">Nombre:</label>
                <input type="text" id="nombreEstudiante" v-model="nombreEstudiante" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    :disabled="isReadOnly" />
            </div>
            <div>
                <label for="apellidoEstudiante" class="block text-gray-700 font-bold mb-1">Apellido:</label>
                <input type="text" id="apellidoEstudiante" v-model="apellidoEstudiante" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    :disabled="isReadOnly" />
            </div>
            <div>
                <label for="anioAcademico" class="block text-gray-700 font-bold mb-1">Año Académico:</label>
                <input type="number" id="anioAcademico" v-model="anioAcademico" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    :disabled="isReadOnly" />
            </div>
            <div>
                <label for="edad" class="block text-gray-700 font-bold mb-1">Edad:</label>
                <input type="number" id="edad" v-model="edad" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    :disabled="isReadOnly" />
            </div>
            <div>
                <label for="facultad" class="block text-gray-700 font-bold mb-1">Facultad:</label>
                <select id="facultad" v-model="facultad" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    :disabled="isReadOnly">
                    <option value="">Seleccione una carrera</option>
                    <option v-for="c in carrerasFiltradas" :key="c" :value="c">{{ c }}</option>
                </select>
            </div>
            <div>
                <label for="becaId" class="block text-gray-700 font-bold mb-1">Beca:</label>
                <select id="becaId" v-model="becaId" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    :disabled="isReadOnly">
                    <option value="">Seleccione un piso</option>
                    <option v-for="piso in pisosFiltrados" :key="piso.id" :value="piso.id">
                        {{ piso.numero_piso }}
                    </option>
                </select>
            </div>
            <div>
                <label for="torreId" class="block text-gray-700 font-bold mb-1">Torre:</label>
                <select id="torreId" v-model="torreId" required
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    :disabled="isReadOnly">
                    <option value="">Seleccione un cuarto</option>
                    <option v-for="cuarto in cuartos" :key="cuarto.id" :value="cuarto.id">
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
            <button type="button" @click="$emit('cerrarFormulario')"
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Cancelar
            </button>
            <button type="submit"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {{ isEditing ? 'Actualizar Estudiante' : 'Crear Estudiante' }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRuntimeConfig } from '#app';
const { token } = useAuth()

const toast = useToast();

const props = defineProps({
    initialData: Object,
    isEditing: Boolean,
    isReadOnly: Boolean
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

const fotoGrande = ref(null);

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

// Computed para obtener la URL de la foto desde el backend
const fotoUrl = computed(() => {
    return foto.value && !foto.value.startsWith('data:')
        ? `${config.public.backend_url}/estudiantes/foto/${foto.value}`
        : '/images/avatar.jpg';
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

// Función para validar y enviar el formulario
const validarYEnviar = () => {
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
    enviarFormulario();
};

// Validaciones
const validarNombreApellido = (nombre) => /^[A-Z][a-zA-Z\s]*$/.test(nombre);
const validarAnioAcademico = (anio) => /^[1-5]$/.test(anio);
const validarEdad = (edad) => /^[1-9][0-9]?$/.test(edad);

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
    formData.append('becaId', becaId.value);
    formData.append('pisoId', pisoId.value);
    formData.append('torreId', torreId.value);
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
        toast.error(`Error: ${error.message}\nPor favor, verifique los datos e intente nuevamente.`);
    }
};

// Función para guardar datos en localStorage
const guardarEnLocalStorage = () => {
    const datosFormulario = {
        nombreEstudiante: nombreEstudiante.value,
        apellidoEstudiante: apellidoEstudiante.value,
        anioAcademico: anioAcademico.value,
        edad: edad.value,
        carrera: carrera.value,
        facultad: facultad.value,
        becaId: becaId.value,
        pisoId: pisoId.value,
        torreId: torreId.value,
        cuartoId: cuartoId.value,
        foto: foto.value
    };
    localStorage.setItem('datosFormularioEstudiante', JSON.stringify(datosFormulario));
};

// Función para cargar datos desde localStorage
const cargarDesdeLocalStorage = () => {
    const datosGuardados = localStorage.getItem('datosFormularioEstudiante');
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        nombreEstudiante.value = datos.nombreEstudiante || '';
        apellidoEstudiante.value = datos.apellidoEstudiante || '';
        anioAcademico.value = datos.anioAcademico || '';
        edad.value = datos.edad || '';
        carrera.value = datos.carrera || '';
        facultad.value = datos.facultad || '';
        becaId.value = datos.becaId || '';
        pisoId.value = datos.pisoId || '';
        torreId.value = datos.torreId || '';
        cuartoId.value = datos.cuartoId || '';
        foto.value = datos.foto || '';
    }
};

// Observa cambios en los campos del formulario para guardar en localStorage
watch([nombreEstudiante, apellidoEstudiante, anioAcademico, edad, carrera, facultad, becaId, pisoId, torreId, cuartoId, foto], guardarEnLocalStorage);

// Cargar datos desde localStorage al montar el componente
onMounted(async () => {
    cargarDesdeLocalStorage();
    await cargarBecas();
    await cargarPisos();
    await cargarTorres();
    await cargarCuartos();
    if (props.isEditing || props.isReadOnly) {
        console.log(props.initialData);
        becaId.value = props.initialData.cuarto.torre.piso.beca.id;
        pisoId.value = props.initialData.cuarto.torre.piso.id;
        torreId.value = props.initialData.cuarto.torre.id;
        cuartoId.value = props.initialData.cuarto.id;
    }
});

const mostrarFotoGrande = () => {
    if (foto.value) {
        fotoGrande.value = fotoUrl.value;
    }
};

const cerrarFotoGrande = () => {
    fotoGrande.value = null;
};

</script>