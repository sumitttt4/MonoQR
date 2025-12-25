export interface QRCode {
    id: string;
    name: string;
    type: 'url' | 'wifi' | 'text';
    content: string;
    createdAt: string;
    scans: number;
    lastActive: string;
}

export const MOCK_QRS: QRCode[] = [
    {
        id: "qr_1",
        name: "Spring Marketing Flyer",
        type: "url",
        content: "https://monoqr.com/spring-sale",
        createdAt: "2024-03-10T10:00:00Z",
        scans: 1245,
        lastActive: "Just now"
    },
    {
        id: "qr_2",
        name: "Office WiFi Guest",
        type: "wifi",
        content: "WIFI:S:Guest;T:WPA;P:password;;",
        createdAt: "2024-01-15T09:30:00Z",
        scans: 89,
        lastActive: "2 hours ago"
    },
    {
        id: "qr_3",
        name: "vCard: CEO",
        type: "text", // representing vcard content
        content: "BEGIN:VCARD...",
        createdAt: "2024-02-01T14:20:00Z",
        scans: 430,
        lastActive: "1 day ago"
    }
];

export const MOCK_ANALYTICS = {
    qr_1: {
        dailyScans: [120, 132, 101, 134, 190, 230, 210],
        devices: { mobile: 85, desktop: 15 },
        locations: { "USA": 60, "Germany": 20, "India": 10, "Other": 10 }
    }
};
