/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYm9yeWFuYS1kaW5rb3ZhIiwiYSI6ImNrY2dxc21vZzBkZ2Yyc3FreXc3N2g4eXQifQ._OpD7sOs-mak6D1LbS4XSA';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/boryana-dinkova/ckcgr2uhe1dax1il5blv6wkut',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 25,
    })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map);

    map.on('mouseenter', 'test', function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'test', function () {
      map.getCanvas().style.cursor = '';
    });

    // Extend map bounds to include current location
    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 250,
      bottom: 110,
      left: 100,
      right: 100,
    },
  });
};
