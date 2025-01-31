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
            <input type="password" v-model="newPassword" placeholder="Nueva Contraseña"
                class="mt-2 p-2 border rounded" />
            <input type="password" v-model="confirmPassword" placeholder="Confirmar Nueva Contraseña"
                class="mt-2 p-2 border rounded" />
            <button @click="actualizarPerfil" class="mt-2 p-2 bg-blue-500 text-white rounded">Actualizar</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from 'vue-auth';
import { useToast } from 'vue-toastification';

const { data, token } = useAuth();
const toast = useToast();

const userData = ref({
    nombre: data.value.nombre_usuario,
});
const config = useRuntimeConfig();

const newPassword = ref('');
const confirmPassword = ref('');

const actualizarPerfil = async () => {
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
        const response = await $fetch(`${config.public.backend_url}/mi-cuenta`, {
            method: 'PUT',
            headers: {
                'Authorization': token.value
            },
            body: updateData,
        });
        toast.success('Perfil actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        toast.error('Error al actualizar el perfil');
    }
};
</script>