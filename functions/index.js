const { initializeApp } = require('firebase/app');
const { onRequest } = require('firebase-functions/v2/https');
const { getStorage, ref, connectStorageEmulator, getDownloadURL, listAll, getMetadata } = require('firebase/storage');
const { firebaseConfig } = require('./secrets');

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// Only for testing
// connectStorageEmulator(storage, '127.0.0.1', 9199);

const haversine = (lat1, long1, lat2, long2) => {
    // Haversine formula 
    // https://community.esri.com/t5/coordinate-reference-systems-blog/distance-on-a-sphere-the-haversine-formula/ba-p/902128#:~:text=Calculate distance using the Haversine Formula
    const a = Math.sin((lat2 - lat1) * Math.PI / 180 / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin((long2 - long1) * Math.PI / 180 / 2) ** 2;
    return (6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

exports.getMarkers = onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    try {
        const state = req.query.state.toLowerCase();
        // Download data
        const file = ref(storage, state + '.json');
        getMetadata(file).then(metadata => {
            const downloadUrl = getDownloadURL(file);
            if (metadata.size >= 33554432)
                downloadUrl.then(url => res.redirect(url));
            else
                downloadUrl.then(url => fetch(url)).then(res => res.json()).then(data => {
                    // Filter by parameters
                    let ret = [];
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
                        limit = Math.min(offset + parseInt(req.query.limit, data.length));
                    else
                        limit = data.length;
                    if (req.query.reporter)
                        reporter = req.query.reporter.toUpperCase().split(',');
                    for (let i = offset; i < limit; i++) {
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
                            if (haversine(marker.lat, marker.long, location[0], location[1]) > req.query.radius)
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

                        ret.push(obj);
                    }

                    res.json(ret).status(200).end();
                });
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