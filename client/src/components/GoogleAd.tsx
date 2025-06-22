import { useEffect } from "react";

interface GoogleAdProps {
    slot: string; // Your ad slot ID
    style?: React.CSSProperties;
    className?: string;
    format?: string;
}

export default function GoogleAd({ slot, style, className, format = "auto" }: GoogleAdProps) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            // Ignore if AdSense is blocked
        }
    }, []);

    return (
        <ins
            className={`adsbygoogle ${className || ""}`}
            style={style || { display: "block" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your publisher ID
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
        />
    );
} 