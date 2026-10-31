import React, { useState } from 'react';
import { X, Truck, CheckCircle2, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { NearbyTransfer } from '../types';

interface DispatchModalProps {
  transfer: NearbyTransfer | null;
  onClose: () => void;
  onConfirm: (hospitalName: string) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({ transfer, onClose, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!transfer) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmed(true);
      onConfirm(transfer.hospital);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                Mutual Aid Coordination
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Authorize Emergency Supply Transfer
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {!confirmed ? (
            <>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Source Facility:</span>
                  <strong className="text-slate-900 font-bold text-sm">{transfer.hospital}</strong>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Transit Travel Time:</span>
                  <span className="font-semibold text-slate-800 flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-slate-400" />
                    {transfer.distance}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Oxygen Tanks:</span>
                  <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {transfer.availableOxygenTanks} Cylinders
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Ventilator Units:</span>
                  <strong className="text-slate-900">{transfer.ventilators} Portable Units</strong>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Support Personnel:</span>
                  <span className="text-slate-700 font-medium">{transfer.staffAvailable}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Clicking confirm issues an immediate regional transport dispatch code to route delivery vehicles directly to Northside Urgent Care and local clinics.
              </p>
            </>
          ) : (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg">
                Supply Transfer Dispatched!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Tracking Code: <strong className="font-mono text-slate-800">AID-{Math.floor(1000 + Math.random() * 9000)}-EMERGENCY</strong>
                <br />
                Courier convoy has departed {transfer.hospital}. Estimated delivery in {transfer.distance}.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-slate-100 bg-slate-50 space-x-2">
          {!confirmed ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Dispatching...' : 'Confirm & Dispatch Now'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
