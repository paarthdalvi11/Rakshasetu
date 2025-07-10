const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const embeddings = require("@themaximalist/embeddings.js").default;
const similarity = require( 'compute-cosine-similarity' );
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const dotenv = require("dotenv").config();
const { createUser, updateUser } = require('./database');
const { router: authRoutes, authenticateToken } = require('./auth');
const turf = require("@turf/turf");
const polyline = require("@mapbox/polyline");


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const API_KEY = process.env.MAPS_API_KEY;

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

app.get('/', async(req, res) => {
  res.send('CORS-enabled Express server');
});


app.post('/upload/video', upload.single('video'), async (req, res) => {
    const clientId = req.body.clientId || 'default';
    console.log(clientId)
    const clientFolderPath = path.join('uploads', clientId);
  
    fs.mkdir(clientFolderPath, { recursive: true }, (err) => {
      if (err) return res.status(500).send('Folder creation failed');
  
      const ext = path.extname(req.file.originalname);
      const uniqueName = `${uuidv4()}_${Date.now()}${ext}`;
      const fullPath = path.join(clientFolderPath, uniqueName);
  
      fs.writeFile(fullPath, req.file.buffer, (err) => {
        if (err) return res.status(500).send('File save failed');
        res.send('Video uploaded successfully');
      });
    });
  });


app.post('/upload/audio', upload.single('audio'), async (req, res) => {
    const clientId = req.body.clientId || 'default';
    console.log(clientId)
    const clientFolderPath = path.join('uploads', clientId);
  
    fs.mkdir(clientFolderPath, { recursive: true }, (err) => {
      if (err) return res.status(500).send('Folder creation failed');
  
      const ext = path.extname(req.file.originalname);
      const uniqueName = `${uuidv4()}_${Date.now()}${ext}`;
      const fullPath = path.join(clientFolderPath, uniqueName);
  
      fs.writeFile(fullPath, req.file.buffer, (err) => {
        if (err) return res.status(500).send('File save failed');
        res.send('Audio uploaded successfully');
      });
    });
  });

app.post('/send-text', async(req, res) => {
  const text = req.body.text;
  res.send(`Text received: ${text}`);
});

app.post('/nearby-police-stations', async (req, res) => {
    const { lat, lng } = req.body;
  
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
  
    try {
      const radius = 3000;
      const numof = 5
      const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=police&key=${API_KEY}`;
      const nearbyResponse = await axios.get(nearbyUrl);
      const results = nearbyResponse.data.results;
  
    const stationsWithScores = await Promise.all(
        results.map(async station => {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${station.place_id}&fields=name,formatted_address,formatted_phone_number,geometry&key=${API_KEY}`;
          const detailsResponse = await axios.get(detailsUrl);
          const details = detailsResponse.data.result;
      
          const relevance = await getRelavanceScore(details.name, "police station");
      
          return {
            name: details.name,
            address: details.formatted_address,
            location: details.geometry.location,
            phone: details.formatted_phone_number || 'Not available',
            relevance
          };
        })
      );
      
      // sort stations by relevance (highest first)
      stationsWithScores.sort((a, b) => b.relevance - a.relevance);
      
      res.json({ stations: stationsWithScores.slice(0, numof) });
      
  
    //   res.json({ stations });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to fetch nearby police stations with contact details' });
    }
  });


  app.post('/nearby-hospitals', async (req, res) => {
    const { lat, lng } = req.body;
  
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
  
    try {
      const radius = 3000;
      const numof = 5;
      const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=hospital&key=${API_KEY}`;
      const nearbyResponse = await axios.get(nearbyUrl);
      const results = nearbyResponse.data.results;
  
      const hospitalsWithScores = await Promise.all(
        results.map(async hospital => {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${hospital.place_id}&fields=name,formatted_address,formatted_phone_number,geometry&key=${API_KEY}`;
          const detailsResponse = await axios.get(detailsUrl);
          const details = detailsResponse.data.result;
  
          const relevance = await getRelavanceScore(details.name, "hospital");
  
          return {
            name: details.name,
            address: details.formatted_address,
            location: details.geometry.location,
            phone: details.formatted_phone_number || 'Not available',
            relevance
          };
        })
      );
  
      hospitalsWithScores.sort((a, b) => b.relevance - a.relevance);
      res.json({ hospitals: hospitalsWithScores.slice(0, numof) });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to fetch nearby hospitals with contact details' });
    }
  });
  
  
