# survey-markers

An API for [NGS geodetic survey markers](https://geodesy.noaa.gov/datasheets/).

## Endpoints

Get markers: `https://us-central1-survey-markers.cloudfunctions.net/getMarkers?<parameters>`\
Example response: 
```javascript
{
    "markers": [
        {
            // Type of marker
            "marker": "CHISELED TRIANGLE",
            // What it's in
            "setting": "SET IN A MASSIVE STRUCTURE",
            // Specific setting (uncommon)
            "spSet": "BUILDING",
            // Stability
            "stability": "PROBABLY HOLD POSITION/ELEVATION WELL",
            // Marker description
            "description": "BY COAST AND GEODETIC SURVEY 1956 AT SAN FRANCISCO. AT SAN FRANCISCO, ALONG SEVENTH STREET, BETWEEN KING AND TOWNSEND STREETS, AT A THREE STORY BRICK BUILDING OCCUPIED BY BAKER AND HAMILTON, ON TOP OF THE NORTHWEST END OF THE BOTTOM STEP OF THE MAIN ENTRANCE, 125 FEET SOUTHWEST OF THE CENTER LINE OF TOWNSEND STREET, 0.5 FOOT SOUTHEAST OF THE SOUTHEAST END OF THE BRICK WALL AT THE NORTHEAST DOOR, 0.7 FOOT HIGHER THAN THE SIDEWALK, AND ABOUT 1 FOOT HIGHER THAN THE STREET.",
            // Height above sea level (meters)
            "elevation": 4.54,
            // Marker report history
            "history": [
                {
                    "date": "UNK",
                    "condition": "MONUMENTED",
                    "reporter": "CA3290"
                },
                {
                    "date": "1956",
                    "condition": "GOOD",
                    "reporter": "CGS"
                }
            ],
            // Marker PID
            "id": "HT0754",
            // Location
            "latitude": 37.7725,
            "longitude": -122.4025
        }
    ],
    // Whether a limit was forced
    "paginated": false,
    // How many markers were searched
    "endIndex": 1,
    // How many markers in the state
    "total": 62234
}
```
Get images: `https://us-central1-survey-markers.cloudfunctions.net/getImages?id=<ID>`\
Example response:
```javascript
// List of images for the marker
// Empty if no images
[
    "https://geodesy.noaa.gov/cgi-bin/get_image.prl?PROCESSING=get_image&PID=HV1846&filename=HV1846-MERIDIAN_STONE-1-20131105.jpg",
    "https://geodesy.noaa.gov/cgi-bin/get_image.prl?PROCESSING=get_image&PID=HV1846&filename=HV1846-MERIDIAN_STONE-2-20190321.jpg",
    "https://geodesy.noaa.gov/cgi-bin/get_image.prl?PROCESSING=get_image&PID=HV1846&filename=HV1846-MERIDIAN_STONE-3N-20131025.jpg",
    "https://geodesy.noaa.gov/cgi-bin/get_image.prl?PROCESSING=get_image&PID=HV1846&filename=HV1846-MERIDIAN_STONE-3S-20131107.jpg",
    "https://geodesy.noaa.gov/cgi-bin/get_image.prl?PROCESSING=get_image&PID=HV1846&filename=HV1846-MERIDIAN_STONE-3E-20120302.jpg",
    "https://geodesy.noaa.gov/cgi-bin/get_image.prl?PROCESSING=get_image&PID=HV1846&filename=HV1846-MERIDIAN_STONE-3W-20120302.jpg",
    "https://geodesy.noaa.gov/cgi-bin/get_image.prl?PROCESSING=get_image&PID=HV1846&filename=HV1846-MERIDIAN_STONE-1-20201212.jpg",
    "https://geodesy.noaa.gov/cgi-bin/get_image.prl?PROCESSING=get_image&PID=HV1846&filename=HV1846-MERIDIAN_STONE-2-20201212.jpg"
]
```

### Parameters

| Name | Description | Required |
| ---- | ----------- | -------- |
| state | The state/territory to retrieve in 2 letter code format. State codes can be found at `https://firebasestorage.googleapis.com/v0/b/survey-markers.appspot.com/o/states.json?alt=media&token=56e7422d-1377-4aa4-8607-30d946323b09`. | `true` |
| data | The data fields to return (will return all data if left empty) | recommended, especially for large states |
| offset | How many markers to skip | `false` |
| limit | How many markers to return (a limit is forced on large requests) | `false` |
| id | The single marker ID to return | `false` |
| location | The lat/long coordinates to center the search | with radius |
| radius | How far in kilometers to search from `location` | with location |
| search | A RegEx query or string search for marker descriptions | `false` |
| condition | The last recorded condition of the marker | `false` |
| reporter | Reporter of any report in the marker's history | `false` |

### Examples

- [Javascript](#javascript)
- [Python](#python)

#### Javascript
```javascript
fetch('https://us-central1-survey-markers.cloudfunctions.net/getMarkers?state=aa&data=id,description')
.then(res => res.json())
.then(data => {
    // Handle data
});
```
#### Python
```python
from requests import get
from json import loads

req = get("https://us-central1-survey-markers.cloudfunctions.net/getMarkers?state=aa&data=id,description")

json = loads(req.text)

# Handle data
```
