# aquilini.ch

## Local preview

### Requirements

- PowerShell.
- Docker Desktop running with Linux containers and Docker Compose v2 available
  through `docker compose` (including support for `up --wait`).
- Internet access on the first run to download the nginx image.

### Start the preview

Open PowerShell in the repository directory and run:

```powershell
.\preview.ps1
```

The script starts nginx and prints the preview links after verifying that it responds:

- [Homepage](http://localhost:8080/)
- [Resume](http://localhost:8080/resume.html)

The first run downloads the nginx image. Local edits appear after refreshing the
browser; no rebuild is needed. Only website files are mounted, read-only, and the
server is bound to the local machine.

The container runs in the background, so closing the terminal does not stop it.
This is a local preview only; it does not publish the website.

### Use another port

```powershell
.\preview.ps1 -Port 8081
```

Open the URLs printed by the script, for example `http://localhost:8081/`.
Running the script again reuses the preview service. Changing the port recreates it;
it does not start a second preview. Omitting `-Port` switches back to port 8080.

### Stop the preview

```powershell
.\preview.ps1 -Stop
```

This removes the preview container and its Compose network. Your files and the
downloaded nginx image are retained. You do not need to specify a custom port when
stopping.

### Run from another directory

Invoke the script by its full path; it locates `compose.yaml` relative to itself:

```powershell
& 'D:\source\aquilini-ch\preview.ps1'
```

### Troubleshooting

- **Docker cannot be reached:** start Docker Desktop, wait for its engine to be
  ready, and check that it is using Linux containers.
- **Port already in use:** choose another port with `-Port`.
- **Changes are not visible:** refresh the page, or use a hard refresh to reload
  cached CSS and images. There is no automatic browser reload.
- **localhost does not respond:** try `http://127.0.0.1:8080/`, using your selected
  port if different.

To inspect nginx logs, run this from the repository directory:

```powershell
docker compose --project-name aquilini-ch-preview --file compose.yaml logs --tail 100 preview
```

Only the HTML files and asset directories listed in `compose.yaml` are served. If
you add another top-level page or asset directory, add its read-only mount there
and rerun the preview script.
