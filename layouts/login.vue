<template>

    <main>
        <slot />
    </main>
</template>

<script setup>
import { useSeoMeta } from 'nuxt/app'; // Asegúrate de importar useSeoMeta

// Configuración de SEO
useSeoMeta({
    title: 'Iniciar sesión - Plataforma de gestión',
    ogTitle: 'Iniciar sesión - Plataforma de gestión',
    description: 'Accede a la plataforma de gestión de residencias universitarias.',
    ogDescription: 'Accede a la plataforma de gestión de residencias universitarias.',
    ogImage: '', // Puedes agregar la URL de una imagen aquí
    keywords: 'iniciar sesión, plataforma de gestión, residencias universitarias'
});
</script>