"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// Define the Pad type
export type Pad = {
  id: string;
  applicationDate: string;
  replacementDate: string;
  model: string;
  dosage: string;
  location: string;
  notes?: string;
};

// Define the Inventory type
export type Inventory = {
  model: string;
  count: number;
  lowThreshold: number;
};

// Define the PadTrackerContext type
type PadTrackerContextType = {
  pads: Pad[];
  inventory: Inventory[];
  addPad: (pad: Omit<Pad, 'id'>) => void;
  removePad: (id: string) => void;
  updatePad: (id: string, pad: Partial<Pad>) => void;
  updateInventory: (model: string, count: number, lowThreshold: number) => void;
  getActivePad: () => Pad | null;
  getNextReplacementDate: () => string | null;
  isInventoryLow: () => boolean;
};

// Create the PadTrackerContext
const PadTrackerContext = createContext<PadTrackerContextType | undefined>(undefined);

// PadTracker Provider component
export function PadTrackerProvider({ children }: { children: React.ReactNode }) {
  const [pads, setPads] = useState<Pad[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const loadData = () => {
      try {
        const storedPads = localStorage.getItem('pads');
        const storedInventory = localStorage.getItem('inventory');
        
        if (storedPads) {
          setPads(JSON.parse(storedPads));
        }
        
        if (storedInventory) {
          setInventory(JSON.parse(storedInventory));
        }
      } catch (error) {
        console.error('Failed to load pad tracking data:', error);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pads', JSON.stringify(pads));
  }, [pads]);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Add a new pad
  const addPad = (pad: Omit<Pad, 'id'>) => {
    const newPad = {
      ...pad,
      id: `pad_${Date.now()}`,
    };
    setPads([...pads, newPad]);
    
    // Update inventory
    const padModel = pad.model;
    const inventoryItem = inventory.find(item => item.model === padModel);
    
    if (inventoryItem && inventoryItem.count > 0) {
      updateInventory(padModel, inventoryItem.count - 1, inventoryItem.lowThreshold);
    }
  };

  // Remove a pad
  const removePad = (id: string) => {
    setPads(pads.filter(pad => pad.id !== id));
  };

  // Update a pad
  const updatePad = (id: string, updatedPad: Partial<Pad>) => {
    setPads(pads.map(pad => 
      pad.id === id ? { ...pad, ...updatedPad } : pad
    ));
  };

  // Update inventory
  const updateInventory = (model: string, count: number, lowThreshold: number) => {
    const existingIndex = inventory.findIndex(item => item.model === model);
    
    if (existingIndex >= 0) {
      const updatedInventory = [...inventory];
      updatedInventory[existingIndex] = {
        ...updatedInventory[existingIndex],
        count,
        lowThreshold
      };
      setInventory(updatedInventory);
    } else {
      setInventory([...inventory, { model, count, lowThreshold }]);
    }
  };

  // Get the currently active pad
  const getActivePad = (): Pad | null => {
    const now = new Date();
    const activePads = pads.filter(pad => {
      const replacementDate = new Date(pad.replacementDate);
      return replacementDate > now;
    });
    
    // Sort by replacement date (ascending)
    activePads.sort((a, b) => 
      new Date(a.replacementDate).getTime() - new Date(b.replacementDate).getTime()
    );
    
    return activePads.length > 0 ? activePads[0] : null;
  };

  // Get the next replacement date
  const getNextReplacementDate = (): string | null => {
    const activePad = getActivePad();
    return activePad ? activePad.replacementDate : null;
  };

  // Check if any inventory item is below threshold
  const isInventoryLow = (): boolean => {
    return inventory.some(item => item.count <= item.lowThreshold);
  };

  return (
    <PadTrackerContext.Provider 
      value={{ 
        pads, 
        inventory, 
        addPad, 
        removePad, 
        updatePad, 
        updateInventory,
        getActivePad,
        getNextReplacementDate,
        isInventoryLow
      }}
    >
      {children}
    </PadTrackerContext.Provider>
  );
}

// Custom hook to use the pad tracker context
export function usePadTracker() {
  const context = useContext(PadTrackerContext);
  if (context === undefined) {
    throw new Error('usePadTracker must be used within a PadTrackerProvider');
  }
  return context;
}
