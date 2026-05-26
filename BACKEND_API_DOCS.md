# StreetLightITB Backend API Documentation

Dokumentasi REST API untuk backend FastAPI + PostgreSQL + Firebase Realtime Database.

## Ringkasan Arsitektur

- PostgreSQL adalah sumber utama untuk user, role, telemetry history, reports, maintenance logs, dan insight.
- Autentikasi memakai email/password di PostgreSQL dan token JWT dari backend.
- Firebase Realtime Database hanya dipakai backend untuk membaca data IoT dari path `node_registry`, `node_state`, dan `telemetry_logs`, serta menulis command override ke path `node_state/{node_id}`.
- Frontend mengirim JWT backend melalui header `Authorization`.

## Autentikasi

Endpoint selain login membutuhkan JWT:

```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

Default admin dibuat saat startup jika belum ada:

```text
Email: admin@itb.ac.id
Password: Admin@12345
Role: ADMIN
```

Ubah nilai ini melalui `.env` untuk environment selain development:

```env
DEFAULT_ADMIN_EMAIL=admin@itb.ac.id
DEFAULT_ADMIN_PASSWORD=Admin@12345
DEFAULT_ADMIN_DISPLAY_NAME=Default Admin
JWT_SECRET_KEY=change-this-dev-secret
JWT_EXPIRE_MINUTES=480
```

### RBAC

- `ADMIN`: akses endpoint admin, override, dan maintenance.
- `MAHASISWA`: akses read/report endpoint non-admin.

Role diambil dari kolom `users.role` di PostgreSQL.

## Endpoint Auth

### POST `/api/v1/auth/register`

Register user mahasiswa baru. Akun baru selalu dibuat dengan role `MAHASISWA`.

**Authorization**: Public

**Request**:

```json
{
  "email": "mahasiswa@itb.ac.id",
  "password": "Password123",
  "display_name": "Nama Mahasiswa"
}
```

**Validation**:

- `password` minimal 8 karakter.
- `email` harus unik.

**Response `201`**:

```json
{
  "id": 2,
  "email": "mahasiswa@itb.ac.id",
  "display_name": "Nama Mahasiswa",
  "role": "MAHASISWA",
  "is_active": true
}
```

**Error**:

- `409`: email sudah terdaftar.

**cURL**:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"mahasiswa@itb.ac.id","password":"Password123","display_name":"Nama Mahasiswa"}'
```

### POST `/api/v1/auth/login`

Login memakai akun PostgreSQL dan menghasilkan JWT.

**Authorization**: Public

**Request**:

```json
{
  "email": "admin@itb.ac.id",
  "password": "Admin@12345"
}
```

**Response**:

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in_minutes": 480
}
```

**cURL**:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@itb.ac.id","password":"Admin@12345"}'
```

### GET `/api/v1/auth/me`

Mengambil user aktif dari JWT.

**Authorization**: User/Admin

**Response**:

```json
{
  "id": 1,
  "email": "admin@itb.ac.id",
  "display_name": "Default Admin",
  "role": "ADMIN",
  "is_active": true
}
```

## Endpoint Nodes dan Lights

### GET `/api/v1/nodes`

Mengambil semua node dari PostgreSQL.

**Authorization**: User/Admin

**Response**:

```json
[
  {
    "id": "NODE-001",
    "location_name": "Gerbang Utama",
    "latitude": -6.8671,
    "longitude": 107.7329,
    "zone": "Jatinangor",
    "status": "ACTIVE",
    "last_seen_at": "2026-05-26T01:00:00",
    "created_at": "2026-05-26T00:00:00",
    "updated_at": "2026-05-26T01:00:00",
    "lux": 2027.0,
    "brightness_pwm": 0,
    "pir_active": true,
    "temperature": null,
    "voltage": null,
    "current": null
  }
]
```

### GET `/api/v1/nodes/{node_id}`

Mengambil detail satu node dari PostgreSQL.

**Authorization**: User/Admin

**Error**:

- `404`: node tidak ditemukan.

### GET `/api/v1/lights`

