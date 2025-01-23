<template>
    <div class="min-h-screen relative">
        <!-- Imagen de fondo fija -->
        <div class="fixed inset-0 z-0">
            <img src="/images/R.jpeg" alt="Background" class="w-full h-full object-cover" />
        </div>

        <!-- Contenido que se desplaza sobre la imagen -->
        <div class="relative z-10 p-8 mt-16">
            <!-- Sección de Información General -->
            <div
                class="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-8 mb-8 transition-all duration-300 hover:shadow-blue-100">
                <h2 class="text-4xl font-bold text-blue-800 mb-6 border-b-2 border-blue-200 pb-2">Información General
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Tarjeta de Estadísticas -->
                    <div
                        class="bg-gradient-to-br from-white to-blue-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 class="text-2xl font-semibold mb-4 text-blue-700">Estadísticas</h3>
                        <div class="space-y-3 text-gray-600">
                            <p class="flex items-center"><span class="w-32">Total Becas:</span> <span
                                    class="font-semibold">%</span></p>
                            <p class="flex items-center"><span class="w-32">Estudiantes:</span> <span
                                    class="font-semibold">%</span></p>
                            <p class="flex items-center"><span class="w-32">Ocupación:</span> <span
                                    class="font-semibold">%</span></p>
                        </div>
                    </div>

                    <!-- Tarjeta de Noticias -->
                    <div
                        class="bg-gradient-to-br from-white to-blue-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 class="text-2xl font-semibold mb-4 text-blue-700">Últimas Noticias</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-center gap-2">
                                <span class="text-blue-500">•</span>
                                Nueva convocatoria de becas
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-blue-500">•</span>
                                Mantenimiento programado
                            </li>
                        </ul>
                    </div>

                    <!-- Tarjeta de Eventos -->
                    <div
                        class="bg-gradient-to-br from-white to-blue-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 class="text-2xl font-semibold mb-4 text-blue-700">Próximos Eventos</h3>
                        <ul class="space-y-3 text-gray-600">
                            <li class="flex items-center gap-2">
                                <span class="text-blue-500">•</span>
                                Reunión de becarios
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-blue-500">•</span>
                                Inspección mensual
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Sección de Recursos -->
            <div
                class="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-8 transition-all duration-300 hover:shadow-blue-100">
                <h2 class="text-4xl font-bold text-blue-800 mb-6 border-b-2 border-blue-200 pb-2">Recursos Disponibles
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Área de Documentos -->
                    <div
                        class="bg-gradient-to-br from-white to-blue-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 class="text-2xl font-semibold mb-4 text-blue-700">Documentos Importantes</h3>
                        <ul class="space-y-3">
                            <li class="flex items-center gap-2 text-gray-600">
                                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Reglamento de Becas
                            </li>
                            <li class="flex items-center gap-2 text-gray-600">
                                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Normativa Interna
                            </li>
                        </ul>
                    </div>

                    <!-- Área de Enlaces -->
                    <div
                        class="bg-gradient-to-br from-white to-blue-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 class="text-2xl font-semibold mb-4 text-blue-700">Enlaces Útiles</h3>
                        <ul class="space-y-3">
                            <li class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <a href="#" class="hover:underline">Portal Estudiantil</a>
                            </li>
                            <li class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <a href="#" class="hover:underline">Servicios Académicos</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>


// Configuración de SEO
useSeoMeta({
    title: 'Explora los recursos y oportunidades en UNISS',
    ogTitle: 'Explora los recursos y oportunidades en UNISS',
    description: 'Descubre los recursos disponibles y las oportunidades en las residencias universitarias de UNISS.',
    ogDescription: 'Descubre los recursos disponibles y las oportunidades en las residencias universitarias de UNISS.',
    ogImage: '/images/logo.jpeg',
    keywords: 'explorar recursos, oportunidades UNISS, residencias universitarias, gestión de becas'
});

// Configuración de la página
definePageMeta({
    auth: false
});
// Lógica del componente aquí
</script>