# survey-markers

An API for [NGS geodetic survey markers](https://geodesy.noaa.gov/datasheets/).

## Usage

Call the API with a GET request to `https://getmarkers-wiffvxy7vq-uc.a.run.app/`.

### Parameters

| Name | Description | Required |
| ---- | ----------- | -------- |
| state | The state/territory to retrieve in 2 letter code format | `true` |
| data | The data fields to return (will return all data if left empty) | recommended |
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
fetch('https://getmarkers-wiffvxy7vq-uc.a.run.app/?state=aa&data=id,description').then(res => res.json()).then(data => {
    // Handle data
});
```
#### Python
```python
from requests import get
from json import loads

req = get("https://getmarkers-wiffvxy7vq-uc.a.run.app/?state=aa&data=id,description")

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
        URL url = new URL("https://getmarkers-wiffvxy7vq-uc.a.run.app/?state=aa&data=id,description");

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

url = URI.parse('https://getmarkers-wiffvxy7vq-uc.a.run.app/?state=aa&data=id,description')
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
	url := "https://getmarkers-wiffvxy7vq-uc.a.run.app/?state=aa&data=id,description"

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

$url = 'https://getmarkers-wiffvxy7vq-uc.a.run.app/?state=aa&data=id,description';
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
    let url = "https://getmarkers-wiffvxy7vq-uc.a.run.app/?state=aa&data=id,description";
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

    std::string url = "https://getmarkers-wiffvxy7vq-uc.a.run.app/?state=aa&data=id,description";
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