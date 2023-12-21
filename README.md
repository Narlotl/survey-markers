# survey-markers

An API for [NGS geodetic survey markers](https://geodesy.noaa.gov/datasheets/).

## Endpoints

Get markers: `https://us-central1-survey-markers.cloudfunctions.net/getMarkers?parameters`\
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
Get images: `https://us-central1-survey-markers.cloudfunctions.net/getImages?id=ID`\
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
- [Java](#java)
- [Ruby](#ruby)
- [Go](#go)
- [PHP](#php)
- [Rust](#rust)
- [C++](#c++)

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
The following examples are AI written and may not work. Please create an issue if there is a problem with one. Help with an accurate example or an example for a missing language is greatly appreciated.
#### Java (requires `GSON`)
```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class Main {
    public static void main(String[] args) {
        URL url = new URL("https://us-central1-survey-markers.cloudfunctions.net/getMarkers?state=aa&data=id,description");

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("GET");

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String inputLine;
        StringBuilder response = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        Gson gson = new Gson();
        JsonObject json = gson.fromJson(response.toString(), JsonObject.class);

        // Handle data
    }
}
```
#### Ruby
```ruby 
require 'net/http'
require 'json'

url = URI.parse('https://us-central1-survey-markers.cloudfunctions.net/getMarkers?state=aa&data=id,description')
http = Net::HTTP.new(url.host, url.port)
http.use_ssl = (url.scheme == 'https')

response = http.request(Net::HTTP::Get.new(url.request_uri))
json_response = JSON.parse(response.body)

# Handle data
```
#### Go
```go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type Response struct {
	State string `json:"state"`
	Data  string `json:"data"`
}

func main() {
	url := "https://us-central1-survey-markers.cloudfunctions.net/getMarkers?state=aa&data=id,description"

	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return
	}

	var jsonResp Response
	err = json.Unmarshal(body, &jsonResp)
	if err != nil {
		fmt.Println("Error parsing JSON response:", err)
		return
	}

	// Handle data
}
```
#### PHP
```php
<?php

$url = 'https://us-central1-survey-markers.cloudfunctions.net/getMarkers?state=aa&data=id,description';
$response = file_get_contents($url);
$json_response = json_decode($response, true);

// Handle data
```
#### Rust (requires `reqwest` and `serde_json`)
```rust
use std::io::Read;
use reqwest::blocking::get;
use serde_json::json;

fn main() {
    let url = "https://us-central1-survey-markers.cloudfunctions.net/getMarkers?state=aa&data=id,description";
    let response = get(url);

    let mut body = String::new();
    response
        .read_to_string(&mut body)

    let json_response = json::parse(&body).expect("Failed to parse JSON response");

    // Handle data
}
```
#### C++ (requires `libcurl` and `nlohmann/json`)
```c++
#include <iostream>
#include <curl/curl.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* response)
{
    size_t totalSize = size * nmemb;
    response->append((char*)contents, totalSize);
    return totalSize;
}

int main()
{
    curl_global_init(CURL_GLOBAL_DEFAULT);

    CURL* curl = curl_easy_init();
    if (!curl)
    {
        std::cerr << "Failed to initialize CURL." << std::endl;
        return 1;
    }

    std::string url = "https://us-central1-survey-markers.cloudfunctions.net/getMarkers?state=aa&data=id,description";
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());

    std::string response;
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

    CURLcode res = curl_easy_perform(curl);
    if (res != CURLE_OK)
    {
        std::cerr << "Failed to perform CURL request: " << curl_easy_strerror(res) << std::endl;
        curl_easy_cleanup(curl);
        return 1;
    }

    curl_easy_cleanup(curl);

    json json_response = json::parse(response);

    // Handle data

    return 0;
}
```
