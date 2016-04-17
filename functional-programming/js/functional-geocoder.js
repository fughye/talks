var join =  R.curry(function (glue, array) {
  return array && array.join(glue);
});

function locationDataToArray(locationData){
  return locationData && [
    locationData.province,
    locationData.city,
    locationData.route,
    locationData.streetNumber
  ] || [];
}

var filter = R.curry(function (predicate, array) {
  return array && array.filter(predicate);
});

function isTruthy(value) {
  return !!value;
}

var formatAddress = R.compose(
    join(', '),
    filter(isTruthy),
    locationDataToArray
);

function transformAddressComponents(addressComponents) {
  return addressComponents && R.reduce(function(res, component) {
        switch(component.types[0]){
          case 'administrative_area_level_2':
            res.province = component.short_name;
            break;
          case 'administrative_area_level_3':
            res.city = component.long_name;
            break;
          case 'route':
            res.route = component.long_name;
            break;
          case 'street_number':
            res.streetNumber = component.long_name;
            break;
        }
        return res;
      }, {}, addressComponents);
}

var getProperty = R.curry(function (propName, obj) {
  return obj && obj[propName];
});

var first = getProperty(0);

function validGeocodeResponse(results, status) {
  return status == google.maps.GeocoderStatus.OK && results;
}

var formatGeocodeResponse = R.compose(
  formatAddress,
  transformAddressComponents,
  getProperty('address_components'),
  first,
  validGeocodeResponse
);

var showAddress = R.curry(function(errorMessage, output, formattedData) {
  if(formattedData) {
      output.textContent = formattedData;
  } else {
      alert(errorMessage);
  }
});

var geocode = R.curry(function(geocoder, output, address) {
  geocoder.geocode({
        address: address
  }, R.compose(
    showAddress('Inserisci un indirizzo valido!', output),
    formatGeocodeResponse
  ));
});

function manageAddressGeocoding(input, output, button){
  var geocodeOnOutput = geocode(
     new google.maps.Geocoder(),
     output
  );
  button.addEventListener('click', function() {
    geocodeOnOutput(input.value);
  });
}

function initializeFunctionalGeocoder(){
  var input,
      output,
      button;

  if(window.google){
    input = document.getElementById('shitty-query-input');
    output = document.getElementById('shitty-geocode-result');
    button = document.getElementById('shitty-geocode-button');

    manageAddressGeocoding(
        input,
        output,
        button
    );

    input.disabled = false;
    button.disabled = false;
  } else {
    setTimeout(initializeFunctionalGeocoder, 500);
  }
}

initializeFunctionalGeocoder();