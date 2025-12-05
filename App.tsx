import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { BillPanel } from './components/BillPanel';
import { MenuPanel } from './components/MenuPanel';
import { Header } from './components/Header';
import { Order, OrderItem, MenuItem as MenuItemType, PrintSettings } from './types';
import { PrintLayout } from './components/PrintLayout';
import { AddItemModal } from './components/AddItemModal';
import { SettingsModal } from './components/SettingsModal';
import { MENU_ITEMS, DEFAULT_STAFF_LIST, INITIAL_CATEGORIES } from './constants';

const getInitialOrderState = (): Order => ({
    id: `ORD-${Date.now()}`,
    guestName: '',
    mobileNo: '',
    roomNo: '',
    tableNo: '',
    staff: '',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    date: new Date(),
    isNC: false,
    serviceTime: '',
    specialRequest: '',
});

const getInitialPrintSettings = (): PrintSettings => {
    const defaults = {
        showAddress: true,
        showPhone: true,
        showGstin: true,
        showGuestInfo: true,
        showStaffInfo: true,
    };
    try {
        const saved = window.localStorage.getItem('posPrintSettings');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return { ...defaults, ...parsed };
            }
        }
        return defaults;
    } catch (error) {
        console.error("Failed to parse print settings from localStorage", error);
        return defaults;
    }
};


