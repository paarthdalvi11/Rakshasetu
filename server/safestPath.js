// // require('dotenv').config();
// // const axios = require('axios');

// // const start = { lat: 21.1702, lng: 72.8311 };
// // const end = { lat: 21.2156, lng: 72.8364 };

// // const crimeZones = [
// //   { lat: 8.139, lng: 77.2 },
// //   { lat: 8.138, lng: 77.195 },
// //   { lat: 8.145, lng: 77.21 },
// //   { lat: 8.19, lng: 77.2 },
// //   { lat: 8.25, lng: 77.3 },
// //   { lat: 8.9, lng: 77.2 },
// // ];

// // // Function to calculate distance between two points (Haversine formula)
// // function haversineDistance(p1, p2) {
// //   const toRad = deg => (deg * Math.PI) / 180;
// //   const R = 6371; // Radius of Earth in km

// //   const dLat = toRad(p2.lat - p1.lat);
// //   const dLng = toRad(p2.lng - p1.lng);

// //   const a =
// //     Math.sin(dLat / 2) ** 2 +
// //     Math.cos(toRad(p1.lat)) *
// //       Math.cos(toRad(p2.lat)) *
// //       Math.sin(dLng / 2) ** 2;

// //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// //   return R * c;
// // }

// // // Check how close a point is to any crime zone
// // function isNearCrime(point, thresholdKm = 1) {
// //   return crimeZones.some(zone => haversineDistance(point, zone) < thresholdKm);
// // }

// // // Score a route by counting how many steps are near crime zones
// // function scoreRoute(route) {
// //   const steps = route.legs.flatMap(leg => leg.steps);
// //   let score = 0;
// //   for (const step of steps) {
// //     const loc = {
// //       lat: step.end_location.lat,
// //       lng: step.end_location.lng,
// //     };
// //     if (isNearCrime(loc)) score += 1;
// //   }
// //   return score;
// // }

// // async function getSafestRoute() {
// //   const url = `https://maps.googleapis.com/maps/api/directions/json`;
// //   const params = {
// //     origin: `${start.lat},${start.lng}`,
// //     destination: `${end.lat},${end.lng}`,
// //     alternatives: true,
// //     key: process.env.MAPS_API_KEY,
// //   };

// //   try {
// //     const res = await axios.get(url, { params });
// //     const routes = res.data.routes;

// //     if (!routes.length) {
// //       console.error("No routes found");
// //       return;
// //     }

// //     let safestRoute = routes[0];
// //     let minScore = scoreRoute(routes[0]);

// //     for (let i = 1; i < routes.length; i++) {
// //       const score = scoreRoute(routes[i]);
// //       if (score < minScore) {
// //         minScore = score;
// //         safestRoute = routes[i];
// //       }
// //     }

// //     console.log("Safest route found with score:", minScore);
// //     console.log(
// //       safestRoute.legs[0].steps.map(step => step.html_instructions).join('\n')
// //     );
// //   } catch (error) {
// //     console.error("Error fetching directions:", error.response?.data || error);
// //   }
// // }

// // getSafestRoute();

// const axios = require("axios");
// const turf = require("@turf/turf");

// // Config
// const START = { lat: 21.1702, lng: 72.8311 };
// const END = { lat: 21.2156, lng: 72.8364 };
// const CRIME_ZONES = [
//   { lat: 8.139, lng: 77.2 },
//   { lat: 8.138, lng: 77.195 },
//   { lat: 8.145, lng: 77.21 },
//   { lat: 8.19, lng: 77.2 },
//   { lat: 8.25, lng: 77.3 },
//   { lat: 8.9, lng: 77.2 },
// ];

// // Fetch road data from OpenStreetMap using Overpass API
// async function fetchOSMRoads(bbox) {
//   const query = `
//     [out:json];
//     (
//       way["highway"](${bbox});
//     );
//     out geom;
//   `;

//   const res = await axios.post(
//     "https://overpass-api.de/api/interpreter",
//     query,
//     { headers: { "Content-Type": "text/plain" } }
//   );

//   return res.data.elements;
// }

// // Convert nodes to graph
// function buildGraph(ways) {
//   const graph = {};

