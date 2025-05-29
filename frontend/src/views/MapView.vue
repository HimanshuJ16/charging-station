<template>
  <div class="container">
    <h1>Charging Stations Map</h1>
    
    <div v-if="loading" class="loading">Loading map...</div>
    
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    
    <div id="map" class="map-container"></div>
    
    <div v-if="selectedStation" class="station-details-panel">
      <div class="panel-header">
        <h3>{{ selectedStation.name }}</h3>
        <button @click="selectedStation = null" class="close-btn">&times;</button>
      </div>
      
      <div class="panel-body">
        <p><strong>Status:</strong> <span :class="selectedStation.status === 'Active' ? 'text-success' : 'text-danger'">{{ selectedStation.status }}</span></p>
        <p><strong>Location:</strong> {{ selectedStation.latitude }}, {{ selectedStation.longitude }}</p>
        <p><strong>Power Output:</strong> {{ selectedStation.powerOutput }} kW</p>
        <p><strong>Connector Type:</strong> {{ selectedStation.connectorType }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default {
  name: 'MapView',
  data() {
    return {
      map: null,
      markers: [],
      selectedStation: null
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
          this.initMap();
        });
    },
    initMap() {
      // Fix for Leaflet icon issue
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
      });

      // Initialize map
      this.map = L.map('map').setView([0, 0], 2);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      
      // Add markers for stations
      this.addMarkers();
      
      // Fit bounds to markers
      if (this.stations.length > 0) {
        const bounds = L.latLngBounds(this.stations.map(station => [station.latitude, station.longitude]));
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    },
    addMarkers() {
      // Clear existing markers
      this.markers.forEach(marker => this.map.removeLayer(marker));
      this.markers = [];
      
      // Add new markers
      this.stations.forEach(station => {
        const marker = L.marker([station.latitude, station.longitude])
          .addTo(this.map)
          .bindPopup(`<b>${station.name}</b><br>Status: ${station.status}`);
        
        marker.on('click', () => {
          this.selectedStation = station;
        });
        
        this.markers.push(marker);
      });
    }
  },
  watch: {
    stations() {
      if (this.map) {
        this.addMarkers();
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

<style scoped>
.map-container {
  height: 70vh;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.station-details-panel {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.panel-header h3 {
  margin: 0;
  color: #2c3e50;
}

.panel-body {
  padding: 1rem;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.25rem;
  color: #6c757d;
}
</style>
