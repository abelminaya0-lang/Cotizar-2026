
import React from 'react';
import { X, MessageCircle, Minus, Plus, Sparkles, TrendingDown, ArrowRight, Info } from 'lucide-react';
import { QuoteData } from '../types.ts';
import { 
  BASE_RATE_WEEKDAY,
  BASE_RATE_WEEKEND,
  EXTRA_GUEST_FEE_PER_NIGHT, 
  MAX_BASE_GUESTS,
  MAX_TOTAL_GUESTS,
  MULTI_NIGHT_DISCOUNT,
  WHATSAPP_NUMBER 
} from '../constants.ts';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QuoteData;
  setData: React.Dispatch<React.SetStateAction<QuoteData>>;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, data, setData }) => {
  if (!isOpen) return null;

  const calculateForNights = (checkIn: string, checkOut: string, numGuests: number) => {
    const start = new Date(checkIn + 'T00:00:00');
    const end = new Date(checkOut + 'T00:00:00');
    const extraGuests = Math.max(0, numGuests - MAX_BASE_GUESTS);
    
    let weekdaySubtotal = 0;
    let weekendSubtotal = 0;
    let nights = 0;
    
    const currentDay = new Date(start);
    while (currentDay < end) {
      const dayOfWeek = currentDay.getDay(); // 0: Dom, 1: Lun, ..., 5: Vie, 6: Sab
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
      
      const nightBaseRate = isWeekend ? BASE_RATE_WEEKEND : BASE_RATE_WEEKDAY;
      const nightExtraFee = extraGuests * EXTRA_GUEST_FEE_PER_NIGHT;
      const nightTotal = nightBaseRate + nightExtraFee;

      if (isWeekend) {
        weekendSubtotal += nightTotal;
      } else {
        weekdaySubtotal += nightTotal;
      }
      
      nights++;
      currentDay.setDate(currentDay.getDate() + 1);
    }

    if (nights === 0) nights = 1;

    // El descuento del 10% solo aplica sobre la parte de días de semana
    // y solo si la estadía total es de 2 o más noches.
    const discountAmount = nights >= 2 ? weekdaySubtotal * MULTI_NIGHT_DISCOUNT : 0;
    const subtotal = weekdaySubtotal + weekendSubtotal;
    const total = subtotal - discountAmount;

    return { nights, subtotal, discountAmount, total, weekdaySubtotal, weekendSubtotal };
  };

  const results = calculateForNights(data.checkIn, data.checkOut, data.guests);
  const originalPricePerNight = results.subtotal / results.nights;
  const discountedPricePerNight = results.total / results.nights;

  // Lógica de Upselling: Solo sugerir si hay días de semana involucrados que generen descuento
  let promoInfo: { totalWithDiscount: number, savings: number, pricePerNight: number } | undefined;
  if (results.nights === 1) {
    const hypStart = new Date(data.checkIn + 'T00:00:00');
    const hypEnd = new Date(hypStart);
    hypEnd.setDate(hypEnd.getDate() + 2);
    
    const hypResults = calculateForNights(
      data.checkIn, 
      hypEnd.toISOString().split('T')[0], 
      data.guests
    );

    if (hypResults.discountAmount > 0) {
      promoInfo = {
        totalWithDiscount: hypResults.total,
        savings: hypResults.discountAmount,
        pricePerNight: hypResults.total / 2
      };
    }
  }

  const handleUpdateGuests = (delta: number) => {
    setData(prev => ({
      ...prev,
      guests: Math.min(MAX_TOTAL_GUESTS, Math.max(1, prev.guests + delta))
    }));
  };

  const handleAcceptOffer = () => {
    const startDate = new Date(data.checkIn + 'T00:00:00');
    const newEndDate = new Date(startDate);
    newEndDate.setDate(startDate.getDate() + 2);
    setData(prev => ({
      ...prev,
      checkOut: newEndDate.toISOString().split('T')[0]
    }));
  };

  const handleWhatsApp = () => {
    const message = `¡Hola Olas Home Paracas! 👋\n\nMe gustaría confirmar mi estadía:\n📅 Ingreso: ${data.checkIn}\n📅 Salida: ${data.checkOut}\n👥 Personas: ${data.guests}\n🌙 Noches: ${results.nights}\n💰 Total: $${results.total.toFixed(0)} USD\n\n¿Me podrían ayudar con la reserva?`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles size={24} className="text-yellow-300" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Tu Cotización</h2>
          </div>
          <p className="text-blue-100/70 text-sm font-medium">Tarifas L-J $160 | V-D $180</p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">DURACIÓN</p>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl font-black text-gray-900">{results.nights}</p>
                <p className="text-gray-400 text-xs font-bold uppercase">{results.nights === 1 ? 'noche' : 'noches'}</p>
              </div>
            </div>
            <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">PERSONAS</p>
              <div className="flex items-center justify-between bg-white rounded-2xl p-1 shadow-sm border border-blue-50">
                <button onClick={() => handleUpdateGuests(-1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"><Minus size={16} /></button>
                <span className="text-lg font-black text-gray-900">{data.guests}</span>
                <button onClick={() => handleUpdateGuests(1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-blue-600"><Plus size={16} /></button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 text-center">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Promedio por noche</h4>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-3">
                {results.discountAmount > 0 && (
                  <span className="text-2xl font-bold text-gray-300 line-through decoration-red-400/50 decoration-2">
                    ${originalPricePerNight.toFixed(0)}
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className={`text-6xl font-black ${results.discountAmount > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                    ${discountedPricePerNight.toFixed(0)}
                  </span>
                  <span className="text-gray-400 text-sm font-black uppercase tracking-widest">USD</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tight">
                  {results.discountAmount > 0 ? '✨ Descuento aplicado (L-J)' : 'Tarifa estándar según día'}
                </p>
                {results.weekendSubtotal > 0 && results.discountAmount > 0 && (
                  <p className="text-[9px] text-gray-400 font-medium italic">
                    * El descuento del 10% no aplica a Viernes, Sábados o Domingos.
                  </p>
                )}
              </div>
            </div>
          </div>

          {promoInfo && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-[2.5rem] p-6 relative overflow-hidden group shadow-lg">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                  <TrendingDown size={14} /> Oferta Semanal
                </div>
                <p className="text-amber-900 text-sm font-semibold mb-5 leading-relaxed">
                  ¡Ahorra <span className="text-orange-600 font-black">${promoInfo.savings.toFixed(0)} USD</span> en tus días de semana reservando 2 noches!
                </p>
                <button 
                  onClick={handleAcceptOffer}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-[1.03] shadow-lg shadow-orange-200"
                >
                  ¡Quiero el descuento!
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl transition-all group-hover:bg-blue-500/20"></div>
            <div className="flex justify-between items-end relative z-10">
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total de la estadía</p>
                <div className="flex items-center gap-2 text-xs text-blue-400 font-bold mb-4">
                  <Info size={14} />
                  Días de semana con 10% de descuento
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-white tracking-tighter">${results.total.toFixed(0)}</span>
                  <span className="text-blue-400 font-bold text-base">USD</span>
                </div>
              </div>
              
              {results.discountAmount > 0 && (
                <div className="text-right">
                  <div className="bg-emerald-500/30 text-emerald-300 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter border border-emerald-500/30">
                    Ahorro: ${results.discountAmount.toFixed(0)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleWhatsApp}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-emerald-100"
          >
            <MessageCircle fill="currentColor" size={28} />
            Confirmar Reserva
          </button>

          <p className="text-center text-gray-400 text-[11px] font-bold uppercase tracking-tighter">
            * Sujeto a disponibilidad • Consulta vía WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
};