Backward-compatible alias untuk list node. Response mengikuti model `Node`.

**Authorization**: User/Admin

### POST `/api/v1/lights/{light_id}/override`

Admin mengirim override ke Firebase RTDB path `node_state/{light_id}`.

**Authorization**: Admin

**Request**:

```json
{
  "status_override": true,
  "brightness_pwm": 40
}
```

**Validation**:

- `brightness_pwm` harus 0 sampai 100.
- `light_id` harus ada sebagai `nodes.id` di PostgreSQL.

**Response**:

```json
{
  "status": "ok",
  "message": "Override command sent to light successfully",
  "node_id": "NODE-001",
  "override_active": true,
  "brightness_pwm": 40,
  "timestamp": "2026-05-26T01:30:00.000000"
}
```

**Firebase update**:

```json
{
  "override_active": true,
  "brightness_pwm": 40,
  "override_timestamp": "2026-05-26T01:30:00.000000",
  "override_by_admin": "admin@itb.ac.id"
}
```

## Endpoint Telemetry

### GET `/api/v1/telemetry/{node_id}/history`

Mengambil telemetry history dari PostgreSQL.

**Authorization**: User/Admin

**Query parameters**:

- `start_date`: optional ISO datetime.
- `end_date`: optional ISO datetime.
- `page`: default `1`, minimal `1`.
- `limit`: default `50`, minimal `1`, maksimal `500`.

**Validation**:

- `start_date <= end_date`.
- `node_id` harus ada di PostgreSQL.

**Response**:

```json
{
  "node_id": "NODE-001",
  "page": 1,
  "limit": 50,
  "total": 1,
  "items": [
    {
      "recorded_at": "2026-05-26T01:00:00",
      "lux": 120.5,
      "brightness_pwm": 40,
      "pir_active": false,
      "temperature": 27.1,
      "voltage": 220.0,
      "current": 0.18,
      "event_type": "update"
    }
  ]
}
```

### GET `/api/v1/telemetry/{node_id}/aggregated`

Mengambil agregasi telemetry untuk grafik dan insight.

**Authorization**: User/Admin

**Query parameters**:

- `start_date`: optional ISO datetime.
- `end_date`: optional ISO datetime.

**Response**:

```json
{
  "node_id": "NODE-001",
  "start_date": null,
  "end_date": null,
  "avg_lux": 120.5,
  "avg_pwm": 40.0,
  "pir_active_count": 8,
  "energy_kwh_est": 0.0396,
  "event_distribution": {
    "update": 25,
    "alert": 1
  }
}
```

## Endpoint Reports

### POST `/api/v1/reports`

Membuat laporan kerusakan node.

**Authorization**: User/Admin

**Request**:

```json
{
  "node_id": "NODE-001",
  "issue_type": "lampu_mati",
  "severity": "HIGH",
  "description": "Lampu tidak menyala sama sekali",
  "photo_url": null
}
```

**Validation**:

- `severity`: `LOW`, `MEDIUM`, atau `HIGH`.
- `node_id` harus ada di PostgreSQL.

**Response**:

```json
{
  "id": 1,
  "node_id": "NODE-001",
  "reported_by_id": 2,
  "issue_type": "lampu_mati",
  "severity": "HIGH",
  "description": "Lampu tidak menyala sama sekali",
  "photo_url": null,
  "status": "PENDING",
  "created_at": "2026-05-26T01:10:00",
  "updated_at": null,
  "resolved_at": null,
  "resolved_by_id": null,
  "maintenance_notes": null
}
```


### GET `/api/v1/reports`

Mengambil riwayat laporan milik user yang sedang login. Endpoint ini ditujukan untuk mobile app/user biasa. Admin tetap bisa memakai endpoint admin untuk semua laporan.

**Authorization**: User/Admin

**Query parameters**:

- `page`: default `1`, minimal `1`.
- `limit`: default `20`, minimal `1`, maksimal `100`.
- `status`: optional, salah satu `PENDING`, `IN_PROGRESS`, `RESOLVED`.

**Response**:

