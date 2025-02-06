<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 class="text-3xl font-bold mb-6 text-center">Iniciar Sesión</h1>
      <form @submit.prevent="handleSignIn">
        <div class="mb-4">
          <label for="nombre_usuario" class="block text-gray-700">Nombre de usuario</label>
          <input id="nombre_usuario" v-model="nombre_usuario" type="text" required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div class="mb-6 relative">
          <label for="contrasena" class="block text-gray-700">Contraseña</label>
          <input :type="mostrarContrasena ? 'text' : 'password'" id="contrasena" v-model="contrasena" required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          <button type="button" @click="toggleMostrarContrasena"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
            <svg v-if="mostrarContrasena" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.97 10.97 0 0112 20c-7 0-11-8-11-8a21.35 21.35 0 014.06-5.94M1 1l22 22"></path>
            </svg>
          </button>
        </div>
        <button type="submit" :disabled="cargando"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
          {{ cargando ? 'Cargando...' : 'Iniciar sesión' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from 'vue-toastification';

const { signIn } = useAuth()

const nombre_usuario = ref("");
const contrasena = ref("");
const mostrarContrasena = ref(false);
const cargando = ref(false);

const toast = useToast();

definePageMeta({
  layout: "login",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

// Configuración de SEO
useSeoMeta({
  title: 'Iniciar sesión - Plataforma de gestión',
  ogTitle: 'Iniciar sesión - Plataforma de gestión',
  description: 'Accede a la plataforma de gestión de residencias universitarias.',
  ogDescription: 'Accede a la plataforma de gestión de residencias universitarias.',
  ogImage: '/images/logo.jpg', // Puedes agregar la URL de una imagen aquí
  keywords: 'iniciar sesión, plataforma de gestión, residencias universitarias'
});

const handleSignIn = async () => {
  cargando.value = true;
  try {
    await signIn({ nombre_usuario: nombre_usuario.value, contrasena: contrasena.value },
      { callbackUrl: '/confirm2FA', redirect: true });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    toast.error("Credenciales inválidas. Por favor, inténtalo de nuevo.");
  } finally {
    cargando.value = false;
  }
};

const toggleMostrarContrasena = () => {
  mostrarContrasena.value = !mostrarContrasena.value;
};
</script>
