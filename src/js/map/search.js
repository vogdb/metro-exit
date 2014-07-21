/**
 * находит заданный адрес
 * @param address
 * @param callback исполним после получения результата геокодирования
 */
metro.exit.mmap.searchAddress = function (address) {
    var geocoder = new google.maps.Geocoder();
    var request = {
        address:address,
        bounds:new google.maps.LatLngBounds(new google.maps.LatLng(55.0, 37.0), new google.maps.LatLng(56.0, 38.0))
    };

    geocoder.geocode(request, function (results, status) {
        if (results.length > 0 && status == google.maps.GeocoderStatus.OK) {
            results = metro.exit.mmap.filterResults(results)
            if (results.length > 0) {
                if (results.length == 1) {
                    metro.exit.mmap.openMap(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                } else {
                    window.location.assign("selectAddress.html?" + metro.exit.mmap.mergeAddresses(results));
                }
            } else {
                alert("Адрес находится за пределами Москвы");
            }
        } else {
            alert("Невозможно найти заданный адрес: " + status);
        }
    });
}

metro.exit.mmap.filterResults = function (results) {
    var filtered = []
    for (var i = 0; i < results.length; i++) {
        var result = results[i]
        var location = result.geometry.location
        var isSuited = false
        for (var typeInd = 0; typeInd < result.types.length; typeInd++) {
            var type = result.types[typeInd]
            if (type == "street_address" || type == "route" || type == "intersection" || type == "park" || type == "premise") {
                isSuited = true
                break
            }
        }
        if (location.lat() > 55 && location.lat() < 56 && location.lng() > 37 && location.lng() < 38
            && isSuited)
            filtered.push(result)
    }
    return filtered
}

metro.exit.mmap.mergeAddresses = function (addresses) {
    var merged = ""
    for (var i = 0; i < addresses.length - 1; i++) {
        merged += metro.exit.mmap.formatAddress(addresses[i]) + "&"
    }
    merged += metro.exit.mmap.formatAddress(addresses[i])
    return encodeURIComponent(merged)
}

metro.exit.mmap.formatAddress = function (address) {
    return address.formatted_address + metro.exit.config.arraySeparator
        + address.geometry.location.lat() + metro.exit.config.arraySeparator + address.geometry.location.lng()
}