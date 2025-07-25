# Lift Cash Trivia Game

A decentralized trivia game built on the Internet Computer using DFINITY, featuring multi-language support, scheduled rounds, and Internet Identity authentication.

## Features

- 🔐 **Secure Authentication**: Internet Identity integration for decentralized login
- 🌐 **Multi-Language Support**: Play in English, Spanish, French, German, Italian, or Portuguese
- ⏰ **Scheduled Rounds**: Automatic trivia rounds every 3 hours
- 👥 **Multiplayer**: Compete with players worldwide
- 🎨 **Modern UI**: Dark theme with responsive design
- ⚡ **Real-time Updates**: Live countdown timers and player status

## Tech Stack

### Backend
- **DFINITY Internet Computer** - Decentralized hosting
- **Motoko** - Smart contract language
- **Multi-user Authentication System** - Role-based access control

### Frontend
- **React 19** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Query** - Server state management
- **Internet Identity** - Decentralized authentication

## Getting Started

### Prerequisites

- [DFINITY SDK (dfx)](https://sdk.dfinity.org/docs/quickstart/local-development.html)
- [Node.js](https://nodejs.org/) (v20 or higher)
- [pnpm](https://pnpm.io/) (package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lift_trivia_game
   ```

2. **Install DFINITY SDK** (if not already installed)
   ```bash
   sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
   ```

3. **Install Node.js dependencies**
   ```bash
   cd frontend
   pnpm install
   ```

### Local Development

1. **Start the local DFINITY replica**
   ```bash
   dfx start --clean --background
   ```

2. **Deploy the canisters**
   ```bash
   dfx deploy
   ```

3. **Access the application**
   - Frontend: `http://<frontend-canister-id>.localhost:4943/`
   - Backend Candid UI: `http://127.0.0.1:4943/?canisterId=<candid-ui-canister-id>&id=<backend-canister-id>`

### Build Commands

```bash
# Build frontend
cd frontend
pnpm build

# Deploy to local network
dfx deploy

# Generate TypeScript declarations
dfx generate
```

## Project Structure

```
lift_trivia_game/
├── backend/                 # Motoko smart contracts
│   ├── auth-multi-user/    # Authentication system
│   ├── main.mo            # Main trivia game logic
│   └── migration.mo       # Data migration helpers
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   └── backend/       # Generated backend types
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
├── src/declarations/       # Generated canister interfaces
├── dfx.json               # DFINITY project configuration
└── Specification.md       # Detailed project specification
```

## Game Flow

1. **Login**: Users authenticate with Internet Identity
2. **Language Selection**: Choose preferred language for trivia questions
3. **Ready Up**: Mark yourself as ready for the next round
4. **Countdown**: Wait for the scheduled round to begin
5. **Play**: Answer trivia questions in your selected language
6. **Results**: View scores and compete with other players

## Development Features

- **Hot Reload**: Frontend auto-refreshes during development
- **Type Safety**: Full TypeScript support with generated backend types
- **Modern Styling**: Tailwind CSS with custom design system
- **Component Library**: Lucide React icons
- **State Management**: React Query for server state
- **Error Handling**: Comprehensive error boundaries and loading states

## Configuration

### Frontend Environment
```bash
# Frontend build configuration
cd frontend
pnpm build          # Production build
pnpm dev           # Development server
pnpm preview       # Preview production build
```

### Backend Configuration
The backend is configured via `dfx.json` with:
- Local network on `127.0.0.1:4943`
- Motoko canisters for game logic
- Asset canister for frontend hosting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

### Local Network
```bash
dfx start --clean --background
dfx deploy
```

### IC Mainnet
```bash
dfx deploy --network ic
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Started with ❤️ using [caffeine.ai](https://caffeine.ai) Extended with Humans + Claude Code
- Powered by the [Internet Computer](https://internetcomputer.org/)
- UI components from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
