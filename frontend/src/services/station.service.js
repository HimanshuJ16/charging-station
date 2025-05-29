import axios from "axios"
import authHeader from "./auth-header"

const API_URL = process.env.VUE_APP_API_URL || "https://charging-station-lyhl.onrender.com/api/stations/"

class StationService {
  getAll(filters = {}) {
    const params = new URLSearchParams()

    if (filters.status) params.append("status", filters.status)
    if (filters.connectorType) params.append("connectorType", filters.connectorType)
    if (filters.minPower) params.append("minPower", filters.minPower)
    if (filters.maxPower) params.append("maxPower", filters.maxPower)

    const queryString = params.toString() ? `?${params.toString()}` : ""

    return axios.get(API_URL + queryString)
  }

  get(id) {
    return axios.get(API_URL + id)
  }

  create(data) {
    return axios.post(API_URL, data, { headers: authHeader() })
  }

  update(id, data) {
    return axios.put(API_URL + id, data, { headers: authHeader() })
  }

  delete(id) {
    return axios.delete(API_URL + id, { headers: authHeader() })
  }

  getConnectorTypes() {
    return axios.get(API_URL + "types/connectors")
  }
}

export default new StationService()
