import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Trophy, Plus, Trash2, Clock, AlertCircle, CheckCircle } from 'lucide-react';

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

interface RateLimitInfo {
  lastSubmission: Date | null;
  submissionCount: number;
  isLimited: boolean;
  timeUntilReset: number;
}

interface ValidationResult {
  isValid: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface GameLeaderboardSystemProps {
  initialGameTypes?: GameType[];
  rateLimitWindow?: number;
  maxSubmissionsPerWindow?: number;
}

const GameLeaderboardSystem: React.FC<GameLeaderboardSystemProps> = ({
  initialGameTypes = [
    { id: '1', name: 'Space Shooter', description: 'Classic arcade space shooter' },
    { id: '2', name: 'Puzzle Master', description: 'Mind-bending puzzle challenges' },
    { id: '3', name: 'Racing Thunder', description: 'High-speed racing action' }
  ],
  rateLimitWindow = 60000,
  maxSubmissionsPerWindow = 3
}) => {
  const [gameTypes, setGameTypes] = useState<GameType[]>(initialGameTypes);
  const [scores, setScores] = useState<Score[]>([]);
  const [selectedGameType, setSelectedGameType] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [playerScore, setPlayerScore] = useState<string>('');
  const [newGameTypeName, setNewGameTypeName] = useState<string>('');
  const [newGameTypeDescription, setNewGameTypeDescription] = useState<string>('');
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>({
    lastSubmission: null,
    submissionCount: 0,
    isLimited: false,
    timeUntilReset: 0
  });
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('leaderboard');

  const updateRateLimit = useCallback(() => {
    const now = new Date();
    if (rateLimitInfo.lastSubmission) {
      const timeSinceLastSubmission = now.getTime() - rateLimitInfo.lastSubmission.getTime();
      if (timeSinceLastSubmission > rateLimitWindow) {
        setRateLimitInfo(prev => ({
          ...prev,
          submissionCount: 0,
          isLimited: false,
          timeUntilReset: 0
        }));
      } else {
        const timeUntilReset = rateLimitWindow - timeSinceLastSubmission;
        setRateLimitInfo(prev => ({
          ...prev,
          isLimited: prev.submissionCount >= maxSubmissionsPerWindow,
          timeUntilReset
        }));
      }
    }
  }, [rateLimitInfo.lastSubmission, rateLimitWindow, maxSubmissionsPerWindow]);

  useEffect(() => {
    const interval = setInterval(updateRateLimit, 1000);
    return () => clearInterval(interval);
  }, [updateRateLimit]);

  const validateScore = (name: string, score: string, gameType: string): ValidationResult => {
    if (!name.trim()) {
      return {
        isValid: false,
        message: 'Player name is required',
        type: 'error'
      };
    }
    if (name.trim().length < 2) {
      return {
        isValid: false,
        message: 'Player name must be at least 2 characters',
        type: 'error'
      };
    }
    if (!score.trim()) {
      return {
        isValid: false,
        message: 'Score is required',
        type: 'error'
      };
    }
    const numericScore = parseInt(score);
    if (isNaN(numericScore)) {
      return {
        isValid: false,
        message: 'Score must be a valid number',
        type: 'error'
      };
    }
    if (numericScore < 0) {
      return {
        isValid: false,
        message: 'Score cannot be negative',
        type: 'error'
      };
    }
    if (numericScore > 999999999) {
      return {
        isValid: false,
        message: 'Score is too high (max: 999,999,999)',
        type: 'error'
      };
    }
    if (!gameType) {
      return {
        isValid: false,
        message: 'Please select a game type',
        type: 'error'
      };
    }
    return {
      isValid: true,
      message: 'Score is valid and ready to submit',
      type: 'success'
    };
  };

  const handleScoreSubmit = () => {
    if (rateLimitInfo.isLimited) {
      setValidationResult({
        isValid: false,
        message: `Rate limit exceeded. Try again in ${Math.ceil(rateLimitInfo.timeUntilReset / 1000)} seconds`,
        type: 'error'
      });
      return;
    }
    const validation = validateScore(playerName, playerScore, selectedGameType);
    setValidationResult(validation);
    if (!validation.isValid) return;
    const newScore: Score = {
      id: Date.now().toString(),
      playerName: playerName.trim(),
      score: parseInt(playerScore),
      timestamp: new Date(),
      gameType: selectedGameType
    };
    setScores(prev => [...prev, newScore]);
    const now = new Date();
    setRateLimitInfo(prev => ({
      lastSubmission: now,
      submissionCount: prev.submissionCount + 1,
      isLimited: prev.submissionCount + 1 >= maxSubmissionsPerWindow,
      timeUntilReset: rateLimitWindow
    }));
    setPlayerName('');
    setPlayerScore('');
    setValidationResult({
      isValid: true,
      message: 'Score submitted successfully!',
      type: 'success'
    });
    setTimeout(() => setValidationResult(null), 3000);
  };

  const handleAddGameType = () => {
    if (!newGameTypeName.trim()) return;
    const newGameType: GameType = {
      id: Date.now().toString(),
      name: newGameTypeName.trim(),
      description: newGameTypeDescription.trim() || 'No description provided'
    };
    setGameTypes(prev => [...prev, newGameType]);
    setNewGameTypeName('');
    setNewGameTypeDescription('');
  };

  const handleRemoveGameType = (gameTypeId: string) => {
    setGameTypes(prev => prev.filter(gt => gt.id !== gameTypeId));
    setScores(prev => prev.filter(score => score.gameType !== gameTypeId));
    if (selectedGameType === gameTypeId) {
      setSelectedGameType('');
    }
  };

  const getTopScores = (gameTypeId: string): Score[] => {
    return scores.filter(score => score.gameType === gameTypeId).sort((a, b) => b.score - a.score).slice(0, 10);
  };

  const formatScore = (score: number): string => {
    return score.toLocaleString();
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-black">Game Leaderboard System</h1>
          <p className="text-lg text-gray-600">Track high scores across multiple game types</p>
        </div>

        <div className="flex justify-center space-x-4 border-b border-gray-200">
          <Button
            variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('leaderboard')}
            className={`px-6 py-2 ${
              activeTab === 'leaderboard' 
                ? 'bg-blue-600 text-white border-b-2 border-blue-600' 
                : 'text-black hover:bg-blue-50'
            }`}
          >
            Leaderboards
          </Button>
          <Button
            variant={activeTab === 'submit' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('submit')}
            className={`px-6 py-2 ${
              activeTab === 'submit' 
                ? 'bg-blue-600 text-white border-b-2 border-blue-600' 
                : 'text-black hover:bg-blue-50'
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Submit Score
          </Button>
          <Button
            variant={activeTab === 'manage' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-2 ${
              activeTab === 'manage' 
                ? 'bg-blue-600 text-white border-b-2 border-blue-600' 
                : 'text-black hover:bg-blue-50'
            }`}
          >
            Manage Games
          </Button>
        </div>

        {rateLimitInfo.isLimited && <Alert className="border-red-200 bg-red-50">
            <Clock className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Rate limit active. You can submit again in {Math.ceil(rateLimitInfo.timeUntilReset / 1000)} seconds.
            </AlertDescription>
          </Alert>}

        {validationResult && <Alert className={`border-${validationResult.type === 'error' ? 'red' : 'green'}-200 bg-${validationResult.type === 'error' ? 'red' : 'green'}-50`}>
            {validationResult.type === 'error' ? <AlertCircle className="h-4 w-4 text-red-600" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
            <AlertDescription className={`text-${validationResult.type === 'error' ? 'red' : 'green'}-800`}>
              {validationResult.message}
            </AlertDescription>
          </Alert>}

        {activeTab === 'leaderboard' && <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gameTypes.map(gameType => {
          const topScores = getTopScores(gameType.id);
          return <Card key={gameType.id} className="border-gray-200">
                  <CardHeader className="bg-blue-600 text-white">
                    <CardTitle className="flex items-center space-x-2">
                      
                      <span>{gameType.name}</span>
                    </CardTitle>
                    <p className="text-blue-100 text-sm">{gameType.description}</p>
                  </CardHeader>
                  <CardContent className="p-0">
                    {topScores.length === 0 ? <div className="p-6 text-center text-gray-500">
                        No scores yet. Be the first to submit!
                      </div> : <div className="space-y-0">
                        {topScores.map((score, index) => <div key={score.id} className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 ${index === 0 ? 'bg-yellow-50' : index === 1 ? 'bg-gray-50' : index === 2 ? 'bg-orange-50' : ''}`}>
                            <div className="flex items-center space-x-3">
                              <Badge variant={index === 0 ? 'default' : 'secondary'} className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-orange-400 text-white' : 'bg-blue-100 text-blue-800'}`}>
                                {index + 1}
                              </Badge>
                              <div>
                                <div className="font-semibold text-black">{score.playerName}</div>
                                <div className="text-xs text-gray-500">{formatTime(score.timestamp)}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg text-blue-600">{formatScore(score.score)}</div>
                            </div>
                          </div>)}
                      </div>}
                  </CardContent>
                </Card>;
        })}
          </div>}

