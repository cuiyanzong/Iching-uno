import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function StabilityTest() {
  const [errors, setErrors] = useState<Array<{type: string, message: string, time: number}>>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setErrors(prev => [...prev, {
        type: 'Error',
        message: event.message,
        time: Date.now()
      }]);
    };
    
    const handleRejection = (event: PromiseRejectionEvent) => {
      setErrors(prev => [...prev, {
        type: 'Promise Rejection',
        message: String(event.reason),
        time: Date.now()
      }]);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);
  
  const runStabilityTest = async () => {
    setIsRunning(true);
    setErrors([]);
    
    try {
      // 模拟各种可能导致错误的操作
      for (let i = 0; i < 10; i++) {
        // 测试WebSocket连接
        const ws = new WebSocket(`ws://localhost:5000/game-ws?playerId=1&gameId=1`);
        ws.onopen = () => ws.close();
        
        // 测试API调用
        await fetch('/api/games/1').catch(() => {});
        await fetch('/api/games/999').catch(() => {});
        
        // 等待一小段时间
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log('Stability test completed');
    } catch (error) {
      console.error('Stability test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">稳定性测试</h3>
      
      <Button 
        onClick={runStabilityTest} 
        disabled={isRunning}
        className="mb-4"
      >
        {isRunning ? '测试中...' : '开始稳定性测试'}
      </Button>
      
      <div className="space-y-2">
        <p>错误计数: {errors.length}</p>
        
        {errors.length > 0 && (
          <div className="max-h-40 overflow-y-auto space-y-1">
            {errors.slice(-10).map((error, index) => (
              <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                <div className="font-semibold">{error.type}</div>
                <div className="truncate">{error.message}</div>
                <div className="text-xs text-gray-500">
                  {new Date(error.time).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}