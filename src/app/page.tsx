import { supabase } from '@/lib/supabase';
import AddGuestForm from '@/components/AddGuestForm';
import MenuSummaryPopup from '@/components/MenuSummaryPopup';
import { Calendar, CheckCircle2, Flame, Beer, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 0;

export default async function Home() {
  // Fetch party settings
  const { data: settingsData } = await supabase
    .from('party_settings')
    .select('*')
    .eq('id', 1)
    .single();

  // Fetch guests
  const { data: guestsData } = await supabase
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });

  // Use default mock data if not connected properly yet
  const settings = settingsData || {
    date: new Date().toISOString(),
    active: true,
    grilling: 'Burgers & Veggie Skewers',
    beers_on_tap: 'Corona & Local IPA'
  };

  const guests = guestsData || [
    { id: '1', name: 'Alex', eta: '1:00 PM', party_size: 2, sides_apps: 'Tortilla Chips & Guac', drinks: 'Sprite' },
    { id: '2', name: 'Jordan', eta: '2:30 PM', party_size: 1, main_dish: 'Ribs', dessert: 'Watermelon' },
  ];

  const totalGuests = guests.reduce((sum: number, g: any) => sum + (g.party_size || 1), 0);

  return (
    <main className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      {/* Compact Header & Settings Bar */}
      <header className="flex flex-col lg:flex-row gap-4 items-center justify-between glass-panel rounded-3xl p-4 md:p-6">
        <div className="flex items-center gap-4">
          <img src="/CBEACH-coin.png" alt="CBEACH Logo" className="w-16 h-16 object-contain drop-shadow-lg" />
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Pool Party Time
            </h1>
            <p className="text-sm opacity-80 mt-1">
              RSVP and let us know what you're bringing!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
          <div className="flex items-center space-x-2 bg-background/50 px-3 py-2 rounded-xl text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-medium">{settings.date ? format(new Date(settings.date), 'MMM do @ h:mm a') : 'TBD'}</span>
          </div>
          <div className="flex items-center space-x-2 bg-background/50 px-3 py-2 rounded-xl text-sm">
            <CheckCircle2 className={`w-4 h-4 ${settings.active ? 'text-green-500' : 'text-red-500'}`} />
            <span className="font-medium">{settings.active ? 'ON' : 'TBD'}</span>
          </div>
          {settings.grilling && (
            <div className="flex items-center space-x-2 bg-background/50 px-3 py-2 rounded-xl text-sm">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{settings.grilling}</span>
            </div>
          )}
          {settings.beers_on_tap && (
            <div className="flex items-center space-x-2 bg-background/50 px-3 py-2 rounded-xl text-sm">
              <Beer className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{settings.beers_on_tap}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Section (Smaller width) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-3xl p-6 sticky top-6">
            <h3 className="text-xl font-bold mb-4">RSVP Here</h3>
            <AddGuestForm />
          </div>
        </div>

        {/* Guest List Cards (Larger width) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Who's Coming ({totalGuests} people)
              </h3>
              <MenuSummaryPopup guests={guests} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {guests.length === 0 ? (
                <p className="opacity-70 italic col-span-full py-8">No one has RSVP'd yet. Be the first!</p>
              ) : (
                guests.map((guest: any) => (
                  <div key={guest.id} className="bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                    
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg leading-tight">
                          {guest.name}
                          {guest.party_size > 1 && <span className="text-sm font-normal opacity-70 ml-1">(+{guest.party_size - 1})</span>}
                        </h4>
                        {guest.eta && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            ETA: {guest.eta}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mt-4 text-sm">
                      {guest.main_dish && (
                        <div className="flex items-start gap-2">
                          <span className="text-orange-500">🍔</span>
                          <div>
                            <span className="font-semibold text-xs uppercase tracking-wider opacity-60 block">Main</span>
                            {guest.main_dish}
                          </div>
                        </div>
                      )}
                      {guest.sides_apps && (
                        <div className="flex items-start gap-2">
                          <span className="text-green-500">🥗</span>
                          <div>
                            <span className="font-semibold text-xs uppercase tracking-wider opacity-60 block">Sides/Apps</span>
                            {guest.sides_apps}
                          </div>
                        </div>
                      )}
                      {guest.drinks && (
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500">🥤</span>
                          <div>
                            <span className="font-semibold text-xs uppercase tracking-wider opacity-60 block">Drinks</span>
                            {guest.drinks}
                          </div>
                        </div>
                      )}
                      {guest.dessert && (
                        <div className="flex items-start gap-2">
                          <span className="text-pink-500">🧁</span>
                          <div>
                            <span className="font-semibold text-xs uppercase tracking-wider opacity-60 block">Dessert</span>
                            {guest.dessert}
                          </div>
                        </div>
                      )}
                      {!guest.main_dish && !guest.sides_apps && !guest.drinks && !guest.dessert && (
                        <div className="text-xs opacity-50 italic">Just bringing the good vibes!</div>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
