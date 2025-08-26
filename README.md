
# Game Leaderboard System - LeaderboardScores ACA

An advanced, full-featured game leaderboard system built with React, TypeScript, and Tailwind CSS. This system provides comprehensive score tracking across multiple game types with built-in rate limiting, validation, and management features.

## 🎮 Features

### Core Functionality
- **Multi-Game Support**: Track scores across different game types
- **Real-time Leaderboards**: View top 10 scores for each game
- **Score Submission**: Submit new scores with validation
- **Game Management**: Add and remove game types dynamically

### Advanced Features
- **Rate Limiting**: Prevents spam submissions (3 submissions per minute by default)
- **Input Validation**: Comprehensive validation for player names and scores
- **Real-time Updates**: Live countdown timers for rate limits
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Visual Feedback**: Success/error alerts and ranking badges

### User Interface
- **Tabbed Navigation**: Clean interface with Leaderboards, Submit Score, and Manage Games tabs
- **Ranking System**: Gold, silver, bronze visual indicators for top 3 positions
- **Score Formatting**: Automatic number formatting with commas
- **Timestamp Display**: Shows when each score was submitted

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leaderboardscores-aca
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to view the application

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## 🎯 How to Use

### Viewing Leaderboards
1. Click on the **"Leaderboards"** tab (default view)
2. Browse through different game leaderboards
3. Each game shows the top 10 scores with player names and timestamps
4. Rankings are color-coded: Gold (1st), Silver (2nd), Bronze (3rd)

### Submitting Scores
1. Click on the **"Submit Score"** tab
2. Enter your player name (minimum 2 characters)
3. Select a game type from the dropdown
4. Enter your score (0 to 999,999,999)
5. Click **"Submit Score"**

**Note**: Rate limiting allows 3 submissions per minute to prevent spam.

### Managing Games
1. Click on the **"Manage Games"** tab
2. **Add New Games**: Enter game name and description, then click "Add Game Type"
3. **Remove Games**: Click the trash icon next to any game to remove it
4. Removing a game also removes all associated scores

## ⚙️ Configuration

The component accepts the following props for customization:

```typescript
interface GameLeaderboardSystemProps {
  initialGameTypes?: GameType[];        // Default game types
  rateLimitWindow?: number;             // Rate limit window in ms (default: 60000)
  maxSubmissionsPerWindow?: number;     // Max submissions per window (default: 3)
}
```

### Default Game Types
The system comes with three pre-configured games:
- **Space Shooter**: Classic arcade space shooter
- **Puzzle Master**: Mind-bending puzzle challenges  
- **Racing Thunder**: High-speed racing action

## 🛠️ Technical Details

### Technology Stack
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality UI components
- **Lucide React**: Beautiful icons
- **Vite**: Fast build tool and dev server

### Key Components
- `GameLeaderboardSystem`: Main component with all functionality
- Rate limiting with automatic reset
- Input validation with detailed error messages
- Local state management with React hooks
- Responsive grid layouts

### Data Structures
```typescript
interface Score {
  id: string;
  playerName: string;
  score: number;
  timestamp: Date;
  gameType: string;
}

interface GameType {
  id: string;
  name: string;
  description: string;
}
```

## 🎨 Customization

### Styling
The system uses Tailwind CSS for styling. Key design elements:
- Blue primary color scheme (`bg-blue-600`)
- Clean card-based layout
- Responsive grid system
- Hover effects and transitions

### Rate Limiting
Modify rate limiting by passing props:
```typescript
<GameLeaderboardSystem 
  rateLimitWindow={120000}        // 2 minutes
  maxSubmissionsPerWindow={5}     // 5 submissions
/>
```

### Initial Games
Customize default games:
```typescript
const customGames = [
  { id: '1', name: 'My Game', description: 'Custom game description' }
];

<GameLeaderboardSystem initialGameTypes={customGames} />
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is built with Lovable and is available under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the browser console for error messages
2. Ensure all dependencies are installed correctly
3. Verify Node.js version compatibility
4. Check network connectivity for any external resources

---

**Project URL**: leaderboardscores-aca  
**Built with**: ❤️ and Lovable
"# leaderboard-aca" 
