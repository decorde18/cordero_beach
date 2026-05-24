'use client';

import { useState } from 'react';
import { UtensilsCrossed, X } from 'lucide-react';

export default function MenuSummaryPopup({ guests }: { guests: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-primary/20 text-primary hover:bg-primary/30 transition-colors px-4 py-2 rounded-xl font-bold text-sm"
      >
        <UtensilsCrossed className="w-4 h-4" />
        <span>Menu Summary</span>
      </button>
    );
  }

  // Aggregate items
  const mainDishes = guests.filter(g => g.main_dish).map(g => ({ name: g.name, item: g.main_dish }));
  const sidesApps = guests.filter(g => g.sides_apps).map(g => ({ name: g.name, item: g.sides_apps }));
  const drinks = guests.filter(g => g.drinks).map(g => ({ name: g.name, item: g.drinks }));
  const desserts = guests.filter(g => g.dessert).map(g => ({ name: g.name, item: g.dessert }));
  const otherItems = guests.filter(g => g.other_items).map(g => ({ name: g.name, item: g.other_items }));

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-primary/20 text-primary hover:bg-primary/30 transition-colors px-4 py-2 rounded-xl font-bold text-sm"
      >
        <UtensilsCrossed className="w-4 h-4" />
        <span>Menu Summary</span>
      </button>

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-background border border-white/10 w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-primary" />
              Menu Summary
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
            
            {/* Main Dishes */}
            <section>
              <h3 className="text-lg font-bold text-orange-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                🍔 Main Dishes ({mainDishes.length})
              </h3>
              {mainDishes.length === 0 ? <p className="opacity-50 italic text-sm">None yet.</p> : (
                <ul className="space-y-2">
                  {mainDishes.map((m, i) => (
                    <li key={i} className="bg-white/5 px-4 py-3 rounded-xl text-sm">
                      <span className="font-semibold">{m.name}:</span> {m.item}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Sides / Apps */}
            <section>
              <h3 className="text-lg font-bold text-green-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                🥗 Sides & Apps ({sidesApps.length})
              </h3>
              {sidesApps.length === 0 ? <p className="opacity-50 italic text-sm">None yet.</p> : (
                <ul className="space-y-2">
                  {sidesApps.map((s, i) => (
                    <li key={i} className="bg-white/5 px-4 py-3 rounded-xl text-sm">
                      <span className="font-semibold">{s.name}:</span> {s.item}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Drinks */}
            <section>
              <h3 className="text-lg font-bold text-blue-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                🥤 Drinks ({drinks.length})
              </h3>
              {drinks.length === 0 ? <p className="opacity-50 italic text-sm">None yet.</p> : (
                <ul className="space-y-2">
                  {drinks.map((d, i) => (
                    <li key={i} className="bg-white/5 px-4 py-3 rounded-xl text-sm">
                      <span className="font-semibold">{d.name}:</span> {d.item}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Desserts */}
            <section>
              <h3 className="text-lg font-bold text-pink-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                🧁 Desserts ({desserts.length})
              </h3>
              {desserts.length === 0 ? <p className="opacity-50 italic text-sm">None yet.</p> : (
                <ul className="space-y-2">
                  {desserts.map((d, i) => (
                    <li key={i} className="bg-white/5 px-4 py-3 rounded-xl text-sm">
                      <span className="font-semibold">{d.name}:</span> {d.item}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Other / Supplies */}
            <section>
              <h3 className="text-lg font-bold text-purple-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                🧊 Other / Supplies ({otherItems.length})
              </h3>
              {otherItems.length === 0 ? <p className="opacity-50 italic text-sm">None yet.</p> : (
                <ul className="space-y-2">
                  {otherItems.map((o, i) => (
                    <li key={i} className="bg-white/5 px-4 py-3 rounded-xl text-sm">
                      <span className="font-semibold">{o.name}:</span> {o.item}
                    </li>
                  ))}
                </ul>
              )}
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
