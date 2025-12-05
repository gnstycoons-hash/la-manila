import React, { useState, useEffect } from 'react';
import { Order, OrderItem } from '../types';
import { generateBillPdf, generateKotPdf } from '../services/pdfService';
import { UserIcon, PhoneIcon, RoomIcon, StaffIcon, PlusIcon, MinusIcon, TrashIcon, PdfIcon, PrintIcon, ShareIcon, SaveIcon, KOTIcon, NCIcon, ClockIcon, SpecialRequestIcon, TableIcon } from './Icons';

interface BillPanelProps {
    order: Order;
    onUpdateQuantity: (itemId: number, newQuantity: number) => void;
    onUpdateGuestInfo: (field: keyof Order, value: string) => void;
    onResetOrder: () => void;
    onPrint: (order: Order, type: 'bill' | 'kot') => void;
    onUpdateItemPrice: (itemId: number, newPrice: number) => void;
    onToggleNC: () => void;
    staffList: string[];
    onSaveOrder: () => void;
}

interface BillItemProps {
    item: OrderItem;
    isNC: boolean;
    onUpdateQuantity: (itemId: number, newQuantity: number) => void;
    onUpdateItemPrice: (itemId: number, newPrice: number) => void;
}

const BillItem: React.FC<BillItemProps> = ({ item, isNC, onUpdateQuantity, onUpdateItemPrice }) => {
    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const [newPrice, setNewPrice] = useState(String(item.price));

    useEffect(() => {
        if (!isEditingPrice) {
            setNewPrice(String(item.price));
        }
    }, [item.price, isEditingPrice]);

    const handlePriceUpdate = () => {
        const priceValue = parseFloat(newPrice);
        if (!isNaN(priceValue) && priceValue >= 0) {
            onUpdateItemPrice(item.id, priceValue);
        } else {
            setNewPrice(String(item.price));
        }
        setIsEditingPrice(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handlePriceUpdate();
        } else if (e.key === 'Escape') {
            setNewPrice(String(item.price));
            setIsEditingPrice(false);
        }
    };

    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-700">
            <div className="flex-1 pr-2">
                <p className="font-medium text-slate-200">{item.name}</p>
                {isEditingPrice ? (
                    <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        onBlur={handlePriceUpdate}
                        onKeyDown={handleKeyDown}
                        className="bg-slate-700 text-slate-200 text-sm rounded px-1 w-20 py-0.5"
                        autoFocus
                        step="0.01"
                        min="0"
                    />
                ) : (
                    <button onClick={() => setIsEditingPrice(true)} className={`text-sm text-slate-400 hover:text-amber-400 hover:underline ${isNC ? 'line-through' : ''}`}>
                        Rs. {item.price.toFixed(2)}
                    </button>
                )}
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-slate-600 hover:bg-slate-500 transition-colors"><MinusIcon /></button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-slate-600 hover:bg-slate-500 transition-colors"><PlusIcon /></button>
            </div>
            <p className={`w-20 text-right font-semibold text-amber-300 ${isNC ? 'line-through' : ''}`}>Rs. {(item.price * item.quantity).toFixed(2)}</p>
            <button onClick={() => onUpdateQuantity(item.id, 0)} className="ml-2 text-red-500 hover:text-red-400 transition-colors"><TrashIcon /></button>
        </div>
    );
};

const InputField: React.FC<{ icon: React.ReactNode; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; }> = ({ icon, placeholder, value, onChange, type = 'text' }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{icon}</div>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
    </div>
);