async function getRelavanceScore(string, targetString){
    const vector1 = await embeddings(string);
    const vector2 = await embeddings(targetString);
    const sim = similarity(vector1, vector2);
    console.log(sim)
    return sim
}

app.post("/mark-location", async (req, res) => {
    const location = req.body.location;
    console.log('Incoming location:', location);
  
    let crimeLocations = get("crimeLocations.json");
    if (!crimeLocations.locations) crimeLocations.locations = [];
  
    // Check if location already exists
    const exists = crimeLocations.locations.some(loc =>
      JSON.stringify(loc) === JSON.stringify(location)
    );
  
    if(!exists){
        crimeLocations.locations.push(location);
    }
    set("crimeLocations.json", crimeLocations);
  
    res.send(crimeLocations);
  });
  
  app.post("/get-marked-locations", async (req, res) => {
    const myLocation = req.body.location; // Expected: { lat, lng }
    const RANGE_KM = 5;
  
    const getDistanceInKm = (lat1, lng1, lat2, lng2) => {
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
  
    const allLocations = get("crimeLocations.json");
  
    if (!allLocations?.locations) {
      return res.status(404).json({ message: "No locations found" });
    }
  
    const nearbyLocations = allLocations.locations.filter(loc => {
      const distance = getDistanceInKm(
        myLocation.lat,
        myLocation.lng,
        loc.lat,
        loc.lng
      );
      return distance <= RANGE_KM;
    });

    res.json({ nearbyLocations });
  });

app.post("/sync-location", async(req, res)=>{
    const clientId = req.body.clientId
    const myLocation = req.body.location

    console.log(clientId)
    console.log(myLocation)
    
    updateUser(clientId, {
        "location":myLocation
    })

    res.send("location updated")
})
  
function get(filePath) {
    try {
      const absolutePath = path.resolve(filePath);
      const data = fs.readFileSync(absolutePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error(`Error reading JSON from ${filePath}:`, err.message);
      return null;
    }
  }

  function set(filePath, value) {
    try {
      const absolutePath = path.resolve(filePath);
      const json = JSON.stringify(value, null, 2); // pretty print with 2-space indent
      fs.writeFileSync(absolutePath, json, 'utf8');
      console.log(`Successfully updated ${filePath}`);
    } catch (err) {
      console.error(`Error writing JSON to ${filePath}:`, err.message);
    }
  }
  
  async function getSafestPath(start, end) {
    // 1. Fetch OSM roads
    const bbox = `${start.lat - 0.05},${start.lng - 0.05},${end.lat + 0.05},${end.lng + 0.05}`;
    const osmQuery = `
      [out:json];
      (
        way["highway"](${bbox});
      );
      out geom;
    `;
    const { data } = await axios.post(
      "https://overpass-api.de/api/interpreter",
      osmQuery,
      { headers: { "Content-Type": "text/plain" } }
    );
  
    // 2. Build graph
    const graph = {};
    for (const way of data.elements) {
      const nodes = way.geometry;
      for (let i = 0; i < nodes.length - 1; i++) {
        const from = `${nodes[i].lat},${nodes[i].lon}`;
        const to = `${nodes[i + 1].lat},${nodes[i + 1].lon}`;
        const distance = turf.distance(
          [nodes[i].lon, nodes[i].lat],
          [nodes[i + 1].lon, nodes[i + 1].lat]
        );
        const crimePenalty = get("crimeLocations.json").locations.some(zone => {
          const d = turf.distance(
            [nodes[i].lon, nodes[i].lat],
            [zone.lng, zone.lat]
          );
          return d < 0.2;
        }) ? 10 : 0;
  
        if (!graph[from]) graph[from] = [];
        if (!graph[to]) graph[to] = [];
        graph[from].push({ to, cost: distance + crimePenalty });
        graph[to].push({ to: from, cost: distance + crimePenalty });
      }
    }
  
    // 3. A* pathfinding
    function heuristic(a, b) {
      const [aLat, aLng] = a.split(",").map(Number);
      const [bLat, bLng] = b.split(",").map(Number);
      return turf.distance([aLng, aLat], [bLng, bLat]);
    }
  
    function nearestNode(graph, coord) {
      let min = Infinity;
      let closest = null;
      for (const node in graph) {
        const [lat, lng] = node.split(",").map(Number);
        const dist = turf.distance([lng, lat], [coord.lng, coord.lat]);
        if (dist < min) {
          min = dist;
          closest = node;
        }
      }
      return closest;
    }
  
    function aStar(graph, startCoord, endCoord) {
      const start = nearestNode(graph, startCoord);
      const end = nearestNode(graph, endCoord);
      const openSet = new Set([start]);
      const cameFrom = {};
      const gScore = {}, fScore = {};
      for (const node in graph) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
      }
      gScore[start] = 0;
      fScore[start] = heuristic(start, end);
  
      while (openSet.size > 0) {
        let current = [...openSet].reduce((a, b) => fScore[a] < fScore[b] ? a : b);
        if (current === end) return reconstructPath(cameFrom, current);
        openSet.delete(current);
        for (const neighbor of graph[current]) {
          const tentative = gScore[current] + neighbor.cost;
          if (tentative < gScore[neighbor.to]) {
            cameFrom[neighbor.to] = current;
            gScore[neighbor.to] = tentative;
            fScore[neighbor.to] = tentative + heuristic(neighbor.to, end);
            openSet.add(neighbor.to);
          }
        }
      }
      return null;
    }
  
    function reconstructPath(cameFrom, current) {
      const path = [current];
      while (cameFrom[current]) {
        current = cameFrom[current];
        path.unshift(current);
      }
      return path.map(p => {
        const [lat, lng] = p.split(",").map(Number);
        return { lat, lng };
      });
    }
  
    const path = aStar(graph, start, end);
    if (!path) throw new Error("No path found.");
  
    // 4. Create Map
    const encodedPath = polyline.encode(path.map(p => [p.lat, p.lng]));
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=800x800&path=color:0x0000ff|weight:5|enc:${encodedPath}&markers=color:green|label:S|${start.lat},${start.lng}&markers=color:blue|label:E|${end.lat},${end.lng}` +
      get("crimeLocations.json").locations.map(z => `&markers=color:red|label:X|${z.lat},${z.lng}`).join("") +
      `&key=${process.env.MAPS_API_KEY}`;
  
    const imageRes = await axios.get(mapUrl, { responseType: "arraybuffer" });
    const base64Image = Buffer.from(imageRes.data).toString("base64");
  
    // 5. Return results
    return {
      mapImageBase64: base64Image,
      pathGeoJSON: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: path.map(p => [p.lng, p.lat])
        },
        properties: {
          length_km: turf.length({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: path.map(p => [p.lng, p.lat])
            }
          })
        }
      }
    };
  }

  app.post("/find-safest-path", async(req, res)=>{
    const start = req.body.start;
    const end = req.body.end

    const result =await getSafestPath(start, end)
    res.send(result)
  });

  // async function getPatrollingRoute(myLocation) {
  //   // 1. Load crime locations from file
  //   const crimeData = JSON.parse(fs.readFileSync('crimeLocations.json', 'utf-8'));
  //   const crimePoints = crimeData.locations;
  
  //   if (!myLocation || !myLocation.location) throw new Error("Invalid current location");
  //   const start = myLocation.location;
  //   if (crimePoints.length === 0) throw new Error("No crime locations found.");
  
  //   // 2. Greedy nearest-neighbor path starting from my location
  //   const visited = new Set();
  //   const route = [start];
  //   let current = start;
  
  //   while (visited.size < crimePoints.length) {
  //     let nearestIdx = -1;
  //     let minDist = Infinity;
  //     for (let i = 0; i < crimePoints.length; i++) {
  //       if (visited.has(i)) continue;
  //       const dist = turf.distance(
  //         [current.lng, current.lat],
  //         [crimePoints[i].lng, crimePoints[i].lat]
  //       );
  //       if (dist < minDist) {
  //         minDist = dist;
  //         nearestIdx = i;
  //       }
  //     }
  //     current = crimePoints[nearestIdx];
  //     visited.add(nearestIdx);
  //     route.push(current);
  //   }
  
  //   // 3. Optional: return to starting point (close loop)
  //   route.push(start);
  
  //   // 4. Encode path for Google Maps Static API
  //   const encodedPath = polyline.encode(route.map(p => [p.lat, p.lng]));
  
  //   const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=800x800&path=color:0x0000ff|weight:5|enc:${encodedPath}` +
  //     crimePoints.map(z => `&markers=color:red|label:C|${z.lat},${z.lng}`).join('') +
  //     `&markers=color:green|label:U|${start.lat},${start.lng}` +
  //     `&key=${process.env.MAPS_API_KEY}`;
  
  //   const imageRes = await axios.get(mapUrl, { responseType: "arraybuffer" });
  //   const base64Image = Buffer.from(imageRes.data).toString("base64");
  
  //   // 5. Return route + visual
  //   return {
  //     patrollingMapBase64: base64Image,
  //     routeGeoJSON: {
  //       type: "Feature",
  //       geometry: {
  //         type: "LineString",
  //         coordinates: route.map(p => [p.lng, p.lat])
  //       },
  //       properties: {
  //         length_km: turf.length({
  //           type: "Feature",
  //           geometry: {
  //             type: "LineString",
  //             coordinates: route.map(p => [p.lng, p.lat])
  //           }
  //         })
  //       }
  //     }
  //   };
  // }

  async function getPatrollingRoute(myLocation) {
    // 1. Validate input
    if (!myLocation || !myLocation.location)
      throw new Error("Invalid current location");
  
    const start = myLocation.location;
  
    // 2. Load and filter crime locations within 3 km
    const crimeData = JSON.parse(fs.readFileSync('crimeLocations.json', 'utf-8'));
    const crimePoints = crimeData.locations.filter(point => {
      const distance = turf.distance(
        [start.lng, start.lat],
        [point.lng, point.lat]
      );
      return distance <= 3; // keep only crimes within 3km
    });
  
    if (crimePoints.length === 0)
      throw new Error("No nearby crime locations within 3 km found.");
  
    // 3. Nearest Neighbor Path Starting from My Location
    const visited = new Set();
    const route = [start];
    let current = start;
  
    while (visited.size < crimePoints.length) {
      let nearestIdx = -1;
      let minDist = Infinity;
  
      for (let i = 0; i < crimePoints.length; i++) {
        if (visited.has(i)) continue;
        const dist = turf.distance(
          [current.lng, current.lat],
          [crimePoints[i].lng, crimePoints[i].lat]
        );
        if (dist < minDist) {
          minDist = dist;
          nearestIdx = i;
        }
      }
  
      current = crimePoints[nearestIdx];
      visited.add(nearestIdx);
      route.push(current);
    }
  
    // 4. Optionally return to start to close the loop
    route.push(start);
  
    // 5. Create Google Static Map
    const encodedPath = polyline.encode(route.map(p => [p.lat, p.lng]));
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=800x800&path=color:0x0000ff|weight:5|enc:${encodedPath}` +
      crimePoints.map(z => `&markers=color:red|label:C|${z.lat},${z.lng}`).join('') +
      `&markers=color:green|label:U|${start.lat},${start.lng}` +
      `&key=${process.env.MAPS_API_KEY}`;
  
    const imageRes = await axios.get(mapUrl, { responseType: "arraybuffer" });
    const base64Image = Buffer.from(imageRes.data).toString("base64");
  
    // 6. Return results
    return {
      patrollingMapBase64: base64Image,
      routeGeoJSON: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: route.map(p => [p.lng, p.lat])
        },
        properties: {
          length_km: turf.length({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: route.map(p => [p.lng, p.lat])
            }
          })
        }
      }
    };
  }


  // app.post("/find-patrolling-path", async(req, res)=>{
  //   const myLocation = req.body.location;

  //   const result =await getPatrollingRoute(myLocation.location)
  //   res.send(result)
  // });
  app.post("/find-patrolling-path", async (req, res) => {
    try {
      const myLocation = req.body; // req.body = { location: { lat, lng } }
  
      const result = await getPatrollingRoute(myLocation); // Pass entire object with .location
      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    }
  });
  
  app.post("/add-soss", async(req, res)=>{
    try{
      const sos = req.body.sos;
      const soss = get("soss.json");
      soss.soss.push(sos);
      set("soss.json",soss);
      res.send("soss sent successfully")
    }catch(error){
      console.error(error);
      res.status(500).send({
        error:error.message
      })
    }
  })

  app.get("/get-soss", async(req, res)=>{
    try{
      const soss = get("soss.json");
      res.json(soss)
    }catch(error){
      console.error(error);
      res.status(500).send({
        error:error.message
      })
    }
  })
