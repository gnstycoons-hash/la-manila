
import React from 'react';
import { SettingsIcon, CloudIcon, CloudOfflineIcon } from './Icons';

interface HeaderProps {
    onSettingsClick: () => void;
    isOnline: boolean;
    pendingSyncCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick, isOnline, pendingSyncCount }) => {
    return (
        <header className="bg-slate-950 shadow-lg sticky top-0 z-20">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-amber-400 tracking-wider">
                    La Manila Kanishka
                </h1>
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-colors ${isOnline ? 'bg-green-800 text-green-200' : 'bg-slate-700 text-slate-300'}`}>
                        {isOnline ? <CloudIcon /> : <CloudOfflineIcon />}
                        <span>{isOnline ? 'Online' : 'Offline'}</span>
                        {pendingSyncCount > 0 && !isOnline && (
                            <span 
                                className="ml-2 bg-amber-500 text-slate-900 font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse" 
                                title={`${pendingSyncCount} ${pendingSyncCount === 1 ? 'order' : 'orders'} waiting to sync`}
                            >
                                {pendingSyncCount}
                            </span>
                        )}
                    </div>
                    <h2 className="text-lg md:text-xl text-slate-300 hidden sm:block">Point of Sale</h2>
                     <button 
                        onClick={onSettingsClick} 
                        className="text-slate-400 hover:text-amber-400 transition-colors"
                        aria-label="Open print settings"
                    >
                        <SettingsIcon />
                    </button>
                </div>
            </div>
        </header>
    );
};
