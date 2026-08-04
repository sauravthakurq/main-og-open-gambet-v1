import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SettingSection, SettingRow, SettingToggle, SettingSelect, SettingInput, SettingAction } from './SettingsShared';
import { CountrySelect } from '@/components/ui/CountrySelect';
import { User, LogOut, Trash2, Swords, RefreshCw, Eye, MousePointer2, Clock, Volume2, Mic, Bot, LineChart, MessageSquare, Zap, Globe, Calendar, MapPin, Shield, Lock, History, UserX, Database, Trash, Info, FileText, HelpCircle, Bug, Key, Cloud } from 'lucide-react';

export const AccountSettingsTab = () => {
  const { account, updateAccount } = useSettingsStore();

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SettingSection title="Public Profile" icon={User} description="Manage your public-facing details.">
        <SettingRow title="Username" description="Your unique display name">
          <SettingInput value={account.username} onChange={(v: string) => updateAccount({ username: v })} placeholder="Username" />
        </SettingRow>
        <SettingRow title="Bio" description="A short description about yourself">
          <SettingInput value={account.bio} onChange={(v: string) => updateAccount({ bio: v })} placeholder="Chess enthusiast..." />
        </SettingRow>
        <SettingRow title="Country" description="The flag displayed next to your name" isLast>
          <CountrySelect 
            value={account.country} 
            onChange={(v: string) => updateAccount({ country: v })} 
          />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Account Actions" icon={Lock}>
        <SettingAction label="Sign Out" icon={LogOut} onClick={() => alert('Signing out...')} />
        <SettingAction label="Delete Account" icon={Trash2} destructive onClick={() => confirm('Are you sure you want to delete your account? This cannot be undone.')} />
      </SettingSection>
    </div>
  );
};

export const GameplaySettingsTab = () => {
  const { gameplay, updateGameplay } = useSettingsStore();

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SettingSection title="Match Experience" icon={Swords} description="Configure how pieces move and board behaves.">
        <SettingRow title="Move Confirmation" description="Require an extra click to confirm moves">
          <SettingToggle checked={gameplay.moveConfirmation} onChange={(v) => updateGameplay({ moveConfirmation: v })} />
        </SettingRow>
        <SettingRow title="Auto Queen Promotion" description="Automatically promote to a Queen">
          <SettingToggle checked={gameplay.autoQueenPromotion} onChange={(v) => updateGameplay({ autoQueenPromotion: v })} />
        </SettingRow>
        <SettingRow title="Show Legal Moves" description="Highlight valid squares when a piece is selected">
          <SettingToggle checked={gameplay.showLegalMoves} onChange={(v) => updateGameplay({ showLegalMoves: v })} />
        </SettingRow>
        <SettingRow title="Auto-Flip Board" description="Automatically flip board when playing as Black" isLast>
          <SettingToggle checked={gameplay.autoFlipBoard} onChange={(v) => updateGameplay({ autoFlipBoard: v })} />
        </SettingRow>
      </SettingSection>
    </div>
  );
};

export const ClockSettingsTab = () => {
  const { clock, updateClock } = useSettingsStore();

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SettingSection title="Time Management" icon={Clock} description="Visual and audio cues for the clock.">
        <SettingRow title="Low-Time Warning" description="Flashes board and pulses clock below 30s">
          <SettingToggle checked={clock.lowTimeWarning} onChange={(v) => updateClock({ lowTimeWarning: v })} />
        </SettingRow>
        <SettingRow title="Countdown Voice" description="Spoken countdown for the last 10 seconds">
          <SettingToggle checked={clock.countdownVoice} onChange={(v) => updateClock({ countdownVoice: v })} />
        </SettingRow>
        <SettingRow title="Clock Sound" description="The sound played when hitting the clock" isLast>
          <SettingSelect 
            value={clock.clockSound} 
            onChange={(v: string) => updateClock({ clockSound: v })} 
            options={[ { label: 'Standard', value: 'Standard' }, { label: 'Mechanical', value: 'Mechanical' }, { label: 'Digital', value: 'Digital' }, { label: 'Silent', value: 'Silent' } ]}
          />
        </SettingRow>
      </SettingSection>
    </div>
  );
};

