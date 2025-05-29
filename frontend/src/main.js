import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import Toast, { POSITION } from "vue-toastification"
import "vue-toastification/dist/index.css"
import "./assets/tailwind.css"

const app = createApp(App)

app.use(store)
app.use(router)

// Configure toast with proper error handling
const toastOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  // Add error handling
  onMounted: () => {
    console.log("Toast notifications ready")
  },
}

app.use(Toast, toastOptions)

app.mount("#app")
