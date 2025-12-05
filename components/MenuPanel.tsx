import React, { useState, useMemo, useEffect } from 'react';
import { MenuItem } from '../types';
import { SearchIcon, VegIcon, NonVegIcon, PlusIcon, HistoryIcon, XIcon, EditIcon, CheckIcon } from './Icons';

interface MenuPanelProps {
    onAddItem: (item: MenuItem) => void;
    menuItems: MenuItem[];
    onAddNewItemClick: () => void;
    searchHistory: string[];
    onAddToSearchHistory: (term: string) => void;
    onClearSearchHistory: () => void;
    onEditItem: (item: MenuItem) => void;
    categories: string[];
    onUpdateCategoryName: (oldName: string, newName: string) => void;
}

const MenuItemCard: React.FC<{ item: MenuItem; onAddItem: (item: MenuItem) => void; onEditItem: (item: MenuItem) => void; }> = ({ item, onAddItem, onEditItem }) => {
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the card's onClick from firing
        onEditItem(item);
    };
    
    return (
    <div 
        className="bg-slate-800 rounded-lg p-3 flex flex-col justify-between hover:bg-slate-700 hover:shadow-amber-500/10 shadow-md transition-all duration-300 cursor-pointer group relative"
        onClick={() => onAddItem(item)}
    >
        <button
            onClick={handleEditClick}
            className="absolute top-2 right-2 p-1.5 bg-slate-900/50 rounded-full text-slate-400 hover:bg-slate-900/80 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Edit item"
        >
            <EditIcon />
        </button>
        <div>
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-slate-100 flex items-center pr-2">
                    {item.isVeg ? <VegIcon className="mr-2 flex-shrink-0" /> : <NonVegIcon className="mr-2 flex-shrink-0" />}
                    <span>{item.name}</span>
                </h4>
                <p className="font-bold text-amber-300 whitespace-nowrap">Rs. {item.price.toFixed(2)}</p>
            </div>
            <p className="text-sm text-slate-400 mt-1">{item.description}</p>
        </div>
    </div>
    );
};

export const MenuPanel: React.FC<MenuPanelProps> = ({ 
    onAddItem, 
    menuItems, 
    onAddNewItemClick, 
    searchHistory,
    onAddToSearchHistory,
    onClearSearchHistory,
    onEditItem,
    categories,
    onUpdateCategoryName
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editedName, setEditedName] = useState('');

    useEffect(() => {
        if (selectedCategory !== 'all' && !categories.includes(selectedCategory)) {
            setSelectedCategory('all');
        }
    }, [categories, selectedCategory]);

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onAddToSearchHistory(searchTerm);
        }
    };
    
    const handleHistoryClick = (term: string) => {
        setSearchTerm(term);
        onAddToSearchHistory(term);
    };

    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [menuItems, searchTerm, selectedCategory]);

    const groupedItems = useMemo(() => {
        const sortedItems = [...filteredItems].sort((a, b) => a.name.localeCompare(b.name));
        return sortedItems.reduce((acc, item) => {
            const category = item.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {} as Record<string, MenuItem[]>);
    }, [filteredItems]);

    const displayCategories = useMemo(() => ['all', ...[...categories].sort()], [categories]);
    const sortedGroupKeys = useMemo(() => Object.keys(groupedItems).sort(), [groupedItems]);

    const handleStartEdit = (cat: string) => {
        setEditingCategory(cat);
        setEditedName(cat);
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setEditedName('');
    };

    const handleSaveEdit = () => {
        if (editingCategory) {
            onUpdateCategoryName(editingCategory, editedName);
        }
        handleCancelEdit();
    };

    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };
    
    const handleCategoryClick = (cat: string) => {
        if(editingCategory) {
            handleCancelEdit();
        }
        setSelectedCategory(cat);
    };


    return (
        <div className="bg-slate-800/50 rounded-lg shadow-xl p-4 space-y-4">
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for an item and press Enter..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                     <button 
                        onClick={onAddNewItemClick}
                        className="flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-md transition-colors bg-amber-600 hover:bg-amber-500 text-white whitespace-nowrap"
                    >
                        <PlusIcon /> Add Item
                    </button>
                </div>
                {searchHistory.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-slate-400 font-semibold flex items-center gap-1.5"><HistoryIcon /> Recent:</span>
                        {searchHistory.map(term => (
                            <button
                                key={term}
                                onClick={() => handleHistoryClick(term)}
                                className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-0.5 rounded-md transition-colors"
                            >
                                {term}
                            </button>
                        ))}
                        <button onClick={onClearSearchHistory} className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-full ml-auto">
                            <XIcon />
                        </button>
                    </div>
                )}
            </div>
            
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
                {displayCategories.map(cat => (
                    <div key={cat} className="relative group flex items-center">
                        {editingCategory === cat ? (
                            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-full">
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    onKeyDown={handleEditKeyDown}
                                    onBlur={handleSaveEdit}
                                    className="bg-slate-700 text-slate-100 text-sm rounded-full px-3 py-1 focus:ring-2 focus:ring-amber-500 focus:outline-none w-48"
                                    autoFocus
                                />
                                <button onClick={handleSaveEdit} className="p-1.5 text-green-400 hover:bg-slate-700 rounded-full"><CheckIcon /></button>
                                <button onClick={handleCancelEdit} className="p-1.5 text-red-400 hover:bg-slate-700 rounded-full"><XIcon /></button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedCategory === cat ? 'bg-amber-500 text-slate-900 font-semibold' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                                >
                                    {cat === 'all' ? 'All' : cat}
                                </button>
                                {cat !== 'all' && (
                                     <button
                                        onClick={() => handleStartEdit(cat)}
                                        className="ml-1 p-1 bg-slate-700 rounded-full text-slate-400 hover:bg-amber-500 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-all"
                                        aria-label={`Edit ${cat} category`}
                                     >
                                        <EditIcon />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="space-y-6 pt-2">
                {sortedGroupKeys.length > 0 ? (
                    sortedGroupKeys.map(category => (
                        <div key={category}>
                            <h3 className="text-xl font-bold text-amber-400 mb-3">{category}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {groupedItems[category].map(item => <MenuItemCard key={item.id} item={item} onAddItem={onAddItem} onEditItem={onEditItem} />)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-500">
                        <p>No items match your search.</p>
                        {searchTerm && <button onClick={() => setSearchTerm('')} className="text-amber-500 hover:underline mt-2">Clear search</button>}
                    </div>
                )}
            </div>
        </div>
    );
};