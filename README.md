# ✈️ Funcode Flight Tracker

Yo! Welcome to the **Funcode Flight Tracker**. This is a sleek, real-time flight tracking app built with the latest web tech. It allows users to punch in a flight number and get instant details—perfect for checking if your flight is delayed or just to see where planes are going.

## 🚀 Features

-   **Flight Lookup**: Enter an IATA flight code (like `UA123`) to get the deets.
-   **Real-time Status**: See if it's scheduled, active, landed, or cancelled.
-   **Detailed Info**:
    -   Airline & Flight Number
    -   Origin & Destination (City, Time, Terminal, Gate)
    -   Duration Calculation
-   **Responsive Design**: Looks good on desktop and mobile.
-   **Modern UI**: Glassmorphism touches and smooth interactions.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: CSS Modules (Vanilla CSS for that fine-grained control)
-   **API**: [Aviationstack API](https://aviationstack.com/)
-   **State Management**: React Hooks

## 🏁 Getting Started

Get this thing running locally in no time.

1.  **Clone the repo**
    ```bash
    git clone https://github.com/yourusername/flight_tracker.git
    cd flight_tracker
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or yarn, pnpm, bun
    ```

3.  **Environment Setup**
    You need an API key from [Aviationstack](https://aviationstack.com/).
    Create a `.env.local` file in the root:
    ```env
    AVIATIONSTACK_API_KEY=your_api_key_here
    ```

4.  **Run it**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) and start tracking!

## ⚠️ Notes

-   The app uses the **free tier** of Aviationstack, which only supports HTTP (not HTTPS) for the API endpoint. The request is proxied through the Next.js API route (`/api/flights`), so the frontend remains secure.
-   If you don't have an API key, the app won't fetch real data.

## 🤝 Contributing

Feel free to open a PR if you want to add map visualization or historical data.

---

*Built with ❤️ by Funcode AI*
