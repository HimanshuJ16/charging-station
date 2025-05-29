import { createStore } from "vuex"
import { auth } from "./auth.module"
import { stations } from "./stations.module"

export default createStore({
  modules: {
    auth,
    stations,
  },
})
