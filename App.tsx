
import React, { useState } from 'react';
import { BookingForm } from './components/BookingForm.tsx';
import { QuoteModal } from './components/QuoteModal.tsx';
import { QuoteData } from './types.ts';

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
    <div className="min-h-screen relative flex flex-col items-center overflow-x-hidden">
      
      {/* Hero Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://res.cloudinary.com/drvs81bl0/image/upload/v1767802728/WhatsApp_Image_2026-01-05_at_8.45.07_PM_wrys7i.jpg')` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/30"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full flex flex-col items-center py-8">
        <div className="bg-white/95 backdrop-blur-md p-4 px-10 rounded-2xl shadow-xl flex flex-col items-center border border-white/20 transform hover:scale-105 transition-transform duration-300">
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
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-4 -mt-8 md:-mt-16 pb-20">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <h2 className="text-white text-5xl md:text-8xl font-black mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] tracking-tighter italic">
            Cotizar mi estadía
          </h2>
          <div className="bg-blue-600/20 backdrop-blur-sm border border-white/20 py-3 px-6 rounded-full inline-block">
            <p className="text-white text-sm md:text-xl font-black drop-shadow-md tracking-widest uppercase">
              VIVE LA EXPERIENCIA CON DEPARTAMENTOS FRENTE AL MAR
            </p>
          </div>
        </div>

        <BookingForm onQuote={handleQuote} />
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-white/70 text-[10px] font-bold tracking-[0.3em] uppercase bg-black/10 w-full text-center backdrop-blur-sm">
        <p>© {new Date().getFullYear()} Olas Home Paracas • Luxury Rentals Experience</p>
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