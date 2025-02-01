<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">Lista de Usuarios</h1>
        <div class="flex justify-end mb-6">
            <button @click="abrirFormulario()"
                class="bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clip-rule="evenodd" />
                </svg>
                Insertar Usuario
            </button>
        </div>
        <table class="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                    <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Nombre de
                        Usuario</th>
                    <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Rol</th>
                    <th class="px-4 py-2 border-b-2 border-gray-200 bg-blue-200 text-black text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="usuario in usuarios" :key="usuario.id" class="hover:bg-gray-50">
                    <td class="px-4 py-2 border-b border-gray-200 text-center">{{ usuario.nombre_usuario }}</td>
                    <td class="px-4 py-2 border-b border-gray-200 text-center">{{ usuario.role }}</td>
                    <td class="px-4 py-2 border-b border-gray-200 text-center">
                        <button @click="abrirFormulario(usuario)"
                            class="text-blue-500 hover:underline mr-2">Editar</button>
                        <button @click="deleteUsuario(usuario.id)" class="text-red-500 hover:underline">Borrar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <Modal :visible="showModal" @close="showModal = false">
            <UsuarioFormulario :initialData="usuarioSeleccionado" :isEditing="isEditing" @usuarioCreado="agregarUsuario"
                @usuarioActualizado="actualizarUsuario" @cerrarFormulario="showModal = false" />
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';


const toast = useToast();
const config = useRuntimeConfig();
const { token } = useAuth();

const usuarios = ref([]);
const showModal = ref(false);
const usuarioSeleccionado = ref(null);
const isEditing = ref(false);

// Configuración de SEO
useSeoMeta({
    title: 'Gestión de residencias universitarias',
    ogTitle: 'Gestión de residencias universitarias',
    description: 'Sistema integral para la gestión de residencias y becas universitarias.',
    ogDescription: 'Sistema integral para la gestión de residencias y becas universitarias.',
    ogImage: '/images/logo.jpg', // Puedes agregar la URL de una imagen aquí
    keywords: 'residencias universitarias, gestión de becas, administración de pisos, control de habitaciones'
});

const fetchUsuarios = async () => {
    try {
        const data = await $fetch(`${config.public.backend_url}/usuarios`, {
            headers: {
                'Authorization': token.value
            },
        });
        usuarios.value = data;
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        toast.error('Error al obtener los usuarios. Por favor, inténtalo de nuevo.');
    }
};

const abrirFormulario = (usuario = null) => {
    usuarioSeleccionado.value = usuario;
    isEditing.value = !!usuario;
    showModal.value = true;
};

const agregarUsuario = (nuevoUsuario) => {
    usuarios.value.push(nuevoUsuario);
    toast.success('Usuario creado exitosamente');
};

const actualizarUsuario = (usuarioActualizado) => {
    const index = usuarios.value.findIndex(usuario => usuario.id === usuarioActualizado.id);
    if (index !== -1) {
        usuarios.value[index] = usuarioActualizado;
        toast.success('Usuario actualizado exitosamente');
    }
};

const deleteUsuario = async (id) => {
    try {
        await $fetch(`${config.public.backend_url}/usuarios/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token.value
            }
        });
        toast.success('Usuario eliminado exitosamente');
        fetchUsuarios();
    } catch (error) {
        console.error(error);
        toast.error('Hubo un problema al eliminar el usuario. Por favor, inténtalo de nuevo.');
    }
};

onMounted(() => {
    fetchUsuarios();
});
</script>