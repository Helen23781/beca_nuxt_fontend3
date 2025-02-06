<template>
    <NuxtImg :src="foto" alt="Foto del estudiante" class="w-10 h-10 rounded-full object-cover cursor-pointer"
        @error="handleImageError" />


</template>

<script setup>
const config = useRuntimeConfig()

const { fotoUrl } = defineProps({ fotoUrl: String })


// Función para obtener la URL de la foto
const foto = ref("/images/avatar.jpg")
const handleImageError = () => {
    console.log(foto.value)

    // foto.value = '/images/avatar.jpg';

};

onMounted(() => {
    console.log(fotoUrl)
    if (fotoUrl && fotoUrl.includes('supabase.co')) {
        // Si la URL ya es de Supabase, la usamos directamente
        foto.value = fotoUrl;
    } else {

        foto.value = fotoUrl ? `${config.public.backend_url}/estudiantes/foto/${fotoUrl}` : '/images/avatar.jpg';
    }
})



</script>