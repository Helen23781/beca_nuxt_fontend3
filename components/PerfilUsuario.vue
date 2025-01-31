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
            <div class="mb-2">
                <input type="password" v-model="newPassword" :class="newPasswordClass" placeholder="Nueva Contraseña" />
            </div>
            <div class="mb-2">
                <input type="password" v-model="confirmPassword" :class="confirmPasswordClass"
                    placeholder="Confirmar Nueva Contraseña" />
            </div>
            <button @click="actualizarPerfil" class="mt-2 p-2 bg-blue-500 text-white rounded">Actualizar</button>
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

const actualizarPerfil = async () => {
    if (!newPassword.value || !confirmPassword.value) {
        toast.error('Llene todos los campos');
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
        toast.error('Las contraseñas no coinciden');
        return;
    }

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
    }
};
</script>