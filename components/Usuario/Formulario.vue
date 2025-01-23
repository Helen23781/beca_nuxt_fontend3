<template>
    <form @submit.prevent="validarYEnviar" class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div class="mb-4">
            <label for="nombreUsuario" class="block text-gray-700 font-bold mb-2">Nombre de Usuario:</label>
            <input type="text" id="nombreUsuario" v-model="nombreUsuario" required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div class="mb-4">
            <label for="contrasena" class="block text-gray-700 font-bold mb-2">Contraseña:</label>
            <input type="password" id="contrasena" v-model="contrasena" required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div class="mb-4">
            <label for="role" class="block text-gray-700 font-bold mb-2">Rol:</label>
            <select v-model="role" id="role" required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="" disabled selected>Seleccione el rol</option>
                <option value="gestor">Gestor</option>
                <option value="administrador">Administrador</option>
            </select>
        </div>
        <div class="flex justify-end space-x-2">
            <button type="button" @click="cancelarFormulario"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Cancelar
            </button>
            <button type="submit"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {{ isEditing ? 'Actualizar Usuario' : 'Crear Usuario' }}
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
const { token } = useAuth();

const props = defineProps({
    initialData: Object,
    isEditing: Boolean
});

const emit = defineEmits(['usuarioCreado', 'usuarioActualizado', 'cerrarFormulario']);

const config = useRuntimeConfig();
const nombreUsuario = ref(props.initialData?.nombre_usuario || '');
const contrasena = ref(props.initialData?.contrasena || '');
const role = ref(props.initialData?.role || '');

const cancelarFormulario = () => {
    emit('cerrarFormulario');
};

const enviarFormulario = async () => {
    const url = props.isEditing
        ? `${config.public.backend_url}/usuarios/update/${props.initialData.id}`
        : `${config.public.backend_url}/usuarios/create`;
    const method = props.isEditing ? 'PUT' : 'POST';

    try {
        const response = await $fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.value
            },
            body: JSON.stringify({
                nombre_usuario: nombreUsuario.value,
                contrasena: contrasena.value,
                role: role.value
            })
        });

        const data = await response;

        if (props.isEditing) {
            emit('usuarioActualizado', data);
        } else {
            emit('usuarioCreado', data);
        }

        emit('cerrarFormulario');

        setTimeout(() => {
            alert(props.isEditing ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
        }, 100);

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}\nPor favor, verifique los datos e intente nuevamente.`);
    }
};

const validarYEnviar = () => {
    enviarFormulario();
};
</script>