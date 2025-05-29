import StationService from "../services/station.service"

export const stations = {
  namespaced: true,
  state: {
    stations: [],
    connectorTypes: [],
    loading: false,
    error: null,
  },
  actions: {
    fetchStations({ commit }, filters = {}) {
      commit("setLoading", true)
      return StationService.getAll(filters).then(
        (response) => {
          commit("setStations", response.data)
          commit("setLoading", false)
          return Promise.resolve(response.data)
        },
        (error) => {
          commit("setError", error.message)
          commit("setLoading", false)
          return Promise.reject(error)
        },
      )
    },
    fetchConnectorTypes({ commit }) {
      return StationService.getConnectorTypes().then(
        (response) => {
          commit("setConnectorTypes", response.data)
          return Promise.resolve(response.data)
        },
        (error) => {
          commit("setError", error.message)
          return Promise.reject(error)
        },
      )
    },
    createStation({ commit, dispatch }, station) {
      return StationService.create(station).then(
        (response) => {
          dispatch("fetchStations")
          return Promise.resolve(response.data)
        },
        (error) => {
          commit("setError", error.message)
          return Promise.reject(error)
        },
      )
    },
    updateStation({ commit, dispatch }, { id, data }) {
      return StationService.update(id, data).then(
        (response) => {
          dispatch("fetchStations")
          return Promise.resolve(response.data)
        },
        (error) => {
          commit("setError", error.message)
          return Promise.reject(error)
        },
      )
    },
    deleteStation({ commit, dispatch }, id) {
      return StationService.delete(id).then(
        (response) => {
          dispatch("fetchStations")
          return Promise.resolve(response.data)
        },
        (error) => {
          commit("setError", error.message)
          return Promise.reject(error)
        },
      )
    },
  },
  mutations: {
    setStations(state, stations) {
      state.stations = stations
    },
    setConnectorTypes(state, types) {
      state.connectorTypes = types
    },
    setLoading(state, status) {
      state.loading = status
    },
    setError(state, error) {
      state.error = error
    },
  },
  getters: {
    allStations: (state) => state.stations,
    allConnectorTypes: (state) => state.connectorTypes,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
}
