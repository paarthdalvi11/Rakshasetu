require("dotenv").config();
const axios = require("axios");
const turf = require("@turf/turf");
const fs = require("fs");
const polyline = require("@mapbox/polyline");

const CRIME_ZONES = [
  { lat: 21.1800, lng: 72.8350 },
  { lat: 21.1900, lng: 72.8300 },
  { lat: 21.2000, lng: 72.8400 },
  { lat: 21.1850, lng: 72.8250 },
  { lat: 21.1750, lng: 72.8450 },
  { lat: 21.2100, lng: 72.8380 }
];

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
      const crimePenalty = CRIME_ZONES.some(zone => {
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
    CRIME_ZONES.map(z => `&markers=color:red|label:X|${z.lat},${z.lng}`).join("") +
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

// Example usage
(async () => {
  const start = { lat: 21.1702, lng: 72.8311 };
  const end = { lat: 21.2156, lng: 72.8364 };
  const result = await getSafestPath(start, end);
  fs.writeFileSync("output.json", JSON.stringify(result, null, 2));
  console.log("✅ Output written to output.json");
})();
