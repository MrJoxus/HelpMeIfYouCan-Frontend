export const state = () => ({
  center: { lat: 53.565965, lng: 9.948829 },
  locations: [
    { id: 0, lat: 53.565965, lng: 9.948829 },
    { id: 1, lat: 53.6179168, lng: 10.088444 },
    { id: 2, lat: 53.6179168, lng: 10.088745 }
  ],
  infoWindow: {
    dummyContent: [
      {
        type: 'Gesuch1',
        description:
          'Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig.'
      },
      {
        type: 'Angebot1',
        description:
          'Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig.'
      },
      {
        type: 'Angebot2',
        description:
          'Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig.'
      }
    ]
  }
})

export const mutations = {
  UPDATE_CENTER(state, payload) {
    console.log('UPDATE_CENTER')
    state.center = payload
  }
}

export const actions = {
  GET_GEOLOCATION({ commit }, payload) {
    console.log('GET_GEOLOCATION', payload)

    let addressQuery = encodeURIComponent(
      `${payload.street}, ${payload.postalCode}, ${payload.area}`
    )
    delete this.$axios.defaults.headers.common['Authorization']

    this.$axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?&address=${addressQuery}&key=${process.env.GOOGLE_API_KEY}`
      )
      .then(response => {
        if (response.data.results.length != 0) {
          commit('UPDATE_CENTER', response.data.results[0].geometry.location)
        } else {
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}
