<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">{{ title }}</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <ExclamationTriangleIcon class="h-10 w-10 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-gray-700">{{ message }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3">
          <button
            @click="$emit('close')"
            class="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            :class="['btn', 'flex-1', confirmClass]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'ConfirmModal',
  components: {
    XMarkIcon,
    ExclamationTriangleIcon,
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirm Action'
    },
    message: {
      type: String,
      default: 'Are you sure you want to proceed?'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    confirmClass: {
      type: String,
      default: 'btn-primary'
    }
  },
  emits: ['close', 'confirm']
}
</script>
