/**
 *
 * @param {Element} input
 * @param {Element} output
 * @param {Element} button
 * @constructor
 */
function Geocoder(input, output, button) {
    var _this = this;

    this.input = input;
    this.output = output;
    this.geocoder = new google.maps.Geocoder();

    button.addEventListener('click', function () {
        _this.geocodeAddress();
    });
}

Geocoder.prototype.geocodeAddress = function () {
    var _this = this;

    this.geocoder.geocode({
        address: this.input.value
    }, function (results, status) {
        _this.handleGeocodeResult(results, status);
    });
};

Geocoder.prototype.handleGeocodeResult = function (results, status) {
    var locationData = {},
        addressComponents, i, l;

    if (
        results &&
        results.length > 0 &&
        status == google.maps.GeocoderStatus.OK
    ) {
        addressComponents = results[0]['address_components'];

        for(i = 0, l = addressComponents.length; i < l; i++){
            switch(addressComponents[i].types[0]){
                case 'administrative_area_level_2':
                    locationData.province = addressComponents[i].short_name;
                    break;
                case 'administrative_area_level_3':
                    locationData.city = addressComponents[i].long_name;
                    break;
                case 'route':
                    locationData.route = addressComponents[i].long_name;
                    break;
                case 'street_number':
                    locationData.streetNumber = addressComponents[i].long_name;
                    break;
            }
        }
        this.locationData = locationData;
        this.showAddress();
    } else {
        alert('Inserisci un indirizzo valido!');
    }
};

Geocoder.prototype.showAddress = function () {
    var formattedData = this.locationData.province + ', ' +
        this.locationData.city + ', ' + this.locationData.route;

    if(this.locationData.streetNumber){
        formattedData +=  ', ' + this.locationData.streetNumber;
    }

    this.output.textContent = formattedData;
};

function initializeGeocoder(){
    var input,
        output,
        button;

    if(window.google){
        input = document.getElementById('shitty-query-input');
        output = document.getElementById('shitty-geocode-result');
        button = document.getElementById('shitty-geocode-button');

        new Geocoder(
            input,
            output,
            button
        );

        input.disabled = false;
        button.disabled = false;
    } else {
        setTimeout(initializeGeocoder, 500);
    }
}

//initializeGeocoder();