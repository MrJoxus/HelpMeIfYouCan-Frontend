export default function({ store }) {
  if (!process.server) {
    if (!store.state.user.set && store.state.auth.loggedIn) {
      store.dispatch('user/REQUEST_USER')
    }
  }
}