export const AISettingsTab = () => {
  const { ai, updateAI } = useSettingsStore();

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SettingSection title="Artificial Intelligence" icon={Bot} description="Configure AI engines and analysis tools.">
        <SettingRow title="Default AI Model" description="The primary engine used for bot matches">
          <SettingSelect 
            value={ai.defaultModel} 
            onChange={(v: string) => updateAI({ defaultModel: v })} 
            options={[ { label: 'Stockfish 16.1', value: 'Stockfish' }, { label: 'AlphaZero (Cloud)', value: 'AlphaZero' }, { label: 'GPT-4o (Language)', value: 'GPT-4o' } ]}
          />
        </SettingRow>
        <SettingRow title="Auto Analysis" description="Automatically analyze games after they end">
          <SettingToggle checked={ai.autoAnalysis} onChange={(v) => updateAI({ autoAnalysis: v })} />
        </SettingRow>
        <SettingRow title="Hint Mode" description="Allow requesting hints against bots">
          <SettingToggle checked={ai.hintMode} onChange={(v) => updateAI({ hintMode: v })} />
        </SettingRow>
        <SettingRow title="Evaluation Bar" description="Show the engine evaluation bar during games">
          <SettingToggle checked={ai.showEvalBar} onChange={(v) => updateAI({ showEvalBar: v })} />
        </SettingRow>
        <SettingRow title="Best Move Suggestions" description="Show arrows for the best engine moves in analysis" isLast>
          <SettingToggle checked={ai.showBestMove} onChange={(v) => updateAI({ showBestMove: v })} />
        </SettingRow>
      </SettingSection>
    </div>
  );
};

export const LanguageSettingsTab = () => {
  const { language, updateLanguage } = useSettingsStore();

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SettingSection title="Localization" icon={Globe} description="Format dates, times, and app language.">
        <SettingRow title="App Language" description="The language of the user interface">
          <SettingSelect 
            value={language.appLanguage} 
            onChange={(v: string) => updateLanguage({ appLanguage: v })} 
            options={[ { label: 'English', value: 'English' }, { label: 'Spanish', value: 'Spanish' }, { label: 'Hindi', value: 'Hindi' }, { label: 'Russian', value: 'Russian' } ]}
          />
        </SettingRow>
        <SettingRow title="Time Format" description="12-hour or 24-hour clock display">
          <SettingSelect 
            value={language.timeFormat} 
            onChange={(v: string) => updateLanguage({ timeFormat: v as '12h'|'24h' })} 
            options={[ { label: '12 Hour (AM/PM)', value: '12h' }, { label: '24 Hour', value: '24h' } ]}
          />
        </SettingRow>
        <SettingRow title="Date Format" description="How dates are presented">
          <SettingSelect 
            value={language.dateFormat} 
            onChange={(v: string) => updateLanguage({ dateFormat: v })} 
            options={[ { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' }, { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' }, { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' } ]}
          />
        </SettingRow>
        <SettingRow title="Region" description="Used for local tournament matchmaking" isLast>
          <SettingInput value={language.region} onChange={(v: string) => updateLanguage({ region: v })} placeholder="United States" />
        </SettingRow>
      </SettingSection>
    </div>
  );
};

export const PrivacySettingsTab = () => {
  const { privacy, updatePrivacy } = useSettingsStore();

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SettingSection title="Privacy & Visibility" icon={Shield} description="Control who can see your activity.">
        <SettingRow title="Online Status" description="Show when you are active on the platform">
          <SettingToggle checked={privacy.onlineStatus} onChange={(v) => updatePrivacy({ onlineStatus: v })} />
        </SettingRow>
        <SettingRow title="Public Profile" description="Allow others to view your profile">
          <SettingToggle checked={privacy.publicProfile} onChange={(v) => updatePrivacy({ publicProfile: v })} />
        </SettingRow>
        <SettingRow title="Show Rating" description="Display your Elo rating publicly">
          <SettingToggle checked={privacy.showRating} onChange={(v) => updatePrivacy({ showRating: v })} />
        </SettingRow>
        <SettingRow title="Show Match History" description="Allow others to review your past games">
          <SettingToggle checked={privacy.showMatchHistory} onChange={(v) => updatePrivacy({ showMatchHistory: v })} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Blocked Users" icon={UserX}>
        <SettingAction label="Manage Blocked Players" icon={UserX} onClick={() => alert('No blocked players yet.')} />
      </SettingSection>
    </div>
  );
};

export const StorageSettingsTab = () => {
  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SettingSection title="Local Storage" icon={Database} description="Manage cached assets and data.">
        <SettingRow title="Calculated Cache Size" description="Includes downloaded boards, pieces, and engines">
          <span className="text-[var(--color-accent)] font-mono font-bold">142 MB</span>
        </SettingRow>
        <SettingAction 
          label="Clear Cache" 
          icon={Trash} 
          destructive 
          onClick={() => {
            if(confirm('Are you sure you want to clear your local cache? This will reset all your settings to defaults.')) {
              localStorage.clear();
              window.location.reload();
            }
          }} 
        />
      </SettingSection>
    </div>
  );
};

