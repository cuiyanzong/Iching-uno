import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Medal, Award, User } from 'lucide-react';
import { getLeaderboard, type PermanentScoreData } from '@/utils/permanentScores';
import { getGlobalLeaderboard } from '@/utils/globalLeaderboard';
import type { GlobalLeaderboard } from '@shared/schema';
import { useState, useEffect } from 'react';

interface LeaderboardProps {
  onClose: () => void;
}

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<GlobalLeaderboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalLeaderboard = async () => {
      try {
        setIsLoading(true);
        const data = await getGlobalLeaderboard();
        setGlobalLeaderboard(data);
      } catch (err) {
        console.error('获取全球排行榜失败:', err);
        setError('获取排行榜失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{rank}</span>;
    }
  };

  const formatWinRate = (wins: number, gamesPlayed: number, defeats: number = 0, draws: number = 0) => {
    // 总游戏局数 = 胜 + 负 + 平
    const totalGames = wins + defeats + draws;
    if (totalGames === 0) return '0%';
    return `${Math.round((wins / totalGames) * 100)}%`;
  };

  // 新的排名规则：积分 > 胜率 > 回合数（越少越好）
  const sortedLeaderboard = [...globalLeaderboard].sort((a, b) => {
    // 第一优先级：积分越高排名越高
    if (a.totalScore !== b.totalScore) {
      return b.totalScore - a.totalScore;
    }
    
    // 第二优先级：胜率越高排名越高
    // 总游戏局数 = 胜 + 负 + 平
    const aTotalGames = a.wins + a.defeats + (a.draws || 0);
    const bTotalGames = b.wins + b.defeats + (b.draws || 0);
    const aWinRate = aTotalGames > 0 ? a.wins / aTotalGames : 0;
    const bWinRate = bTotalGames > 0 ? b.wins / bTotalGames : 0;
    if (Math.abs(aWinRate - bWinRate) > 0.001) { // 使用小数容差
      return bWinRate - aWinRate;
    }
    
    // 第三优先级：回合数越少排名越高
    const aRounds = a.roundsPlayed || aTotalGames || 0; // 向后兼容
    const bRounds = b.roundsPlayed || bTotalGames || 0; // 向后兼容
    return aRounds - bRounds;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="bg-gray-800 border-gray-600 p-6 max-w-4xl w-full mx-2 max-h-[85vh] overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">积分排行榜</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">加载排行榜中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-400 text-lg mb-2">❌ {error}</div>
              <p className="text-gray-500 text-sm">请检查网络连接</p>
            </div>
          ) : globalLeaderboard.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">暂无排行榜数据</p>
              <p className="text-gray-500 text-sm mt-2">成为第一个上传成绩的玩家吧！</p>
            </div>
          ) : (
            sortedLeaderboard.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border-yellow-600'
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-900/20 to-gray-800/20 border-gray-600'
                    : index === 2
                    ? 'bg-gradient-to-r from-amber-900/20 to-amber-800/20 border-amber-600'
                    : 'bg-gray-700/50 border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600">
                    {getRankIcon(index + 1)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{player.playerName}</h3>
                    <div className="text-sm text-gray-400">
                      胜率: {formatWinRate(player.wins, player.gamesPlayed, player.defeats, player.draws || 0)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <span>{player.wins + player.defeats + (player.draws || 0)}局</span>
                      <span>{player.roundsPlayed || player.gamesPlayed || 0}回合</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <span>小胜:{player.smallWins}</span>
                      <span>双杀:{player.doubleKills}</span>
                      <span>团灭:{player.quadKills}</span>
                      <span>清牌:{player.clearCards}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{player.totalScore}</div>
                  <div className="text-sm text-gray-400">积分</div>
                  <div className="text-xs text-gray-500">
                    {player.uploadDate ? new Date(player.uploadDate).toLocaleDateString() : '未知'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}