'use client';

import { useState } from 'react';
import styles from './FlightSearch.module.css';

interface Flight {
    uniqueId: string;
    flightNumber: string;
    airline: string;
    origin: {
        code: string;
        city: string;
        time: string;
        timezone: string;
        terminal?: string;
        gate?: string;
    };
    destination: {
        code: string;
        city: string;
        time: string;
        timezone: string;
        terminal?: string;
        gate?: string;
    };
    duration: string;
    status: string;
}

export default function FlightSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setSearched(true);
        setResults([]);

        try {
            const response = await fetch(`/api/flights?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to fetch flights');
            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError('An error occurred while searching for flights. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC'
            });
        } catch (e) {
            return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    };

    const formatDate = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleDateString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC'
            });
        } catch (e) {
            return new Date(isoString).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        }
    }

    return (
        <div className={styles.searchContainer}>
            <form onSubmit={handleSearch} className={styles.inputGroup}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter flight number (e.g., UA123)"
                    className={styles.input}
                    aria-label="Flight number"
                />
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.results}>
                {searched && !loading && results.length === 0 && !error && (
                    <div className={styles.error} style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.05)' }}>
                        No flights found matching "{query}"
                    </div>
                )}

                {results.map((flight) => (
                    <div key={flight.uniqueId} className={styles.flightCard}>
                        <div className={styles.header}>
                            <div className={styles.flightNumber}>
                                {flight.airline} <span style={{ opacity: 0.5 }}>{flight.flightNumber}</span>
                            </div>
                            <div className={`${styles.status} ${flight.status === 'On Time' ? styles.statusOnTime : styles.statusDelayed}`}>
                                {flight.status}
                            </div>
                        </div>

                        <div className={styles.route}>
                            <div className={styles.location} style={{ alignItems: 'flex-start' }}>
                                <div className={styles.code}>{flight.origin.code}</div>
                                <div className={styles.city}>{flight.origin.city}</div>
                                {(flight.origin.terminal || flight.origin.gate) && (
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '2px' }}>
                                        {flight.origin.terminal && `Term ${flight.origin.terminal}`}
                                        {flight.origin.terminal && flight.origin.gate && ' • '}
                                        {flight.origin.gate && `Gate ${flight.origin.gate}`}
                                    </div>
                                )}
                                <div className={styles.timeInfo}>
                                    <div>{formatDate(flight.origin.time)}</div>
                                    <div className={styles.time}>
                                        {formatTime(flight.origin.time)}
                                        <span className={styles.timezone}>{flight.origin.timezone.split('/')[1].replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.tripLine}></div>

                            <div className={styles.location} style={{ alignItems: 'flex-end', textAlign: 'right' }}>
                                <div className={styles.code}>{flight.destination.code}</div>
                                <div className={styles.city}>{flight.destination.city}</div>
                                {(flight.destination.terminal || flight.destination.gate) && (
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '2px' }}>
                                        {flight.destination.terminal && `Term ${flight.destination.terminal}`}
                                        {flight.destination.terminal && flight.destination.gate && ' • '}
                                        {flight.destination.gate && `Gate ${flight.destination.gate}`}
                                    </div>
                                )}
                                <div className={styles.timeInfo}>
                                    <div>{formatDate(flight.destination.time)}</div>
                                    <div className={styles.time}>
                                        {formatTime(flight.destination.time)}
                                        <span className={styles.timezone}>{flight.destination.timezone.split('/')[1].replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '1.5rem', opacity: 0.6, fontSize: '0.9rem' }}>
                            Duration: {flight.duration}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