        {activeTab === 'submit' && <Card className="max-w-md mx-auto border-gray-200">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle>Submit New Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Player Name</label>
                <Input value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Enter your name" className="border-gray-300 focus:border-blue-500" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Game Type</label>
                <Select value={selectedGameType} onValueChange={setSelectedGameType}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    {gameTypes.map(gameType => <SelectItem key={gameType.id} value={gameType.id}>
                        {gameType.name}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Score</label>
                <Input type="number" value={playerScore} onChange={e => setPlayerScore(e.target.value)} placeholder="Enter your score" className="border-gray-300 focus:border-blue-500" />
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  Rate Limit: {rateLimitInfo.submissionCount}/{maxSubmissionsPerWindow} submissions used
                </div>
                {rateLimitInfo.timeUntilReset > 0 && <div className="text-xs text-gray-500">
                    Resets in: {Math.ceil(rateLimitInfo.timeUntilReset / 1000)}s
                  </div>}
              </div>

              <Button onClick={handleScoreSubmit} disabled={rateLimitInfo.isLimited} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Submit Score
              </Button>
            </CardContent>
          </Card>}

        {activeTab === 'manage' && <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-gray-200">
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle>Add New Game Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Game Name</label>
                    <Input value={newGameTypeName} onChange={e => setNewGameTypeName(e.target.value)} placeholder="Enter game name" className="border-gray-300 focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Description</label>
                    <Input value={newGameTypeDescription} onChange={e => setNewGameTypeDescription(e.target.value)} placeholder="Enter description" className="border-gray-300 focus:border-blue-500" />
                  </div>
                </div>
                <Button onClick={handleAddGameType} disabled={!newGameTypeName.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Game Type
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle>Existing Game Types</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {gameTypes.map((gameType, index) => <div key={gameType.id}>
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <div className="font-semibold text-black">{gameType.name}</div>
                        <div className="text-sm text-gray-600">{gameType.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {getTopScores(gameType.id).length} scores recorded
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveGameType(gameType.id)} className="bg-red-600 hover:bg-red-700 text-white">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {index < gameTypes.length - 1 && <Separator />}
                  </div>)}
              </CardContent>
            </Card>
          </div>}
      </div>
    </div>
  );
};

export default GameLeaderboardSystem;
