// List of 6 license plates to be recognized
// 4 are authorized, 2 are unauthorized (not in authorizedVehicleList)
export const recognizedVehicleList = [
    '9AR329',  // Authorized
    'CF24G3',  // Authorized
    '48G68S',  // Authorized
    '21H637',  // Authorized
    'KS3023',  // Authorized
    'FD2837',  // Unauthorized (not in authorizedVehicleList)
];

// Only 4 out of 6 are authorized
// export const authorizedVehicleList = [
//     'DJA218',
//     'F1S214',
//     'RPQ453',
//     'QJA561',
//     'XYZ123'
// ];
export const authorizedVehicleList = [
    '9AR329',
    'CF24G3',
    '48G68S',
    '21H637',
    'KS3023'
];
// Scan History => Time Period List
export const timePeriodArray = [
    {
        id: 1,
        name: "Last 30 days"
    },
    {
        id: 2,
        name: "Last 3 months"
    },
    {
        id: 3,
        name: "Current Year"
    },
    {
        id: 4,
        name: "All Time"
    },
];
// Scan History => Time Period List
export let scanTypes = [
    {
        id: 1,
        name: "All",
    },
    {
        id: 2,
        name: "Unauthorized",
        dataType: "unregistered"
    },
    {
        id: 3,
        name: "Valid",
        dataType: "registered"
    },
];
// Header 
export const headerTitle = "Parking Enforcement";
// Scan History Texts 
export const scanHistoryTexts = {
    licensePlateTextField: "Search License Plate",
    licensePlatePlaceholder: "ENTER LICENSE PLATE NUMBER",
    timePeriodLabel: "Time Period",
    emptyScanText: 'No scans found',
    emailToSelf: "Email to Self",
    record: "record",
    emailSentSuccessfully: "Email sent successfully",
    unregistered: "unregistered",
    registered: "registered",
    sent: "Sent",
    texted: "Texted"
}
// Towing Queue Texts 
export const towingQueueTexts = {
    markedAsTowed: "Item is marked as towed successfully",
    markedAsResolved: "Item is marked as resolved successfully"
}