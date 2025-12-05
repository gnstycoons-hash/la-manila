
import { MenuItem } from './types';

export const INITIAL_CATEGORIES = [
    'Appetizers',
    'Tandoori Breads & More',
    'Main Course (Veg)',
    'Main Course (Non-Veg)',
    'Rice & Biryani',
    'Desserts',
    'Beverages',
];

export const MENU_ITEMS: MenuItem[] = [
    // Appetizers
    { id: 1, name: 'Vegetable Samosa', description: 'Crispy pastry filled with spiced potatoes and peas.', price: 150, category: 'Appetizers', isVeg: true },
    { id: 2, name: 'Paneer Tikka', description: 'Cubes of cottage cheese marinated in spices and grilled in a tandoor.', price: 250, category: 'Appetizers', isVeg: true },
    { id: 3, name: 'Chicken 65', description: 'Spicy, deep-fried chicken dish originating from Chennai, India.', price: 300, category: 'Appetizers', isVeg: false },
    { id: 4, name: 'Hara Bhara Kebab', description: 'A vegetarian kebab made from spinach, peas, and potatoes.', price: 220, category: 'Appetizers', isVeg: true },

    // Tandoori
    { id: 10, name: 'Tandoori Roti', description: 'Whole wheat bread baked in a clay oven.', price: 40, category: 'Tandoori Breads & More', isVeg: true },
    { id: 11, name: 'Butter Naan', description: 'Soft, leavened flatbread with butter.', price: 60, category: 'Tandoori Breads & More', isVeg: true },
    { id: 12, name: 'Garlic Naan', description: 'Naan bread flavored with garlic and herbs.', price: 70, category: 'Tandoori Breads & More', isVeg: true },
    { id: 13, name: 'Laccha Paratha', description: 'Layered whole wheat bread.', price: 65, category: 'Tandoori Breads & More', isVeg: true },

    // Main Course (Veg)
    { id: 20, name: 'Paneer Butter Masala', description: 'Cottage cheese in a rich, creamy tomato gravy.', price: 350, category: 'Main Course (Veg)', isVeg: true },
    { id: 21, name: 'Dal Makhani', description: 'Black lentils and kidney beans cooked in a buttery, creamy sauce.', price: 300, category: 'Main Course (Veg)', isVeg: true },
    { id: 22, name: 'Malai Kofta', description: 'Cottage cheese dumplings in a creamy cashew gravy.', price: 375, category: 'Main Course (Veg)', isVeg: true },
    { id: 23, name: 'Aloo Gobi', description: 'A simple yet flavorful dish of potatoes and cauliflower.', price: 280, category: 'Main Course (Veg)', isVeg: true },
    
    // Main Course (Non-Veg)
    { id: 30, name: 'Butter Chicken', description: 'Grilled chicken in a spiced tomato, butter, and cream sauce.', price: 450, category: 'Main Course (Non-Veg)', isVeg: false },
    { id: 31, name: 'Rogan Josh', description: 'Aromatic lamb curry with a blend of Kashmiri spices.', price: 550, category: 'Main Course (Non-Veg)', isVeg: false },
    { id: 32, name: 'Goan Fish Curry', description: 'Tangy and spicy fish curry with coconut milk.', price: 500, category: 'Main Course (Non-Veg)', isVeg: false },
    { id: 33, name: 'Chicken Tikka Masala', description: 'Roasted marinated chicken chunks in a spiced curry sauce.', price: 475, category: 'Main Course (Non-Veg)', isVeg: false },

    // Rice & Biryani
    { id: 40, name: 'Steamed Rice', description: 'Plain boiled basmati rice.', price: 150, category: 'Rice & Biryani', isVeg: true },
    { id: 41, name: 'Vegetable Biryani', description: 'Aromatic rice dish with mixed vegetables and spices.', price: 320, category: 'Rice & Biryani', isVeg: true },
    { id: 42, name: 'Chicken Dum Biryani', description: 'Slow-cooked chicken and basmati rice with spices.', price: 420, category: 'Rice & Biryani', isVeg: false },
    
    // Desserts
    { id: 50, name: 'Gulab Jamun', description: 'Soft, milk-solid balls soaked in rose-flavored sugar syrup.', price: 120, category: 'Desserts', isVeg: true },
    { id: 51, name: 'Ras Malai', description: 'Cottage cheese dumplings soaked in sweetened, thickened milk.', price: 150, category: 'Desserts', isVeg: true },

    // Beverages
    { id: 60, name: 'Masala Chai', description: 'Indian spiced tea.', price: 80, category: 'Beverages', isVeg: true },
    { id: 61, name: 'Mango Lassi', description: 'A refreshing yogurt-based mango shake.', price: 140, category: 'Beverages', isVeg: true },
];

export const DEFAULT_STAFF_LIST = [
    'Amit Kumar',
    'Priya Sharma',
    'Rahul Verma',
    'Sunita Singh',
    'Vikram Rathore',
];

export const RESTAURANT_DETAILS = {
    name: 'La Manila Kanishka',
    address: 'Ranka Rd, near Banjhakri\nWaterfall, Lower, Luing\nGangtok, Sikkim 737103',
    phone: '9907975680',
    gstin: '11AALFL9987C1Z1',
};
