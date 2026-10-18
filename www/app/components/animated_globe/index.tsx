'use client'

import { useEffect, useRef } from "react";
import createGlobe, { type Marker } from "cobe";

// Capital/major city per country, max 4 per continent
const MARKERS: Marker[] = [
    // Africa
    { location: [5.6037, -0.187], size: 0.05 },     // Ghana (Accra)
    { location: [6.5244, 3.3792], size: 0.05 },     // Nigeria (Lagos)
    { location: [30.0444, 31.2357], size: 0.05 },   // Egypt (Cairo)
    { location: [-26.2041, 28.0473], size: 0.05 },  // South Africa (Johannesburg)
    // Asia
    { location: [39.9042, 116.4074], size: 0.05 },  // China (Beijing)
    { location: [28.6139, 77.209], size: 0.05 },    // India (New Delhi)
    { location: [35.6762, 139.6503], size: 0.05 },  // Japan (Tokyo)
    { location: [-6.2088, 106.8456], size: 0.05 },  // Indonesia (Jakarta)
    // Europe
    { location: [51.5074, -0.1278], size: 0.05 },   // United Kingdom (London)
    { location: [48.8566, 2.3522], size: 0.05 },    // France (Paris)
    { location: [52.52, 13.405], size: 0.05 },      // Germany (Berlin)
    { location: [40.4168, -3.7038], size: 0.05 },   // Spain (Madrid)
    // North America
    { location: [38.9072, -77.0369], size: 0.05 },  // United States (Washington, D.C.)
    { location: [45.4215, -75.6972], size: 0.05 },  // Canada (Ottawa)
    { location: [19.4326, -99.1332], size: 0.05 },  // Mexico (Mexico City)
    { location: [23.1136, -82.3666], size: 0.05 },  // Cuba (Havana)
    // South America
    { location: [-15.7939, -47.8828], size: 0.05 }, // Brazil (Brasília)
    { location: [-34.6037, -58.3816], size: 0.05 }, // Argentina (Buenos Aires)
    { location: [4.711, -74.0721], size: 0.05 },    // Colombia (Bogotá)
    { location: [-12.0464, -77.0428], size: 0.05 }, // Peru (Lima)
    // Oceania
    { location: [-33.8688, 151.2093], size: 0.05 }, // Australia (Sydney)
    { location: [-41.2865, 174.7762], size: 0.05 }, // New Zealand (Wellington)
    { location: [-9.4438, 147.1803], size: 0.05 },  // Papua New Guinea (Port Moresby)
    { location: [-18.1248, 178.4501], size: 0.05 }, // Fiji (Suva)
];

// Pinned to cobe 0.6.5: its shader draws markers as flat discs with a radial glow, which v2 dropped
export default function AnimatedGlobe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        let phi = 0;
        let globe: ReturnType<typeof createGlobe> | null = null;

        const createNewGlobe = (width: number, height: number) => {
            if (globe) globe.destroy();

            globe = createGlobe(canvasRef.current!, {
                devicePixelRatio: 2,
                width,
                height,
                phi: 0,
                theta: 0,
                dark: 1,
                diffuse: 1.2,
                mapSamples: 16000,
                mapBrightness: 6,
                baseColor: [0.3, 0.3, 0.3],
                markerColor: [0.1, 0.8, 1],
                glowColor: [1, 1, 1],
                opacity: 0.34,
                markers: MARKERS,
                onRender: (state) => {
                    state.phi = phi;
                    phi += 0.01;
                },
            });
        };

        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0] && canvasRef.current) {
                const { width, height } = entries[0].contentRect;
                createNewGlobe(width * 2, height * 2);
            }
        });

        // Initial creation
        const rect = canvasRef.current.getBoundingClientRect();
        createNewGlobe(rect.width * 2, rect.height * 2);
        resizeObserver.observe(canvasRef.current);

        return () => {
            resizeObserver.disconnect();
            if (globe) {
                globe.destroy();
            }
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '100%', maxWidth: 600, margin: '0 auto' }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1',
                }}
            />
        </div>
    );
}