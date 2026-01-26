export const enhanceAdviceForDemo = (baseAdvice, location, hazard) => {
  return {
    ...baseAdvice,

    avoid: {
      list: baseAdvice.avoid,
      mapRegion: {
        center: {
          lat: location.latitude,
          lon: location.longitude
        },
        radiusKm: 50,
        zipCodes: [location.zip_code]
      }
    },

    recommended: [
      'Stay indoors and maintain heating',
      'Layer clothing and cover exposed skin',
      'Keep emergency supplies accessible',
      'Check on neighbors and vulnerable individuals'
    ],

    resources: {
      emergency: [
        { label: 'Emergency Services', url: 'tel:911' },
        {
          label: 'Local Emergency Management',
          url: `https://www.ready.gov/community-state-info?zip=${location.zip_code}`
        }
      ],
      aid: [
        {
          label: 'Red Cross Shelter Finder',
          url: 'https://www.redcross.org/get-help.html'
        },
        {
          label: 'Heating Assistance (LIHEAP)',
          url: 'https://www.acf.hhs.gov/ocs/energy-assistance'
        }
      ],
      info: [
        {
          label: 'CDC Cold Weather Safety',
          url: 'https://www.cdc.gov/disasters/winter/index.html'
        },
        {
          label: 'National Weather Service',
          url: 'https://www.weather.gov'
        }
      ]
    }
  };
};