
import React, { useState } from 'react';
import { Calendar, Users, Search, ChevronDown } from 'lucide-react';
import { QuoteData } from '../types.ts';
import { MAX_TOTAL_GUESTS } from '../constants.ts';

interface BookingFormProps {
  onQuote: (data: QuoteData) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onQuote }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert('Por favor selecciona las fechas de ingreso y salida');
      return;
    }
    onQuote({ checkIn, checkOut, guests });
  };

  const guestOptions = Array.from({ length: MAX_TOTAL_GUESTS }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-white/40">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
          {/* Fecha Ingreso */}
          <div className="w-full md:flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-blue-200 transition-all focus-within:ring-2 focus-within:ring-blue-100">
            <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">
              <Calendar size={14} className="text-blue-500" />
              Fecha Ingreso
            </label>
            <input
              type="date"
              className="w-full bg-transparent text-gray-800 font-bold focus:outline-none text-sm cursor-pointer"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </div>

          {/* Fecha Salida */}
          <div className="w-full md:flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-blue-200 transition-all focus-within:ring-2 focus-within:ring-blue-100">
            <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">
              <Calendar size={14} className="text-blue-500" />
              Fecha Salida
            </label>
            <input
              type="date"
              className="w-full bg-transparent text-gray-800 font-bold focus:outline-none text-sm cursor-pointer"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>

          {/* Número de Personas */}
          <div className="w-full md:flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-blue-200 transition-all relative">
            <label className="flex items-center gap-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">
              <Users size={14} className="text-blue-500" />
              Personas
            </label>
            <div className="flex items-center justify-between">
              <select
                className="w-full bg-transparent text-gray-800 font-bold focus:outline-none text-sm appearance-none cursor-pointer"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              >
                {guestOptions.map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'persona' : 'personas'}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Botón Cotizar */}
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-3xl font-black flex items-center justify-center gap-3 transition-all transform hover:scale-[1.03] active:scale-95 shadow-xl shadow-blue-200"
          >
            <Search size={22} strokeWidth={3} />
            <span className="whitespace-nowrap uppercase tracking-wider text-sm">Cotizar ahora</span>
          </button>
        </form>

        <div className="flex justify-center gap-8 mt-6">
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            Disponibilidad inmediata
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            Mejor precio garantizado
          </div>
        </div>
      </div>
    </div>
  );
};