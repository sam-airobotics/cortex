# CURA Dashboard

A lightweight, multi-page web-based Human-Machine Interface (HMI) for the **CURA hospital assistance robot**, designed for an **800×480 7-inch capacitive touch panel in landscape orientation**.

The dashboard provides a touch-friendly interface for monitoring and interacting with CURA's missions, navigation, inventory, system diagnostics, messages, and settings.

---

## Features

- 🏠 **Home Dashboard**
  - Robot overview
  - Current mission status
  - Battery status
  - System status
  - Activity information

- 🎯 **Mission Management**
  - View mission queue
  - Start and pause missions
  - Complete tasks
  - Track mission progress

- 🧭 **Navigation**
  - Manual drive controls
  - Live robot position
  - Navigation status

- 📦 **Inventory**
  - Stock-level monitoring
  - Quantity increment/decrement controls
  - Inventory state persistence

- ⚙️ **System Diagnostics**
  - Subsystem status
  - Fault simulation
  - Diagnostic information

- 💬 **Messages**
  - Activity log
  - Robot events
  - System notifications

- 🔧 **Settings**
  - Robot name
  - Display brightness
  - Volume
  - Dark mode
  - Reset functionality

- 💾 **Persistent State**
  - Uses browser `localStorage`
  - Maintains robot state between page navigation and reloads

- 🖥️ **Kiosk Compatible**
  - Designed for touchscreen deployment
  - Supports Chromium/Brave-based kiosk browsers
  - No build system required

---

## Project Structure

```text
cura-dashboard/
├── index.html                  # Home / main dashboard
├── launch.sh                   # Single-point dashboard launcher
├── README.md                   # Project documentation
│
├── pages/
│   ├── mission.html            # Mission queue
│   ├── navigation.html         # Manual navigation and live position
│   ├── inventory.html          # Inventory management
│   ├── system.html             # System diagnostics
│   ├── messages.html           # Activity and message log
│   └── settings.html           # Dashboard settings
│
└── assets/
    ├── css/
    │   └── style.css           # Shared stylesheet
    │
    └── js/
        ├── state.js            # Shared persistent application state
        ├── ui.js               # Shared UI, icons, topbar, sidebar and simulation tick
        ├── dashboard.js        # Home dashboard logic
        ├── mission.js          # Mission page logic
        ├── navigation.js       # Navigation page logic
        ├── inventory.js        # Inventory page logic
        ├── system.js           # System diagnostics logic
        ├── messages.js         # Messages page logic
        └── settings.js         # Settings page logic
```

---

## Application Architecture

CURA uses a conventional **multi-page web application** architecture.

Each page loads:

```text
state.js
    ↓
ui.js
    ↓
Page-specific JavaScript
```

For example:

```text
mission.html
    │
    ├── state.js
    ├── ui.js
    └── mission.js
```

Navigation between pages uses standard HTML links rather than JavaScript-based view switching.

For example:

```html
<a href="pages/navigation.html">
```

This allows the dashboard to behave like a conventional website while remaining suitable for kiosk deployment.

---

## Persistent Application State

Because every page is a separate HTML document, normal JavaScript variables would be recreated whenever the user navigates between pages.

CURA therefore stores its shared application state in browser `localStorage`.

The state includes information such as:

- Mission status
- Mission progress
- Battery percentage
- Inventory levels
- Activity messages
- Robot settings
- Theme preferences
- System state

The general data flow is:

```text
             Browser
                │
                ▼
          localStorage
                │
                ▼
             state.js
                │
        ┌───────┴───────┐
        ▼               ▼
      ui.js        Page Scripts
        │               │
        └───────┬───────┘
                ▼
          CURA Dashboard
```

State is saved whenever an application action modifies it.

---

## Shared Simulation

`ui.js` provides a shared simulation tick that runs on every page.

This allows simulated values to continue updating while the user navigates between screens.

The simulation currently handles elements such as:

- Mission countdown
- Battery drain/charging
- System state
- Clock
- Other simulated robot activity

This functionality is intended for **prototype and demonstration purposes**.

---

# Running the Dashboard

## Option 1 — Open Directly

The dashboard can be opened directly by launching `index.html` in a modern browser.

No build system or package manager is required.

```bash
xdg-open index.html
```

This method is suitable for quick frontend development and testing.

---

## Option 2 — Local HTTP Server

For kiosk deployment, it is recommended to serve the dashboard through a local HTTP server.

Navigate to the project directory:

```bash
cd ~/cura-dashboard
```

Start the server:

```bash
python3 -m http.server 8080
```

The dashboard will be available at:

```text
http://localhost:8080
```

Open this address in a browser to access the dashboard.

---

# Single-Point Launcher

The project includes a `launch.sh` script that provides a **single point of launch** for the complete dashboard.

The launcher:

1. Changes to the dashboard directory.
2. Starts the local HTTP server.
3. Waits for the server to initialize.
4. Opens the dashboard in the kiosk browser.
5. Keeps the HTTP server running while the dashboard is active.

Make the launcher executable once:

```bash
chmod +x launch.sh
```

Then launch the complete dashboard with:

```bash
./launch.sh
```

The dashboard will be served at:

```text
http://localhost:8080
```

---

## Brave Browser

When Brave is installed through Snap, its executable is typically available at:

```text
/snap/bin/brave
```

The dashboard can be launched manually in kiosk mode with:

```bash
/snap/bin/brave --new-window --kiosk "http://localhost:8080"
```

The `launch.sh` script automates the server and browser startup process.

---

## Launch Flow

