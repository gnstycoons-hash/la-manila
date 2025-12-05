export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    isVeg: boolean;
}

export interface OrderItem extends MenuItem {
    quantity: number;
}

export interface Order {
    id: string;
    guestName: string;
    mobileNo: string;
    roomNo: string;
    tableNo: string;
    staff: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    total: number;
    date: Date;
    isNC: boolean;
    serviceTime?: string;
    specialRequest?: string;
}

export interface PrintSettings {
    showAddress: boolean;
    showPhone: boolean;
    showGstin: boolean;
    showGuestInfo: boolean;
    showStaffInfo: boolean;
}