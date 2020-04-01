export const state = () => ({
  center: { lat: 53.565965, lng: 9.948829 },
  locations: [
    { id: 0, lat: 53.565965, lng: 9.948829 },
    { id: 1, lat: 53.6179168, lng: 10.0886449 },
    { id: 2, lat: 53.6179168, lng: 10.088745 }
  ],
  pins: {
    selected: '/assets/img/001-hilfe.png',
    notSelected: '/assets/img/001-hilfe.png'
  },
  options: {
    fullscreenControl: false,
    disableDefaultUI: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  },
  infoWindow: {
    dummyContent: [
      {
        type: 'Gesuch',
        description:
          'Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig.'
      },
      {
        type: 'Angebot',
        description:
          'Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig. Bacon ipsum dolor amet fatback kevin shoulder tenderloin drumstick filet mignon, chicken buffalo pig.'
      }
    ]
  }
})

export const mutations = {}

export const actions = {}
