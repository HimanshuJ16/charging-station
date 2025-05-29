<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ isEditing ? 'Edit' : 'Add' }} Charging Station
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Station Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Station Name *
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="form-input"
            placeholder="Enter station name"
          />
        </div>

        <!-- Location -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="latitude" class="block text-sm font-medium text-gray-700 mb-2">
              Latitude *
            </label>
            <input
              id="latitude"
              v-model.number="formData.latitude"
              type="number"
              step="0.000001"
              required
              class="form-input"
              placeholder="40.7128"
            />
          </div>
          <div>
            <label for="longitude" class="block text-sm font-medium text-gray-700 mb-2">
              Longitude *
            </label>
            <input
              id="longitude"
              v-model.number="formData.longitude"
              type="number"
              step="0.000001"
              required
              class="form-input"
              placeholder="-74.0060"
            />
          </div>
        </div>

        <!-- Status -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select id="status" v-model="formData.status" class="form-select" required>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <!-- Power Output -->
        <div>
          <label for="powerOutput" class="block text-sm font-medium text-gray-700 mb-2">
            Power Output (kW) *
          </label>
          <input
            id="powerOutput"
            v-model.number="formData.powerOutput"
            type="number"
            min="0"
            step="0.1"
            required
            class="form-input"
            placeholder="50.0"
          />
        </div>

        <!-- Connector Type -->
        <div>
          <label for="connectorType" class="block text-sm font-medium text-gray-700 mb-2">
            Connector Type *
          </label>
          <input
            id="connectorType"
            v-model="formData.connectorType"
            type="text"
            required
            class="form-input"
            placeholder="e.g., CCS, CHAdeMO, Type 2"
          />
        </div>

        <!-- Actions -->
        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary flex-1"
          >
            {{ isEditing ? 'Update' : 'Create' }} Station
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'StationModal',
  components: {
    XMarkIcon,
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    station: {
      type: Object,
      default: () => ({})
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      formData: {
        name: '',
        latitude: null,
        longitude: null,
        status: 'Active',
        powerOutput: null,
        connectorType: ''
      }
    }
  },
  watch: {
    station: {
      handler(newStation) {
        if (newStation && Object.keys(newStation).length > 0) {
          this.formData = { ...newStation }
        } else {
          this.resetForm()
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('save', { ...this.formData })
    },
    resetForm() {
      this.formData = {
        name: '',
        latitude: null,
        longitude: null,
        status: 'Active',
        powerOutput: null,
        connectorType: ''
      }
    }
  }
}
</script>
