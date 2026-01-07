
import React, { useState } from 'react';
import { Calendar, Users, Search, ChevronDown } from 'lucide-react';
import { QuoteData } from '../types';
import { MAX_TOTAL_GUESTS } from '../constants';

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
      <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-[2.5rem] shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
          {/* Fecha Ingreso */}
          <div className="w-full md:flex-1 bg-gray-50 rounded-2xl p-4 border border-transparent hover:border-blue-200 transition-all">
            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              <Calendar size={14} className="text-blue-500" />
              Fecha Ingreso
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full bg-transparent text-gray-800 font-semibold focus:outline-none text-sm cursor-pointer"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
          </div>

          {/* Fecha Salida */}
          <div className="w-full md:flex-1 bg-gray-50 rounded-2xl p-4 border border-transparent hover:border-blue-200 transition-all">
            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              <Calendar size={14} className="text-blue-500" />
              Fecha de Salida
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full bg-transparent text-gray-800 font-semibold focus:outline-none text-sm cursor-pointer"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          {/* Número de Personas */}
          <div className="w-full md:flex-1 bg-gray-50 rounded-2xl p-4 border border-transparent hover:border-blue-200 transition-all relative">
            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              <Users size={14} className="text-blue-500" />
              Número de Personas
            </label>
            <div className="flex items-center justify-between">
              <select
                className="w-full bg-transparent text-gray-800 font-semibold focus:outline-none text-sm appearance-none cursor-pointer"
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
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-200"
          >
            <Search size={20} strokeWidth={3} />
            <span className="whitespace-nowrap">Cotizar ahora</span>
          </button>
        </form>

        <div className="flex justify-center gap-8 mt-6">
          <button className="text-xs font-semibold px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
            Fechas exactas
          </button>
          <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">
            Mínimo 1 noche
          </button>
        </div>
      </div>
    </div>
  );
};
