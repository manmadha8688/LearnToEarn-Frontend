export const DOTNET_GUIDE = [
  {
    phase: '01',
    title: 'Deploying ASP.NET Core for free — the honest setup',
    color: '#512BD4',
    steps: [
      {
        label: '.NET needs Docker on free hosts (just like Java)',
        isText: true,
        text: [
          'Most free hosts (Render, Koyeb) have no built-in .NET runtime — the',
          'same situation as Java/Spring Boot. The clean, reliable fix is to',
          'ship your app inside a Docker container. You write one Dockerfile and',
          'it runs anywhere.',
          '',
          'What this guide covers:',
          '→ Making ASP.NET Core listen on the host\'s PORT (Phase 02)',
          '→ A production Dockerfile (SDK build → slim runtime) (Phase 03)',
          '→ Deploying that container free on Render (Phase 04)',
          '→ A free database with EF Core (Phase 05)',
          '',
          'Works for a Web API, an MVC app, or Razor Pages — the deploy steps',
          'are identical.',
        ],
        note: 'Microsoft\'s own Azure has a free tier too (Azure App Service F1), but it is fiddly and quota-limited for students. A Docker container on Render/Koyeb is more predictable and portable, and the same image later runs on Azure, Fly.io, or Cloud Run unchanged.',
      },
      {
        label: 'Where it runs free (2026)',
        isText: true,
        text: [
          '✅ Render — Docker web service, free (sleeps ~15 min idle, 750',
          '   instance-hours/month).',
          '✅ Koyeb — Docker web service, free (sleeps ~1 hour idle, Frankfurt',
          '   or Washington D.C.).',
          '✅ Azure App Service F1 — free but limited (60 CPU-min/day quota).',
          '',
          'All free tiers sleep when idle, so the first request after a quiet',
          'spell is slow. Perfectly fine for demos, projects and portfolios.',
        ],
        note: 'For a graded project or a resume link, Render or Koyeb with Docker is the least painful path. Reach for Azure only if your assignment specifically requires the Microsoft cloud.',
      },
    ],
  },

  {
    phase: '02',
    title: 'Make ASP.NET Core read the PORT',
    color: '#512BD4',
    steps: [
      {
        label: 'Bind to the host-provided port in Program.cs',
        isFile: true,
        fileName: 'Program.cs',
        commands: [
          `var builder = WebApplication.CreateBuilder(args);

// ... your services (controllers, DbContext, etc.) ...

var app = builder.Build();

// Read the PORT the host injects; fall back to 8080 for local dev.
// "http://0.0.0.0:{port}" makes the app reachable from outside.
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Urls.Add($"http://0.0.0.0:{port}");

// ... your middleware and endpoints ...

app.Run();`,
        ],
        note: 'By default ASP.NET Core listens on port 5000/5001 or an ASPNETCORE_URLS value — neither matches the random $PORT a host assigns. Reading PORT and binding to 0.0.0.0 is the one change that makes the difference between "deploy succeeded" and "app never becomes live".',
      },
      {
        label: 'Alternative: use the ASPNETCORE_URLS env var',
        isText: true,
        text: [
          'If you would rather not touch code, you can set an environment',
          'variable on the host instead:',
          '',
          '→ ASPNETCORE_URLS = http://0.0.0.0:10000',
          '   then tell the host your app listens on port 10000',
          '',
          'The Program.cs approach (previous step) is more robust because it',
          'follows whatever $PORT the host picks automatically. Pick one — do',
          'not do both, or they can conflict.',
        ],
        note: 'Render assigns a $PORT dynamically, so the code-based approach (reading Environment.GetEnvironmentVariable("PORT")) is the safest. Use the ASPNETCORE_URLS variable only if you set a fixed port and configure the host to match it.',
      },
    ],
  },

  {
    phase: '03',
    title: 'Write the Dockerfile',
    color: '#2496ED',
    steps: [
      {
        label: 'A multi-stage Dockerfile (SDK build → slim runtime)',
        isFile: true,
        fileName: 'Dockerfile',
        commands: [
          `# ---- build stage: full SDK to compile & publish ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app

# ---- run stage: small ASP.NET runtime only ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
# Start the app (replace YourApp.dll with your project's output name)
ENTRYPOINT ["dotnet", "YourApp.dll"]`,
        ],
        note: 'The two-stage build keeps the final image small: the heavy SDK (~800 MB) only exists in the build stage; the runtime image ships just the aspnet runtime plus your compiled app. Replace YourApp.dll with your actual assembly name (it matches your .csproj / project name).',
      },
      {
        label: 'Add a .dockerignore so the image stays clean',
        isFile: true,
        fileName: '.dockerignore',
        commands: [
          `bin/
obj/
.vs/
.git/
*.user`,
        ],
        note: 'Without a .dockerignore, Docker copies your local bin/ and obj/ folders into the build context — that can carry stale artifacts and slow the build. Ignoring them forces a clean compile inside the container every time.',
      },
    ],
  },

  {
    phase: '04',
    title: 'Deploy the container on Render',
    color: '#22C55E',
    steps: [
      {
        label: 'Create the web service',
        isText: true,
        text: [
          '1. Push your project (with the Dockerfile) to a GitHub repo',
          '2. render.com → New + → "Web Service" → connect the repo',
          '3. Render sees the Dockerfile → Runtime: Docker, Instance: Free',
          '4. Add environment variables:',
          '      ASPNETCORE_ENVIRONMENT = Production',
          '      (plus any secrets / connection strings)',
          '5. Create the service → watch the build logs',
          '6. Live at https://your-app.onrender.com',
        ],
        note: 'The first Docker build takes a few minutes (restoring NuGet packages and publishing). Subsequent deploys are faster thanks to layer caching. If the build succeeds but the service never goes live, it is the port — re-check Phase 02.',
      },
      {
        label: 'Koyeb works with the same Dockerfile',
        isText: true,
        text: [
          '→ Koyeb → Create Web Service → GitHub → Dockerfile builder',
          '→ Instance: Free (Frankfurt or Washington D.C.)',
          '→ Add the same env vars → Deploy',
          '',
          'Koyeb waits ~1 hour before sleeping vs Render\'s ~15 minutes, so a',
          'shared demo stays warm a little longer. The container is identical.',
        ],
        note: 'Because your app is now a container, you are not tied to one host. The same image runs on Render, Koyeb, Azure, or Cloud Run — if a free tier changes, you move with essentially no rework.',
      },
    ],
  },

  {
    phase: '05',
    title: 'Add a free database with EF Core',
    color: '#F59E0B',
    steps: [
      {
        label: 'Use Neon Postgres (free, kept forever)',
        isText: true,
        text: [
          'Render\'s free Postgres expires in 30 days, so use Neon for data you',
          'want to keep. EF Core supports Postgres via the Npgsql provider.',
          '',
          '1. Create a free Neon project → copy its connection string',
          '2. Add the provider package:',
          '      dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL',
          '3. Register it in Program.cs:',
          '      builder.Services.AddDbContext<AppDbContext>(o =>',
          '        o.UseNpgsql(Environment.GetEnvironmentVariable("DATABASE_URL")));',
          '4. Set DATABASE_URL as an env var on Render (never in code)',
          '5. Apply migrations on startup or via dotnet ef database update',
        ],
        note: 'Neon gives a standard Postgres connection string; Npgsql accepts the "Host=...;Database=...;Username=...;Password=...;SSL Mode=Require" form. Keep the value in the DATABASE_URL environment variable so the same code runs locally and in production with different databases.',
      },
      {
        label: 'Run migrations against the live database',
        isText: true,
        text: [
          'Two common ways to get your tables onto the live DB:',
          '',
          '→ Automatic on boot — call db.Database.Migrate() at startup so the',
          '  app applies pending migrations when it launches. Simplest for a',
          '  student project.',
          '→ Manual — point the EF CLI at the production connection string once:',
          '      dotnet ef database update',
          '',
          'For a solo project, migrate-on-boot is the least hassle; just be',
          'aware every instance will try it, so keep migrations idempotent.',
        ],
        note: 'Remember the free filesystem is ephemeral — never rely on a local SQLite file for real data on Render/Koyeb, because it is wiped on redeploy. A managed database (Neon/Aiven) is the only durable option on free hosting.',
      },
    ],
  },
]
