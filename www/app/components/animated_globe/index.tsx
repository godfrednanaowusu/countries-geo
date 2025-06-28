'use client'

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { Box } from "@radix-ui/themes";

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
                opacity:0.34,
                markers: [
                    { location: [37.7595, -122.4367], size: 0.03 },
                    { location: [40.7128, -74.006], size: 0.1 }
                ],
                onRender: (state) => {
                    state.phi = phi;
                    phi += 0.01;
                }
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
        <Box style={{ width: '100%', height: '100%', maxWidth: 600, margin: '0 auto' }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1',
                }}
            />
        </Box>
    );
}