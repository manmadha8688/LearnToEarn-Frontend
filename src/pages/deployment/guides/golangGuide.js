export const GOLANG_GUIDE = [
  {
    phase: '01',
    title: 'Why Go is the easiest backend to deploy',
    color: '#00ADD8',
    steps: [
      {
        label: 'Go compiles to ONE file — that changes everything',
        isText: true,
        text: [
          'A Go program builds into a single self-contained binary. No runtime to',
          'install on the server, no node_modules, no virtualenv — just one file',
          'that runs. That makes Go one of the simplest things to host free.',
          '',
          'Two easy free paths (both covered here):',
          '→ From source — Render and Koyeb detect Go from your go.mod and build',
          '  it for you. No Docker needed. (Phase 03)',
          '→ From Docker — a tiny multi-stage image (a few MB). Runs anywhere,',
          '  the same everywhere. (Phase 04)',
          '',
          'Good for: a Go REST API (net/http, Gin, Fiber, Echo, chi) that you',
          'want live for free. Pair it with a free database (Neon, Turso, Atlas).',
        ],
        note: 'Because a Go build is a single static binary, the Docker image can be almost empty (scratch or distroless) — often under 20 MB. That is why Go deploys fast and cheap even on the smallest free instances.',
      },
      {
        label: 'Where it runs free (2026)',
        isText: true,
        text: [
          '✅ Render — native Go support, build from go.mod. Free web service',
          '   sleeps after ~15 min idle; 750 free instance-hours/month.',
          '✅ Koyeb — Go buildpack or Docker. Free service sleeps after ~1 hour',
          '   idle (Frankfurt or Washington D.C. region).',
          '✅ Fly.io / Cloud Run — also run Go containers (card required).',
          '',
          'All free backends sleep when idle → the first request after a quiet',
          'period is slow (cold start). Fine for demos and portfolios.',
        ],
        note: 'Render vs Koyeb for Go: Render has more tutorials and a shorter setup; Koyeb waits longer before sleeping. Both are genuinely free for one small service — a good move is to use one for each project rather than crowding two apps onto one free slot.',
      },
    ],
  },

  {
    phase: '02',
    title: 'Prepare your Go app for hosting',
    color: '#00ADD8',
    steps: [
      {
        label: 'Read the PORT env var and bind to 0.0.0.0',
        isFile: true,
        fileName: 'main.go',
        commands: [
          `package main

import (
    "fmt"
    "net/http"
    "os"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "Hello from Go!")
    })

    // The host injects PORT — read it, fall back for local dev.
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    // ":" + port binds to 0.0.0.0 (all interfaces), which the host needs.
    fmt.Println("listening on :" + port)
    http.ListenAndServe(":"+port, nil)
}`,
        ],
        note: 'This one detail decides whether your deploy goes live: read the PORT env var and bind to ":"+port (all interfaces), never a hard-coded port or 127.0.0.1. Binding to localhost inside a cloud host makes your app unreachable and the health check fails.',
      },
      {
        label: 'Make sure you have a go.mod',
        isText: true,
        text: [
          'Hosts detect a Go project by its go.mod file. If you do not have one:',
          '',
          '1. In your project folder run:',
          '      go mod init github.com/yourname/yourapp',
          '2. Add any dependencies (they get recorded automatically):',
          '      go get github.com/gin-gonic/gin   # example',
          '3. Tidy it up before pushing:',
          '      go mod tidy',
          '4. Commit go.mod AND go.sum, then push to GitHub.',
        ],
        note: 'go.sum locks the exact versions of your dependencies — commit it alongside go.mod. Without go.sum the host may fail to reproduce your build. "go mod tidy" adds anything missing and removes what you no longer use.',
      },
    ],
  },

  {
    phase: '03',
    title: 'Deploy from source on Render (no Docker)',
    color: '#22C55E',
    steps: [
      {
        label: 'Create the web service',
        isText: true,
        text: [
          '1. Push your project (with go.mod) to a GitHub repo',
          '2. render.com → New + → "Web Service" → connect the repo',
          '3. Render detects Go. Confirm the commands:',
          '   → Build command:  go build -o app',
          '   → Start command:  ./app',
          '4. Instance type: Free',
          '5. Add environment variables if your app needs them',
          '   (DATABASE_URL, API keys, etc.)',
          '6. Create the service → watch the build → you get a live',
          '   https://your-app.onrender.com URL',
        ],
        note: 'The build command compiles your code into a binary called "app"; the start command runs it. If your main package is in a subfolder, adjust the build command (e.g. go build -o app ./cmd/server) to point at it.',
      },
      {
        label: 'If the build fails, check these first',
        isText: true,
        text: [
          '→ "no Go files in ..." — your main package is in a subdirectory. Set',
          '  the build command to target it: go build -o app ./cmd/api',
          '→ "cannot find module" — go.sum is missing or stale. Run',
          '  go mod tidy locally, commit go.sum, push again.',
          '→ Builds fine but never becomes live — you did not read $PORT, or you',
          '  bound to 127.0.0.1. Fix main.go (Phase 02) and redeploy.',
        ],
        note: 'A Go deploy that "builds but never goes healthy" is almost always the port. Confirm os.Getenv("PORT") and http.ListenAndServe(":"+port, ...) — the host waits for your app to listen on its assigned port before marking the service live.',
      },
    ],
  },

  {
    phase: '04',
    title: 'Deploy with Docker (tiny image, runs anywhere)',
    color: '#2496ED',
    steps: [
      {
        label: 'A multi-stage Dockerfile for a Go binary',
        isFile: true,
        fileName: 'Dockerfile',
        commands: [
          `# ---- build stage: compile the binary ----
FROM golang:1.23-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# CGO off => a fully static binary that runs on a bare image
RUN CGO_ENABLED=0 go build -o /app .

# ---- run stage: almost-empty final image ----
FROM gcr.io/distroless/static-debian12
COPY --from=build /app /app
EXPOSE 8080
CMD ["/app"]`,
        ],
        note: 'The magic is the second stage: because the Go binary is static (CGO_ENABLED=0), the final image needs no OS, no Go toolchain — just the binary on a distroless base. The result is a tiny image (often <20 MB) that starts almost instantly.',
      },
      {
        label: 'Ship it to Render or Koyeb',
        isText: true,
        text: [
          'Render (Docker):',
          '→ New + → Web Service → repo → Runtime auto-detects Docker',
          '→ Instance: Free → add env vars → Create',
          '',
          'Koyeb (Docker):',
          '→ Create Web Service → GitHub → Dockerfile builder',
          '→ Instance: Free (Frankfurt / Washington D.C.) → env vars → Deploy',
          '',
          'Your app still reads $PORT (Phase 02) — the same binary works on',
          'either host with no code changes.',
        ],
        note: 'Source deploy (Phase 03) is the least effort; Docker (this phase) gives you an identical, portable image and control over the Go version and base. For a simple API, start with source; reach for Docker when you need reproducibility or system libraries.',
      },
    ],
  },

  {
    phase: '05',
    title: 'Connect a free database & secrets',
    color: '#F59E0B',
    steps: [
      {
        label: 'Pick a free database and wire it in',
        isText: true,
        text: [
          'Host the app on Render/Koyeb, keep DATA in a dedicated free database:',
          '',
          '→ Neon (Postgres) — 0.5 GB/project, kept forever. Use the pgx or',
          '  database/sql driver. Great default for Go APIs.',
          '→ Turso (SQLite/libSQL) — 5 GB, no cold starts, edge-fast.',
          '→ MongoDB Atlas — 512 MB free forever, official Go driver.',
          '',
          'Set the connection string as an environment variable on the host',
          '(e.g. DATABASE_URL) and read it in Go with os.Getenv("DATABASE_URL").',
          'Never hard-code credentials in your source.',
        ],
        note: 'Render\'s free Postgres expires after 30 days — for anything you want to keep, use Neon or Turso instead and just point DATABASE_URL at it. The app does not care where the database lives, only what the connection string says.',
      },
    ],
  },
]
