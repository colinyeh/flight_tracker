
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query'); // Keep 'query' to match frontend for now

    if (!query) {
        return NextResponse.json([]);
    }

    const apiKey = process.env.AVIATIONSTACK_API_KEY;

    if (!apiKey) {
        console.error('API key missing');
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        // Aviationstack expects 'flight_iata' for flight number like 'UA123'
        const response = await fetch(
            `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${query}`,
            { cache: 'no-store' }
        );

        if (!response.ok) {
            // Handle non-200 responses
            return NextResponse.json([], { status: response.status });
        }

        const data = await response.json();

        // Transform to Flight interface
        // Interface: { flightNumber, airline, origin: {code, city, time, timezone}, destination: {code, city, time, timezone}, duration, status }

        const flights = (data.data || []).map((item: any, index: number) => {
            const depTime = new Date(item.departure.scheduled);
            const arrTime = new Date(item.arrival.scheduled);
            const durationMs = arrTime.getTime() - depTime.getTime();
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            const duration = `${hours}h ${minutes}m`;

            return {
                flightNumber: item.flight.iata,
                airline: item.airline.name,
                origin: {
                    code: item.departure.iata,
                    city: item.departure.airport, // Using airport name as city proxy for now
                    time: item.departure.scheduled,
                    timezone: item.departure.timezone,
                    terminal: item.departure.terminal,
                    gate: item.departure.gate,
                },
                destination: {
                    code: item.arrival.iata,
                    city: item.arrival.airport,
                    time: item.arrival.scheduled,
                    timezone: item.arrival.timezone,
                    terminal: item.arrival.terminal,
                    gate: item.arrival.gate,
                },
                duration: duration,
                status: item.flight_status.charAt(0).toUpperCase() + item.flight_status.slice(1),
                uniqueId: `${item.flight.iata}-${item.departure.scheduled}-${index}`,
            };
        });

        return NextResponse.json(flights);

    } catch (error) {
        console.error('Flight lookup error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch flight data' },
            { status: 500 }
        );
    }
}