//   for (const way of ways) {
//     const nodes = way.geometry;
//     for (let i = 0; i < nodes.length - 1; i++) {
//       const from = `${nodes[i].lat},${nodes[i].lon}`;
//       const to = `${nodes[i + 1].lat},${nodes[i + 1].lon}`;

//       const distance = turf.distance(
//         [nodes[i].lon, nodes[i].lat],
//         [nodes[i + 1].lon, nodes[i + 1].lat]
//       );

//       const crimePenalty = CRIME_ZONES.some(zone => {
//         const d = turf.distance(
//           [nodes[i].lon, nodes[i].lat],
//           [zone.lng, zone.lat]
//         );
//         return d < 0.2; // 200m crime proximity
//       })
//         ? 10
//         : 0;

//       if (!graph[from]) graph[from] = [];
//       if (!graph[to]) graph[to] = [];

//       graph[from].push({ to, cost: distance + crimePenalty });
//       graph[to].push({ to: from, cost: distance + crimePenalty }); // bidirectional
//     }
//   }

//   return graph;
// }

// // A* pathfinding algorithm
// function aStar(graph, startCoord, endCoord) {
//   const start = nearestNode(graph, startCoord);
//   const end = nearestNode(graph, endCoord);

//   const openSet = new Set([start]);
//   const cameFrom = {};
//   const gScore = {};
//   const fScore = {};

//   for (const node in graph) {
//     gScore[node] = Infinity;
//     fScore[node] = Infinity;
//   }

//   gScore[start] = 0;
//   fScore[start] = heuristic(start, end);

//   while (openSet.size > 0) {
//     let current = [...openSet].reduce((a, b) =>
//       fScore[a] < fScore[b] ? a : b
//     );

//     if (current === end) return reconstructPath(cameFrom, current);

//     openSet.delete(current);

//     for (const neighbor of graph[current]) {
//       const tentative = gScore[current] + neighbor.cost;
//       if (tentative < gScore[neighbor.to]) {
//         cameFrom[neighbor.to] = current;
//         gScore[neighbor.to] = tentative;
//         fScore[neighbor.to] =
//           tentative + heuristic(neighbor.to, end);
//         openSet.add(neighbor.to);
//       }
//     }
//   }

//   return null;
// }

// // Heuristic (straight-line)
// function heuristic(a, b) {
//   const [aLat, aLng] = a.split(",").map(Number);
//   const [bLat, bLng] = b.split(",").map(Number);
//   return turf.distance([aLng, aLat], [bLng, bLat]);
// }

// function reconstructPath(cameFrom, current) {
//   const path = [current];
//   while (cameFrom[current]) {
//     current = cameFrom[current];
//     path.unshift(current);
//   }
//   return path.map(p => {
//     const [lat, lng] = p.split(",").map(Number);
//     return { lat, lng };
//   });
// }

// // Find closest node
// function nearestNode(graph, coord) {
//   let min = Infinity;
//   let closest = null;
//   for (const node in graph) {
//     const [lat, lng] = node.split(",").map(Number);
//     const dist = turf.distance([lng, lat], [coord.lng, coord.lat]);
//     if (dist < min) {
//       min = dist;
//       closest = node;
//     }
//   }
//   return closest;
// }

// // Main flow
// (async () => {
//   const bbox = `${START.lat - 0.05},${START.lng - 0.05},${END.lat + 0.05},${END.lng + 0.05}`;
//   console.log("Fetching road data...");
//   const roads = await fetchOSMRoads(bbox);
//   console.log("Building graph...");
//   const graph = buildGraph(roads);
//   console.log("Finding path...");
//   const path = aStar(graph, START, END);

//   console.log("Safest path:");
//   console.log(path);
// })();

require("dotenv").config();
const axios = require("axios");
const turf = require("@turf/turf");
const fs = require("fs");
const polyline = require("@mapbox/polyline");

