// Points of interest
const poiData = [
    {
        id: 1,
        name: "Κεντρική Βιβλιοθήκη",
        category: "academic",
        coordinates: [33.80427100088687, -117.47539983537660],
        description: "Η κεντρική βιβλιοθήκη του πανεπιστημίου με περισσότερα από 500.000 βιβλία και ηλεκτρονικές πηγές.",
        image: "images/library.jpg",
        openingHours: "Δευτέρα-Παρασκευή: 08:00-22:00, Σαββατοκύριακο: 10:00-18:00"
    },
    {
        id: 2,
        name: "Κτίριο Διοίκησης",
        category: "administration",
        coordinates: [33.80527100088687, -117.47639983537660],
        description: "Κτίριο διοίκησης όπου βρίσκονται τα γραφεία του πρύτανη και των διοικητικών υπηρεσιών.",
        image: "images/admin.jpg",
        contactInfo: "Τηλ: 210-123456, Email: admin@university.edu"
    },
    {
        id: 3,
        name: "Αμφιθέατρο 'Αριστοτέλης'",
        category: "academic",
        coordinates: [33.80327100088687, -117.47439983537660],
        description: "Το μεγαλύτερο αμφιθέατρο του πανεπιστημίου με χωρητικότητα 500 ατόμων.",
        image: "images/amphitheater.jpg",
        events: "Συνέδρια, διαλέξεις και εκδηλώσεις του πανεπιστημίου."
    },
    {
        id: 4,
        name: "Φοιτητική Λέσχη",
        category: "services",
        coordinates: [33.80627100088687, -117.47739983537660],
        description: "Χώρος σίτισης και αναψυχής για τους φοιτητές.",
        image: "images/cafeteria.jpg",
        openingHours: "Δευτέρα-Παρασκευή: 07:30-20:00, Σαββατοκύριακο: Κλειστά"
    },
    {
        id: 5,
        name: "Τμήμα Πληροφορικής",
        category: "academic",
        coordinates: [33.80727100088687, -117.47839983537660],
        description: "Κτίριο του τμήματος Πληροφορικής με εργαστήρια υπολογιστών και αίθουσες διδασκαλίας.",
        image: "images/cs-dept.jpg",
        website: "https://cs.university.edu"
    }
];

// Point categories
const poiCategories = {
    academic: {
        name: "Ακαδημαϊκά Κτίρια",
        color: "#3388ff"
    },
    administration: {
        name: "Διοίκηση",
        color: "#ff3333"
    },
    services: {
        name: "Υπηρεσίες",
        color: "#33ff33"
    },
    sports: {
        name: "Αθλητικές Εγκαταστάσεις",
        color: "#ff8833"
    },
    residence: {
        name: "Εστίες",
        color: "#8833ff"
    }
};


export { poiData, poiCategories };