```json
[
  {
    "id": 1,
    "node_id": "NODE-001",
    "reported_by_id": 2,
    "issue_type": "lampu_mati",
    "severity": "HIGH",
    "description": "Lampu tidak menyala sama sekali",
    "photo_url": null,
    "status": "PENDING",
    "created_at": "2026-05-26T01:10:00",
    "updated_at": null,
    "resolved_at": null,
    "resolved_by_id": null,
    "maintenance_notes": null
  }
]
```

### GET `/api/v1/reports/me`

Alias untuk `GET /api/v1/reports`. Disediakan agar mobile app bisa memakai path eksplisit untuk laporan milik user aktif.

**Authorization**: User/Admin

## Endpoint Admin Reports

### GET `/api/v1/admin/reports`

Mengambil daftar reports untuk admin.

**Authorization**: Admin

**Query parameters**:

- `page`: default `1`, minimal `1`.
- `limit`: default `10`, minimal `1`, maksimal `100`.
- `status`: optional, salah satu `PENDING`, `IN_PROGRESS`, `RESOLVED`.

**Response**:

```json
[
  {
    "id": 1,
    "node_id": "NODE-001",
    "reported_by_id": 2,
    "issue_type": "lampu_mati",
    "severity": "HIGH",
    "description": "Lampu tidak menyala sama sekali",
    "photo_url": null,
    "status": "PENDING",
    "created_at": "2026-05-26T01:10:00",
    "updated_at": null,
    "resolved_at": null,
    "resolved_by_id": null,
    "maintenance_notes": null
  }
]
```

### PATCH `/api/v1/admin/reports/{report_id}`

Mengubah status report. Jika status berubah ke `RESOLVED`, backend juga membuat maintenance log dalam transaksi yang sama.

**Authorization**: Admin

**Request**:

```json
{
  "status": "RESOLVED",
  "maintenance_notes": "Lampu diganti dan sensor diuji ulang"
}
```

**Validation**:

- `status`: `PENDING`, `IN_PROGRESS`, atau `RESOLVED`.
- `report_id` harus ada.

**Response**:

Response adalah report yang sudah diperbarui.

## Endpoint Maintenance Logs

### POST `/api/v1/maintenance-logs`

Membuat catatan maintenance manual.

**Authorization**: Admin

**Request**:

```json
{
  "node_id": "NODE-001",
  "report_id": 1,
  "action_taken": "Mengganti lampu dan membersihkan sensor PIR",
  "logged_at": "2026-05-26T02:00:00"
}
```

**Response**:

```json
{
  "id": 1,
  "node_id": "NODE-001",
  "report_id": 1,
  "admin_id": 1,
  "action_taken": "Mengganti lampu dan membersihkan sensor PIR",
  "logged_at": "2026-05-26T02:00:00"
}
```

## PostgreSQL Schema

### `users`

| Column | Description |
|---|---|
| `id` | Primary key. |
| `email` | Unique login email. |
| `password_hash` | PBKDF2 password hash. |
| `display_name` | Nama tampilan user. |
| `role` | `ADMIN` atau `MAHASISWA`. |
| `is_active` | Status aktif akun. |
| `created_at` | Waktu dibuat. |
| `updated_at` | Waktu diperbarui. |

### `nodes`

| Column | Description |
|---|---|
| `id` | Primary key node, contoh `NODE-001`. |
| `location_name` | Nama lokasi. |
| `latitude` | Latitude. |
| `longitude` | Longitude. |
| `zone` | Zona/area. |
| `status` | `ACTIVE`, `ECO`, `BROKEN`, `OFF`, atau status lain dari normalizer. |
| `last_seen_at` | Waktu terakhir node terlihat. |
| `created_at` | Waktu dibuat. |
| `updated_at` | Waktu diperbarui. |

### `telemetry_logs`

| Column | Description |
|---|---|
| `id` | Primary key. |
| `node_id` | Foreign key ke `nodes.id`. |
| `recorded_at` | Waktu telemetry dicatat. |
| `lux` | Nilai intensitas cahaya. |
| `brightness_pwm` | Brightness/PWM 0-100. |
| `pir_active` | Status sensor PIR. |
| `temperature` | Suhu. |
| `voltage` | Tegangan. |
| `current` | Arus. |
| `event_type` | Jenis event, default `update`. |
| `created_at` | Waktu masuk PostgreSQL. |

