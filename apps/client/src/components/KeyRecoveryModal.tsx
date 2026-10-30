import React from 'react';
import { X, Printer, ShieldAlert, KeyRound, Lock } from 'lucide-react';

interface KeyRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  archiveId?: string;
  ownerName?: string;
  passphraseHint?: string;
}

export const KeyRecoveryModal: React.FC<KeyRecoveryModalProps> = ({
  isOpen,
  onClose,
  archiveId = 'ofrenda_vault_sealed',
  ownerName = 'Marisol Hernandez',
  passphraseHint = 'Abuela birth year and birthplace'
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-olive-950/70 backdrop-blur-sm animate-fade-in print:bg-white print:p-0">
      <div className="bg-parchment-100 border border-parchment-400 w-full max-w-2xl rounded-2xl shadow-elevated overflow-hidden print:border-none print:shadow-none print:w-full print:max-w-none">
        {/* Header */}
        <div className="px-6 py-4 bg-olive-900 text-parchment-100 flex items-center justify-between print:bg-white print:text-black print:border-b-2 print:border-black">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-marigold-400 print:text-black" />
            <div>
              <h3 className="font-serif text-lg font-bold tracking-tight">
                Emergency Estate Passphrase Sheet
              </h3>
              <p className="text-xs text-sage-300 print:text-gray-600 font-mono">
                Physical Key Escrow • The Last Login
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-parchment-300 hover:text-white hover:bg-olive-800 transition-colors print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Body */}
        <div className="p-8 space-y-6 text-olive-900 font-sans print:p-6 print:text-black">
          {/* Warning Banner */}
          <div className="p-4 rounded-xl bg-parchment-200 border border-parchment-300 text-xs text-olive-800 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-olive-950">
              <ShieldAlert className="w-4 h-4 text-marigold-600" />
              <span>Zero-Knowledge Security Notice</span>
            </div>
            <p className="leading-relaxed">
              This digital estate vault is encrypted locally using authenticated AES-256-GCM. 
              <strong> There is no cloud backdoor, no master password, and no company server.</strong> 
              If this passphrase is lost, the contents of the sealed ofrenda cannot be decrypted by anyone.
            </p>
          </div>

          {/* Record Details */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono py-2 border-y border-parchment-300 print:border-gray-300">
            <div>
              <span className="text-olive-600 block">ESTATE OWNER:</span>
              <span className="text-olive-950 font-bold text-sm">{ownerName}</span>
            </div>
            <div>
              <span className="text-olive-600 block">ARCHIVE IDENTIFIER:</span>
              <span className="text-olive-950 font-bold truncate block">{archiveId}</span>
            </div>
            <div>
              <span className="text-olive-600 block">ENCRYPTION SCHEME:</span>
              <span className="text-olive-950 font-bold">AES-256-GCM (PBKDF2-SHA256)</span>
            </div>
            <div>
              <span className="text-olive-600 block">CREATION DATE:</span>
              <span className="text-olive-950 font-bold">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Handwritten Passphrase Area */}
          <div className="border-2 border-dashed border-olive-900/20 rounded-xl p-6 bg-parchment-50 print:bg-white print:border-gray-400">
            <label className="block text-xs font-mono uppercase text-olive-700 tracking-wider mb-2 font-semibold">
              Handwritten Passphrase (Store in physical safe or with trusted attorney)
            </label>
            <div className="h-12 border-b-2 border-olive-900/40 flex items-end pb-1 text-sm font-mono text-olive-950">
              {/* Intentionally blank for safe offline handwriting */}
              <span className="text-olive-400 text-xs italic print:hidden">
                [ Write your secret vault passphrase here by hand after printing ]
              </span>
            </div>
            {passphraseHint && (
              <p className="text-xs text-olive-700 mt-3 font-mono">
                <span className="font-semibold">Memory Hint:</span> {passphraseHint}
              </p>
            )}
          </div>

          {/* Instructions for Executor */}
          <div className="text-xs text-olive-800 space-y-2">
            <h4 className="font-serif font-bold text-sm text-olive-950">
              Instructions for the Designated Recipient or Executor:
            </h4>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Locate the digital file ending in <code className="bg-parchment-200 px-1 rounded">.ofrenda</code> on the estate USB key or hard drive.</li>
              <li>Open <strong>The Last Login</strong> application on any computer.</li>
              <li>Go to <strong>Sealed Ofrenda &rarr; Verify / Decrypt Vault</strong>.</li>
              <li>Upload the <code className="bg-parchment-200 px-1 rounded">.ofrenda</code> file and enter the handwritten passphrase above.</li>
              <li>All approved family heirlooms, recipes, photographs, and letters will unlock with verified integrity.</li>
            </ol>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-parchment-200 border-t border-parchment-300 flex items-center justify-between print:hidden">
          <p className="text-xs text-olive-600 font-mono">
            Print this sheet and store with vital documents
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-parchment-100 hover:bg-parchment-300 text-olive-900 border border-parchment-300 rounded-xl text-sm font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-sm font-medium shadow-md transition-all hover:shadow-glow-marigold"
            >
              <Printer className="w-4 h-4 text-marigold-400" />
              <span>Print Recovery Sheet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
