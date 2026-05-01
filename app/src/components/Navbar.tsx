import { useNavigate } from 'react-router';
import { ArrowLeft, Settings, Save } from 'lucide-react';
import { useGameState } from '@/engine/GameState';
import { saveGame } from '@/engine/SaveSystem';

export default function Navbar() {
  const navigate = useNavigate();
  const { state, dispatch } = useGameState();

  const handleSave = () => {
    saveGame(state);
    dispatch({ type: 'ADD_LOG', payload: {
      id: `save_${Date.now()}`,
      familyName: '系统',
      action: '游戏已保存',
      timestamp: Date.now(),
    }});
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-50"
      style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-[#A0A0A0] hover:text-white transition-colors duration-200"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">返回</span>
      </button>
      
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#FFD700] transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          <Save size={18} />
          <span className="text-sm font-medium">存档</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#A0A0A0] hover:text-white transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          <Settings size={18} />
          <span className="text-sm font-medium">设置</span>
        </button>
      </div>
    </nav>
  );
}
