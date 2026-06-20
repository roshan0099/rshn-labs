/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Users,
  Calendar,
  UtensilsCrossed,
  Layers,
  Flame,
  Check,
  Plus,
  Minus,
  Trash2,
  Phone,
  Mail,
  User,
  MapPin,
  ClipboardList,
  Printer,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Info
} from 'lucide-react';
import {
  INDIAN_MENU_ITEMS,
  INDIAN_EVENT_TYPES,
  MenuItem,
  CateringSelection,
  GuestConfig,
  calculateQuantity
} from './data';

export default function App() {
  // --- STATE ---
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [guestCount, setGuestCount] = useState<number>(100);
  const [eventType, setEventType] = useState<string>('Wedding Reception');
  const [eventDate, setEventDate] = useState<string>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 2 weeks later
  );
  const [dietaryPreference, setDietaryPreference] = useState<'all' | 'veg-only' | 'non-veg-only'>('all');
  
  // Clean, minimal contact form state
  const [contact, setContact] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const [selectedItems, setSelectedItems] = useState<Record<string, CateringSelection>>({});
  const [currentTab, setCurrentTab] = useState<'starters' | 'juice' | 'main' | 'dessert'>('starters');
  
  // Submit state
  const [isSubmitMode, setIsSubmitMode] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    totalCost: number;
    subtotal: number;
    taxes: number;
  } | null>(null);

  // --- ACTIONS ---
  const handleItemToggle = (item: MenuItem) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      if (copy[item.id]) {
        delete copy[item.id];
      } else {
        copy[item.id] = {
          item,
          multiplier: 1.0, // default portion scale
          proportion: 100  // default serve ratio (100% of guests)
        };
      }
      return copy;
    });
  };

  const adjustMultiplier = (itemId: string, direction: 'up' | 'down') => {
    setSelectedItems((prev) => {
      if (!prev[itemId]) return prev;
      const current = prev[itemId].multiplier;
      let next = current;
      if (direction === 'up' && current < 1.5) next = Number((current + 0.1).toFixed(1));
      if (direction === 'down' && current > 0.6) next = Number((current - 0.1).toFixed(1));
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          multiplier: next
        }
      };
    });
  };

  const removeItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const resetAll = () => {
    setSelectedItems({});
    setGuestCount(100);
    setEventType('Wedding Reception');
    setDietaryPreference('all');
    setContact({ name: '', phone: '', email: '', notes: '' });
    setConfirmedOrder(null);
    setIsSubmitMode(false);
    setShowLanding(true);
  };

  // --- DERIVED VALUES ---
  const selectedList = useMemo(() => Object.values(selectedItems), [selectedItems]);

  const filteredMenuItems = useMemo(() => {
    return INDIAN_MENU_ITEMS.filter((item) => {
      if (item.category !== currentTab) return false;
      if (dietaryPreference === 'veg-only' && item.type === 'non-veg') return false;
      if (dietaryPreference === 'non-veg-only' && item.type === 'veg') return false;
      return true;
    });
  }, [currentTab, dietaryPreference]);

  const finances = useMemo(() => {
    let subtotal = 0;
    selectedList.forEach((sel) => {
      const perGuestCost = sel.item.pricePerGuest * sel.multiplier * (sel.proportion / 100);
      subtotal += perGuestCost * guestCount;
    });
    const taxes = Math.round(subtotal * 0.05); // 5% CGST/SGST professional hospitality levy
    const totalCost = subtotal + taxes;
    return {
      subtotal: Math.round(subtotal),
      taxes,
      totalCost: Math.round(totalCost),
      perGuestAverage: selectedList.length > 0 ? Math.round(subtotal / guestCount) : 0
    };
  }, [selectedList, guestCount]);

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedList.length === 0) return;
    const randomId = 'ICM-' + Math.floor(100000 + Math.random() * 900000);
    setConfirmedOrder({
      orderId: randomId,
      subtotal: finances.subtotal,
      taxes: finances.taxes,
      totalCost: finances.totalCost
    });
  };

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#2c2621]">
      
      {/* SIMPLE REFINED HEADER */}
      <header className="bg-white border-b border-[#ebdcd0] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍛</span>
            <div>
              <h1 className="text-lg font-display font-semibold tracking-tight text-[#1a120b]">
                Utsav <span className="text-[#c2410c] font-light">Catering</span>
              </h1>
              <p className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase">Traditional Indian Banquet Planner</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={resetAll}
              className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-all font-medium flex items-center gap-1 bg-neutral-50 hover:bg-neutral-100 rounded-lg cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Plan
            </button>
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-neutral-400 block uppercase font-mono tracking-wider">Est. Budget</span>
              <span className="text-sm font-sans font-bold text-[#c2410c]">₹{finances.totalCost.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </header>

      {!confirmedOrder && showLanding ? (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Landing Hero copy */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                <Sparkles className="h-3 w-3" /> Royal Culinary Experience
              </span>

              <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-neutral-900 leading-tight">
                Savour the Royal Heritage of <span className="text-[#c2410c] italic font-light font-sans block sm:inline">Indian Feasts</span>
              </h2>

              <p className="text-sm sm:text-base text-neutral-500 max-w-xl leading-relaxed">
                Step into a modern digital workshop designed for planning authentic Indian celebrations. 
                Whether hosting a grand imperial wedding or a pristine family pooja, assemble your perfect platter 
                and map food quantities with surgical precision.
              </p>

              {/* Minimal feature list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex gap-2">
                  <span className="text-xl shrink-0">🍢</span>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">Delectable Heritage</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Mouthwatering Paneer Tikkas, refreshing Lassis, and slow-smmered Biryanis.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="text-xl shrink-0">⚖️</span>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">Portion Calibration</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Scale counts from 15 to 1,000 guests instantly based on professional catering guidelines.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="text-xl shrink-0">🌿</span>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">Dietary Safety</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Filter items effortlessly by Pure Vegetarian standard, Non-Veg preferences, and heat levels.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="text-xl shrink-0">📋</span>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">Caterer Bill Generator</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Download or print full visual receipts to communicate directly with your kitchen team.</p>
                  </div>
                </div>
              </div>

              {/* Call to action direct trigger */}
              <div className="pt-6">
                <button
                  onClick={() => setShowLanding(false)}
                  className="px-8 py-3.5 bg-[#c2410c] hover:bg-[#a13307] text-white font-bold text-sm rounded-xl shadow-md cursor-pointer inline-flex items-center gap-2 transition-all active:scale-95"
                >
                  Configure My Menu <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Config quick-selector preview panel */}
            <div className="lg:col-span-5 bg-white border border-[#ebdcd0] rounded-3xl p-6 sm:p-8 shadow-sm relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-9xl">🍛</div>
              
              <h3 className="font-display font-bold text-neutral-800 text-base mb-4 inline-flex items-center gap-1.5 border-b border-[#f4ece7] pb-2 w-full">
                Setup Event Groundwork
              </h3>

              <div className="space-y-4 text-xs font-medium text-neutral-600">
                
                {/* 1. Guests Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-neutral-750">Guests Target</span>
                    <span className="font-mono text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px]">
                      {guestCount} Pax
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min="15"
                    max="600"
                    step="5"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="w-full accent-[#c2410c] py-2"
                  />
                </div>

                {/* 2. Event Occasion */}
                <div className="space-y-1.5">
                  <span className="font-bold text-neutral-750">Occasion Style</span>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full text-xs font-medium border border-neutral-200 p-2.5 rounded-xl bg-neutral-50/50 cursor-pointer focus:outline-[#c2410c]"
                  >
                    {INDIAN_EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Date selection */}
                <div className="space-y-1.5">
                  <span className="font-bold text-neutral-750">Event Launch Date</span>
                  <input
                    type="date"
                    value={eventDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs font-medium border border-neutral-200 p-2.5 rounded-xl bg-neutral-50/50 cursor-pointer focus:outline-[#c2410c] font-mono text-neutral-700"
                  />
                </div>

                {/* Beautiful CTA */}
                <button
                  onClick={() => setShowLanding(false)}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs tracking-wider transition-all cursor-pointer block text-center"
                >
                  Create Custom Bill Plate →
                </button>
              </div>

              {/* Saffron disclaimer line */}
              <div className="mt-4 text-[9px] text-neutral-400 text-center flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-600 inline-block" />
                <span>Supports pure vegetarian & non-veg event arrangements securely</span>
              </div>
            </div>

          </div>
        </main>
      ) : !confirmedOrder ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* STEP 1: COMPACT EVENT CONFIG BAR */}
          <div className="bg-white border border-[#e8dfd8] rounded-2xl p-5 mb-8 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            
            {/* Guest Count Input Box */}
            <div className="flex-1 min-w-[200px] flex items-center gap-4 border-b md:border-b-0 md:border-r border-dashed border-[#eaded5] pb-4 md:pb-0 md:pr-6">
              <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-700 shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Estimated Guests</span>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="range"
                    min="15"
                    max="600"
                    step="5"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="flex-1 accent-[#c2410c] h-1"
                  />
                  <input
                    type="number"
                    value={guestCount}
                    min="15"
                    max="1000"
                    onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 15))}
                    className="w-16 text-center font-mono font-bold text-xs bg-[#fdfcfb] border border-[#e8dfd8] py-1 rounded-lg focus:outline-[#c2410c] text-amber-950"
                  />
                </div>
              </div>
            </div>

            {/* Event Occasion */}
            <div className="flex-1 min-w-[150px] flex items-center gap-3 border-b md:border-b-0 md:border-r border-dashed border-[#eaded5] pb-4 md:pb-0 md:pr-6">
              <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-700 shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Occasion Type</span>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full text-xs font-semibold bg-transparent text-[#3e342c] focus:outline-hidden mt-1 cursor-pointer"
                >
                  {INDIAN_EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Diet preferences */}
            <div className="flex-1 min-w-[180px] flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 shrink-0">
                <span className="text-xl">🌿</span>
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Diet Preference</span>
                <div className="flex gap-2 mt-1">
                  {[
                    { label: 'All', val: 'all' },
                    { label: 'Veg Only', val: 'veg-only' },
                    { label: 'Non-Veg Only', val: 'non-veg-only' }
                  ].map((d) => (
                    <button
                      key={d.val}
                      onClick={() => setDietaryPreference(d.val as any)}
                      className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-all cursor-pointer ${
                        dietaryPreference === d.val
                          ? 'bg-[#166534] text-white border-[#166534]'
                          : 'bg-white border-[#e8dfd8] text-neutral-600 hover:border-neutral-400'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT AREA: COMPACT CATEGORY GRID WITH CARDS */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* CATEGORY SELECTOR */}
              <div className="flex border-b border-[#e8dfd8] space-x-2">
                {[
                  { key: 'starters', label: '🍢 Starters', desc: 'Savoury Bites' },
                  { key: 'juice', label: '🥤 Welcome Juices', desc: 'Lassis & Coolers' },
                  { key: 'main', label: '🍛 Main Course', desc: 'Royal Gravies & Breads' },
                  { key: 'dessert', label: '🍨 Desserts', desc: 'Divine Sweets' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setCurrentTab(tab.key as any)}
                    className={`flex-1 pb-3 text-center transition-all border-b-2 cursor-pointer ${
                      currentTab === tab.key
                        ? 'border-[#c2410c] text-[#c2410c] font-semibold'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700 font-medium'
                    }`}
                  >
                    <span className="text-xs sm:text-sm block">{tab.label}</span>
                    <span className="text-[9px] text-neutral-400 hidden sm:block mt-0.5">{tab.desc}</span>
                  </button>
                ))}
              </div>

              {/* CARD GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMenuItems.map((item) => {
                  const isSelected = !!selectedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      className={`bg-white border rounded-xl p-4 transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-amber-400 ring-1 ring-amber-500/20 shadow-sm bg-amber-50/5'
                          : 'border-[#eae2dc] hover:border-neutral-300'
                      }`}
                    >
                      <div>
                        {/* Type Indicator and Spice Rating */}
                        <div className="flex justify-between items-center mb-1">
                          <span className="flex items-center gap-1 text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                            <span className={`inline-block h-2 w-2 rounded-full ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                            {item.type}
                          </span>
                          
                          <div className="flex gap-0.5">
                            {item.spicyLevel > 0 ? (
                              Array.from({ length: item.spicyLevel }).map((_, i) => (
                                <Flame key={i} className="h-3 w-3 text-orange-600 fill-orange-500" />
                              ))
                            ) : (
                              <span className="text-[8px] bg-slate-50 text-slate-500 font-bold px-1 py-0.5 rounded uppercase">Sweet/Mild</span>
                            )}
                          </div>
                        </div>

                        {/* Title, description & Price label */}
                        <h3 className="font-display font-semibold text-[#1a120b] text-sm mt-1">{item.name}</h3>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Add and adjust block */}
                      <div className="mt-4 pt-3 border-t border-dashed border-[#f4ece7] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-400 block">Est. Rate</span>
                          <span className="text-xs font-mono font-bold text-amber-800">₹{item.pricePerGuest} <span className="text-[9px] text-neutral-400 font-normal">/ pax</span></span>
                        </div>

                        <button
                          onClick={() => handleItemToggle(item)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                              : 'bg-white border border-[#c2410c] text-[#c2410c] hover:bg-amber-50'
                          }`}
                        >
                          {isSelected ? '✓ Added' : '+ Add Item'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* RIGHT SIDEBAR: ORDER NOTEBOOK */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white border border-[#e8dfd8] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#ebdcd0] pb-3 mb-4">
                  <h3 className="font-display font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-[#c2410c]" />
                    Your Platter Selection
                  </h3>
                  <span className="text-xs font-mono font-bold text-neutral-500 px-2 py-0.5 rounded bg-neutral-100">
                    {selectedList.length} items
                  </span>
                </div>

                {selectedList.length === 0 ? (
                  <div className="text-center py-10">
                    <span className="text-3xl block mb-2 opacity-60">🍛</span>
                    <p className="text-xs text-neutral-400">Your catering plate is empty.</p>
                    <p className="text-[10px] text-neutral-400 mt-1 max-w-[200px] mx-auto">Pick your favorite appetizers and delicacies across tabs.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    
                    {/* Selected item lines */}
                    <div className="max-h-60 overflow-y-auto divide-y divide-[#f5ede7] pr-1">
                      {selectedList.map((selected) => {
                        const qty = calculateQuantity(guestCount, selected.item, selected.multiplier, selected.proportion);
                        return (
                          <div key={selected.item.id} className="py-2.5 flex justify-between items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-semibold text-neutral-800 truncate">{selected.item.name}</h4>
                              
                              {/* Quantity control banner inside summary */}
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-[10px] text-neutral-400 mr-2">Qty: <span className="font-mono font-bold text-neutral-600">{qty} {selected.item.unit}</span></span>
                                
                                <button
                                  onClick={() => adjustMultiplier(selected.item.id, 'down')}
                                  disabled={selected.multiplier <= 0.6}
                                  className="h-4 w-4 bg-neutral-100 rounded hover:bg-neutral-200 disabled:opacity-40 flex items-center justify-center text-[10px] cursor-pointer"
                                  title="Reduce quantity slightly"
                                >
                                  -
                                </button>
                                <span className="text-[10px] text-neutral-500 font-mono scale-90 px-0.5">{Math.round(selected.multiplier * 100)}%</span>
                                <button
                                  onClick={() => adjustMultiplier(selected.item.id, 'up')}
                                  disabled={selected.multiplier >= 1.5}
                                  className="h-4 w-4 bg-neutral-100 rounded hover:bg-neutral-200 disabled:opacity-40 flex items-center justify-center text-[10px] cursor-pointer"
                                  title="Increase quantity slightly"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono font-bold text-xs text-neutral-700 block">
                                ₹{Math.round(selected.item.pricePerGuest * selected.multiplier * guestCount).toLocaleString('en-IN')}
                              </span>
                              <button
                                onClick={() => removeItem(selected.item.id)}
                                className="text-neutral-400 hover:text-red-500 text-[10px] mt-1 inline-block cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* FINANCIALS BREAKDOWN */}
                    <div className="bg-[#fdfcfb] border border-[#e8dfd8] rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex justify-between text-neutral-500">
                        <span>Items Subtotal:</span>
                        <span className="font-mono">₹{finances.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-neutral-500">
                        <span>Linen & Chef Taxes (5%):</span>
                        <span className="font-mono">₹{finances.taxes.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="border-t border-[#ebdcd0] pt-2 mt-2 flex justify-between font-bold text-neutral-900 text-sm">
                        <span>Estimated Quote:</span>
                        <span className="font-mono text-[#c2410c]">₹{finances.totalCost.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="text-[10px] text-neutral-400 text-center pt-2 font-medium">
                        Avg. Spend: ₹{finances.perGuestAverage} per guest plate
                      </div>
                    </div>

                    {/* CONTACT FORM BLOCK FOR BANQUET SUBMISSION */}
                    <div className="border-t border-[#ebdcd0] pt-4 space-y-3">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Contact Coordinates</span>
                      
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Your Name *"
                          required
                          value={contact.name}
                          onChange={(e) => setContact({ ...contact, name: e.target.value })}
                          className="w-full text-xs py-2 px-3 border border-[#e8dfd8] rounded-lg focus:outline-hidden focus:border-[#c2410c] bg-white text-neutral-800"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Phone Number *"
                            required
                            value={contact.phone}
                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                            className="w-full text-xs py-2 px-3 border border-[#e8dfd8] rounded-lg focus:outline-hidden focus:border-[#c2410c] bg-white text-neutral-800"
                          />
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={contact.email}
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                            className="w-full text-xs py-2 px-3 border border-[#e8dfd8] rounded-lg focus:outline-hidden focus:border-[#c2410c] bg-white text-neutral-800"
                          />
                        </div>
                        <textarea
                          placeholder="Special requests or allergy instructions..."
                          rows={2}
                          value={contact.notes}
                          onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                          className="w-full text-xs py-1.5 px-3 border border-[#e8dfd8] rounded-lg focus:outline-hidden focus:border-[#c2410c] bg-white text-neutral-800 resize-none"
                        ></textarea>
                      </div>

                      <button
                        onClick={handleFinalSubmit}
                        disabled={!contact.name || !contact.phone}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          contact.name && contact.phone
                            ? 'bg-[#c2410c] hover:bg-[#a13307] text-white'
                            : 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
                        }`}
                      >
                        Submit Menu Selection <ArrowRight className="h-4 w-4" />
                      </button>
                      <p className="text-[9px] text-neutral-400 text-center">Please provide Name & Phone to unlock submission.</p>
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

        </main>
      ) : (
        /* LOCK / BOOKED TRANSITIONAL INVOICE VIEW */
        <main className="max-w-2xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#ebdcd0] rounded-3xl overflow-hidden shadow-lg"
          >
            {/* Green confirmation header banner */}
            <div className="bg-[#166534] p-8 text-center text-white relative">
              <span className="text-4xl">🎉</span>
              <h2 className="text-xl font-display font-bold mt-2">Catering Bill Registered</h2>
              <p className="text-[11px] text-emerald-100 font-mono uppercase mt-1 tracking-wider leading-relaxed">
                Order Reference: {confirmedOrder.orderId}
              </p>
            </div>

            {/* Invoice metadata overview */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 text-[10px] font-bold block uppercase tracking-wider">Occasion</span>
                  <span className="font-bold text-neutral-800 text-sm mt-0.5 block">{eventType}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] font-bold block uppercase tracking-wider">Estimated Pax</span>
                  <span className="font-bold text-neutral-800 text-sm mt-0.5 block">{guestCount} Guests</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] font-bold block uppercase tracking-wider">Reserved Host</span>
                  <span className="font-bold text-[#c2410c] text-sm mt-0.5 block">{contact.name}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] font-bold block uppercase tracking-wider">Contact Phone</span>
                  <span className="font-bold text-neutral-800 text-sm mt-0.5 block font-mono">{contact.phone}</span>
                </div>
              </div>

              {/* Cuisine lineup list */}
              <div className="border-t border-[#f4ece7] pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3">Customized Delicacies Lineup</h4>
                
                <div className="space-y-3">
                  {selectedList.map((selected) => {
                    const qty = calculateQuantity(guestCount, selected.item, selected.multiplier, selected.proportion);
                    return (
                      <div key={selected.item.id} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`h-2 w-2 rounded-full shrink-0 ${selected.item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                          <span className="font-semibold text-neutral-800 truncate">{selected.item.name}</span>
                        </div>
                        <span className="font-mono text-neutral-500">{qty} {selected.item.unit}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-[#fdfcfb] rounded-2xl p-4 border border-[#e8dfd8] space-y-2 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{confirmedOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Professional Catering Tax:</span>
                  <span className="font-mono">₹{confirmedOrder.taxes.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="border-t border-[#ebdcd0] pt-3.5 mt-2 flex justify-between font-bold text-neutral-900 text-sm items-baseline">
                  <span>Grand Estimate Total:</span>
                  <div className="text-right">
                    <span className="font-mono text-lg text-[#c2410c]">₹{confirmedOrder.totalCost.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-neutral-400 block font-normal">(incl. kitchen layout setups)</span>
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 px-4 py-2 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Printer className="h-4 w-4" /> Print Receipt
                </button>
                <button
                  onClick={resetAll}
                  className="flex-grow px-5 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                >
                  Plan Another Banquet
                </button>
              </div>

            </div>
          </motion.div>
        </main>
      )}

    </div>
  );
}
