export const PHP_GUIDE = [
  {
    phase: '01',
    title: 'Two kinds of PHP project — pick your path first',
    color: '#777BB4',
    steps: [
      {
        label: 'Plain PHP + MySQL vs Laravel — they deploy very differently',
        isText: true,
        text: [
          'PHP projects split into two groups, and each has a different free host.',
          'Figure out which one you have before you do anything else.',
          '',
          '1) Plain PHP + MySQL (the classic college project):',
          '→ Loose .php files, mysqli or PDO, a phpMyAdmin database',
          '→ No Composer, no framework, you just upload the files',
          '→ Best free host: InfinityFree (upload + phpMyAdmin) — Phase 02',
          '',
          '2) Laravel (or any Composer-based framework):',
          '→ Needs composer install, an APP_KEY, and php artisan migrate',
          '→ Free shared hosts (InfinityFree) have NO SSH and NO Composer,',
          '  so Laravel does not deploy cleanly there',
          '→ Best free host: Render or Koyeb using Docker — Phase 04',
          '',
          'If you are not sure: is there a composer.json and an artisan file in',
          'your project root? That is Laravel → use the Docker path.',
        ],
        note: 'The single most common mistake is trying to force Laravel onto a free FTP host like InfinityFree. It has no Composer and no command line, so migrations and the vendor/ folder become a nightmare. Plain PHP → InfinityFree; Laravel → Render/Koyeb with Docker.',
      },
      {
        label: 'Honest 2026 hosting map — what still exists',
        isText: true,
        text: [
          'Free PHP hosting changed a lot recently. The truth for 2026:',
          '',
          '🚫 000webhost — SHUT DOWN in October 2024. Do not use it.',
          '🚫 Hostinger free plan — discontinued in early 2024.',
          '   (Old tutorials still recommend both — ignore them.)',
          '',
          '✅ InfinityFree — still the best truly-free plain PHP + MySQL host',
          '   5 GB storage, PHP 8.3, MySQL + phpMyAdmin, free SSL, free',
          '   subdomain. No SSH, no Composer, throttled under heavy traffic.',
          '✅ Render / Koyeb (Docker) — the right home for Laravel and any',
          '   app that needs Composer. Free web service, sleeps when idle.',
          '💰 A $3–5/month shared host or VPS (Hostinger, etc.) — the honest',
          '   upgrade once a project has real users.',
        ],
        note: 'Free shared hosting from a company that mainly sells paid plans can be switched off at any time (that is exactly what happened to 000webhost). For a graded submission or a portfolio link you want to keep, prefer InfinityFree (independent, free is their product) or a Docker deploy you fully control.',
      },
    ],
  },

  {
    phase: '02',
    title: 'Plain PHP + MySQL → deploy free on InfinityFree',
    color: '#22C55E',
    steps: [
      {
        label: 'Create the account and the MySQL database',
        isText: true,
        text: [
          '1. Sign up at infinityfree.com (no credit card, no payment)',
          '2. Create a free account → you get a subdomain like',
          '   yourname.infinityfreeapp.com (or connect your own domain later)',
          '3. In the control panel open "MySQL Databases"',
          '4. Create a database — note the FOUR values it shows you:',
          '   → DB host  (e.g. sqlXXX.infinityfree.com — NOT localhost)',
          '   → DB name  (e.g. if0_12345678_mydb)',
          '   → DB user  (e.g. if0_12345678)',
          '   → DB password (the one you set)',
          '5. Open phpMyAdmin from the panel and import your .sql dump',
          '   (Export it locally first: phpMyAdmin → Export → SQL)',
        ],
        note: 'The #1 thing students get wrong: the database host is NOT "localhost" on shared hosting. Copy the exact sqlXXX.infinityfree.com host shown in the panel. Using "localhost" is the most common reason a deployed PHP site shows "connection refused".',
      },
      {
        label: 'Point your PHP at the live database',
        isFile: true,
        fileName: 'db.php',
        commands: [
          `<?php
// Use the EXACT values from the InfinityFree MySQL panel.
// Do NOT use "localhost" on shared hosting.
$host = "sqlXXX.infinityfree.com";
$user = "if0_12345678";
$pass = "your_db_password";
$name = "if0_12345678_mydb";

$conn = new mysqli($host, $user, $pass, $name);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>`,
        ],
        note: 'Keep every database call going through one include file (db.php) so you only change credentials in one place when you move between local and live. Locally your host is "localhost"; on InfinityFree it is the sqlXXX host — that one line is usually the only difference.',
      },
      {
        label: 'Upload your files with the File Manager or FTP',
        isText: true,
        text: [
          'Your website files must live inside the htdocs folder.',
          '',
          'Easiest — the online File Manager:',
          '1. Control panel → "Online File Manager"',
          '2. Open the htdocs folder (delete the default index2.html)',
          '3. Upload all your .php, .css, .js and asset files there',
          '',
          'Or with FTP (FileZilla) for bigger projects:',
          '→ Host / user / password are under "FTP Accounts" in the panel',
          '→ Connect, then drag your project INTO htdocs',
          '',
          'Visit https://yourname.infinityfreeapp.com — your site is live.',
          'Free SSL (the https padlock) can take a few minutes to activate.',
        ],
        note: 'Only what is inside htdocs is served to the web. If you upload your project as a subfolder (htdocs/myproject/index.php), your URL becomes .../myproject/ — either upload files directly into htdocs, or expect the subfolder in the address.',
      },
    ],
  },

  {
    phase: '03',
    title: 'Common plain-PHP problems (and the fixes)',
    color: '#F59E0B',
    steps: [
      {
        label: 'The three errors almost everyone hits',
        isText: true,
        text: [
          '⚠️  "Connection refused" / "Access denied for user":',
          '   → You used localhost, or copied the DB host/user wrong. Paste the',
          '     exact values from the MySQL panel. The user/db name start with',
          '     if0_ on InfinityFree.',
          '',
          '⚠️  Blank white page (nothing shows):',
          '   → A PHP error is happening but errors are hidden. Add these two',
          '     lines to the TOP of the page while debugging, then remove them:',
          '        error_reporting(E_ALL);',
          '        ini_set("display_errors", 1);',
          '',
          '⚠️  Images / CSS work locally but 404 on the live site:',
          '   → Linux hosting is case-sensitive. Style.css and style.css are',
          '     different files. Match the exact case in your <link> and <img>.',
        ],
        note: 'Case-sensitivity is the sneakiest one: Windows and most Mac setups ignore case, but the Linux server does not. If an asset loads locally but 404s live, check the capitalisation of the filename against the path in your HTML.',
      },
      {
        label: 'Know the free-tier limits before you rely on it',
        isText: true,
        text: [
          'InfinityFree is genuinely free, but it is shared hosting:',
          '',
          '→ CPU / I/O is throttled — a burst of traffic can slow or pause you',
          '→ ~50,000 hits/day fair-use cap; fine for a demo, not a busy app',
          '→ No SSH and no Composer (that is why Laravel needs Docker instead)',
          '→ No email sending, no background workers or cron on free',
          '→ An inode (file-count) limit — do not dump huge node_modules-style',
          '  folders of tiny files onto it',
          '',
          'For a project you share with an examiner or on a resume, this is',
          'perfectly fine. For an app with real, constant users, budget for a',
          '$3–5/month shared host.',
        ],
        note: 'InfinityFree is ideal for "here is my working project, click the link" — coursework, demos, portfolios. It is not built for production traffic. Set expectations accordingly and you will not be surprised by throttling.',
      },
    ],
  },

  {
    phase: '04',
    title: 'Laravel → prepare the app for a Docker deploy',
    color: '#EF4444',
    steps: [
      {
        label: 'Why Laravel needs Render/Koyeb + Docker, not shared hosting',
        isText: true,
        text: [
          'Laravel expects a real environment: Composer to install vendor/, a',
          'command line for php artisan migrate, and env-based config. Free',
          'shared hosts give you none of those cleanly.',
          '',
          'The reliable free path is a container:',
          '→ You write a Dockerfile once (next step)',
          '→ Render or Koyeb builds it, runs composer install, and serves it',
          '→ Your data goes in a free managed database (Neon Postgres or Aiven',
          '  MySQL) — Laravel supports both out of the box',
        ],
        note: 'Render has no free MySQL and its free Postgres expires in 30 days, so for Laravel put the database in Neon (Postgres, kept forever) or Aiven (free MySQL). Laravel only needs DB_CONNECTION=pgsql vs mysql plus the connection details — the code stays the same.',
      },
      {
        label: 'Set up .env and generate an app key',
        isText: true,
        text: [
          'Before deploying, get the config right:',
          '',
          '1. Never commit your real .env — it holds secrets. Commit .env.example',
          '2. Generate an app key locally and copy the value:',
          '      php artisan key:generate --show',
          '   You will set this as the APP_KEY env var on the host.',
          '3. Decide your database. For Neon (Postgres) your env will be:',
          '      DB_CONNECTION=pgsql',
          '      DB_HOST / DB_PORT / DB_DATABASE / DB_USERNAME / DB_PASSWORD',
          '   (Aiven MySQL is the same idea with DB_CONNECTION=mysql.)',
          '4. Set APP_ENV=production and APP_DEBUG=false for the live site.',
        ],
        note: 'APP_KEY is required — Laravel throws "No application encryption key" without it. Generate it once with --show, then paste the value into the host\'s environment variables (not into git). Turn APP_DEBUG off in production so errors do not leak stack traces to visitors.',
      },
    ],
  },

  {
    phase: '05',
    title: 'Laravel → the Dockerfile and deploy on Render',
    color: '#2496ED',
    steps: [
      {
        label: 'Add a Dockerfile to your Laravel project root',
        isFile: true,
        fileName: 'Dockerfile',
        commands: [
          `# PHP + Apache image that already knows how to serve Laravel
FROM php:8.3-apache

# Laravel needs these PHP extensions (pdo_pgsql for Neon Postgres)
RUN apt-get update && apt-get install -y \\
    libpq-dev libzip-dev zip unzip git \\
 && docker-php-ext-install pdo pdo_pgsql zip

# Enable .htaccess rewrites and point Apache at Laravel's /public
RUN a2enmod rewrite
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!\${APACHE_DOCUMENT_ROOT}!g' \\
    /etc/apache2/sites-available/*.conf /etc/apache2/apache2.conf

WORKDIR /var/www/html
COPY . .

# Install Composer, then install PHP deps (no dev packages in prod)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Laravel must be able to write to storage + cache
RUN chown -R www-data:www-data storage bootstrap/cache

# Apache serves on the port Render provides via $PORT
CMD sed -i "s/80/\${PORT}/g" /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf \\
    && php artisan migrate --force \\
    && apache2-foreground`,
        ],
        note: 'Two Laravel-specific gotchas are handled here: the document root points at /public (never expose the project root), and mod_rewrite is enabled so Laravel\'s pretty URLs work. The CMD rewrites Apache to listen on Render\'s $PORT and runs migrations on boot with --force (required in production).',
      },
      {
        label: 'Create the Render web service',
        isText: true,
        text: [
          '1. Push the project (with the Dockerfile) to GitHub',
          '2. render.com → New + → "Web Service" → connect the repo',
          '3. Render detects the Dockerfile → Runtime: Docker, Instance: Free',
          '4. Add environment variables (from Phase 04):',
          '      APP_KEY, APP_ENV=production, APP_DEBUG=false',
          '      DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE,',
          '      DB_USERNAME, DB_PASSWORD  (from Neon/Aiven)',
          '5. Create the service → watch the build and migrate logs',
          '6. You get a live https://your-app.onrender.com URL',
        ],
        note: 'Set APP_URL to your final onrender.com URL too, so generated links and assets point at the right host. If the build succeeds but the first request errors, open the Render logs — a missing DB_* value or APP_KEY is the usual cause.',
      },
      {
        label: 'Koyeb is the same idea with a longer idle window',
        isText: true,
        text: [
          'Everything above works on Koyeb too — same Dockerfile:',
          '',
          '→ Koyeb → Create Web Service → GitHub → Dockerfile builder',
          '→ Instance: Free (Frankfurt or Washington D.C.)',
          '→ Add the same env vars, deploy',
          '',
          'Difference vs Render: Koyeb free sleeps after ~1 hour idle (Render',
          'after ~15 min), so demos stay warm a bit longer. Both cold-start on',
          'the first request after sleeping.',
        ],
        note: 'Having the app in a Dockerfile means you are not locked to one host — the exact same container runs on Render or Koyeb. If one changes its free tier, you move with almost no changes.',
      },
    ],
  },

  {
    phase: '06',
    title: 'Reality check & keeping it alive',
    color: '#8B5CF6',
    steps: [
      {
        label: 'File uploads and cold starts on free hosts',
        isText: true,
        text: [
          'Two things to plan for on any free container host (Render/Koyeb):',
          '',
          '⚠️  The filesystem is EPHEMERAL — files your app saves (user uploads,',
          '   generated PDFs) are WIPED on every redeploy or restart. Store',
          '   uploads in a service instead:',
          '   → Cloudinary (25 GB free) for images/media',
          '   → Any S3-compatible bucket for general files',
          '',
          '⚠️  Free services SLEEP when idle → the first visit after a quiet',
          '   period takes several seconds to wake. Normal for free tiers.',
          '   You can ping the URL every few minutes with cron-job.org to',
          '   reduce it — use sparingly.',
        ],
        note: 'The ephemeral filesystem surprises a lot of Laravel students: storage/app/public survives locally but not across a Render redeploy. If your project accepts uploads, wire them to Cloudinary or an S3 bucket from day one rather than the local disk.',
      },
      {
        label: 'Quick decision recap',
        isText: true,
        text: [
          'Plain PHP + MySQL, just need a live link:',
          '→ InfinityFree. Upload to htdocs, DB via phpMyAdmin. Done.',
          '',
          'Laravel / Composer app:',
          '→ Render or Koyeb with the Dockerfile above',
          '→ Database in Neon (Postgres) or Aiven (MySQL)',
          '→ Uploads in Cloudinary, secrets in env vars',
          '',
          'Real users, needs to be fast and always-on:',
          '→ Budget $3–5/month for a shared host or small VPS.',
        ],
        note: 'Match the host to the project: a graded demo does not need a paid server, and a real product should not run on throttled free shared hosting. Knowing which one you have keeps you from fighting the wrong platform.',
      },
    ],
  },
]
