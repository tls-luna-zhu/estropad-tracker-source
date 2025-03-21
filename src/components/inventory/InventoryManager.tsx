import { useState } from 'react';
import { usePadTracker, Inventory } from '@/lib/padTracker';

export default function InventoryManager() {
  const { inventory, updateInventory } = usePadTracker();
  const [model, setModel] = useState('');
  const [count, setCount] = useState(0);
  const [lowThreshold, setLowThreshold] = useState(2);
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateInventory(model, count, lowThreshold);
    setSuccess(true);
    
    // Reset form if adding new
    if (isAdding) {
      setModel('');
      setCount(0);
      setLowThreshold(2);
    }
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const handleEditInventory = (item: Inventory) => {
    setModel(item.model);
    setCount(item.count);
    setLowThreshold(item.lowThreshold);
    setIsAdding(false);
  };

  const handleAddNew = () => {
    setModel('');
    setCount(0);
    setLowThreshold(2);
    setIsAdding(true);
  };

  return (
    <div className="pixel-card">
      <h2 className="text-xl font-bold mb-4">Inventory Management</h2>
      
      {success && (
        <div className="bg-[var(--success)] p-3 mb-4 text-white">
          Inventory updated successfully!
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="font-bold mb-2">Current Inventory</h3>
        
        {inventory.length === 0 ? (
          <p className="text-center py-2">No inventory items added yet.</p>
        ) : (
          <div className="space-y-2">
            {inventory.map((item) => (
              <div 
                key={item.model} 
                className={`flex justify-between items-center p-3 border-2 ${
                  item.count <= item.lowThreshold 
                    ? 'border-[var(--error)] bg-[var(--error)]/10' 
                    : 'border-[var(--primary-dark)]'
                } rounded cursor-pointer`}
                onClick={() => handleEditInventory(item)}
              >
                <div>
                  <h4 className="font-bold">{item.model}</h4>
                  <p className="text-sm">
                    {item.count <= item.lowThreshold 
                      ? 'Low stock!' 
                      : `${item.count - item.lowThreshold} above threshold`}
                  </p>
                </div>
                <div className="text-xl font-bold">{item.count}</div>
              </div>
            ))}
          </div>
        )}
        
        <button 
          className="pixel-button mt-4 w-full"
          onClick={handleAddNew}
        >
          Add New Inventory Item
        </button>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">
          {isAdding ? 'Add New Inventory Item' : 'Update Inventory'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="model" className="block mb-2">
              Pad Model
            </label>
            {isAdding ? (
              <select
                id="model"
                className="pixel-input w-full"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              >
                <option value="">Select a model</option>
                <option value="Standard">Standard (3-4 days)</option>
                <option value="Extended">Extended (7 days)</option>
                <option value="Ultra">Ultra (1-2 days)</option>
              </select>
            ) : (
              <input
                type="text"
                className="pixel-input w-full bg-gray-100"
                value={model}
                readOnly
              />
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="count" className="block mb-2">
              Current Count
            </label>
            <input
              id="count"
              type="number"
              min="0"
              className="pixel-input w-full"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="lowThreshold" className="block mb-2">
              Low Stock Threshold
            </label>
            <input
              id="lowThreshold"
              type="number"
              min="1"
              className="pixel-input w-full"
              value={lowThreshold}
              onChange={(e) => setLowThreshold(parseInt(e.target.value))}
              required
            />
            <p className="text-sm mt-1">
              You'll be notified when inventory falls to or below this number
            </p>
          </div>
          
          <button
            type="submit"
            className="pixel-button w-full"
          >
            {isAdding ? 'Add Inventory Item' : 'Update Inventory'}
          </button>
        </form>
      </div>
    </div>
  );
}
