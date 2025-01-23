<template>
  <header class="w-full bg-white shadow-md fixed top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <NuxtLink to="/"
          class="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent hover:from-blue-600 hover:to-blue-800 transition-colors duration-300">
          UNISS
        </NuxtLink>
      </div>

      <!-- Botón de menú para vista móvil -->
      <div class="sm:hidden flex items-center" v-if="loggedIn">
        <button @click="toggleMenu" class="text-gray-700 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      <!-- Botón de iniciar sesión para vista móvil -->
      <div class="sm:hidden" v-if="!loggedIn">
        <NuxtLink to="/login" class="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300">
          Iniciar Sesión
        </NuxtLink>
      </div>

      <!-- Menú de acciones para vista de escritorio -->
      <div class="hidden sm:flex items-center gap-4 sm:gap-6 lg:gap-8">
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
            <div class="py-1">
              <NuxtLink to="/beca" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                Becas
              </NuxtLink>
              <NuxtLink to="/piso" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                Pisos
              </NuxtLink>
              <NuxtLink to="/torre" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                Torres
              </NuxtLink>
              <NuxtLink to="/cuarto"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                Cuartos
              </NuxtLink>
              <NuxtLink to="/estudiante"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                Estudiantes
              </NuxtLink>
              <NuxtLink to="/usuarios" v-if="userRole === 'administrador'"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                Usuarios
              </NuxtLink>

            </div>
          </div>
        </div>
        <!-- Botón de perfil -->
        <div v-if="loggedIn">
          <button @click="mostrarPerfil"
            class="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300">
            Perfil
          </button>
        </div>
      </div>

      <div v-if="!loggedIn" class="hidden sm:block">
        <NuxtLink to="/login" class="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300">
          Iniciar Sesión
        </NuxtLink>
      </div>
      <div v-if="loggedIn" class="hidden sm:block">
        <button @click="handleSignOut"
          class="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300">
          Cerrar Sesión
        </button>
      </div>
    </nav>

    <!-- Menú desplegable para vista móvil -->
    <div v-if="isMenuOpen && loggedIn" class="sm:hidden bg-white shadow-md">
      <div class="px-4 pt-2 pb-3 space-y-1">
        <NuxtLink to="/beca" @click="closeMenu"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
          Becas
        </NuxtLink>
        <NuxtLink to="/piso" @click="closeMenu"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
          Pisos
        </NuxtLink>
        <NuxtLink to="/torre" @click="closeMenu"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
          Torres
        </NuxtLink>
        <NuxtLink to="/cuarto" @click="closeMenu"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
          Cuartos
        </NuxtLink>
        <NuxtLink to="/estudiante" @click="closeMenu"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
          Estudiantes
        </NuxtLink>
        <NuxtLink to="/usuarios" @click="closeMenu"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
          Usuarios
        </NuxtLink>
        <div v-if="loggedIn">
          <button @click="handleSignOut"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
            Cerrar Sesión
          </button>
        </div>
        <NuxtLink to="#" @click="mostrarPerfil"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
          Perfil
        </NuxtLink>
      </div>
    </div>

    <Modal :visible="showProfileModal" @close="cerrarPerfil">
      <PerfilUsuario />
    </Modal>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { signOut, status, data } = useAuth()

const loggedIn = computed(() => status.value === "authenticated")
const isMenuOpen = ref(false)

// Suponiendo que el rol del usuario está disponible en el objeto `user`
const userRole = computed(() => data.value?.role)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleSignOut = async () => {
  await signOut({ callbackUrl: "/", redirect: true })
}

const showProfileModal = ref(false);

const mostrarPerfil = () => {
  showProfileModal.value = true;
};

const cerrarPerfil = () => {
  showProfileModal.value = false;
};

</script>

<style>
/* Tus estilos aquí */
</style>
