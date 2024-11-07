import React, { useState, useEffect } from 'react';
import { Star, Trophy, Award, Crown, Heart, Sparkles, Smile, Frown, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const DEFAULT_ACTIVITIES = [
  { id: 'eat', name: 'Comer Bem', icon: '🍎', xp: 50 },
  { id: 'sleep', name: 'Dormir na Hora', icon: '😴', xp: 50 },
  { id: 'homework', name: 'Fazer a Lição', icon: '📚', xp: 100 },
  { id: 'behave', name: 'Comportar-se Bem', icon: '🤗', xp: 75 },
  { id: 'brush', name: 'Escovou Dentes', icon: '🪥', xp: 50 },
  { id: 'fun', name: 'Divertiu Muito', icon: '😄', xp: 50 }
];

const ACHIEVEMENTS = [
  { id: 'streak3', name: 'Herói Iniciante', icon: '🥉', description: 'Complete 3 dias seguidos' },
  { id: 'streak7', name: 'Super Herói', icon: '🥈', description: 'Complete 7 dias seguidos' },
  { id: 'streak30', name: 'Mega Herói', icon: '🥇', description: 'Complete 30 dias seguidos' },
  { id: 'allTasks', name: 'Campeão do Dia', icon: '🌟', description: '100% das tarefas em um dia' }
];

const LEVELS = [
  { level: 1, xpNeeded: 0, title: 'Herói Novato' },
  { level: 2, xpNeeded: 500, title: 'Herói Aprendiz' },
  { level: 3, xpNeeded: 1200, title: 'Herói em Treinamento' },
  { level: 4, xpNeeded: 2000, title: 'Herói Experiente' },
  { level: 5, xpNeeded: 3000, title: 'Super Herói' },
  { level: 6, xpNeeded: 4500, title: 'Mega Herói' },
  { level: 7, xpNeeded: 6000, title: 'Herói Lendário' }
];

const THEMES = {
  hero: 'from-blue-500 via-purple-500 to-pink-500',
  space: 'from-indigo-600 via-purple-600 to-pink-600',
  forest: 'from-green-500 via-emerald-500 to-teal-500',
  sunset: 'from-orange-500 via-red-500 to-pink-500'
};

interface Activity {
  id: string;
  name: string;
  icon: string;
  xp: number;
}

const SuperKids = () => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [activities, setActivities] = useState<Activity[]>(DEFAULT_ACTIVITIES);
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});
  const [achievements, setAchievements] = useState<string[]>([]);
  const [theme, setTheme] = useState('hero');
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCompletedDate, setLastCompletedDate] = useState('');

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('superKids');
    if (savedData) {
      const data = JSON.parse(savedData);
      setName(data.name || '');
      setLevel(data.level || 1);
      setXp(data.xp || 0);
      setTotalXp(data.totalXp || 0);
      setStreak(data.streak || 0);
      setActivities(data.activities || DEFAULT_ACTIVITIES);
      setCompletedActivities(data.completedActivities || {});
      setAchievements(data.achievements || []);
      setTheme(data.theme || 'hero');
      setLastCompletedDate(data.lastCompletedDate || '');
    }
  }, []);

  // Save data when state changes
  useEffect(() => {
    localStorage.setItem('superKids', JSON.stringify({
      name,
      level,
      xp,
      totalXp,
      streak,
      activities,
      completedActivities,
      achievements,
      theme,
      lastCompletedDate
    }));
  }, [name, level, xp, totalXp, streak, activities, completedActivities, achievements, theme, lastCompletedDate]);

  // Check level up
  useEffect(() => {
    const currentLevel = LEVELS.findIndex(l => totalXp < l.xpNeeded);
    if (currentLevel > 0 && currentLevel !== level) {
      setLevel(currentLevel);
      triggerCelebration();
    }
  }, [totalXp, level]);

  const handleActivityToggle = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setCompletedActivities(prev => {
      const newActivities = { ...prev, [id]: !prev[id] };
      
      // Calculate XP gained
      if (newActivities[id]) {
        const activity = activities.find(a => a.id === id);
        if (activity) {
          setXp(prev => prev + activity.xp);
          setTotalXp(prev => prev + activity.xp);
        }
      }

      // Check if all activities are completed
      const allCompleted = activities.every(activity => newActivities[activity.id]);
      if (allCompleted && !achievements.includes('allTasks')) {
        setAchievements(prev => [...prev, 'allTasks']);
        triggerCelebration();
      }

      // Update streak
      if (lastCompletedDate !== today && allCompleted) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastCompletedDate === yesterdayStr) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          
          // Check streak achievements
          if (newStreak === 3) setAchievements(prev => [...prev, 'streak3']);
          if (newStreak === 7) setAchievements(prev => [...prev, 'streak7']);
          if (newStreak === 30) setAchievements(prev => [...prev, 'streak30']);
        } else {
          setStreak(1);
        }
        
        setLastCompletedDate(today);
      }

      return newActivities;
    });
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);

    // Play celebration sound
    const audio = new Audio('/sounds/celebration.mp3');
    audio.play().catch(() => {}); // Ignore errors if sound can't play
  };

  const getCurrentLevelProgress = () => {
    const currentLevelInfo = LEVELS[level - 1];
    const nextLevelInfo = LEVELS[level];
    if (!nextLevelInfo) return 100;
    
    const levelXp = totalXp - currentLevelInfo.xpNeeded;
    const xpNeededForNextLevel = nextLevelInfo.xpNeeded - currentLevelInfo.xpNeeded;
    return (levelXp / xpNeededForNextLevel) * 100;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-r ${THEMES[theme]} p-8`}>
      <div className="max-w-4xl mx-auto grid gap-6">
        {/* Header and Level */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Crown className="h-8 w-8 text-yellow-400" />
              <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Super Kids
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-full p-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">Nível {level} - {LEVELS[level - 1].title}</span>
                  <span className="text-sm text-gray-600">{xp} XP</span>
                </div>
                <Progress value={getCurrentLevelProgress()} className="h-3" />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-blue-50 p-4">
                <div className="text-center">
                  <Trophy className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="font-bold">{streak} Dias</div>
                  <div className="text-sm text-gray-600">Sequência</div>
                </div>
              </Card>
              
              <Card className="bg-green-50 p-4">
                <div className="text-center">
                  <Award className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="font-bold">{achievements.length}</div>
                  <div className="text-sm text-gray-600">Conquistas</div>
                </div>
              </Card>
              
              <Card className="bg-yellow-50 p-4">
                <div className="text-center">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <div className="font-bold">{totalXp}</div>
                  <div className="text-sm text-gray-600">XP Total</div>
                </div>
              </Card>
              
              <Card className="bg-purple-50 p-4">
                <div className="text-center">
                  <Heart className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <div className="font-bold">{level}</div>
                  <div className="text-sm text-gray-600">Nível</div>
                </div>
              </Card>
            </div>

            {/* Activities */}
            <div className="grid grid-cols-2 gap-4">
              {activities.map(({ id, name, icon, xp }) => (
                <Button
                  key={id}
                  onClick={() => handleActivityToggle(id)}
                  className={`text-lg flex items-center justify-center space-x-2 ${
                    completedActivities[id] ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{name}</span>
                  <span className="text-xs">+{xp}XP</span>
                  {completedActivities[id] ? <Smile className="ml-2" /> : <Frown className="ml-2" />}
                </Button>
              ))}
            </div>

            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Conquistas Desbloqueadas</h3>
                <div className="flex flex-wrap gap-2">
                  {achievements.map(id => {
                    const achievement = ACHIEVEMENTS.find(a => a.id === id);
                    if (achievement) {
                      return (
                        <Badge key={id} variant="secondary" className="text-lg">
                          {achievement.icon} {achievement.name}
                        </Badge>
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}
    </div>
  );
};

export default SuperKids;