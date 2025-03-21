import { usePadTracker, Pad } from '@/lib/padTracker';
import { useState } from 'react';

export default function PadList() {
  const { pads, removePad } = usePadTracker();
  const [expandedPadId, setExpandedPadId] = useState<string | null>(null);
  
  // Sort pads by replacement date (soonest first)
  const sortedPads = [...pads].sort((a, b) => 
    new Date(a.replacementDate).getTime() - new Date(b.replacementDate).getTime()
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Calculate days remaining
  const getDaysRemaining = (replacementDate: string) => {
    const now = new Date();
    const replacement = new Date(replacementDate);
    const diffTime = replacement.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Get status class based on days remaining
  const getStatusClass = (daysRemaining: number) => {
    if (daysRemaining < 0) return "bg-[var(--error)]";
    if (daysRemaining === 0) return "bg-[var(--warning)]";
    if (daysRemaining <= 1) return "bg-[var(--warning)]";
    return "bg-[var(--success)]";
  };

  return (
    <div className="pixel-card">
      <h2 className="text-xl font-bold mb-4">Your Pads</h2>
      
      {sortedPads.length === 0 ? (
        <p className="text-center py-4">No pads added yet. Add your first pad to start tracking!</p>
      ) : (
        <div className="space-y-4">
          {sortedPads.map(pad => {
            const daysRemaining = getDaysRemaining(pad.replacementDate);
            const statusClass = getStatusClass(daysRemaining);
            const isExpanded = expandedPadId === pad.id;
            
            return (
              <div key={pad.id} className="border-2 border-[var(--primary-dark)] rounded">
                <div className="flex items-center justify-between p-3 cursor-pointer"
                     onClick={() => setExpandedPadId(isExpanded ? null : pad.id)}>
                  <div>
                    <h3 className="font-bold">{pad.model}</h3>
                    <p className="text-sm">Replace: {formatDate(pad.replacementDate)}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`${statusClass} text-white px-2 py-1 rounded mr-2`}>
                      {daysRemaining < 0 
                        ? 'Overdue!' 
                        : daysRemaining === 0 
                          ? 'Today!' 
                          : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`}
                    </span>
                    <button 
                      className="text-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to remove this pad?')) {
                          removePad(pad.id);
                        }
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-3 border-t-2 border-[var(--primary-dark)]">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-bold">Applied:</p>
                        <p>{formatDate(pad.applicationDate)}</p>
                      </div>
                      <div>
                        <p className="font-bold">Location:</p>
                        <p>{pad.location}</p>
                      </div>
                      <div>
                        <p className="font-bold">Dosage:</p>
                        <p>{pad.dosage}</p>
                      </div>
                      {pad.notes && (
                        <div className="col-span-2">
                          <p className="font-bold">Notes:</p>
                          <p>{pad.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
