const { initializeApp } = require('firebase/app');
const { onRequest } = require('firebase-functions/v2/https');
const { getStorage, ref, connectStorageEmulator, getDownloadURL, listAll, getMetadata, getStream } = require('firebase/storage');
const { firebaseConfig } = require('./secrets');

const MAX_BYTES = 31.5 * 2 ** 20;

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// Only for testing
// connectStorageEmulator(storage, '127.0.0.1', 9199);

// Haversine formula 
// https://community.esri.com/t5/coordinate-reference-systems-blog/distance-on-a-sphere-the-haversine-formula/ba-p/902128#:~:text=Calculate distance using the Haversine Formula
const haversine = (lat1, long1, lat2, long2) => {
    const a = Math.sin((lat2 - lat1) * Math.PI / 180 / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin((long2 - long1) * Math.PI / 180 / 2) ** 2;
    return (6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

// https://stackoverflow.com/a/11900218
const roughSizeOfObject = object => {
    const objectList = [];
    const stack = [object];
    let bytes = 0;

    while (stack.length) {
        const value = stack.pop();

        switch (typeof value) {
            case 'boolean':
                bytes += 4;
                break;
            case 'string':
                bytes += value.length * 2;
                break;
            case 'number':
                bytes += 8;
                break;
            case 'object':
                if (!objectList.includes(value)) {
                    objectList.push(value);
                    for (const prop in value) {
                        if (value.hasOwnProperty(prop)) {
                            stack.push(value[prop]);
                        }
                    }
                }
                break;
        }
    }

    return bytes;
}

exports.getMarkers = onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {
        const state = req.query.state.toLowerCase();
        // Download data
        const file = ref(storage, state + '.json');
        let data = '';
        getDownloadURL(file).then(url => fetch(url)).then(res => res.json()).then(data => {
            // Filter by parameters
            let ret = [], bytes = 0;
            let dataParam, location, offset, limit, reporter;
            if (req.query.data)
                dataParam = req.query.data.split(',');
            if (req.query.location)
                location = req.query.location.split(',');
            if (req.query.offset)
                offset = parseInt(req.query.offset);
            else
                offset = 0;
            if (req.query.limit)
                limit = Math.min(offset + parseInt(req.query.limit), data.length);
            else
                limit = data.length;
            if (req.query.reporter)
                reporter = req.query.reporter.toUpperCase().split(',');

            let done = 0, i;
            for (i = offset; done < limit && bytes < MAX_BYTES; i++) {
                const marker = data[i];
                let obj = {};
                // Filter by ID
                if (req.query.id)
                    if (marker.id != req.query.id)
                        continue;
                // Filter by search
                if (req.query.search)
                    if (!marker.description.match(new RegExp(req.query.search, 'gmi')))
                        continue;
                // Filter by condition
                if (req.query.condition)
                    if (!marker.history || marker.history.length == 0 || marker.history[marker.history.length - 1].condition != req.query.condition.toUpperCase())
                        continue;
                // Filter by reporter
                if (req.query.reporter) {
                    let hasReporter = false;

                    for (const rep of reporter)
                        for (const report of marker.history)
                            if (report.reporter == rep) {
                                hasReporter = true;
                                break;
                            }
                    if (!hasReporter || (!marker.history || marker.history.length == 0))
                        continue;
                }
                // Filter by loction and radius
                if (location && req.query.radius)
                    if (haversine(marker.latitude, marker.longitude, location[0], location[1]) > req.query.radius)
                        continue;
                // Only include specified data
                if (dataParam) {
                    for (const datum of dataParam)
                        if (marker[datum])
                            obj[datum] = marker[datum];
                }
                // Send all data
                else
                    obj = marker;

                done++;
                ret.push(obj);
                bytes += roughSizeOfObject(obj);
            }

            res.json({ markers: ret, paginated: bytes > MAX_BYTES, endIndex: i, total: data.length }).status(200).end();
        });
    }
    catch (e) {
        console.error(e.message);
        // Handle errors
        if (e.code == 'storage/object-not-found')
            res.status(404).json({ code: 404, message: 'File ' + req.query.state + '.json not found' }).end();
        res.status(500).json({ code: 500, message: e.message }).end();
    }
});

exports.getImages = onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.query.id)
        fetch('https://geodesy.noaa.gov/cgi-bin/get_image.prl?PROCESSING=list&PID=' + req.query.id).then(res => res.text()).then(data => {
            if (data.includes('ERROR'))
                res.status(400).json({ code: 400, message: 'Invalid ID format, must be 2 uppercase letters followed by 4 digits' }).end();
            else if (data.includes('No images found'))
                res.status(200).json([]).end();
            else
                res.status(200).json(
                    [...data.matchAll(/<img.*?src="(.*?)".*?>/gmi)]
                        .map(match => 'https://geodesy.noaa.gov' + match[1].replace('get_thumbnail', 'get_image'))
                ).end();
        });
    else
        res.status(400).json({ code: 400, message: 'Missing ID parameter' }).end();
});