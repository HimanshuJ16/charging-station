<template>
  <div id="app">
    <nav v-if="isLoggedIn" class="navbar">
      <div class="navbar-brand">Charging Station Manager</div>
      <div class="navbar-menu">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/map">Map View</router-link>
        <a href="#" @click.prevent="logout">Logout</a>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f4f7fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2c3e50;
  color: white;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-menu {
  display: flex;
  gap: 1.5rem;
}

.navbar-menu a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.navbar-menu a:hover {
  color: #42b983;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #3aa876;
}

.btn-danger {
  background-color: #e74c3c;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.alert {
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
</style>