Indexes/constraints:

- Unique `(node_id, recorded_at)` untuk deduplication.
- Index `(node_id, recorded_at)`.
- Index `recorded_at`.
- Index `event_type`.

### `reports`

| Column | Description |
|---|---|
| `id` | Primary key. |
| `node_id` | Foreign key ke `nodes.id`. |
| `reported_by_id` | Foreign key ke `users.id`. |
| `issue_type` | Jenis masalah. |
| `severity` | `LOW`, `MEDIUM`, atau `HIGH`. |
| `description` | Deskripsi laporan. |
| `photo_url` | URL foto optional. |
| `status` | `PENDING`, `IN_PROGRESS`, atau `RESOLVED`. |
| `created_at` | Waktu dibuat. |
| `updated_at` | Waktu diperbarui. |
| `resolved_at` | Waktu selesai. |
| `resolved_by_id` | Admin penyelesai. |
| `maintenance_notes` | Catatan maintenance. |

### `maintenance_logs`

| Column | Description |
|---|---|
| `id` | Primary key. |
| `node_id` | Foreign key ke `nodes.id`. |
| `report_id` | Foreign key ke `reports.id`, optional. |
| `admin_id` | Foreign key ke `users.id`. |
| `action_taken` | Tindakan maintenance. |
| `logged_at` | Waktu log. |

## Firebase RTDB Integration

Backend membaca:

```text
nodes/{node_id}
telemetry/{node_id}
```

Backend menulis override:

```text
nodes/{node_id}
```

Mapping utama `nodes/{node_id}` ke PostgreSQL:

| Firebase field | PostgreSQL field |
|---|---|
| path key | `nodes.id` |
| `location` / `location_name` | `nodes.location_name` |
| `lat` / `latitude` | `nodes.latitude` |
| `lng` / `longitude` | `nodes.longitude` |
| `zone` | `nodes.zone` |
| `status` | `nodes.status` |
| `lastUpdate` / `timestamp` | `nodes.last_seen_at` |

Mapping utama `telemetry/{node_id}` ke PostgreSQL:

| Firebase field | PostgreSQL field |
|---|---|
| path key | `telemetry_logs.node_id` |
| `timestamp` | `telemetry_logs.recorded_at` |
| `lux` / `illuminance` | `telemetry_logs.lux` |
| `brightness` / `brightness_pwm` / `pwm` | `telemetry_logs.brightness_pwm` |
| `pirActive` / `pir_state` | `telemetry_logs.pir_active` |
| `temperature` | `telemetry_logs.temperature` |
| `voltage` | `telemetry_logs.voltage` |
| `current` | `telemetry_logs.current` |
| `eventType` | `telemetry_logs.event_type` |

## Common Error Format

```json
{
  "detail": "Deskripsi error"
}
```

| Status | Meaning |
|---|---|
| `400` | Validasi request gagal. |
| `401` | JWT tidak ada, invalid, atau expired. |
| `403` | Role tidak cukup. |
| `404` | Resource tidak ditemukan. |
| `500` | Error server atau Firebase write gagal. |

## Local Testing Flow

1. Jalankan backend dan PostgreSQL.
2. Login sebagai default admin.
3. Simpan `access_token`.
4. Panggil endpoint protected dengan `Authorization: Bearer <access_token>`.

```bash
TOKEN=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@itb.ac.id","password":"Admin@12345"}')
```

Di PowerShell:

```powershell
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:8000/api/v1/auth/login" `
  -ContentType "application/json" `
  -Body '{"email":"admin@itb.ac.id","password":"Admin@12345"}'

Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/me" `
  -Headers @{ Authorization = "Bearer $($login.access_token)" }
```

## Development Setup

```bash
pip install -r requirements.txt
cp .env.example .env
docker compose up --build
```

API docs dari FastAPI tersedia di:

```text
http://localhost:8000/docs
```
