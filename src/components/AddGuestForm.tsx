'use client';

import { useRef, useState } from 'react';
import { addGuest } from '@/app/actions';

export default function AddGuestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    
    const res = await addGuest(formData);
    
    if (res?.error) {
      setError(res.error);
    } else {
      formRef.current?.reset();
    }
    
    setLoading(false);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1 opacity-80">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="e.g. Maverick"
          className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      <div>
        <label htmlFor="bringing" className="block text-sm font-medium mb-1 opacity-80">
          What are you bringing?
        </label>
        <input
          type="text"
          id="bringing"
          name="bringing"
          required
          placeholder="e.g. Volleyball & Chips"
          className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1 opacity-80">
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue="drinks"
          className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
        >
          <option value="main">Main Dish</option>
          <option value="sides">Side Dish</option>
          <option value="apps">Appetizer</option>
          <option value="drinks">Drinks</option>
          <option value="dessert">Dessert</option>
          <option value="other">Other / Supplies</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center"
      >
        {loading ? (
          <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
        ) : (
          'Add Me to the List'
        )}
      </button>
    </form>
  );
}
