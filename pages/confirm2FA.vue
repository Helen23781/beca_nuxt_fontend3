<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div class="p-6">
                <h2 class="text-2xl font-bold mb-4 text-gray-800">Two-Factor Authentication</h2>

                <div v-if="is2FAEnabled">
                    <p class="mb-4 text-gray-600">2FA is currently enabled. Please enter your code to verify.</p>
                    <div class="mb-4">
                        <label for="verificationCode" class="block text-sm font-medium text-gray-700 mb-2">Verification
                            Code</label>
                        <input id="verificationCode" v-model="verificationCode" type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter 6-digit code" />
                    </div>
                    <button @click="validateCode" :disabled="cargando"
                        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        {{ cargando ? 'Cargando...' : 'Verify Code' }}
                    </button>
                </div>

                <div v-else>
                    <p class="mb-4 text-gray-600">Scan the QR code below with your authenticator app, then enter the
                        code to
                        enable 2FA.</p>
                    <div class="mb-4 flex justify-center">
                        <img :src="qrCodeUrl" alt="QR Code" class="w-48 h-48" />
                    </div>
                    <div class="mb-4">
                        <label for="secretKey" class="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                        <input id="secretKey" v-model="secretKey" type="text" readonly
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Secret Key" />
                    </div>
                    <div class="mb-4">
                        <label for="setupCode" class="block text-sm font-medium text-gray-700 mb-2">Setup Code</label>
                        <input id="setupCode" v-model="setupCode" type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter 6-digit code" />
                    </div>
                    <button @click="enableTwoFactor" :disabled="cargando"
                        class="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                        {{ cargando ? 'Cargando...' : 'Enable 2FA' }}
                    </button>
                </div>

                <div v-if="message" :class="['mt-4 p-3 rounded-md', messageClass]">
                    <div class="flex items-center">
                        <!-- <CheckCircleIcon v-if="isSuccess" class="h-5 w-5 mr-2" />
                        <XCircleIcon v-else class="h-5 w-5 mr-2" /> -->
                        <span>{{ message }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const { token, data } = useAuth()
const router = useRouter()
const toast = useToast()

const is2FAEnabled = ref(data.value.twoFactorEnabled)
const verificationCode = ref('')
const setupCode = ref('')
const message = ref('')
const isSuccess = ref(false)
const qrCodeUrl = ref('')
const secretKey = ref('')
const cargando = ref(false)

const config = useRuntimeConfig();

// Configuración de SEO
useSeoMeta({
    title: 'Confirmación de 2FA - UNISS',
    ogTitle: 'Confirmación de 2FA - UNISS',
    description: 'Verifica tu identidad con la autenticación de dos factores en la plataforma de UNISS.',
    ogDescription: 'Verifica tu identidad con la autenticación de dos factores en la plataforma de UNISS.',
    ogImage: '/images/logo.jpg', // Puedes agregar la URL de una imagen aquí
    keywords: '2FA, autenticación de dos factores, seguridad, UNISS'
});

const messageClass = computed(() => {
    return isSuccess.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
})

const validateCode = async () => {
    cargando.value = true
    try {
        const response = await $fetch(`${config.public.backend_url}/auth/2fa/validate`, {
            method: 'POST',
            headers: {
                Authorization: token.value
            },
            body: {
                code: verificationCode.value
            }
        });
        isSuccess.value = true
        toast.success('¡Verificación 2FA exitosa!')
        router.push("/")
    } catch (error) {
        isSuccess.value = false
        toast.error('Código de verificación inválido. Inténtalo de nuevo.')
    } finally {
        cargando.value = false
    }
    verificationCode.value = ''
}

const enableTwoFactor = async () => {
    cargando.value = true
    try {
        const response = await $fetch(`${config.public.backend_url}/auth/2fa/verify`, {
            method: 'POST',
            headers: {
                Authorization: token.value
            },
            body: {
                code: setupCode.value
            }
        });
        is2FAEnabled.value = true
        isSuccess.value = true
        toast.success('¡2FA ha sido habilitado exitosamente!')
        router.push("/")
    } catch (error) {
        isSuccess.value = false
        toast.error('Código de configuración inválido. Inténtalo de nuevo.')
    } finally {
        cargando.value = false
    }
    setupCode.value = ''
}

onMounted(async () => {
    if (!is2FAEnabled.value) {
        console.log("lalalallalalalalalalalalalall")
        try {
            const response = await $fetch(`${config.public.backend_url}/auth/2fa/generate`, {
                method: 'POST',
                headers: {
                    Authorization: token.value
                }
            });
            qrCodeUrl.value = response.qrCode;
            secretKey.value = response.secret;
        } catch (error) {
            toast.error('Error al cargar el código QR. Inténtalo de nuevo.');
        }
    }
});

definePageMeta({
    layout: 'login'
});
</script>