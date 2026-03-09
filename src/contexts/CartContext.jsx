import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart context
const CartContext = createContext();

// Initial state
const initialState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isOpen: false,
    selectedItems: []
};

// Action types
const CART_ACTIONS = {
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    CLEAR_CART: 'CLEAR_CART',
    TOGGLE_CART: 'TOGGLE_CART',
    LOAD_CART: 'LOAD_CART',
    TOGGLE_SELECT_ITEM: 'TOGGLE_SELECT_ITEM',
    SELECT_ALL_ITEMS: 'SELECT_ALL_ITEMS',
    DESELECT_ALL_ITEMS: 'DESELECT_ALL_ITEMS'
};

// Reducer function
const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ACTIONS.ADD_ITEM: {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            
            let newItems;
            if (existingItem) {
                // Update quantity if item exists
                newItems = state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: Math.min(item.quantity + action.payload.quantity, 99) }
                        : item
                );
            } else {
                // Add new item
                newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
            }

            return {
                ...state,
                items: newItems,
                totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
                totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
        }

        case CART_ACTIONS.REMOVE_ITEM: {
            const newItems = state.items.filter(item => item.id !== action.payload);
            const newSelectedItems = state.selectedItems.filter(id => id !== action.payload);
            return {
                ...state,
                items: newItems,
                selectedItems: newSelectedItems,
                totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
                totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
        }

        case CART_ACTIONS.UPDATE_QUANTITY: {
            const { itemId, quantity } = action.payload;
            
            if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                const newItems = state.items.filter(item => item.id !== itemId);
                const newSelectedItems = state.selectedItems.filter(id => id !== itemId);
                return {
                    ...state,
                    items: newItems,
                    selectedItems: newSelectedItems,
                    totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
                    totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                };
            }

            const newItems = state.items.map(item =>
                item.id === itemId
                    ? { ...item, quantity: Math.min(quantity, 99) }
                    : item
            );

            return {
                ...state,
                items: newItems,
                totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
                totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
        }

        case CART_ACTIONS.CLEAR_CART:
            return {
                ...state,
                items: [],
                selectedItems: [],
                totalItems: 0,
                totalPrice: 0
            };

        case CART_ACTIONS.TOGGLE_CART:
            return {
                ...state,
                isOpen: !state.isOpen
            };

        case CART_ACTIONS.LOAD_CART:
            return {
                ...state,
                ...action.payload
            };

        case CART_ACTIONS.TOGGLE_SELECT_ITEM: {
            const itemId = action.payload;
            const newSelectedItems = state.selectedItems.includes(itemId)
                ? state.selectedItems.filter(id => id !== itemId)
                : [...state.selectedItems, itemId];
            
            return {
                ...state,
                selectedItems: newSelectedItems
            };
        }

        case CART_ACTIONS.SELECT_ALL_ITEMS: {
            const allItemIds = state.items.map(item => item.id);
            return {
                ...state,
                selectedItems: allItemIds
            };
        }

        case CART_ACTIONS.DESELECT_ALL_ITEMS: {
            return {
                ...state,
                selectedItems: []
            };
        }

        default:
            return state;
    }
};

// Cart provider component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('techhub_cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                dispatch({
                    type: CART_ACTIONS.LOAD_CART,
                    payload: {
                        ...parsedCart,
                        selectedItems: []
                    }
                });
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('techhub_cart', JSON.stringify({
            items: state.items,
            totalItems: state.totalItems,
            totalPrice: state.totalPrice
        }));
    }, [state.items, state.totalItems, state.totalPrice]);

    // Cart actions
    const addToCart = (product, quantity = 1) => {
        dispatch({
            type: CART_ACTIONS.ADD_ITEM,
            payload: { ...product, quantity }
        });
    };

    const removeFromCart = (itemId) => {
        dispatch({
            type: CART_ACTIONS.REMOVE_ITEM,
            payload: itemId
        });
    };

    const updateQuantity = (itemId, quantity) => {
        dispatch({
            type: CART_ACTIONS.UPDATE_QUANTITY,
            payload: { itemId, quantity }
        });
    };

    const clearCart = () => {
        dispatch({
            type: CART_ACTIONS.CLEAR_CART
        });
    };

    const toggleCart = () => {
        dispatch({
            type: CART_ACTIONS.TOGGLE_CART
        });
    };

    const toggleSelectItem = (itemId) => {
        dispatch({
            type: CART_ACTIONS.TOGGLE_SELECT_ITEM,
            payload: itemId
        });
    };

    const selectAllItems = () => {
        dispatch({
            type: CART_ACTIONS.SELECT_ALL_ITEMS
        });
    };

    const deselectAllItems = () => {
        dispatch({
            type: CART_ACTIONS.DESELECT_ALL_ITEMS
        });
    };

    const getSelectedItemsTotal = () => {
        return state.items
            .filter(item => state.selectedItems.includes(item.id))
            .reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getSelectedItemsCount = () => {
        return state.items
            .filter(item => state.selectedItems.includes(item.id))
            .reduce((count, item) => count + item.quantity, 0);
    };

    const isItemSelected = (itemId) => {
        return state.selectedItems.includes(itemId);
    };

    const isAllItemsSelected = () => {
        return state.items.length > 0 && state.selectedItems.length === state.items.length;
    };

    const value = {
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        toggleSelectItem,
        selectAllItems,
        deselectAllItems,
        getSelectedItemsTotal,
        getSelectedItemsCount,
        isItemSelected,
        isAllItemsSelected
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
