<template>
    <div class="min-h-screen relative">
        <!-- Imagen de fondo fija solo para la página de inicio -->
        <div class="fixed inset-0 z-0">
            <img src="/images/R.jpeg" alt="Background" class="w-full h-full object-cover" />
        </div>

        <!-- Contenido centrado sobre la imagen -->
        <div class="relative z-10 flex flex-col items-center justify-center min-h-screen bg-black/30">
            <h1 class="text-6xl font-bold text-white mb-8 shadow-lg text-center">Bienvenido a UNISS</h1>
            <div class="space-x-4">
                <NuxtLink to="/explorar"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg">
                    Explorar
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>


// Configuración de SEO
useSeoMeta({
    title: 'Bienvenido a UNISS - Explora y Gestiona',
    ogTitle: 'Bienvenido a UNISS - Explora y Gestiona',
    description: 'Explora las oportunidades y gestiona tus residencias universitarias con UNISS.',
    ogDescription: 'Explora las oportunidades y gestiona tus residencias universitarias con UNISS.',
    ogImage: '/images/logo.jpg',
    keywords: 'UNISS, gestión de residencias, explorar oportunidades, universidad'
});

// Configuración de la página
definePageMeta({
    auth: false
});
</script>
