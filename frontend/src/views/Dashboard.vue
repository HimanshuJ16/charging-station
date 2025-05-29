<template>
  <div class="container">
    <h1>Charging Stations Dashboard</h1>
    
    <div class="filters-container">
      <div class="filter-group">
        <label for="status">Status:</label>
        <select id="status" v-model="filters.status" class="form-control">
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="connector-type">Connector Type:</label>
        <select id="connector-type" v-model="filters.connectorType" class="form-control">
          <option value="">All</option>
          <option v-for="type in connectorTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="min-power">Min Power (kW):</label>
        <input
          id="min-power"
          v-model.number="filters.minPower"
          type="number"
          min="0"
          class="form-control"
          placeholder="Min"
        />
      </div>
      
      <div class="filter-group">
        <label for="max-power">Max Power (kW):</label>
        <input
          id="max-power"
          v-model.number="filters.maxPower"
          type="number"
          min="0"
          class="form-control"
          placeholder="Max"
        />
      </div>
      
      <button @click="applyFilters" class="btn">Apply Filters</button>
      <button @click="resetFilters" class="btn btn-secondary">Reset</button>
    </div>
    
    <div class="actions-container">
      <button @click="showAddModal = true" class="btn">Add New Station</button>
    </div>
    
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    
    <div v-else-if="stations.length === 0" class="no-data">
      No charging stations found. Add a new one to get started.
    </div>
    
    <div v-else class="stations-grid">
      <div v-for="station in stations" :key="station.id" class="station-card">
        <div class="station-header">
          <h3>{{ station.name }}</h3>
          <span :class="['status-badge', station.status === 'Active' ? 'active' : 'inactive']">
            {{ station.status }}
          </span>
        </div>
        
        <div class="station-details">
          <p><strong>Location:</strong> {{ station.latitude }}, {{ station.longitude }}</p>
          <p><strong>Power Output:</strong> {{ station.powerOutput }} kW</p>
          <p><strong>Connector Type:</strong> {{ station.connectorType }}</p>
        </div>
        
        <div class="station-actions">
          <button @click="editStation(station)" class="btn btn-sm">Edit</button>
          <button @click="confirmDelete(station)" class="btn btn-sm btn-danger">Delete</button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Edit' : 'Add' }} Charging Station</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="showEditModal ? updateStation() : addStation()">
            <div class="form-group">
              <label for="name">Name:</label>
              <input
                id="name"
                v-model="currentStation.name"
                type="text"
                class="form-control"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="latitude">Latitude:</label>
              <input
                id="latitude"
                v-model.number="currentStation.latitude"
                type="number"
                step="0.000001"
                class="form-control"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="longitude">Longitude:</label>
              <input
                id="longitude"
                v-model.number="currentStation.longitude"
                type="number"
                step="0.000001"
                class="form-control"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="status">Status:</label>
              <select id="status" v-model="currentStation.status" class="form-control" required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="power-output">Power Output (kW):</label>
              <input
                id="power-output"
                v-model.number="currentStation.powerOutput"
                type="number"
                min="0"
                step="0.1"
                class="form-control"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="connector-type">Connector Type:</label>
              <input
                id="connector-type"
                v-model="currentStation.connectorType"
                type="text"
                class="form-control"
                required
              />
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn">{{ showEditModal ? 'Update' : 'Add' }}</button>
              <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Confirm Delete</h2>
          <button @click="showDeleteModal = false" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <p>Are you sure you want to delete the charging station "{{ currentStation.name }}"?</p>
          <div class="form-actions">
            <button @click="deleteStation" class="btn btn-danger">Delete</button>
            <button @click="showDeleteModal = false" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Dashboard',
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
    };
  },
  computed: {
    ...mapGetters({
      stations: 'stations/allStations',
      connectorTypes: 'stations/allConnectorTypes',
      loading: 'stations/isLoading',
      error: 'stations/error'
    })
  },
  created() {
    this.fetchStations();
    this.fetchConnectorTypes();
  },
  methods: {
    fetchStations() {
      this.$store.dispatch('stations/fetchStations');
    },
    fetchConnectorTypes() {
      this.$store.dispatch('stations/fetchConnectorTypes');
    },
    applyFilters() {
      this.$store.dispatch('stations/fetchStations', this.filters);
    },
    resetFilters() {
      this.filters = {
        status: '',
        connectorType: '',
        minPower: null,
        maxPower: null
      };
      this.fetchStations();
    },
    editStation(station) {
      this.currentStation = { ...station };
      this.showEditModal = true;
    },
    confirmDelete(station) {
      this.currentStation = { ...station };
      this.showDeleteModal = true;
    },
    closeModal() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.resetCurrentStation();
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
      };
    },
    addStation() {
      this.$store.dispatch('stations/createStation', this.currentStation)
        .then(() => {
          this.closeModal();
        })
        .catch(error => {
          console.error('Error adding station:', error);
        });
    },
    updateStation() {
      this.$store.dispatch('stations/updateStation', {
        id: this.currentStation.id,
        data: this.currentStation
      })
        .then(() => {
          this.showEditModal = false;
          this.resetCurrentStation();
        })
        .catch(error => {
          console.error('Error updating station:', error);
        });
    },
    deleteStation() {
      this.$store.dispatch('stations/deleteStation', this.currentStation.id)
        .then(() => {
          this.showDeleteModal = false;
          this.resetCurrentStation();
        })
        .catch(error => {
          console.error('Error deleting station:', error);
        });
    }
  }
};
</script>

<style scoped>
h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filter-group {
  flex: 1;
  min-width: 150px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.actions-container {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.stations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.station-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.station-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.station-header h3 {
  margin: 0;
  color: #2c3e50;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.station-details {
  margin-bottom: 1rem;
}

.station-details p {
  margin: 0.5rem 0;
}

.station-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.25rem;
  color: #6c757d;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #ddd;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
