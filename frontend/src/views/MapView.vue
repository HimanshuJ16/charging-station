<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Charging Stations Map</h1>
        <p class="text-gray-600">Interactive map view of all charging stations</p>
      </div>

      <!-- Map Container -->
      <div class="relative">
        <!-- Loading State -->
        <div v-if="loading" class="card">
          <div class="card-body text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading map...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="card bg-red-50 border-red-200">
          <div class="card-body text-center">
            <ExclamationTriangleIcon class="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-red-900 mb-2">Error Loading Map</h3>
            <p class="text-red-700">{{ error }}</p>
            <button @click="fetchStations" class="btn btn-primary mt-4">
              <ArrowPathIcon class="h-4 w-4 mr-2" />
              Retry
            </button>
          </div>
        </div>

        <!-- Map -->
        <div v-else class="relative">
          <div id="map" class="w-full h-[70vh] rounded-xl shadow-lg border border-gray-200"></div>
          
          <!-- Map Controls -->
          <!-- <div class="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 space-y-2 z-50">
            <button
              @click="fitBounds"
              class="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Fit all stations"
            >
              <ViewfinderCircleIcon class="h-5 w-5" />
            </button>
            <button
              @click="refreshMap"
              class="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Refresh map"
            >
              <ArrowPathIcon class="h-5 w-5" />
            </button>
          </div> -->

          <!-- Legend -->
          <!-- <div class="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Legend</h3>
            <div class="space-y-2">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600">Active Station</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span class="text-xs text-gray-600">Inactive Station</span>
              </div>
            </div>
          </div> -->
        </div>
      </div>

      <!-- Station Details Panel -->
      <div
        v-if="selectedStation"
        class="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-[60] fade-in"
      >
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ selectedStation.name }}</h3>
          <button
            @click="selectedStation = null"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
        
        <div class="p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Status</span>
            <span :class="['badge', selectedStation.status === 'Active' ? 'badge-success' : 'badge-danger']">
              {{ selectedStation.status }}
            </span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Location</span>
            <span class="text-sm text-gray-900">
              {{ selectedStation.latitude.toFixed(4) }}, {{ selectedStation.longitude.toFixed(4) }}
            </span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Power Output</span>
            <span class="text-sm text-gray-900">{{ selectedStation.powerOutput }} kW</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Connector Type</span>
            <span class="text-sm text-gray-900">{{ selectedStation.connectorType }}</span>
          </div>

          <div class="pt-3 border-t border-gray-200">
            <button
              @click="getDirections"
              class="btn btn-primary w-full"
            >
              <MapPinIcon class="h-4 w-4 mr-2" />
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ViewfinderCircleIcon,
  XMarkIcon,
  MapPinIcon,
} from '@heroicons/vue/24/outline';

export default {
  name: 'MapView',
  components: {
    ExclamationTriangleIcon,
    ArrowPathIcon,
    ViewfinderCircleIcon,
    XMarkIcon,
    MapPinIcon,
  },
  data() {
    return {
      map: null,
      markers: [],
      selectedStation: null,
      mapInitialized: false
    };
  },
  computed: {
    ...mapGetters({
      stations: 'stations/allStations',
      loading: 'stations/isLoading',
      error: 'stations/error'
    })
  },
  mounted() {
    this.fetchStations();
  },
  methods: {
    fetchStations() {
      this.$store.dispatch('stations/fetchStations')
        .then(() => {
          if (!this.mapInitialized) {
            this.$nextTick(() => {
              this.initMap();
            });
          } else {
            this.updateMarkers();
          }
        });
    },
    initMap() {
      if (this.mapInitialized) return;

      // Fix for Leaflet icon issue
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
      });

      // Initialize map
      this.map = L.map('map').setView([40.7128, -74.0060], 10);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(this.map);
      
      this.mapInitialized = true;
      this.updateMarkers();
    },
    updateMarkers() {
      if (!this.map) return;

      // Clear existing markers
      this.markers.forEach(marker => this.map.removeLayer(marker));
      this.markers = [];
      
      // Add new markers
      this.stations.forEach(station => {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div class="w-6 h-6 rounded-full border-2 border-white shadow-lg ${
            station.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
          } flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([station.latitude, station.longitude], { icon })
          .addTo(this.map)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-gray-900">${station.name}</h3>
              <p class="text-sm text-gray-600">Status: <span class="${station.status === 'Active' ? 'text-green-600' : 'text-red-600'}">${station.status}</span></p>
              <p class="text-sm text-gray-600">Power: ${station.powerOutput} kW</p>
              <p class="text-sm text-gray-600">Type: ${station.connectorType}</p>
            </div>
          `);
        
        marker.on('click', () => {
          this.selectedStation = station;
        });
        
        this.markers.push(marker);
      });
      
      // Fit bounds to markers
      this.fitBounds();
    },
    fitBounds() {
      if (this.stations.length > 0 && this.map) {
        const bounds = L.latLngBounds(this.stations.map(station => [station.latitude, station.longitude]));
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    },
    refreshMap() {
      this.fetchStations()
      if (this.$toast) {
        this.$toast.info('Map refreshed')
      }
    },
    getDirections() {
      if (this.selectedStation) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${this.selectedStation.latitude},${this.selectedStation.longitude}`;
        window.open(url, '_blank');
      }
    }
  },
  watch: {
    stations() {
      if (this.mapInitialized) {
        this.updateMarkers();
      }
    }
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  }
};
</script>

<style>
.custom-marker {
  background: transparent !important;
  border: none !important;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.leaflet-popup-tip {
  background: white;
}

/* Fix z-index for Leaflet map container */
#map {
  z-index: 1;
}

/* Ensure Leaflet controls are above the map */
.leaflet-control-container {
  z-index: 1000 !important;
}

.leaflet-control {
  z-index: 1000 !important;
}

/* Ensure our custom controls are above the map */
.leaflet-top,
.leaflet-bottom {
  z-index: 1000 !important;
}

/* Fix for Leaflet attribution and zoom controls */
.leaflet-control-attribution,
.leaflet-control-zoom {
  z-index: 1000 !important;
}
</style>
