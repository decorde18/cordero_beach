import { supabase } from '@/lib/supabase';
import AddGuestForm from '@/components/AddGuestForm';
import { Calendar, CheckCircle2, Flame, Beer, User } from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 0; // Dynamic rendering for latest data

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
    grilling: 'Burgers, Hotdogs, and Veggie Skewers',
    beers_on_tap: 'Corona, Pacifico, and Local IPA'
  };

  const guests = guestsData || [
    { id: '1', name: 'Alex', bringing: 'Tortilla Chips & Guac', category: 'apps' },
    { id: '2', name: 'Jordan', bringing: 'Watermelon & Sprite', category: 'drinks' },
  ];

  const categories = [
    { id: 'main', label: 'Main Dishes' },
    { id: 'sides', label: 'Side Dishes' },
    { id: 'apps', label: 'Appetizers' },
    { id: 'drinks', label: 'Drinks' },
    { id: 'dessert', label: 'Desserts' },
    { id: 'other', label: 'Other / Supplies' },
  ];

  const groupedGuests = categories.map(c => ({
    ...c,
    guests: guests.filter((g: any) => g.category === c.id || (!g.category && c.id === 'other'))
  })).filter(c => c.guests.length > 0);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <header className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
          Pool Party Time
        </h1>
        <p className="text-lg opacity-80 max-w-xl mx-auto">
          Add your name to the list and let us know what you're bringing. Can't wait to see you there!
        </p>
      </header>

      {/* Party Details Card */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-bold border-b border-white/20 pb-4">The Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-70">When</p>
              <p className="font-semibold text-lg">
                {settings.date ? format(new Date(settings.date), 'EEEE, MMMM do @ h:mm a') : 'TBD'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/10 rounded-full text-green-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-70">Status</p>
              <p className="font-semibold text-lg">{settings.active ? 'It is ON! 🌊' : 'Postponed / TBD'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-500/10 rounded-full text-orange-500">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-70">On the Grill</p>
              <p className="font-semibold text-lg">{settings.grilling || 'Nothing yet'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-500">
              <Beer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-70">On Tap</p>
              <p className="font-semibold text-lg">{settings.beers_on_tap || 'BYOB'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guest List & Form Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="md:col-span-1 space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-4">I'm Coming!</h3>
            <AddGuestForm />
          </div>
        </div>

        {/* List */}
        <div className="md:col-span-2 glass-panel rounded-3xl p-6 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Who's Coming ({guests.length})
          </h3>
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {guests.length === 0 ? (
              <p className="opacity-70 italic text-center py-8">No one has RSVP'd yet. Be the first!</p>
            ) : (
              groupedGuests.map(group => (
                <div key={group.id} className="space-y-3">
                  <h4 className="font-bold text-sm text-primary uppercase tracking-wider">{group.label}</h4>
                  {group.guests.map((guest: any) => (
                    <div key={guest.id} className="flex justify-between items-center p-4 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                      <div className="font-semibold text-lg">{guest.name}</div>
                      <div className="text-sm opacity-80 bg-background/50 px-3 py-1 rounded-full">
                        {guest.bringing}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

      </section>
    </main>
  );
}
