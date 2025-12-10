# 🏎️ Turbo Racer - Drive & Survive

An engaging, mobile-friendly car driving game built with Next.js. No login required - just open and play!

![Turbo Racer](./public/icon-512.svg)

## 🎮 Features

- **Instant Play**: No login or registration needed
- **Engaging Gameplay**: Dodge obstacles, collect coins, and beat your high score
- **Power-Ups System**: Shield, Magnet, and Speed Boost power-ups
- **Particle Effects**: Beautiful visual effects for collisions and collections
- **Pause Functionality**: Press SPACE or P to pause the game
- **Progressive Difficulty**: Game speed increases as you progress
- **Speed Indicator**: Real-time speed display
- **Car Tilt Animation**: Dynamic car tilting when steering
- **PWA Support**: Install on your device for offline play
- **Mobile-First Design**: Optimized for both desktop and mobile devices
- **Touch Controls**: Intuitive touch controls for mobile devices
- **Keyboard Controls**: Arrow keys or A/D for desktop, SPACE/P to pause
- **Beautiful UI**: Attractive gradients, glow effects, and smooth animations
- **High Score Tracking**: Automatically saves your best score locally
- **Responsive HUD**: Clean, informative heads-up display

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd self_driving_car
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open your browser and navigate to:

```
http://localhost:3000
```

## 🎯 How to Play

### Desktop Controls

- **Arrow Left** or **A**: Move car left
- **Arrow Right** or **D**: Move car right
- **SPACE** or **P**: Pause/Resume game

### Mobile Controls

- **Touch and Drag**: Swipe left/right to steer the car

### Gameplay

- 🚗 Avoid cars and traffic cones
- 💰 Collect coins for bonus points (+50 points per coin)
- 🏁 Pass obstacles to increase your score (+10 points per obstacle)
- ⚡ Game speed increases every 20 obstacles

### Power-Ups

- 🛡 **Shield**: Protects you from one collision (10 seconds)
- 🧲 **Magnet**: Automatically attracts nearby coins (8 seconds)
- ⚡ **Boost**: Increases your speed by 50% (5 seconds)
- Power-ups spawn every 15 seconds

## 📱 Installing as PWA

### On Mobile (iOS/Android)

#### iOS (Safari)

1. Open the game in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"

#### Android (Chrome)

1. Open the game in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen" or "Install App"
4. Tap "Add"

### On Desktop (Chrome/Edge)

1. Open the game in Chrome or Edge
2. Look for the install icon in the address bar
3. Click "Install"

## 🏗️ Project Structure

```
self_driving_car/
├── app/
│   ├── layout.tsx          # Root layout with PWA config
│   ├── page.tsx            # Main game page
│   ├── globals.css         # Global styles
│   └── register-sw.tsx     # Service worker registration
├── components/
│   ├── GameCanvas.tsx      # Main game logic and rendering
│   ├── StartScreen.tsx     # Start screen UI
│   └── GameOverScreen.tsx  # Game over screen UI
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   ├── icon-192.png       # App icon (192x192)
│   └── icon-512.png       # App icon (512x512)
└── README.md
```

## 🛠️ Built With

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **HTML5 Canvas** - Game rendering
- **Service Workers** - PWA support

## 🎨 Game Mechanics

### Scoring System

- **Passing an obstacle**: +10 points
- **Collecting a coin**: +50 points

### Difficulty Progression

- Base speed increases every 20 obstacles
- Maximum speed cap of 8x to ensure playability
- Speed boost multiplies speed by 1.5x when active
- Obstacle spawn rate: Every 1.5 seconds
- Coin spawn rate: Every 2 seconds
- Power-up spawn rate: Every 15 seconds

### Visual Effects

- Particle effects on coin collection (gold particles)
- Particle effects on collisions (red/cyan particles)
- Shield visual effect (cyan glow around car)
- Glow effects on headlights and coins
- Gradient backgrounds for all elements
- Shadow effects for depth perception
- Car tilt animation when steering
- Rotating coin animation

### Collision Detection

- Rectangle-based collision for obstacles and power-ups
- Circle-based collision for coins
- Precise hit boxes for fair gameplay
- Shield protection from one collision

## 🔧 Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint Code

```bash
npm run lint
```

## 📝 Future Enhancements

- [ ] Add sound effects and background music
- [ ] Implement multiple car skins/colors
- [ ] Create different road environments (desert, city, snow)
- [ ] Add leaderboard (requires backend)
- [ ] Add achievement system
- [ ] Implement car customization
- [ ] Add more power-up types (invincibility, slow-mo, etc.)
- [ ] Mobile pause button
- [ ] Power-up timer bars

## 🐛 Known Issues

- Icons use SVG format (works in all modern browsers)
- For production, consider converting SVG to PNG for older browser support

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Enjoy the game! Try to beat your high score! 🏆**
