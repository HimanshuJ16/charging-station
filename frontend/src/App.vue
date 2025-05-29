<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Navigation -->
    <nav v-if="isLoggedIn" class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                <BoltIcon class="w-5 h-5 text-white" />
              </div>
              <h1 class="text-xl font-bold text-gray-900">ChargeMaster</h1>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link
              to="/dashboard"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/dashboard' }"
            >
              <HomeIcon class="w-5 h-5 mr-2" />
              Dashboard
            </router-link>
            <router-link
              to="/map"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/map' }"
            >
              <MapIcon class="w-5 h-5 mr-2" />
              Map View
            </router-link>
            
            <!-- User Menu -->
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <UserCircleIcon class="w-6 h-6" />
                <span>{{ currentUser?.username }}</span>
                <ChevronDownIcon class="w-4 h-4" />
              </button>
              
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                @click="showUserMenu = false"
              >
                <a
                  href="#"
                  @click.prevent="logout"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <ArrowRightOnRectangleIcon class="w-4 h-4 inline mr-2" />
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Loading Overlay -->
    <div v-if="globalLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span class="text-gray-700">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BoltIcon,
  HomeIcon,
  MapIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'

export default {
  name: 'App',
  components: {
    BoltIcon,
    HomeIcon,
    MapIcon,
    UserCircleIcon,
    ChevronDownIcon,
    ArrowRightOnRectangleIcon,
  },
  data() {
    return {
      showUserMenu: false,
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.status.loggedIn
    },
    currentUser() {
      return this.$store.state.auth.user
    },
    globalLoading() {
      return this.$store.state.stations.loading
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
      this.$toast.success('Logged out successfully')
    },
  },
  mounted() {
    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.relative')) {
        this.showUserMenu = false
      }
    })
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #374151;
  background-color: #f8fafc;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}
</style>