const App: React.FC = () => {
    const [currentOrder, setCurrentOrder] = useState<Order>(getInitialOrderState());
    const [printInfo, setPrintInfo] = useState<{ order: Order; type: 'bill' | 'kot' } | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [printSettings, setPrintSettings] = useState<PrintSettings>(getInitialPrintSettings());
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<MenuItemType | null>(null);
    
    const [menuItems, setMenuItems] = useState<MenuItemType[]>(() => {
        try {
            const saved = window.localStorage.getItem('posMenuItems');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.every(i => i && typeof i === 'object' && i.id && i.name)) {
                     return parsed;
                }
            }
            return MENU_ITEMS;
        } catch (error) {
            console.error("Failed to parse menu items from localStorage", error);
            return MENU_ITEMS;
        }
    });
    
    const [categories, setCategories] = useState<string[]>(() => {
        try {
            const saved = window.localStorage.getItem('posCategories');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.every(c => typeof c === 'string')) {
                    return parsed;
                }
            }
            return INITIAL_CATEGORIES;
        } catch (error) {
            console.error("Failed to parse categories from localStorage", error);
            return INITIAL_CATEGORIES;
        }
    });

    const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
    const [offlineOrders, setOfflineOrders] = useState<Order[]>(() => {
        try {
            const saved = window.localStorage.getItem('posOfflineOrders');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.every(o => o && typeof o === 'object' && o.id && Array.isArray(o.items))) {
                     return parsed;
                }
            }
            return [];
        } catch (error) {
            console.error("Failed to parse offline orders from localStorage", error);
            return [];
        }
    });

    const [staffList, setStaffList] = useState<string[]>(() => {
        try {
            const saved = window.localStorage.getItem('posStaffList');
            if (saved) {
                const parsed = JSON.parse(saved);
                 if (Array.isArray(parsed) && parsed.every(s => typeof s === 'string')) {
                    return parsed;
                }
            }
            return DEFAULT_STAFF_LIST;
        } catch (error) {
            console.error("Failed to parse staff list from localStorage", error);
            return DEFAULT_STAFF_LIST;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('posStaffList', JSON.stringify(staffList));
        } catch (error) {
            console.error("Failed to save staff list to localStorage", error);
        }
    }, [staffList]);

    const [searchHistory, setSearchHistory] = useState<string[]>(() => {
        try {
            const saved = window.localStorage.getItem('posSearchHistory');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.every(s => typeof s === 'string')) {
                    return parsed;
                }
            }
            return [];
        } catch (error) {
            console.error("Failed to parse search history from localStorage", error);
            return [];
        }
    });
    
    useEffect(() => {
        try {
            window.localStorage.setItem('posMenuItems', JSON.stringify(menuItems));
        } catch (error) {
            console.error("Failed to save menu items to localStorage", error);
        }
    }, [menuItems]);
    
    useEffect(() => {
        try {
            window.localStorage.setItem('posCategories', JSON.stringify(categories));
        } catch (error) {
            console.error("Failed to save categories to localStorage", error);
        }
    }, [categories]);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        try {
            window.localStorage.setItem('posOfflineOrders', JSON.stringify(offlineOrders));
        } catch (error) {
            console.error("Failed to save offline orders to localStorage", error);
        }
    }, [offlineOrders]);

    useEffect(() => {
        if (isOnline && offlineOrders.length > 0) {
            const ordersToSync = [...offlineOrders];
            console.log(`Syncing ${ordersToSync.length} offline orders...`);
            ordersToSync.forEach(order => {
                console.log('Syncing order:', order);
            });
            
            setOfflineOrders([]);
            alert(`${ordersToSync.length} offline order(s) have been synced.`);
        }
    }, [isOnline, offlineOrders]);


    useEffect(() => {
        try {
            window.localStorage.setItem('posSearchHistory', JSON.stringify(searchHistory));
        } catch (error) {
            console.error("Failed to save search history to localStorage", error);
        }
    }, [searchHistory]);

    useEffect(() => {
        try {
            window.localStorage.setItem('posPrintSettings', JSON.stringify(printSettings));
        } catch (error) {
            console.error("Failed to save print settings to localStorage", error);
        }
    }, [printSettings]);

    useEffect(() => {
        if (printInfo) {
            const handleAfterPrint = () => {
                setPrintInfo(null);
                window.removeEventListener('afterprint', handleAfterPrint);
            };
            window.addEventListener('afterprint', handleAfterPrint);

            const timer = setTimeout(() => {
                 window.print();
            }, 100);

            return () => {
                clearTimeout(timer);
                window.removeEventListener('afterprint', handleAfterPrint);
            };
        }
    }, [printInfo]);

    const updateTotals = (items: OrderItem[], isNC: boolean) => {
        if (isNC) {
            return { subtotal: 0, tax: 0, total: 0 };
        }
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const tax = subtotal * 0.05; // 5% tax
        const total = subtotal + tax;
        return { subtotal, tax, total };
    };
    
    const handleSaveMenuItem = useCallback((itemData: Omit<MenuItemType, 'id'> | MenuItemType) => {
        const itemCategory = (itemData as any).category.trim();
        if (itemCategory && !categories.some(c => c.toLowerCase() === itemCategory.toLowerCase())) {
            setCategories(prev => [...prev, itemCategory]);
        }

        if ('id' in itemData) { // This is an existing item being edited
            const updatedItem = itemData as MenuItemType;
            setMenuItems(prevItems => 
                prevItems.map(item => item.id === updatedItem.id ? updatedItem : item)
            );
            
            setCurrentOrder(prevOrder => {
                const itemInOrder = prevOrder.items.find(item => item.id === updatedItem.id);
                if (!itemInOrder) return prevOrder;

                const newItems = prevOrder.items.map(orderItem => {
                    if (orderItem.id === updatedItem.id) {
                        const { id, name, description, price, category, isVeg } = updatedItem;
                        return { ...orderItem, id, name, description, price, category, isVeg };
                    }
                    return orderItem;
                });
                const { subtotal, tax, total } = updateTotals(newItems, prevOrder.isNC);
                return { ...prevOrder, items: newItems, subtotal, tax, total };
            });

        } else { // This is a new item
            setMenuItems(prevItems => {
                const newId = Math.max(0, ...prevItems.map(item => item.id)) + 1;
                const completeNewItem: MenuItemType = {
                    ...itemData,
                    category: itemCategory,
                    id: newId,
                };
                return [...prevItems, completeNewItem];
            });
        }
        setIsItemModalOpen(false);
        setItemToEdit(null);
    }, [categories]);

    const handleUpdateCategoryName = useCallback((oldName: string, newName: string) => {
        const trimmedNewName = newName.trim();
        if (!trimmedNewName || oldName === trimmedNewName) {
            return;
        }
        if (categories.some(c => c.toLowerCase() === trimmedNewName.toLowerCase() && c.toLowerCase() !== oldName.toLowerCase())) {
            alert(`Category "${trimmedNewName}" already exists.`);
            return;
        }

        setCategories(prev => prev.map(c => c === oldName ? trimmedNewName : c));
        setMenuItems(prev => prev.map(item => item.category === oldName ? { ...item, category: trimmedNewName } : item));
    }, [categories]);

    const handleOpenAddItemModal = () => {
        setItemToEdit(null);
        setIsItemModalOpen(true);
    };

    const handleEditMenuItem = (item: MenuItemType) => {
        setItemToEdit(item);
        setIsItemModalOpen(true);
    };

    const handleAddItem = useCallback((itemToAdd: MenuItemType) => {
        setCurrentOrder(prevOrder => {
            const existingItem = prevOrder.items.find(item => item.id === itemToAdd.id);
            let newItems: OrderItem[];

            if (existingItem) {
                newItems = prevOrder.items.map(item =>
                    item.id === itemToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                newItems = [...prevOrder.items, { ...itemToAdd, quantity: 1 }];
            }
            const { subtotal, tax, total } = updateTotals(newItems, prevOrder.isNC);
            return { ...prevOrder, items: newItems, subtotal, tax, total };
        });
    }, []);

    const handleUpdateQuantity = useCallback((itemId: number, newQuantity: number) => {
        setCurrentOrder(prevOrder => {
            let newItems: OrderItem[];
            if (newQuantity <= 0) {
                newItems = prevOrder.items.filter(item => item.id !== itemId);
            } else {
                newItems = prevOrder.items.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                );
            }
            const { subtotal, tax, total } = updateTotals(newItems, prevOrder.isNC);
            return { ...prevOrder, items: newItems, subtotal, tax, total };
        });
    }, []);

    const handleUpdateItemPrice = useCallback((itemId: number, newPrice: number) => {
        setCurrentOrder(prevOrder => {
            const newItems = prevOrder.items.map(item =>
                item.id === itemId ? { ...item, price: newPrice } : item
            );
            const { subtotal, tax, total } = updateTotals(newItems, prevOrder.isNC);
            return { ...prevOrder, items: newItems, subtotal, tax, total };
        });
    }, []);

    const handleToggleNC = useCallback(() => {
        setCurrentOrder(prevOrder => {
            const newIsNC = !prevOrder.isNC;
            const { subtotal, tax, total } = updateTotals(prevOrder.items, newIsNC);
            return { ...prevOrder, isNC: newIsNC, subtotal, tax, total };
        });
    }, []);

    const handleUpdateGuestInfo = useCallback((field: keyof Order, value: string) => {
        setCurrentOrder(prevOrder => ({
            ...prevOrder,
            [field]: value,
        }));
    }, []);
    
    const handleResetOrder = useCallback(() => {
        setCurrentOrder(getInitialOrderState());
    }, []);

    const handleSaveOrder = useCallback(() => {
        if (currentOrder.items.length === 0) {
            alert('Cannot save an empty order.');
            return;
        }

        if (isOnline) {
            console.log("Order Saved & Synced (Online):", currentOrder);
            alert(`Order ${currentOrder.id} saved successfully!`);
        } else {
            setOfflineOrders(prev => [...prev, currentOrder]);
            alert(`App is offline. Order ${currentOrder.id} saved locally for syncing later.`);
        }
        handleResetOrder();
    }, [currentOrder, isOnline, handleResetOrder]);


    const handlePrint = useCallback((order: Order, type: 'bill' | 'kot') => {
        if (order.items.length === 0) {
            alert(`Cannot print an empty ${type}.`);
            return;
        }
        setPrintInfo({ order, type });
    }, []);

    const handleAddToSearchHistory = useCallback((term: string) => {
        const cleanedTerm = term.trim();
        if (cleanedTerm.length < 2) return;
        setSearchHistory(prev => {
            const newHistory = [cleanedTerm, ...prev.filter(t => t.toLowerCase() !== cleanedTerm.toLowerCase())];
            return newHistory.slice(0, 5);
        });
    }, []);

    const handleClearSearchHistory = useCallback(() => {
        setSearchHistory([]);
    }, []);

    const handleUpdatePrintSettings = useCallback((setting: keyof PrintSettings, value: boolean) => {
        setPrintSettings(prev => ({ ...prev, [setting]: value }));
    }, []);

    const handleUpdateStaffList = useCallback((newList: string[]) => {
        setStaffList(newList.filter(name => name.trim() !== ''));
    }, []);

    const memoizedMenuPanel = useMemo(() => (
        <MenuPanel 
            onAddItem={handleAddItem} 
            menuItems={menuItems}
            onAddNewItemClick={handleOpenAddItemModal}
            onEditItem={handleEditMenuItem}
            searchHistory={searchHistory}
            onAddToSearchHistory={handleAddToSearchHistory}
            onClearSearchHistory={handleClearSearchHistory}
            categories={categories}
            onUpdateCategoryName={handleUpdateCategoryName}
        />
    ), [handleAddItem, menuItems, searchHistory, handleAddToSearchHistory, handleClearSearchHistory, categories, handleUpdateCategoryName]);
    
    return (
        <>
            <div className="min-h-screen bg-slate-900 text-slate-200 print:hidden">
                <Header 
                    onSettingsClick={() => setIsSettingsModalOpen(true)}
                    isOnline={isOnline}
                    pendingSyncCount={offlineOrders.length} 
                />
                <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                        {memoizedMenuPanel}
                    </div>
                    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start">
                        <BillPanel 
                            order={currentOrder}
                            onUpdateQuantity={handleUpdateQuantity}
                            onUpdateGuestInfo={handleUpdateGuestInfo}
                            onResetOrder={handleResetOrder}
                            onPrint={handlePrint}
                            onUpdateItemPrice={handleUpdateItemPrice}
                            onToggleNC={handleToggleNC}
                            staffList={staffList}
                            onSaveOrder={handleSaveOrder}
                        />
                    </div>
                </main>
            </div>
            {isItemModalOpen && (
                <AddItemModal 
                    onClose={() => {
                        setIsItemModalOpen(false);
                        setItemToEdit(null);
                    }}
                    onSave={handleSaveMenuItem}
                    itemToEdit={itemToEdit}
                    categories={categories}
                />
            )}
             {isSettingsModalOpen && (
                <SettingsModal
                    settings={printSettings}
                    onUpdateSettings={handleUpdatePrintSettings}
                    onClose={() => setIsSettingsModalOpen(false)}
                    staffList={staffList}
                    onUpdateStaffList={handleUpdateStaffList}
                />
            )}
            <div id="print-area">
                {printInfo && <PrintLayout order={printInfo.order} type={printInfo.type} settings={printSettings} />}
            </div>
        </>
    );
};

export default App;