const ActionButton: React.FC<{ onClick: () => void; disabled?: boolean; className?: string; children: React.ReactNode }> = ({ onClick, disabled, className, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 font-bold py-2 px-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm ${className}`}
    >
        {children}
    </button>
);


export const BillPanel: React.FC<BillPanelProps> = ({ order, onUpdateQuantity, onUpdateGuestInfo, onResetOrder, onPrint, onUpdateItemPrice, onToggleNC, staffList, onSaveOrder }) => {

    const formatPhoneNumberForWhatsApp = (phone: string): string => {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        
        // If the number is 10 digits long (standard for India), prepend country code '91'
        if (cleaned.length === 10) {
            return `91${cleaned}`;
        }
        
        // If it already includes a country code (like 91) or is a different length, use it as is.
        // This handles cases like '919876543210' or international numbers.
        return cleaned;
    };

    const formatTime = (timeString: string) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const h = parseInt(hours, 10);
        const m = parseInt(minutes, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHours = h % 12 === 0 ? 12 : h % 12;
        const formattedMinutes = m < 10 ? '0' + m : m;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    const handleShareBill = () => {
        if (!order.mobileNo) {
            alert("Please enter a guest mobile number to share.");
            return;
        }
        const formattedPhone = formatPhoneNumberForWhatsApp(order.mobileNo);
        if (!formattedPhone) {
            alert("Please enter a valid mobile number.");
            return;
        }
        
        let message = `*Bill from La Manila Kanishka*\n\n`;
        if (order.isNC) {
            message = `*Complimentary Bill from La Manila Kanishka*\n\n`;
        }
        message += `Order ID: ${order.id}\n`;
        message += `Guest: ${order.guestName}\n\n`;
        order.items.forEach(item => {
            message += `${item.name} (x${item.quantity}) - Rs. ${(item.price * item.quantity).toFixed(2)}\n`;
        });
        message += `\nSubtotal: Rs. ${order.subtotal.toFixed(2)}\n`;
        message += `Tax (5%): Rs. ${order.tax.toFixed(2)}\n`;
        message += `*Total: Rs. ${order.total.toFixed(2)}*\n\n`;
        if (order.isNC) {
            message += `This is a complimentary bill. No payment is due.\n\n`;
        }
        message += `Thank you for your visit!`;
        
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    const handleShareKot = () => {
        if (order.items.length === 0) {
            alert("Cannot share an empty KOT.");
            return;
        }

        let message = `*KOT from La Manila Kanishka*\n\n`;
        if (order.isNC) {
            message += `*--- NO CHARGE ORDER ---*\n\n`;
        }
        message += `Order ID: ${order.id}\n`;
        if (order.guestName) message += `Guest: ${order.guestName}\n`;
        if (order.roomNo) message += `Room: ${order.roomNo}\n`;
        if (order.tableNo) message += `Table: ${order.tableNo}\n`;
        if (order.staff) message += `Staff: ${order.staff}\n`;
        message += `Date: ${order.date.toLocaleString()}\n`;
        if (order.serviceTime) {
            message += `*Service Time: ${formatTime(order.serviceTime)}*\n`;
        }
        if (order.specialRequest) {
            message += `\n*--- SPECIAL REQUEST ---*\n`;
            message += `${order.specialRequest}\n`;
            message += `*-----------------------*\n`;
        }
        message += `\n--- ITEMS ---\n`;
        order.items.forEach(item => {
            message += `${item.name}  (x ${item.quantity})\n`;
        });
        message += `\n--------------`;

        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };
    
    const hasItems = order.items.length > 0;

    return (
        <div className="bg-slate-800/50 rounded-lg shadow-xl h-full flex flex-col p-4 space-y-4">
            <h3 className="text-xl font-bold text-amber-400 border-b-2 border-amber-500/50 pb-2">Current Order</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField icon={<UserIcon />} placeholder="Guest Name" value={order.guestName} onChange={e => onUpdateGuestInfo('guestName', e.target.value)} />
                <InputField icon={<PhoneIcon />} placeholder="Mobile No." value={order.mobileNo} onChange={e => onUpdateGuestInfo('mobileNo', e.target.value)} type="tel" />
                <InputField icon={<RoomIcon />} placeholder="Room No." value={order.roomNo} onChange={e => onUpdateGuestInfo('roomNo', e.target.value)} />
                <InputField icon={<TableIcon />} placeholder="Table No." value={order.tableNo} onChange={e => onUpdateGuestInfo('tableNo', e.target.value)} />
                <InputField icon={<ClockIcon />} placeholder="Service Time" value={order.serviceTime || ''} onChange={e => onUpdateGuestInfo('serviceTime', e.target.value)} type="time" />
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><StaffIcon /></div>
                    <select value={order.staff} onChange={e => onUpdateGuestInfo('staff', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none">
                        <option value="">Assign Staff</option>
                        {staffList.map(staff => <option key={staff} value={staff}>{staff}</option>)}
                    </select>
                </div>
                <div className="relative md:col-span-2">
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none text-slate-400"><SpecialRequestIcon /></div>
                    <textarea
                        placeholder="Special Request (e.g., less spicy, no onions)"
                        value={order.specialRequest || ''}
                        onChange={e => onUpdateGuestInfo('specialRequest', e.target.value)}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
                    />
                </div>
            </div>

            <div className="flex-grow bg-slate-900 rounded-lg p-3 overflow-y-auto space-y-2 relative" style={{minHeight: '200px'}}>
                {!hasItems ? (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        <p>Add items from the menu</p>
                    </div>
                ) : (
                    order.items.map(item => <BillItem key={item.id} item={item} isNC={order.isNC} onUpdateQuantity={onUpdateQuantity} onUpdateItemPrice={onUpdateItemPrice} />)
                )}
                 {order.isNC && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                        <div className="bg-amber-500 text-slate-900 font-bold py-2 px-4 rounded-md shadow-lg text-lg">
                            COMPLIMENTARY ORDER
                        </div>
                    </div>
                )}
            </div>

            {hasItems && (
                <div className="space-y-1 text-right font-medium pr-2">
                    <div className="flex justify-between text-slate-300"><span>Subtotal:</span><span>Rs. {order.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-slate-400"><span>Tax (5%):</span><span>Rs. {order.tax.toFixed(2)}</span></div>
                    <div className="flex justify-between text-xl font-bold text-amber-400 pt-2 border-t border-slate-700"><span>Total:</span><span>Rs. {order.total.toFixed(2)}</span></div>
                </div>
            )}
            
            <div className="mt-auto pt-4 border-t border-slate-600 space-y-4">
                 <div className="grid grid-cols-3 gap-2">
                    <ActionButton onClick={onSaveOrder} disabled={!hasItems} className="bg-green-600 hover:bg-green-500 text-white"><SaveIcon />Save</ActionButton>
                    <ActionButton onClick={onToggleNC} disabled={!hasItems} className={`${order.isNC ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-900' : 'bg-yellow-700 hover:bg-yellow-600 text-white'}`}><NCIcon /> {order.isNC ? 'Remove NC' : 'Mark NC'}</ActionButton>
                    <ActionButton onClick={onResetOrder} className="bg-slate-600 hover:bg-slate-500 text-white"><PlusIcon />New</ActionButton>
                </div>

                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-400">KOT Actions</h4>
                    <div className="grid grid-cols-3 gap-2">
                        <ActionButton onClick={() => onPrint(order, 'kot')} disabled={!hasItems} className="bg-sky-600 hover:bg-sky-500 text-white"><PrintIcon />Print</ActionButton>
                        <ActionButton onClick={() => generateKotPdf(order)} disabled={!hasItems} className="bg-blue-600 hover:bg-blue-500 text-white"><KOTIcon />PDF</ActionButton>
                        <ActionButton onClick={handleShareKot} disabled={!hasItems} className="bg-teal-600 hover:bg-teal-500 text-white"><ShareIcon />Share</ActionButton>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-400">Bill Actions</h4>
                    <div className="grid grid-cols-3 gap-2">
                         <ActionButton onClick={() => onPrint(order, 'bill')} disabled={!hasItems} className="bg-purple-600 hover:bg-purple-500 text-white"><PrintIcon />Print</ActionButton>
                        <ActionButton onClick={() => generateBillPdf(order)} disabled={!hasItems} className="bg-red-600 hover:bg-red-500 text-white"><PdfIcon />PDF</ActionButton>
                        <ActionButton onClick={handleShareBill} disabled={!hasItems || !order.mobileNo} className="bg-teal-600 hover:bg-teal-500 text-white"><ShareIcon />Share</ActionButton>
                    </div>
                </div>
            </div>
        </div>
    );
};