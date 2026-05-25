import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({ children, delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`scroll-reveal ${visible ? "scroll-reveal-visible" : ""}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}