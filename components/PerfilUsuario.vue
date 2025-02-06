<template>
    <div>
        <h2 class="text-xl font-bold mb-4">Perfil de Usuario</h2>
        <div>
            <p><strong>Nombre:</strong> {{ userData.nombre }}</p>
            <input type="text" v-model="userData.nombre" placeholder="Nuevo Nombre de Usuario"
                class="mt-2 p-2 border rounded" />
        </div>
        <div class="mt-4">
            <h3 class="text-lg font-semibold">Cambiar Contraseña</h3>
            <div class="mb-2 relative">
                <input :type="mostrarContrasena ? 'text' : 'password'" v-model="newPassword" :class="newPasswordClass"
                    placeholder="Nueva Contraseña" />
                <button type="button" @click="toggleMostrarContrasena"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <svg v-if="mostrarContrasena" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M17.94 17.94A10.97 10.97 0 0112 20c-7 0-11-8-11-8a21.35 21.35 0 014.06-5.94M1 1l22 22">
                        </path>
                    </svg>
                </button>
            </div>
            <div class="mb-2 relative">
                <input :type="mostrarContrasena ? 'text' : 'password'" v-model="confirmPassword"
                    :class="confirmPasswordClass" placeholder="Confirmar Nueva Contraseña" />
                <button type="button" @click="toggleMostrarContrasena"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <svg v-if="mostrarContrasena" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M17.94 17.94A10.97 10.97 0 0112 20c-7 0-11-8-11-8a21.35 21.35 0 014.06-5.94M1 1l22 22">
                        </path>
                    </svg>
                </button>
            </div>
            <button @click="actualizarPerfil" :disabled="cargando" class="mt-2 p-2 bg-blue-500 text-white rounded">
                {{ cargando ? 'Cargando...' : 'Actualizar' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';

const { data, token } = useAuth();
const toast = useToast();

const emit = defineEmits(['cerrarFormulario']);

const userData = ref({
    nombre: data.value.nombre_usuario,
});
const config = useRuntimeConfig();

const newPassword = ref('');
const confirmPassword = ref('');

// Cambiar el color de los campos a rojo si están vacíos
const passwordFieldClass = 'mt-2 p-2 border rounded w-full';
const passwordFieldErrorClass = 'mt-2 p-2 border border-red-500 rounded w-full';

const newPasswordClass = computed(() => newPassword.value ? passwordFieldClass : passwordFieldErrorClass);
const confirmPasswordClass = computed(() => confirmPassword.value ? passwordFieldClass : passwordFieldErrorClass);

const mostrarContrasena = ref(false);

const toggleMostrarContrasena = () => {
    mostrarContrasena.value = !mostrarContrasena.value;
};

const cargando = ref(false);

const actualizarPerfil = async () => {
    if (!newPassword.value || !confirmPassword.value) {
        toast.error('Llene todos los campos');
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
        toast.error('Las contraseñas no coinciden');
        return;
    }

    cargando.value = true;
    const updateData = {};
    if (userData.value.nombre) {
        updateData.nombre_usuario = userData.value.nombre;
    }
    if (newPassword.value) {
        updateData.contrasena = newPassword.value;
    }

    try {
        await $fetch(`${config.public.backend_url}/mi-cuenta`, {
            method: 'PUT',
            headers: {
                'Authorization': token.value
            },
            body: updateData,
        });
        toast.success('Perfil actualizado exitosamente');
        emit('cerrarFormulario');
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        toast.error('Error al actualizar el perfil');
    } finally {
        cargando.value = false;
    }
};
</script>