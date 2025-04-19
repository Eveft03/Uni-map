// Αρχικοποίηση του χάρτη
var map = L.map("map", {
    center: [33.80427100088687, -117.4753998353766],
    zoom: 10,
    minZoom: 0,
    maxZoom: 15,
  });
  
  // Προσθήκη του βασικού επιπέδου πλακιδίων (OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  
  // Δεδομένα σημείων ενδιαφέροντος (POI)
  const poiData = [
      {
          id: 1,
          name: "Κεντρική Βιβλιοθήκη",
          category: "academic",
          coordinates: [33.80427100088687, -117.47539983537660],
          description: "Η κεντρική βιβλιοθήκη του πανεπιστημίου με περισσότερα από 500.000 βιβλία και ηλεκτρονικές πηγές."
      },
      {
          id: 2,
          name: "Κτίριο Διοίκησης",
          category: "administration",
          coordinates: [33.80527100088687, -117.47639983537660],
          description: "Κτίριο διοίκησης όπου βρίσκονται τα γραφεία του πρύτανη και των διοικητικών υπηρεσιών."
      },
      {
          id: 3,
          name: "Αμφιθέατρο 'Αριστοτέλης'",
          category: "academic",
          coordinates: [33.80327100088687, -117.47439983537660],
          description: "Το μεγαλύτερο αμφιθέατρο του πανεπιστημίου με χωρητικότητα 500 ατόμων."
      },
      {
          id: 4,
          name: "Φοιτητική Λέσχη",
          category: "services",
          coordinates: [33.80627100088687, -117.47739983537660],
          description: "Χώρος σίτισης και αναψυχής για τους φοιτητές."
      },
      {
          id: 5,
          name: "Τμήμα Πληροφορικής",
          category: "academic",
          coordinates: [33.80727100088687, -117.47839983537660],
          description: "Κτίριο του τμήματος Πληροφορικής με εργαστήρια υπολογιστών και αίθουσες διδασκαλίας."
      }
  ];
  
  // Κατηγορίες σημείων ενδιαφέροντος με χρώματα
  const poiCategories = {
      academic: { color: "#3388ff" },
      administration: { color: "#ff3333" },
      services: { color: "#33ff33" }
  };
  
  // Συνάρτηση για την απεικόνιση του Cloud-Optimized GeoTIFF (COG)
  async function loadCloudOptimizedGeoTIFF() {
      try {
          // Εμφάνιση μηνύματος φόρτωσης
          const loadingDiv = document.createElement('div');
          loadingDiv.id = 'loading-message';
          loadingDiv.innerHTML = 'Φόρτωση χάρτη...';
          loadingDiv.style.position = 'absolute';
          loadingDiv.style.top = '10px';
          loadingDiv.style.left = '50%';
          loadingDiv.style.transform = 'translateX(-50%)';
          loadingDiv.style.zIndex = '1000';
          loadingDiv.style.backgroundColor = 'white';
          loadingDiv.style.padding = '10px';
          loadingDiv.style.borderRadius = '5px';
          loadingDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
          document.body.appendChild(loadingDiv);
  
          // Φόρτωση του αρχείου GeoTIFF
          const url = 'university_map_cog.tif'; // Αλλάξτε το όνομα ανάλογα με το αρχείο σας
          
          // Για Cloud-Optimized GeoTIFF, θα χρησιμοποιήσουμε τη βιβλιοθήκη geotiff.js
          // που μπορεί να κάνει ανάγνωση τμηματικά (HTTP range requests)
          
          // Άνοιγμα του αρχείου χρησιμοποιώντας τις δυνατότητες HTTP range requests
          const tiff = await GeoTIFF.fromUrl(url);
          const image = await tiff.getImage();
          
          // Λήψη των βασικών πληροφοριών του GeoTIFF
          const width = image.getWidth();
          const height = image.getHeight();
          const fileDirectory = image.getFileDirectory();
          const geoKeys = image.getGeoKeys();
          
          // Υπολογισμός του bounding box από τα μεταδεδομένα του GeoTIFF
          let bbox, projection;
          
          if (fileDirectory.ModelTiepoint && fileDirectory.ModelPixelScale) {
              // Εξαγωγή των συντεταγμένων από τα δεδομένα γεωαναφοράς
              const tiepoint = fileDirectory.ModelTiepoint;
              const scale = fileDirectory.ModelPixelScale;
              
              // Υπολογισμός των συντεταγμένων των γωνιών
              const minX = tiepoint[3];
              const maxY = tiepoint[4];
              const maxX = minX + width * scale[0];
              const minY = maxY - height * scale[1];
              
              bbox = [minX, minY, maxX, maxY];
              
              // Προσδιορισμός του συστήματος συντεταγμένων
              if (geoKeys && geoKeys.ProjectedCSTypeGeoKey) {
                  projection = `EPSG:${geoKeys.ProjectedCSTypeGeoKey}`;
              } else if (geoKeys && geoKeys.GeographicTypeGeoKey) {
                  projection = `EPSG:${geoKeys.GeographicTypeGeoKey}`;
              } else {
                  projection = 'EPSG:4326'; // Προεπιλογή σε WGS84
              }
          } else {
              console.warn('Δεν βρέθηκαν πληροφορίες γεωαναφοράς');
              // Fallback σε προκαθορισμένες τιμές
              bbox = [-180, -90, 180, 90];
              projection = 'EPSG:4326';
          }
          
          console.log('GeoTIFF Bound Box:', bbox);
          console.log('GeoTIFF Projection:', projection);
  
          // Αντί να διαβάσουμε όλα τα δεδομένα του raster αμέσως, 
          // θα απεικονίσουμε το GeoTIFF ως ένα σύνολο πλακιδίων, 
          // εκμεταλλευόμενοι τη δομή του Cloud-Optimized GeoTIFF
          
          // Συνάρτηση για τη δημιουργία ενός πλακιδίου (tile) από το GeoTIFF
          const createTile = async (coords, done) => {
              const tile = document.createElement('canvas');
              tile.width = 256;
              tile.height = 256;
              const ctx = tile.getContext('2d');
  
              try {
                  // Υπολογισμός του γεωγραφικού εύρους του πλακιδίου
                  const mapSize = 256 * Math.pow(2, coords.z);
                  const nwPoint = coords.multiplyBy(256);
                  const sePoint = nwPoint.add([256, 256]);
                  
                  // Μετατροπή των συντεταγμένων πλακιδίων σε γεωγραφικές συντεταγμένες
                  const nw = L.point(nwPoint.x, nwPoint.y);
                  const se = L.point(sePoint.x, sePoint.y);
                  
                  const lng1 = (nw.x / mapSize) * 360 - 180;
                  const lat1 = Math.atan(Math.sinh(Math.PI * (1 - 2 * nw.y / mapSize))) * 180 / Math.PI;
                  const lng2 = (se.x / mapSize) * 360 - 180;
                  const lat2 = Math.atan(Math.sinh(Math.PI * (1 - 2 * se.y / mapSize))) * 180 / Math.PI;
                  
                  // Υπολογισμός των αντίστοιχων pixel στο GeoTIFF
                  const pxRatio = width / (bbox[2] - bbox[0]);
                  const pyRatio = height / (bbox[3] - bbox[1]);
                  
                  const x1 = Math.max(0, Math.floor((lng1 - bbox[0]) * pxRatio));
                  const y1 = Math.max(0, Math.floor((bbox[3] - lat1) * pyRatio));
                  const x2 = Math.min(width, Math.ceil((lng2 - bbox[0]) * pxRatio));
                  const y2 = Math.min(height, Math.ceil((bbox[3] - lat2) * pyRatio));
                  
                  // Αν το πλακίδιο είναι εκτός των ορίων του GeoTIFF, επιστρέφουμε ένα διαφανές πλακίδιο
                  if (x2 <= x1 || y2 <= y1 || x1 >= width || y1 >= height || x2 <= 0 || y2 <= 0) {
                      // Διαφανές πλακίδιο
                      ctx.clearRect(0, 0, 256, 256);
                      done(null, tile);
                      return tile;
                  }
                  
                  // Ανάγνωση του τμήματος του GeoTIFF που αντιστοιχεί στο πλακίδιο
                  const windowWidth = x2 - x1;
                  const windowHeight = y2 - y1;
                  
                  // Επιλογή του κατάλληλου επιπέδου επισκόπησης (overview) βάσει του zoom
                  let overviewLevel = 0;
                  const overviews = await tiff.getOverviews();
                  
                  if (overviews.length > 0) {
                      const targetResX = windowWidth / 256;
                      const targetResY = windowHeight / 256;
                      const targetRes = Math.max(targetResX, targetResY);
                      
                      // Επιλογή του πλησιέστερου επιπέδου επισκόπησης
                      for (let i = 0; i < overviews.length; i++) {
                          const overview = overviews[i];
                          const ovWidth = overview.getWidth();
                          const ovHeight = overview.getHeight();
                          const ovResX = width / ovWidth;
                          const ovResY = height / ovHeight;
                          const ovRes = Math.max(ovResX, ovResY);
                          
                          if (ovRes < targetRes) {
                              break;
                          }
                          overviewLevel = i + 1;
                      }
                  }
                  
                  // Χρήση του επιπέδου επισκόπησης αν υπάρχει, διαφορετικά χρήση της αρχικής εικόνας
                  const selectedImage = overviewLevel > 0 ? 
                      await overviews[overviewLevel - 1] : image;
                  
                  // Προσαρμογή των συντεταγμένων των windows για το επίπεδο επισκόπησης
                  const selectedWidth = selectedImage.getWidth();
                  const selectedHeight = selectedImage.getHeight();
                  const xRatio = selectedWidth / width;
                  const yRatio = selectedHeight / height;
                  
                  const readWindow = [
                      Math.floor(y1 * yRatio),
                      Math.floor(x1 * xRatio),
                      Math.ceil(y2 * yRatio),
                      Math.ceil(x2 * xRatio)
                  ];
                  
                  // Ανάγνωση των δεδομένων raster για το συγκεκριμένο παράθυρο
                  const rasters = await selectedImage.readRasters({
                      window: readWindow
                  });
                  
                  // Δημιουργία της εικόνας για το πλακίδιο
                  const windowData = ctx.createImageData(256, 256);
                  const data = windowData.data;
                  
                  // Υπολογισμός των λόγων κλιμάκωσης
                  const readWidth = readWindow[3] - readWindow[1];
                  const readHeight = readWindow[2] - readWindow[0];
                  const scaleX = readWidth / 256;
                  const scaleY = readHeight / 256;
                  
                  // Συμπλήρωση των δεδομένων pixel
                  for (let y = 0; y < 256; y++) {
                      for (let x = 0; x < 256; x++) {
                          const srcX = Math.min(readWidth - 1, Math.floor(x * scaleX));
                          const srcY = Math.min(readHeight - 1, Math.floor(y * scaleY));
                          const srcIdx = srcY * readWidth + srcX;
                          const dstIdx = (y * 256 + x) * 4;
                          
                          if (rasters.length === 1) {
                              // Ασπρόμαυρη εικόνα
                              data[dstIdx] = rasters[0][srcIdx];     // R
                              data[dstIdx + 1] = rasters[0][srcIdx]; // G
                              data[dstIdx + 2] = rasters[0][srcIdx]; // B
                              data[dstIdx + 3] = 255;                // Alpha
                          } else if (rasters.length === 3) {
                              // RGB εικόνα
                              data[dstIdx] = rasters[0][srcIdx];     // R
                              data[dstIdx + 1] = rasters[1][srcIdx]; // G
                              data[dstIdx + 2] = rasters[2][srcIdx]; // B
                              data[dstIdx + 3] = 255;                // Alpha
                          } else if (rasters.length >= 4) {
                              // RGBA εικόνα
                              data[dstIdx] = rasters[0][srcIdx];     // R
                              data[dstIdx + 1] = rasters[1][srcIdx]; // G
                              data[dstIdx + 2] = rasters[2][srcIdx]; // B
                              data[dstIdx + 3] = rasters[3][srcIdx]; // Alpha
                          }
                      }
                  }
                  
                  ctx.putImageData(windowData, 0, 0);
                  done(null, tile);
              } catch (error) {
                  console.error('Σφάλμα δημιουργίας πλακιδίου:', error);
                  // Σε περίπτωση σφάλματος, επιστρέφουμε ένα διαφανές πλακίδιο
                  ctx.clearRect(0, 0, 256, 256);
                  done(null, tile);
              }
              
              return tile;
          };
          
          // Δημιουργία προσαρμοσμένου επιπέδου για το GeoTIFF
          const cogLayer = L.GridLayer.extend({
              createTile: function(coords, done) {
                  return createTile(coords, done);
              }
          });
          
          // Προσθήκη του επιπέδου στο χάρτη
          const geotiffLayer = new cogLayer({
              opacity: 0.7,
              maxNativeZoom: 18,
              minNativeZoom: 0
          }).addTo(map);
          
          // Εστίαση στα όρια του GeoTIFF
          const imageBounds = [
              [bbox[1], bbox[0]], // Southwest
              [bbox[3], bbox[2]]  // Northeast
          ];
          map.fitBounds(imageBounds);
          
          // Προσθήκη ελέγχου διαφάνειας
          const opacityControl = L.control({position: 'bottomright'});
          opacityControl.onAdd = function() {
              const div = L.DomUtil.create('div', 'opacity-control');
              div.innerHTML = '<div style="background: white; padding: 5px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.2);">' +
                              '<label style="display: block; margin-bottom: 5px;">Διαφάνεια χάρτη:</label>' +
                              '<input type="range" min="0" max="1" step="0.1" value="0.7" style="width: 150px;">' +
                              '</div>';
              div.firstChild.querySelector('input').addEventListener('input', function(e) {
                  geotiffLayer.setOpacity(e.target.value);
              });
              return div;
          };
          opacityControl.addTo(map);
          
          // Αφαίρεση του μηνύματος φόρτωσης
          document.body.removeChild(loadingDiv);
          
          console.log('Ο χάρτης φορτώθηκε επιτυχώς!');
      } catch (error) {
          console.error('Σφάλμα φόρτωσης GeoTIFF:', error);
          
          // Προβολή μηνύματος σφάλματος
          const loadingDiv = document.getElementById('loading-message');
          if (loadingDiv) {
              loadingDiv.innerHTML = `Σφάλμα φόρτωσης χάρτη: ${error.message}`;
              loadingDiv.style.backgroundColor = '#ffdddd';
              setTimeout(() => {
                  if (document.body.contains(loadingDiv)) {
                      document.body.removeChild(loadingDiv);
                  }
              }, 5000);
          }
      }
  }
  
  // Συνάρτηση για τη δημιουργία αριθμημένων εικονιδίων
  function createNumberedIcon(number, category) {
      const color = (category && poiCategories[category]) 
          ? poiCategories[category].color 
          : '#3388ff';
  
      return L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="marker-number" style="background-color: ${color};">${number}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
      });
  }
  
  // Προσθήκη των αριθμημένων δεικτών στο χάρτη
  poiData.forEach(poi => {
      const icon = createNumberedIcon(poi.id, poi.category);
      
      const marker = L.marker(poi.coordinates, { icon: icon });
      
      const popupContent = `
          <div class="custom-tooltip">
              <h3>${poi.name}</h3>
              <p>${poi.description}</p>
          </div>
      `;
      
      marker.bindPopup(popupContent);
      marker.addTo(map);
  });
  
  // Βοηθητική λειτουργία για εύρεση συντεταγμένων
  map.on('click', function(e) {
      console.log(`Συντεταγμένες: ${e.latlng.lat}, ${e.latlng.lng}`);
  });
  
  // Φόρτωση του GeoTIFF όταν φορτωθεί η σελίδα
  document.addEventListener('DOMContentLoaded', loadCloudOptimizedGeoTIFF);