import { useState, useEffect } from "react";
import GoogleAd from "./GoogleAd";
import { X } from "lucide-react";

interface TimeDelayedAdProps {
    delaySeconds?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
}

export default function TimeDelayedAd({
    delaySeconds = 5,
    position = 'bottom-right'
}: TimeDelayedAdProps) {
    const [showAd, setShowAd] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAd(true);
        }, delaySeconds * 1000);

        return () => clearTimeout(timer);
    }, [delaySeconds]);

    if (!showAd) return null;

    const positionClasses = {
        'top-right': 'fixed top-4 right-4',
        'top-left': 'fixed top-4 left-4',
        'bottom-right': 'fixed bottom-4 right-4',
        'bottom-left': 'fixed bottom-4 left-4',
        'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    };

    return (
        <div className={`${positionClasses[position]} z-50`}>
            <div className="relative bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm">
                <button
                    onClick={() => setShowAd(false)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                    <X className="h-3 w-3" />
                </button>
                <GoogleAd
                    slot="YOUR_AD_SLOT_ID"
                    style={{
                        display: "block",
                        minHeight: 250,
                        width: '280px',
                        margin: '0 auto',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}
                />
            </div>
        </div>
    );
} 