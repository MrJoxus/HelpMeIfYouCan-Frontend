export default function({ $axios, redirect }) {
  $axios.onRequest(config => {
    console.log('axios request', config)
  })
  $axios.onResponse(response => {
    console.log('axios request', response)
  })
}
