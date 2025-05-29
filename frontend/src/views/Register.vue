<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mb-4">
          <BoltIcon class="h-8 w-8 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Create account</h2>
        <p class="mt-2 text-sm text-gray-600">Join ChargeMaster today</p>
      </div>

      <!-- Register Form -->
      <div class="card fade-in">
        <div class="card-body">
          <form @submit.prevent="handleRegister" class="space-y-6">
            <!-- Alert -->
            <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-error'">
              <div class="flex items-center">
                <ExclamationTriangleIcon v-if="!successful" class="h-5 w-5 mr-2" />
                <CheckCircleIcon v-else class="h-5 w-5 mr-2" />
                {{ message }}
              </div>
            </div>

            <!-- Username Field -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div class="relative">
                <UserIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="username"
                  v-model="user.username"
                  type="text"
                  required
                  class="form-input pl-10"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div class="relative">
                <EnvelopeIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  v-model="user.email"
                  type="email"
                  required
                  class="form-input pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div class="relative">
                <LockClosedIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  v-model="user.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="form-input pl-10 pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                  <EyeSlashIcon v-else class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="btn btn-primary w-full"
            >
              <div v-if="loading" class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating account...
              </div>
              <span v-else>Create account</span>
            </button>

            <!-- Login Link -->
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Already have an account?
                <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Sign in here
                </router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BoltIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'Register',
  components: {
    BoltIcon,
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
  },
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: ''
      },
      loading: false,
      message: '',
      successful: false,
      showPassword: false
    }
  },
  methods: {
    handleRegister() {
      this.message = ''
      this.successful = false
      this.loading = true
      
      this.$store.dispatch('auth/register', this.user)
        .then(response => {
          this.message = response.message || 'Registration successful! Please login.'
          this.successful = true
          this.loading = false
          
          if (this.$toast) {
            this.$toast.success('Account created successfully!')
          }
          
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        })
        .catch(error => {
          this.message = (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    'Registration failed. Please try again.'
          this.successful = false
          this.loading = false
          
          if (this.$toast) {
            this.$toast.error(this.message)
          }
        })
    }
  }
}
</script>

<style scoped>
.alert {
  @apply p-4 rounded-lg border;
}

.alert-success {
  @apply bg-green-50 border-green-200 text-green-800;
}

.alert-error {
  @apply bg-red-50 border-red-200 text-red-800;
}
</style>
