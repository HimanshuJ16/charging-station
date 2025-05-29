<template>
  <div class="container">
    <div class="register-container">
      <div class="card">
        <h2 class="card-title">Register</h2>
        <form @submit.prevent="handleRegister">
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
            <label for="email">Email</label>
            <input
              v-model="user.email"
              type="email"
              class="form-control"
              id="email"
              required
              placeholder="Enter email"
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
              <span v-else>Register</span>
            </button>
          </div>
          <div class="form-group text-center">
            <p>
              Already have an account?
              <router-link to="/login">Login</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: ''
      },
      loading: false,
      message: '',
      successful: false
    };
  },
  methods: {
    handleRegister() {
      this.message = '';
      this.successful = false;
      this.loading = true;
      
      this.$store.dispatch('auth/register', this.user)
        .then(response => {
          this.message = response.message || 'Registration successful! Please login.';
          this.successful = true;
          this.loading = false;
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        })
        .catch(error => {
          this.message = (error.response && error.response.data && error.response.data.message) ||
                        error.message ||
                        error.toString();
          this.successful = false;
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.register-container {
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
