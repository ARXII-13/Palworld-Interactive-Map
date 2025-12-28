# 🗺️ Palworld Interactive Map

An interactive **Palworld world map** with marker progress tracking and **Windows desktop support via Electron**.

Users can:

- Explore the Palworld map
- View and filter map markers
- Mark discovered locations
- Track marker progress
- Run the app in:
    - Browser (web): `http://localhost:8013/`
    - Desktop app (Electron, Windows)
    - Mobile device via LAN: `http://{your_desktop_private_ip}:8013/`  
      _(when the desktop app is running)_

---

## 🧩 Project Architecture

This project is organized as a **monorepo-style setup** with two main parts:

### Data Mining

```text
pal-data-mining/
├── src/        # Scripts to data-mine Palworld Unreal Engine files
└── output/     # Extracted Palworld marker data (JSON)
```

### Application

```text
pal-map/
├── frontend/   # Vue 3 app (UI + interactive map)
├── backend/    # Node.js + Express API (SQLite persistence)
├── electron/   # Electron wrapper (desktop app)
└── data/       # SQLite database (dev / local only)
```

> 📦 **Electron persistent data location (Windows):**  
> `C:\Users\{username}\AppData\Roaming\palmap-desktop\`

---

## 🚀 Features

- 🗺️ Interactive Palworld world map
- 📍 Custom markers with discovery status
- ✅ Visual indicators for discovered locations
- 🔍 Marker filters by:
    - Marker type
    - Discovery status
- 💾 Persistent progress storage using SQLite
- 🖥️ Works in both browser and Electron desktop app
- 📱 Mobile-friendly via LAN access while desktop app is running
- 🧠 Safe migration path for future versions

> 💡 Personal use case:  
> I often keep the map open on a mobile device while gaming on my desktop to manage progress without alt-tabbing.

---

## 🛠️ Tech Stack

### Frontend

- Vue 3
- TypeScript
- Leaflet

### Backend

- Node.js **20.x**
- Express
- better-sqlite3

### Desktop

- Electron

---

## 🛠️ Development

### The Map asset data mining script

Please refer to `pal-data-mining/README.md`

### Local / Web Development

1. Start the backend:

    ```bash
    cd pal-map/backend
    npm run dev
    ```

2. Start the frontend:

    ```bash
    cd pal-map/frontend
    npm run dev
    ```

3. Open the app:
    ```text
    http://localhost:5173/
    ```

---

### Electron Desktop App (Windows)

1. Build the backend:

    ```bash
    cd pal-map/backend
    npm run build
    ```

2. Build the frontend:

    ```basha
    cd pal-map/frontend
    npm run build
    ```

3. Build the Electron app:

    ```bash
    cd pal-map/electron
    npm run build
    ```

4. Output location:
    ```text
    pal-map/dist/win-unpacked/
    ```

---

## 🙌 Credits

- **Palworld** © Pocketpair
- **FModel** – Unreal Engine asset unpacking  
  https://github.com/4sval/FModel
