import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MenuItem } from '../types';
import { PlusIcon, SaveIcon, SparklesIcon } from './Icons';

interface AddItemModalProps {
    onClose: () => void;
    onSave: (itemData: Omit<MenuItem, 'id'> | MenuItem) => void;
    itemToEdit?: MenuItem | null;
    categories: string[];
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onSave, itemToEdit, categories }) => {
    const isEditing = !!itemToEdit;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [isVeg, setIsVeg] = useState(true);
    const [error, setError] = useState('');
    const [isSuggesting, setIsSuggesting] = useState(false);

    useEffect(() => {
        if (isEditing && itemToEdit) {
            setName(itemToEdit.name);
            setDescription(itemToEdit.description);
            setPrice(String(itemToEdit.price));
            setCategory(itemToEdit.category);
            setIsVeg(itemToEdit.isVeg);
        } else {
            setCategory(categories[0] || '');
        }
    }, [itemToEdit, isEditing, categories]);


    const handleSuggestion = async () => {
        if (!name.trim()) {
            setError('Please enter an item name first to get a suggestion.');
            return;
        }
        setError('');
        setIsSuggesting(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Generate a short, enticing menu description for an Indian dish called '${name}'. Keep it under 15 words and sound appealing.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const text = response.text.trim();
            setDescription(text);

        } catch (err) {
            console.error('AI suggestion failed:', err);
            setError('Could not generate a suggestion. Please try again or write one manually.');
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !price || !category.trim()) {
            setError('Item name, price, and category are required.');
            return;
        }
        const priceValue = parseFloat(price);
        if (isNaN(priceValue) || priceValue <= 0) {
            setError('Please enter a valid price greater than zero.');
            return;
        }
        
        const itemData = {
            name: name.trim(),
            description: description.trim(),
            price: priceValue,
            category: category.trim(),
            isVeg
        };

        if (isEditing && itemToEdit) {
            onSave({ ...itemData, id: itemToEdit.id });
        } else {
            onSave(itemData);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-amber-400 mb-4">{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                {error && <p className="bg-red-500/20 text-red-400 p-2 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="itemName" className="block text-sm font-medium text-slate-300 mb-1">Item Name</label>
                        <input
                            id="itemName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                        />
                    </div>
                    <div>
                         <div className="flex justify-between items-center mb-1">
                            <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description</label>
                            <button 
                                type="button" 
                                onClick={handleSuggestion}
                                disabled={isSuggesting || !name.trim()}
                                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <SparklesIcon />
                                {isSuggesting ? 'Suggesting...' : 'AI Suggest'}
                            </button>
                        </div>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            disabled={isSuggesting}
                            placeholder={isSuggesting ? 'Generating a tasty description...' : ''}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-slate-300 mb-1">Price (Rs.)</label>
                            <input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                required
                                min="0.01"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                            <input
                                id="category"
                                type="text"
                                list="category-list"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="e.g., Appetizers"
                                required
                            />
                            <datalist id="category-list">
                                {categories.map(cat => (
                                    <option key={cat} value={cat} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Food Type</label>
                        <div className="flex items-center gap-6">
                             <div className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    id="isVegRadio" 
                                    name="isVeg" 
                                    checked={isVeg} 
                                    onChange={() => setIsVeg(true)} 
                                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                                />
                                <label htmlFor="isVegRadio" className="text-green-400 cursor-pointer">Vegetarian</label>
                            </div>
                             <div className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    id="isNonVegRadio" 
                                    name="isVeg" 
                                    checked={!isVeg} 
                                    onChange={() => setIsVeg(false)} 
                                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                                />
                                <label htmlFor="isNonVegRadio" className="text-red-400 cursor-pointer">Non-Vegetarian</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded-md bg-slate-600 hover:bg-slate-500 text-white font-semibold transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex items-center gap-2 py-2 px-4 rounded-md bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors">
                           {isEditing ? <SaveIcon /> : <PlusIcon/>} {isEditing ? 'Save Changes' : 'Save Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};