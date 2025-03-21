import { useState } from 'react';
import { usePadTracker, Pad } from '@/lib/padTracker';

export default function AddPadForm() {
  const { addPad } = usePadTracker();
  const [model, setModel] = useState('');
  const [dosage, setDosage] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [replacementDays, setReplacementDays] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    
    // Calculate application and replacement dates
    const applicationDate = new Date().toISOString();
    const replacementDate = new Date();
    replacementDate.setDate(replacementDate.getDate() + replacementDays);
    
    // Create new pad object
    const newPad: Omit<Pad, 'id'> = {
      applicationDate,
      replacementDate: replacementDate.toISOString(),
      model,
      dosage,
      location,
      notes
    };
    
    // Add the pad
    addPad(newPad);
    
    // Reset form
    setModel('');
    setDosage('');
    setLocation('');
    setNotes('');
    setReplacementDays(3);
    setIsLoading(false);
    setSuccess(true);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="pixel-card">
      <h2 className="text-xl font-bold mb-4">Add New Pad</h2>
      
      {success && (
        <div className="bg-[var(--success)] p-3 mb-4 text-white">
          Pad added successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="model" className="block mb-2">
            Pad Model
          </label>
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
        </div>
        
        <div className="mb-4">
          <label htmlFor="dosage" className="block mb-2">
            Dosage
          </label>
          <input
            id="dosage"
            type="text"
            className="pixel-input w-full"
            placeholder="e.g., 100mcg/day"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="location" className="block mb-2">
            Application Location
          </label>
          <select
            id="location"
            className="pixel-input w-full"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select location</option>
            <option value="Upper Arm">Upper Arm</option>
            <option value="Abdomen">Abdomen</option>
            <option value="Lower Back">Lower Back</option>
            <option value="Hip">Hip</option>
            <option value="Thigh">Thigh</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="replacementDays" className="block mb-2">
            Replace After (Days)
          </label>
          <input
            id="replacementDays"
            type="number"
            min="1"
            max="14"
            className="pixel-input w-full"
            value={replacementDays}
            onChange={(e) => setReplacementDays(parseInt(e.target.value))}
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="notes" className="block mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            className="pixel-input w-full h-24"
            placeholder="Any additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        <button
          type="submit"
          className="pixel-button w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Pad'}
        </button>
      </form>
    </div>
  );
}