// Config (Surat Area)
const START = { lat: 21.1702, lng: 72.8311 };
const END = { lat: 21.2156, lng: 72.8364 };
const CRIME_ZONES = [
  { lat: 21.1800, lng: 72.8350 },
  { lat: 21.1900, lng: 72.8300 },
  { lat: 21.2000, lng: 72.8400 },
  { lat: 21.1850, lng: 72.8250 },
  { lat: 21.1750, lng: 72.8450 },
  { lat: 21.2100, lng: 72.8380 }
];


// Fetch road data from OpenStreetMap using Overpass API
async function fetchOSMRoads(bbox) {
  const query = `
    [out:json];
    (
      way["highway"](${bbox});
    );
    out geom;
  `;

  const res = await axios.post(
    "https://overpass-api.de/api/interpreter",
    query,
    { headers: { "Content-Type": "text/plain" } }
  );

  return res.data.elements;
}

// Convert nodes to graph
function buildGraph(ways) {
  const graph = {};

  for (const way of ways) {
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
        return d < 0.2; // 200m proximity
      }) ? 10 : 0;

      if (!graph[from]) graph[from] = [];
      if (!graph[to]) graph[to] = [];

      graph[from].push({ to, cost: distance + crimePenalty });
      graph[to].push({ to: from, cost: distance + crimePenalty }); // bidirectional
    }
  }

  return graph;
}

// A* pathfinding algorithm
function aStar(graph, startCoord, endCoord) {
  const start = nearestNode(graph, startCoord);
  const end = nearestNode(graph, endCoord);

  const openSet = new Set([start]);
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  for (const node in graph) {
    gScore[node] = Infinity;
    fScore[node] = Infinity;
  }

  gScore[start] = 0;
  fScore[start] = heuristic(start, end);

  while (openSet.size > 0) {
    let current = [...openSet].reduce((a, b) =>
      fScore[a] < fScore[b] ? a : b
    );

    if (current === end) return reconstructPath(cameFrom, current);

    openSet.delete(current);

    for (const neighbor of graph[current]) {
      const tentative = gScore[current] + neighbor.cost;
      if (tentative < gScore[neighbor.to]) {
        cameFrom[neighbor.to] = current;
        gScore[neighbor.to] = tentative;
        fScore[neighbor.to] =
          tentative + heuristic(neighbor.to, end);
        openSet.add(neighbor.to);
      }
    }
  }

  return null;
}

// Heuristic
function heuristic(a, b) {
  const [aLat, aLng] = a.split(",").map(Number);
  const [bLat, bLng] = b.split(",").map(Number);
  return turf.distance([aLng, aLat], [bLng, bLat]);
}

// Path backtrack
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

// Closest node
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

// Build Static Map URL
function buildMapUrl(path, start, end, crimeZones, apiKey) {
  const base = "https://maps.googleapis.com/maps/api/staticmap";
  const size = "800x800";

  const encodedPath = polyline.encode(path.map(p => [p.lat, p.lng]));
  const pathStr = `&path=color:0x0000ff|weight:5|enc:${encodedPath}`;
  const startMarker = `&markers=color:green|label:S|${start.lat},${start.lng}`;
  const endMarker = `&markers=color:blue|label:E|${end.lat},${end.lng}`;
  const riskMarkers = crimeZones
    .map(z => `&markers=color:red|label:X|${z.lat},${z.lng}`)
    .join("");

  return `${base}?size=${size}${startMarker}${endMarker}${riskMarkers}${pathStr}&key=${apiKey}`;
}

// Save the image
async function saveMapImage(url, filename = "safest_path.png") {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(filename, response.data);
  console.log(`Map saved as ${filename}`);
}

// Main
(async () => {
  const bbox = `${START.lat - 0.05},${START.lng - 0.05},${END.lat + 0.05},${END.lng + 0.05}`;
  console.log("Fetching road data...");
  const roads = await fetchOSMRoads(bbox);
  console.log("Building graph...");
  const graph = buildGraph(roads);
  console.log("Finding path...");
  const path = aStar(graph, START, END);

  if (!path) {
    console.error("No path found.");
    return;
  }

  console.log("Safest path found!");
  const mapUrl = buildMapUrl(path, START, END, CRIME_ZONES, process.env.MAPS_API_KEY);
  await saveMapImage(mapUrl);
})();
