
import React, { useState } from 'react';
import { BookingForm } from './components/BookingForm';
import { QuoteModal } from './components/QuoteModal';
import { QuoteData } from './types';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    checkIn: '',
    checkOut: '',
    guests: 2
  });

  const handleQuote = (data: QuoteData) => {
    setQuoteData(data);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center">
      
      {/* Hero Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url('https://res.cloudinary.com/drvs81bl0/image/upload/v1767802728/WhatsApp_Image_2026-01-05_at_8.45.07_PM_wrys7i.jpg')` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"></div>
      </div>

      {/* Header - Text Only Version */}
      <header className="relative z-10 w-full flex flex-col items-center py-8">
        <div className="bg-white/95 backdrop-blur-md p-4 px-10 rounded-2xl shadow-xl flex flex-col items-center border border-white/20">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-6 h-[2px] bg-blue-500 rounded-full"></div>
            <div className="w-10 h-[2px] bg-blue-500 rounded-full"></div>
            <div className="w-6 h-[2px] bg-blue-500 rounded-full"></div>
          </div>
          <h1 className="text-2xl font-black tracking-[0.25em] text-gray-900 leading-tight">OLAS HOME</h1>
          <p className="text-[10px] tracking-[0.45em] text-blue-600 font-black uppercase">PARACAS • EXCLUSIVE</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-4 -mt-16 md:-mt-24">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-white text-5xl md:text-8xl font-black mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] tracking-tighter italic">
            Cotizar mi estadía
          </h2>
          <p className="text-white text-lg md:text-2xl font-black max-w-3xl mx-auto drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-widest uppercase">
            VIVE LA EXPERIENCIA CON DEPARTAMENTOS FRENTE AL MAR
          </p>
        </div>

        <BookingForm onQuote={handleQuote} />
      </main>

      {/* Footer / Contact */}
      <footer className="relative z-10 py-8 text-white/70 text-[11px] font-bold tracking-widest uppercase">
        <p>© {new Date().getFullYear()} Olas Home Paracas • Luxury Rentals</p>
      </footer>

      {/* Quote Modal */}
      <QuoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={quoteData} 
        setData={setQuoteData}
      />
    </div>
  );
};

export default App;
