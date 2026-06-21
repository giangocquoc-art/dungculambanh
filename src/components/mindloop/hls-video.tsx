"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { cn } from "@/lib/utils";

interface HlsVideoProps {
  src: string;
  className?: string;
  poster?: string;
}

/**
 * Background video player that streams an HLS (.m3u8) source via hls.js.
 * - Uses Hls.isSupported() check with native HLS fallback (Safari).
 * - Autoplay, muted, loop, playsInline — designed for background video.
 */
export function HlsVideo({ src, className, poster }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        void video.play().catch(() => {
          /* autoplay may be blocked until user interaction — ignore */
        });
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS (Safari)
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        void video.play().catch(() => {});
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={cn("h-full w-full object-cover", className)}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
    />
  );
}
