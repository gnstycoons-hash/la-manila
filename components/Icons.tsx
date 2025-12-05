import React from 'react';

const iconProps = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
};

const smallIconProps = {
    ...iconProps,
    width: "16",
    height: "16",
}


export const SearchIcon: React.FC = () => (
    <svg {...smallIconProps} className="text-slate-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

export const VegIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...smallIconProps} className={`text-green-500 border border-green-500 p-0.5 ${className}`}><circle cx="12" cy="12" r="5"></circle></svg>
);

export const NonVegIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...smallIconProps} className={`text-red-500 border border-red-500 p-0.5 ${className}`}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

export const PlusIcon: React.FC = () => (
    <svg {...smallIconProps}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export const MinusIcon: React.FC = () => (
    <svg {...smallIconProps}><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export const TrashIcon: React.FC = () => (
    <svg {...smallIconProps}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

export const UserIcon: React.FC = () => (
    <svg {...smallIconProps}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

export const PhoneIcon: React.FC = () => (
    <svg {...smallIconProps}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

export const RoomIcon: React.FC = () => (
    <svg {...smallIconProps}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);

export const StaffIcon: React.FC = () => (
    <svg {...smallIconProps}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

export const PdfIcon: React.FC = () => (
    <svg {...smallIconProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

export const PrintIcon: React.FC = () => (
    <svg {...smallIconProps}><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
);

export const ShareIcon: React.FC = () => (
    <svg {...smallIconProps}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
);

export const SaveIcon: React.FC = () => (
    <svg {...smallIconProps}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);

export const KOTIcon: React.FC = () => (
     <svg {...smallIconProps}><path d="M22 10v6M2 10v6M12 2v20M17 5l-1.6-1.4c-.4-.3-1-.3-1.4 0L10 8l-4-4-6 6 6 6-3 3 6 6 6-6-3-3 3-3 1-1" /></svg>
);

export const HistoryIcon: React.FC = () => (
    <svg {...smallIconProps}><path d="M1 4v6h6"></path><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
);

export const XIcon: React.FC = () => (
    <svg {...smallIconProps}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export const EditIcon: React.FC = () => (
    <svg {...smallIconProps}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

export const CheckIcon: React.FC = () => (
    <svg {...smallIconProps}><polyline points="20 6 9 17 5 13"></polyline></svg>
);

export const NCIcon: React.FC = () => (
     <svg {...smallIconProps}><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
);

export const ClockIcon: React.FC = () => (
    <svg {...smallIconProps}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

export const SpecialRequestIcon: React.FC = () => (
    <svg {...smallIconProps}><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" /></svg>
);

export const SparklesIcon: React.FC = () => (
    <svg {...smallIconProps} viewBox="0 0 24 24" stroke="currentColor">
       <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
       <path d="M18 6L17.5 7.5L16 8L17.5 8.5L18 10L18.5 8.5L20 8L18.5 7.5L18 6Z" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor"/>
       <path d="M6 18L5.5 16.5L4 16L5.5 15.5L6 14L6.5 15.5L8 16L6.5 16.5L6 18Z" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor"/>
    </svg>
);


export const CloudIcon: React.FC = () => (
    <svg {...smallIconProps}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
);

export const CloudOfflineIcon: React.FC = () => (
    <svg {...smallIconProps}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2.5" />
    </svg>
);

export const SettingsIcon: React.FC = () => (
     <svg {...iconProps}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);

export const TableIcon: React.FC = () => (
    <svg {...smallIconProps}><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
);