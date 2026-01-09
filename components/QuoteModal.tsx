
import React from 'react';
import { X, MessageCircle, Minus, Plus, Sparkles, TrendingDown, ArrowRight, Info } from 'lucide-react';
import { QuoteData } from '../types.ts';
import { 
  BASE_RATE_PER_NIGHT, 
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

  const calculateForNights = (n: number, g: number) => {
    const baseTotal = n * BASE_RATE_PER_NIGHT;
    const extraGuests = Math.max(0, g - MAX_BASE_GUESTS);
    const extraFee = extraGuests * EXTRA_GUEST_FEE_PER_NIGHT * n;
    const subtotal = baseTotal + extraFee;
    const discount = n >= 2 ? subtotal * MULTI_NIGHT_DISCOUNT : 0;
    return { subtotal, discount, total: subtotal - discount };
  };

  const calculateResults = () => {
    const start = new Date(data.checkIn);
    const end = new Date(data.checkOut);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    
    const current = calculateForNights(nights, data.guests);
    const originalPricePerNight = current.subtotal / nights;
    const discountedPricePerNight = current.total / nights;
    
    let promoInfo: { totalWithDiscount: number, savings: number, pricePerNight: number } | undefined;
    if (nights === 1) {
      const twoNights = calculateForNights(2, data.guests);
      promoInfo = {
        totalWithDiscount: twoNights.total,
        savings: twoNights.discount,
        pricePerNight: twoNights.total / 2
      };
    }
    
    return {
      nights,
      subtotal: current.subtotal,
      discountAmount: current.discount,
      total: current.total,
      originalPricePerNight,
      discountedPricePerNight,
      promoInfo
    };
  };

  const results = calculateResults();

  const handleUpdateGuests = (delta: number) => {
    setData(prev => ({
      ...prev,
      guests: Math.min(MAX_TOTAL_GUESTS, Math.max(1, prev.guests + delta))
    }));
  };

  const handleAcceptOffer = () => {
    const startDate = new Date(data.checkIn);
    const newEndDate = new Date(startDate);
    newEndDate.setDate(startDate.getDate() + 2);
    
    setData(prev => ({
      ...prev,
      checkOut: newEndDate.toISOString().split('T')[0]
    }));
  };

  const handleWhatsApp = () => {
    const message = `¡Hola Olas Home Paracas! 👋\n\nMe gustaría confirmar mi estadía:\n📅 Ingreso: ${data.checkIn}\n📅 Salida: ${data.checkOut}\n👥 Personas: ${data.guests}\n🌙 Noches: ${results.nights}\n💰 Total: $${results.total} USD\n\n¿Me podrían ayudar con la reserva?`;
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
          <p className="text-blue-100/70 text-sm font-medium">Estás a un paso de la playa</p>
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
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Tarifa por noche</h4>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-3">
                {results.discountAmount > 0 && (
                  <span className="text-2xl font-bold text-gray-300 line-through decoration-red-400/50 decoration-2">
                    ${results.originalPricePerNight.toFixed(0)}
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className={`text-6xl font-black ${results.discountAmount > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                    ${results.discountedPricePerNight.toFixed(0)}
                  </span>
                  <span className="text-gray-400 text-sm font-black uppercase tracking-widest">USD</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tight mt-2">
                {results.discountAmount > 0 ? '✨ Tarifa especial aplicada' : 'Tarifa estándar'}
              </p>
            </div>
          </div>

          {results.promoInfo && results.nights === 1 && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-[2.5rem] p-6 relative overflow-hidden group shadow-lg">
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                  <TrendingDown size={14} /> Oferta Imperdible
                </div>
                <p className="text-amber-900 text-sm font-semibold mb-5 leading-relaxed">
                  Baja tu tarifa diaria a <span className="text-lg font-black text-orange-600">${results.promoInfo.pricePerNight.toFixed(0)}</span> reservando una noche adicional.
                </p>
                <button 
                  onClick={handleAcceptOffer}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-[1.03] shadow-lg shadow-orange-200"
                >
                  ¡Quiero el descuento ahora!
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
                  {results.nights} {results.nights === 1 ? 'noche' : 'noches'} • {data.guests} pers.
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-white tracking-tighter">${results.total}</span>
                  <span className="text-blue-400 font-bold text-base">USD</span>
                </div>
              </div>
              
              {results.discountAmount > 0 && (
                <div className="text-right">
                  <div className="bg-emerald-500/30 text-emerald-300 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter border border-emerald-500/30">
                    Ahorraste ${results.discountAmount.toFixed(0)}
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
            * Consulta disponibilidad de fechas vía WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
};