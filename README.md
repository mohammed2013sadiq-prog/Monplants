# MoPlants

MoPlants is an indoor garden and botanical companion mobile application with an Express & PostgreSQL backend.

## 🐳 Running with Docker (Recommended)

You do **not** need to install or configure PostgreSQL on your host machine. Docker will manage both the PostgreSQL database and the Node.js backend automatically.

### Start the containers:
```bash
docker compose up -d
```

### Check status:
```bash
docker compose ps
docker logs -f moplants-backend
```

### Stop the containers:
```bash
docker compose down
```

---

## 📱 Running the Mobile App (Expo)

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Start the Expo development server:
   ```bash
   npm start
   ```

3. Scan the QR code using **Expo Go** on Android or iOS.
   - The app dynamically detects your computer's local IP address (or uses `http://192.168.1.79:3000/api`) so it connects directly to the Docker backend.

---

## 🔐 Authentication & Database

- **Demo Account**:
  - **Email**: `demo@moplants.app`
  - **Password**: `password123`
- **New Registrations**:
  - All new users created on the register screen are saved directly into the PostgreSQL database running inside the `moplants-postgres` Docker container.
