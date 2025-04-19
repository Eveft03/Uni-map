// Εισαγωγή των δεδομένων
import { poiData, poiCategories } from './data.js';

// Κλάση για τη διαχείριση των δεικτών στο χάρτη
class MarkerManager {
    constructor(map) {
        this.map = map;
        this.markers = [];
        this.markerLayers = {};
        this.activeFilters = Object.keys(poiCategories);
    }

    // Δημιουργία προσαρμοσμένου HTML εικονιδίου για αριθμημένο δείκτη
    createNumberedIcon(number, category) {
        // Χρήση του χρώματος της κατηγορίας ή προεπιλεγμένο χρώμα
        const color = (category && poiCategories[category]) 
            ? poiCategories[category].color 
            : '#3388ff';

        // HTML για το εικονίδιο με τον αριθμό
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="marker-number" style="background-color: ${color};">${number}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }

    // Δημιουργία HTML περιεχομένου για το tooltip πληροφοριών
    createTooltipContent(poi) {
        let content = `
            <div class="custom-tooltip">
                <h3>${poi.name}</h3>
                <p>${poi.description}</p>
        `;

        // Προσθήκη εικόνας αν υπάρχει
        if (poi.image) {
            content += `<img src="${poi.image}" alt="${poi.name}" style="max-width: 100%; margin: 10px 0;">`;
        }

        // Προσθήκη επιπλέον πληροφοριών ανάλογα με την κατηγορία
        if (poi.openingHours) {
            content += `<p><strong>Ώρες Λειτουργίας:</strong> ${poi.openingHours}</p>`;
        }
        
        if (poi.contactInfo) {
            content += `<p><strong>Επικοινωνία:</strong> ${poi.contactInfo}</p>`;
        }
        
        if (poi.website) {
            content += `<p><strong>Ιστοσελίδα:</strong> <a href="${poi.website}" target="_blank">${poi.website}</a></p>`;
        }

        if (poi.events) {
            content += `<p><strong>Εκδηλώσεις:</strong> ${poi.events}</p>`;
        }

        content += `</div>`;
        return content;
    }

    // Προσθήκη όλων των δεικτών στο χάρτη
    addAllMarkers() {
        // Δημιουργία επιπέδων για κάθε κατηγορία
        for (const category in poiCategories) {
            this.markerLayers[category] = L.layerGroup().addTo(this.map);
        }

        // Προσθήκη κάθε σημείου ενδιαφέροντος στο χάρτη
        poiData.forEach(poi => {
            this.addMarker(poi);
        });
    }

    // Προσθήκη μεμονωμένου δείκτη στο χάρτη
    addMarker(poi) {
        // Δημιουργία εικονιδίου με αριθμό
        const icon = this.createNumberedIcon(poi.id, poi.category);
        
        // Δημιουργία δείκτη και προσθήκη στο χάρτη
        const marker = L.marker(poi.coordinates, { icon: icon });
        
        // Δημιουργία περιεχομένου tooltip
        const tooltipContent = this.createTooltipContent(poi);
        
        // Προσθήκη popup με πληροφορίες
        marker.bindPopup(tooltipContent);
        
        // Προσθήκη στο αντίστοιχο επίπεδο κατηγορίας
        if (poi.category && this.markerLayers[poi.category]) {
            marker.addTo(this.markerLayers[poi.category]);
        } else {
            // Αν δεν υπάρχει κατηγορία, προσθήκη απευθείας στο χάρτη
            marker.addTo(this.map);
        }
        
        // Αποθήκευση του δείκτη στον πίνακα για μελλοντική αναφορά
        this.markers.push({
            id: poi.id,
            marker: marker,
            category: poi.category
        });
        
        return marker;
    }

    // Φιλτράρισμα δεικτών με βάση τις κατηγορίες
    filterMarkers(categories) {
        this.activeFilters = categories;
        
        // Ενημέρωση της ορατότητας για κάθε επίπεδο κατηγορίας
        for (const category in this.markerLayers) {
            if (categories.includes(category)) {
                // Εμφάνιση επιπέδου αν περιλαμβάνεται στα φίλτρα
                this.map.addLayer(this.markerLayers[category]);
            } else {
                // Απόκρυψη επιπέδου αν δεν περιλαμβάνεται στα φίλτρα
                this.map.removeLayer(this.markerLayers[category]);
            }
        }
    }

    // Εστίαση του χάρτη σε συγκεκριμένο δείκτη με βάση το ID
    focusMarker(id) {
        const markerObj = this.markers.find(m => m.id === id);
        if (markerObj) {
            // Εστίαση στο δείκτη
            this.map.setView(markerObj.marker.getLatLng(), 15);
            // Άνοιγμα του popup
            markerObj.marker.openPopup();
        }
    }
}

export { MarkerManager };