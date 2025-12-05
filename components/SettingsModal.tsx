
import React, { useState } from 'react';
import { PrintSettings } from '../types';

interface SettingsModalProps {
    settings: PrintSettings;
    onUpdateSettings: (setting: keyof PrintSettings, value: boolean) => void;
    onClose: () => void;
    staffList: string[];
    onUpdateStaffList: (newList: string[]) => void;
}

const ToggleSwitch: React.FC<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    id: string;
}> = ({ label, checked, onChange, id }) => {
    return (
        <label htmlFor={id} className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-300">{label}</span>
            <div className="relative">
                <input
                    type="checkbox"
                    id={id}
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className="block bg-slate-600 w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'translate-x-6 bg-amber-400' : ''}`}></div>
            </div>
        </label>
    );
};


export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onUpdateSettings, onClose, staffList, onUpdateStaffList }) => {
    const [editableStaffList, setEditableStaffList] = useState([...staffList]);

    const handleStaffNameChange = (index: number, newName: string) => {
        const newList = [...editableStaffList];
        newList[index] = newName;
        setEditableStaffList(newList);
    };

    const handleDone = () => {
        onUpdateStaffList(editableStaffList);
        onClose();
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={handleDone}
        >
            <div 
                className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-amber-400 mb-6 border-b border-slate-700 pb-3">Print Customization</h2>
                        <div className="space-y-4">
                            <ToggleSwitch 
                                id="showAddress"
                                label="Show Address"
                                checked={settings.showAddress}
                                onChange={(val) => onUpdateSettings('showAddress', val)}
                            />
                            <ToggleSwitch 
                                id="showPhone"
                                label="Show Phone Number"
                                checked={settings.showPhone}
                                onChange={(val) => onUpdateSettings('showPhone', val)}
                            />
                             <ToggleSwitch 
                                id="showGstin"
                                label="Show GSTIN (on Bill)"
                                checked={settings.showGstin}
                                onChange={(val) => onUpdateSettings('showGstin', val)}
                            />
                             <ToggleSwitch 
                                id="showGuestInfo"
                                label="Show Guest Name / Room"
                                checked={settings.showGuestInfo}
                                onChange={(val) => onUpdateSettings('showGuestInfo', val)}
                            />
                             <ToggleSwitch 
                                id="showStaffInfo"
                                label="Show Staff Name"
                                checked={settings.showStaffInfo}
                                onChange={(val) => onUpdateSettings('showStaffInfo', val)}
                            />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-amber-400 mb-4 border-b border-slate-700 pb-3">Manage Staff</h2>
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                           {editableStaffList.map((staff, index) => (
                               <input
                                   key={index}
                                   type="text"
                                   value={staff}
                                   onChange={(e) => handleStaffNameChange(index, e.target.value)}
                                   className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                   placeholder={`Staff Member ${index + 1}`}
                               />
                           ))}
                        </div>
                    </div>

                </div>

                <div className="flex justify-end pt-8">
                     <button type="button" onClick={handleDone} className="py-2 px-6 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