export const AboutSettingsTab = () => {
  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SettingSection title="About Gambit" icon={Info} description="Version 2.0.0 (Build 4209)">
        <SettingAction label="Changelog" icon={FileText} onClick={() => alert('Version 2.0.0: Premium redesign and AI overhaul!')} />
        <SettingAction label="Licenses" icon={FileText} onClick={() => alert('Open source licenses...')} />
        <SettingAction label="Terms of Service" icon={Shield} onClick={() => alert('TOS...')} />
        <SettingAction label="Privacy Policy" icon={Lock} onClick={() => alert('Privacy Policy...')} />
      </SettingSection>

      <SettingSection title="Support" icon={HelpCircle}>
        <SettingAction label="Contact Support" icon={MessageSquare} onClick={() => alert('Redirecting to support...')} />
        <SettingAction label="Report a Bug" icon={Bug} onClick={() => alert('Bug report dialog opened.')} />
      </SettingSection>
    </div>
  );
};

export const ApiSettingsTab = () => {
  const { api, updateApi } = useSettingsStore();

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SettingSection title="API Configuration" icon={Key} description="Manage your API keys for AI opponents and Gambit Coach.">
        
        <SettingRow title="Storage Location" description="Choose where your keys are saved securely.">
           <SettingSelect 
             value={api.storageLocation} 
             onChange={(v: string) => updateApi({ storageLocation: v as 'local' | 'firebase' })}
             options={[
               { value: 'local', label: 'Local (Browser Storage)' },
               { value: 'firebase', label: 'Cloud (Firebase Sync)' }
             ]}
           />
        </SettingRow>

        <div className="mt-8 mb-4">
           <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-1">AI Providers</h4>
           <p className="text-xs text-white/40">Enter API keys for external models</p>
        </div>

        <SettingRow title="OpenAI API Key" description="Required for GPT-4 and GPT-3.5 models">
          <div className="w-64">
            <SettingInput 
              value={api.openaiKey} 
              onChange={(v: string) => updateApi({ openaiKey: v })} 
              placeholder="sk-..." 
              type="password"
            />
          </div>
        </SettingRow>

        <SettingRow title="Anthropic API Key" description="Required for Claude 3 models">
          <div className="w-64">
            <SettingInput 
              value={api.anthropicKey} 
              onChange={(v: string) => updateApi({ anthropicKey: v })} 
              placeholder="sk-ant-..." 
              type="password"
            />
          </div>
        </SettingRow>

        <SettingRow title="Google Gemini API Key" description="Required for Gemini Pro models">
          <div className="w-64">
            <SettingInput 
              value={api.googleKey} 
              onChange={(v: string) => updateApi({ googleKey: v })} 
              placeholder="AIza..." 
              type="password"
            />
          </div>
        </SettingRow>

        <div className="mt-8 mb-4">
           <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-1">Gambit AI</h4>
           <p className="text-xs text-white/40">Enter your Gambit Premium key</p>
        </div>

        <SettingRow title="Gambit API Key" description="Unlocks Gambit Coach and Premium features" isLast>
          <div className="w-64">
            <SettingInput 
              value={api.gambitKey} 
              onChange={(v: string) => updateApi({ gambitKey: v })} 
              placeholder="gbt_..." 
              type="password"
            />
          </div>
        </SettingRow>

      </SettingSection>

      {api.storageLocation === 'firebase' && (
        <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-4">
           <Cloud className="text-blue-400 shrink-0 mt-0.5" size={20} />
           <div>
             <h4 className="text-sm font-bold text-blue-400">Cloud Sync Active</h4>
             <p className="text-xs text-blue-400/70 mt-1">
               Your API keys are securely synced to your Firebase account and will be available on all your devices.
             </p>
           </div>
        </div>
      )}
    </div>
  );
};