```text
                  ./launch.sh
                       │
                       ▼
              Python HTTP Server
                       │
                       │ Port 8080
                       ▼
               localhost:8080
                       │
                       ▼
                 Kiosk Browser
                       │
                       ▼
                   index.html
                       │
              ┌────────┼────────┐
              ▼        ▼        ▼
             CSS       JS     Assets
                       │
                       ▼
                CURA Dashboard
```

---

# Touchscreen Deployment

The dashboard is designed for:

| Parameter | Target |
|---|---|
| Display | 7-inch capacitive touchscreen |
| Resolution | 800×480 |
| Orientation | Landscape |
| Host | Raspberry Pi |
| Interface | Web-based HMI |
| Browser | Kiosk-mode browser |
| Launch | `./launch.sh` |

The intended runtime flow is:

```text
Raspberry Pi
     │
     ▼
CURA Dashboard Launcher
     │
     ├──────────────┐
     ▼              ▼
HTTP Server    Kiosk Browser
     │              │
     └──────┬───────┘
            ▼
      CURA Dashboard
```

---

# Development vs Deployment

## Development

For quick frontend development:

```bash
xdg-open index.html
```

or:

```bash
python3 -m http.server 8080
```

## Deployment

For normal CURA dashboard operation:

```bash
./launch.sh
```

The intended deployment chain is:

```text
Raspberry Pi
    ↓
Operating System
    ↓
CURA Launcher
    ↓
HTTP Server
    ↓
Kiosk Browser
    ↓
CURA HMI
```

---

# Current Simulation Architecture

The current dashboard is primarily a **frontend simulation**.

Robot information is generated and maintained locally using JavaScript.

```text
HTML
 │
 ├── CSS
 │
 └── JavaScript
       │
       ▼
  localStorage
```

There is currently no direct connection between the dashboard and the physical robot hardware.

---

# Planned ROS 2 Integration

For deployment on the physical CURA robot, the simulated data layer will be replaced with communication with the robot's ROS 2 software stack.

A possible implementation uses **rosbridge and WebSockets**, allowing the JavaScript frontend to exchange information with ROS 2.

```text
                 CURA HMI
                    │
                    │ WebSocket
                    ▼
              ROS 2 Interface
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
      Navigation  Sensors  Robot State
          │
          ▼
      Low-Level Control
```

Potential ROS 2 interfaces include:

- `/cmd_vel`
- `/odom`
- `/scan`
- `/tf`
- `/battery_state`
- Navigation actions
- Mission status
- Robot diagnostics
- Sensor telemetry
- ESP communication

The final topics, services, and actions will depend on the CURA ROS 2 architecture.

---

# Target Robot Architecture

The intended CURA architecture separates **high-level computation** from **real-time hardware control**.

```text
┌───────────────────────────────────────────┐
│               Raspberry Pi                │
│                                           │
│  CURA Dashboard                           │
│  ROS 2                                    │
│  Navigation / SLAM                        │
│  Sensor Processing                        │
│  Robot State Management                   │
│                                           │
└───────────────────┬───────────────────────┘
                    │
              Serial / USB / UART
                    │
┌───────────────────▼───────────────────────┐
│                   ESP                     │
│                                           │
│  Real-Time Motor Control                  │
│  Drive Base                               │
│  Robotic Arm                              │
│  Low-Level Actuation                      │
│                                           │
└───────────────────────────────────────────┘
```

The Raspberry Pi handles computationally intensive and high-level functionality such as:

- Dashboard / HMI
- ROS 2
- SLAM
- Navigation
- Sensor processing
- Mission management
- Robot state management

The ESP handles low-level, time-critical hardware control such as:

- Drive-base actuation
- Motor control
- Robotic-arm actuation
- Low-level sensor and actuator interfaces

This separation provides a scalable architecture for future autonomous and humanoid-style robotic capabilities.

---

# Known Limitations

The current version is a **prototype dashboard**.

The following components are currently simulated:

- Mission execution
- Battery behavior
- System diagnostics
- Robot telemetry
- Inventory updates
- Navigation state

The dashboard does not yet directly control the physical CURA robot.

---

# Next Development Steps

1. Replace simulated robot state with ROS 2 data.
2. Add a WebSocket/rosbridge communication layer.
3. Integrate live navigation data.
4. Integrate SLAM visualization.
5. Connect the Raspberry Pi to the ESP controller.
6. Add real battery and sensor telemetry.
7. Implement real mission execution.
8. Configure Raspberry Pi boot-time kiosk launch.
9. Validate the HMI on the physical 800×480 touchscreen.
10. Perform end-to-end testing with the CURA robot.

---

## Project Status

| Component | Status |
|---|---|
| Dashboard UI | Prototype / Functional |
| Multi-page navigation | Implemented |
| Persistent state | Implemented |
| Single-point launcher | Implemented |
| Touchscreen layout | Designed for 800×480 |
| Simulation | Implemented |
| ROS 2 integration | Planned |
| Physical robot telemetry | Planned |
| ESP integration | Planned |
| Automatic boot launch | Planned |

---

## Target Platform

**Robot:** CURA Hospital Assistance Robot  
**Display:** 800×480 7-inch capacitive touchscreen  
**Host:** Raspberry Pi  
**Frontend:** HTML, CSS, JavaScript  
**Runtime:** Browser-based kiosk application  
**State Management:** `localStorage`  
**Robot Middleware:** ROS 2 *(planned integration)*  
**Low-Level Controller:** ESP  
**Launch Entry Point:** `./launch.sh`
