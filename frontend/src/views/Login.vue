<template>
  <div class="container">
    <div class="login-container">
      <div class="card">
        <h2 class="card-title">Login</h2>
        <form @submit.prevent="handleLogin">
          <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">
            {{ message }}
          </div>
          <div class="form-group">
            <label for="username">Username</label>
            <input
              v-model="user.username"
              type="text"
              class="form-control"
              id="username"
              required
              placeholder="Enter username"
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              v-model="user.password"
              type="password"
              class="form-control"
              id="password"
              required
              placeholder="Enter password"
            />
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block" :disabled="loading">
              <span v-if="loading">Loading...</span>
              <span v-else>Login</span>
            </button>
          </div>
          <div class="form-group text-center">
            <p>
              Don't have an account?
              <router-link to="/register">Register</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      loading: false,
      message: '',
      successful: false
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/dashboard');
    }
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.message = '';
      
      this.$store.dispatch('auth/login', this.user)
        .then(() => {
          this.$router.push('/dashboard');
        })
        .catch(error => {
          this.loading = false;
          this.message = (error.response && error.response.data && error.response.data.message) ||
                        error.message ||
                        error.toString();
        });
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
}

.card-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.btn-block {
  display: block;
  width: 100%;
}

.text-center {
  text-align: center;
}
</style>
