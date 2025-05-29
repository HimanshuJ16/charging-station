<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Charging Stations Dashboard</h1>
        <p class="text-gray-600">Manage and monitor your EV charging infrastructure</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card hover:shadow-lg transition-shadow">
          <div class="card-body">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-blue-100">
                <BoltIcon class="h-6 w-6 text-blue-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Stations</p>
                <p class="text-2xl font-bold text-gray-900">{{ stations.length }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card hover:shadow-lg transition-shadow">
          <div class="card-body">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-green-100">
                <CheckCircleIcon class="h-6 w-6 text-green-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Active Stations</p>
                <p class="text-2xl font-bold text-gray-900">{{ activeStations }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card hover:shadow-lg transition-shadow">
          <div class="card-body">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-red-100">
                <XCircleIcon class="h-6 w-6 text-red-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Inactive Stations</p>
                <p class="text-2xl font-bold text-gray-900">{{ inactiveStations }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card hover:shadow-lg transition-shadow">
          <div class="card-body">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-yellow-100">
                <LightningBoltIcon class="h-6 w-6 text-yellow-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Power</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalPower }}kW</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Actions -->
      <div class="card mb-8">
        <div class="card-body">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <!-- Filters -->
            <div class="flex flex-wrap gap-4">
              <div class="min-w-0 flex-1 lg:flex-none lg:w-40">
                <select v-model="filters.status" class="form-select">
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div class="min-w-0 flex-1 lg:flex-none lg:w-48">
                <select v-model="filters.connectorType" class="form-select">
                  <option value="">All Connectors</option>
                  <option v-for="type in connectorTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
              
              <div class="min-w-0 flex-1 lg:flex-none lg:w-32">
                <input
                  v-model.number="filters.minPower"
                  type="number"
                  min="0"
                  class="form-input"
                  placeholder="Min kW"
                />
              </div>
              
              <div class="min-w-0 flex-1 lg:flex-none lg:w-32">
                <input
                  v-model.number="filters.maxPower"
                  type="number"
                  min="0"
                  class="form-input"
                  placeholder="Max kW"
                />
              </div>
              
              <button @click="applyFilters" class="btn btn-outline">
                <FunnelIcon class="h-4 w-4 mr-2" />
                Apply
              </button>
              
              <button @click="resetFilters" class="btn btn-outline">
                <XMarkIcon class="h-4 w-4 mr-2" />
                Reset
              </button>
            </div>

            <!-- Actions -->
            <button @click="showAddModal = true" class="btn btn-primary">
              <PlusIcon class="h-4 w-4 mr-2" />
              Add Station
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading stations...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="card bg-red-50 border-red-200">
        <div class="card-body text-center">
          <ExclamationTriangleIcon class="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-900 mb-2">Error Loading Stations</h3>
          <p class="text-red-700">{{ error }}</p>
          <button @click="fetchStations" class="btn btn-primary mt-4">
            <ArrowPathIcon class="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="stations.length === 0" class="card">
        <div class="card-body text-center py-12">
          <BoltIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No charging stations found</h3>
          <p class="text-gray-600 mb-6">Get started by adding your first charging station.</p>
          <button @click="showAddModal = true" class="btn btn-primary">
            <PlusIcon class="h-4 w-4 mr-2" />
            Add Your First Station
          </button>
        </div>
      </div>

      <!-- Stations Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="station in stations"
          :key="station.id"
          class="card hover:shadow-lg transition-all duration-200 fade-in"
        >
          <div class="card-body">
            <!-- Station Header -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ station.name }}</h3>
                <span :class="['badge', station.status === 'Active' ? 'badge-success' : 'badge-danger']">
                  {{ station.status }}
                </span>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editStation(station)"
                  class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <PencilIcon class="h-4 w-4" />
                </button>
                <button
                  @click="confirmDelete(station)"
                  class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Station Details -->
            <div class="space-y-3">
              <div class="flex items-center text-sm text-gray-600">
                <MapPinIcon class="h-4 w-4 mr-2 text-gray-400" />
                <span>{{ station.latitude }}, {{ station.longitude }}</span>
              </div>
              
              <div class="flex items-center text-sm text-gray-600">
                <BoltIcon class="h-4 w-4 mr-2 text-gray-400" />
                <span>{{ station.powerOutput }} kW</span>
              </div>
              
              <div class="flex items-center text-sm text-gray-600">
                <CpuChipIcon class="h-4 w-4 mr-2 text-gray-400" />
                <span>{{ station.connectorType }}</span>
              </div>
            </div>

            <!-- Station Actions -->
            <div class="mt-6 flex space-x-3">
              <button @click="editStation(station)" class="btn btn-outline flex-1">
                <PencilIcon class="h-4 w-4 mr-2" />
                Edit
              </button>
              <button @click="confirmDelete(station)" class="btn btn-danger flex-1">
                <TrashIcon class="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <StationModal
      v-if="showAddModal || showEditModal"
      :show="showAddModal || showEditModal"
      :station="currentStation"
      :is-editing="showEditModal"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      title="Delete Charging Station"
      :message="`Are you sure you want to delete '${currentStation.name}'? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-class="btn-danger"
      @close="showDeleteModal = false"
      @confirm="deleteStation"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  BoltIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  CpuChipIcon,
  FunnelIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { LightningBoltIcon } from '@heroicons/vue/24/solid'
import StationModal from '../components/StationModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

export default {
  name: 'Dashboard',
  components: {
    BoltIcon,
    CheckCircleIcon,
    XCircleIcon,
    LightningBoltIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MapPinIcon,
    CpuChipIcon,
    FunnelIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    StationModal,
    ConfirmModal,
  },
  data() {
    return {
      filters: {
        status: '',
        connectorType: '',
        minPower: null,
        maxPower: null
      },
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      currentStation: {
        id: null,
        name: '',
        latitude: null,
        longitude: null,
        status: 'Active',
        powerOutput: null,
        connectorType: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      stations: 'stations/allStations',
      connectorTypes: 'stations/allConnectorTypes',
      loading: 'stations/isLoading',
      error: 'stations/error'
    }),
    activeStations() {
      return this.stations.filter(station => station.status === 'Active').length
    },
    inactiveStations() {
      return this.stations.filter(station => station.status === 'Inactive').length
    },
    totalPower() {
      return this.stations.reduce((total, station) => total + (station.powerOutput || 0), 0)
    }
  },
  created() {
    this.fetchStations()
    this.fetchConnectorTypes()
  },
  methods: {
    fetchStations() {
      this.$store.dispatch('stations/fetchStations')
    },
    fetchConnectorTypes() {
      this.$store.dispatch('stations/fetchConnectorTypes')
    },
    applyFilters() {
      this.$store.dispatch('stations/fetchStations', this.filters)
      this.$toast.info('Filters applied')
    },
    resetFilters() {
      this.filters = {
        status: '',
        connectorType: '',
        minPower: null,
        maxPower: null
      }
      this.fetchStations()
      this.$toast.info('Filters reset')
    },
    editStation(station) {
      this.currentStation = { ...station }
      this.showEditModal = true
    },
    confirmDelete(station) {
      this.currentStation = { ...station }
      this.showDeleteModal = true
    },
    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.resetCurrentStation()
    },
    resetCurrentStation() {
      this.currentStation = {
        id: null,
        name: '',
        latitude: null,
        longitude: null,
        status: 'Active',
        powerOutput: null,
        connectorType: ''
      }
    },
    handleSave(stationData) {
      if (this.showEditModal) {
        this.$store.dispatch('stations/updateStation', {
          id: this.currentStation.id,
          data: stationData
        })
          .then(() => {
            this.closeModal()
            this.$toast.success('Station updated successfully!')
          })
          .catch(() => {
            this.$toast.error('Failed to update station')
          })
      } else {
        this.$store.dispatch('stations/createStation', stationData)
          .then(() => {
            this.closeModal()
            this.$toast.success('Station created successfully!')
          })
          .catch(() => {
            this.$toast.error('Failed to create station')
          })
      }
    },
    deleteStation() {
      this.$store.dispatch('stations/deleteStation', this.currentStation.id)
        .then(() => {
          this.showDeleteModal = false
          this.resetCurrentStation()
          this.$toast.success('Station deleted successfully!')
        })
        .catch(() => {
          this.$toast.error('Failed to delete station')
        })
    }
  }
}
</script>
