<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mb-4">
          <BoltIcon class="h-8 w-8 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Welcome back</h2>
        <p class="mt-2 text-sm text-gray-600">Sign in to your ChargeMaster account</p>
      </div>

      <!-- Login Form -->
      <div class="card fade-in">
        <div class="card-body">
          <form @submit.prevent="handleLogin" class="space-y-6">
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
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
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
                Signing in...
              </div>
              <span v-else>Sign in</span>
            </button>

            <!-- Register Link -->
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Don't have an account?
                <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Create one here
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
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'Login',
  components: {
    BoltIcon,
    UserIcon,
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
        password: ''
      },
      loading: false,
      message: '',
      successful: false,
      showPassword: false
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/dashboard')
    }
  },
  methods: {
    handleLogin() {
      this.loading = true
      this.message = ''
      
      this.$store.dispatch('auth/login', this.user)
        .then(() => {
          if (this.$toast) {
            this.$toast.success('Welcome back!')
          }
          this.$router.push('/dashboard')
        })
        .catch(error => {
          this.loading = false
          this.message = (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    'Login failed. Please try again.'
      
          // Show toast notification if available
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
