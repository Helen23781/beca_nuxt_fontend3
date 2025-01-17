<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
      <form @submit.prevent="handleSignIn">
        <div class="mb-4">
          <label for="nombre_usuario" class="block text-gray-700">Nombre de usuario</label>
          <input
            id="nombre_usuario"
            v-model="nombre_usuario"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div class="mb-6">
          <label for="contrasena" class="block text-gray-700">Contraseña</label>
          <input
            id="contrasena"
            v-model="contrasena"
            type="password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const {signIn} = useAuth()

const nombre_usuario = ref("");
const contrasena = ref("");

definePageMeta({
  layout: "login",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const handleSignIn = async () => {
  try {
    await signIn({ nombre_usuario: nombre_usuario.value, contrasena: contrasena.value }, { callbackUrl: '/', redirect:true });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
};
</script>
