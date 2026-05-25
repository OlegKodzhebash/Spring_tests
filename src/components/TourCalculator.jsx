import { useMemo, useState } from "react";

export default function TourCalculator({ pricePerDay }) {
    const [days, setDays] = useState(1);
    const [people, setPeople] = useState(1);

    const total = useMemo(() => {
        const safePrice = Number(pricePerDay || 0);
        return safePrice * days * people;
    }, [pricePerDay, days, people]);

    return (
        <div className="calculator">
            <h3>Cost calculator</h3>

            <div className="calculator-grid">
                <label>
                    Days
                    <input
                        type="number"
                        min="1"
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                    />
                </label>

                <label>
                    People
                    <input
                        type="number"
                        min="1"
                        value={people}
                        onChange={(e) => setPeople(Number(e.target.value))}
                    />
                </label>
            </div>

            <p className="calculator-result">
                Total cost: <strong>${total.toFixed(2)}</strong>
            </p>
        </div>
    );
}