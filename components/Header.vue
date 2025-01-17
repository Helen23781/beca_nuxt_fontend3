<template>
  <header class="w-full bg-white shadow-md fixed top-0 z-50">
    <nav class="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <NuxtLink to="/"
          class="text-5xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent hover:from-blue-600 hover:to-blue-800 transition-colors duration-300">
          UNISS
        </NuxtLink>
      </div>

      <div class="flex items-center gap-8">
       

        <!-- Menú desplegable -->
        <div class="relative group" v-if="loggedIn"> 
          <button
            class="flex items-center gap-1 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300">
            Acceder a los datos
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Contenido del menú -->
          <div 
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-1">
            <div class="py-1" >
              <NuxtLink to="/beca" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                Becas
              </NuxtLink>
              <NuxtLink to="/piso" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                Pisos
              </NuxtLink>
              <NuxtLink to="/torre" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                Torres
              </NuxtLink>
              <NuxtLink to="/cuarto" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                Cuartos
              </NuxtLink>
              <NuxtLink to="/estudiante" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                Estudiantes
              </NuxtLink>
              
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loggedIn">
        <NuxtLink to="/login" class="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300">
          Iniciar Sesión
        </NuxtLink>
      </div>
      <div v-if="loggedIn">
        <button @click="handleSignOut">Cerrar Sesión</button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
  const { signOut, status, token } = useAuth();

  const loggedIn = computed(() => status.value === "authenticated");

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" , redirect: true});
  };
</script>

<style>
  /* Tus estilos aquí */
</style>
