import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  FileCode,
  Printer,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { VaultArchive } from '@the-last-login/shared';
import { KeyRecoveryModal } from '../components/KeyRecoveryModal';
import { CandleGlow } from '../components/CandleGlow';

export const SealedOfrendaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seal' | 'verify'>('seal');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sealing state
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [passphraseHint, setPassphraseHint] = useState('Abuela birth year and birthplace');
  const [isSealing, setIsSealing] = useState(false);
  const [sealedArchive, setSealedArchive] = useState<{
    archive: VaultArchive;
    fileName: string;
    downloadUrl: string;
  } | null>(null);
  const [showRecoverySheet, setShowRecoverySheet] = useState(false);

  // Verifying state
  const [verifyPassphrase, setVerifyPassphrase] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  useEffect(() => {
    loadArchiveStatus();
  }, []);

  const loadArchiveStatus = async () => {
    setLoading(true);
    try {
      const data = await api.getArchiveStatus();
      setStatus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSealArchive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase || passphrase.length < 6) {
      alert('Passphrase must be at least 6 characters long.');
      return;
    }
    if (passphrase !== confirmPassphrase) {
      alert('Passphrases do not match.');
      return;
    }

    setIsSealing(true);
    try {
      const res = await api.sealArchive(passphrase, 'Marisol Hernandez');
      setSealedArchive(res);
      setShowRecoverySheet(true);
      await loadArchiveStatus();
    } catch (err: any) {
      alert(err.message || 'Failed to seal archive');
    } finally {
      setIsSealing(false);
    }
  };

  const handleVerifyUploaded = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyPassphrase) {
      alert('Please enter your passphrase.');
      return;
    }

    setIsVerifying(true);
    setVerifyError(null);
    setVerificationResult(null);

    try {
      if (selectedFile) {
        // Upload & verify
        const formData = new FormData();
        formData.append('archiveFile', selectedFile);
        formData.append('passphrase', verifyPassphrase);

        const res = await fetch('/api/archive/upload-verify', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Verification failed');
        setVerificationResult(data);
      } else if (sealedArchive?.archive) {
        // Verify current sealed archive
        const data = await api.verifyArchive(sealedArchive.archive, verifyPassphrase);
        setVerificationResult(data);
      } else {
        alert('Please select an .ofrenda file or seal a vault first.');
      }
    } catch (err: any) {
      setVerifyError(err.message || 'Decryption failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 text-center text-sm font-serif italic text-olive-800">
        Loading cryptographic archive module...
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-3xl font-bold text-olive-900 tracking-tight">
              Sealed Ofrenda
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-sage-200 text-olive-900 border border-sage-300">
              AES-256-GCM Vault
            </span>
          </div>
          <p className="text-xs text-olive-700 mt-1">
            Zero-knowledge cryptographic container. Encrypted locally with PBKDF2-SHA256 and AES-256-GCM.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-parchment-200 border border-parchment-300 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('seal')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'seal'
                ? 'bg-olive-900 text-parchment-50 shadow-sm'
                : 'text-olive-700 hover:text-olive-950'
            }`}
          >
            Seal New Vault
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'verify'
                ? 'bg-olive-900 text-parchment-50 shadow-sm'
                : 'text-olive-700 hover:text-olive-950'
            }`}
          >
            Verify / Decrypt Vault
          </button>
        </div>
      </div>

      {activeTab === 'seal' ? (
        /* TAB 1: SEAL ARCHIVE */
        <div className="space-y-8">
          {/* Readiness Inspection Card */}
          <div className="rounded-2xl bg-parchment-100 border border-parchment-300 p-6 shadow-soft-card space-y-4">
            <h3 className="font-serif text-lg font-bold text-olive-900">
              Archive Content Manifest Check
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3.5 rounded-xl bg-sage-50 border border-sage-200">
                <span className="text-xs text-olive-600 block">Approved Items</span>
                <span className="font-serif text-2xl font-bold text-sage-800">
                  {status?.approvedTotal || 0}
                </span>
                <span className="text-[10px] text-sage-700 font-mono block mt-1">KEEP & RELEASE</span>
              </div>

              <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300">
                <span className="text-xs text-olive-600 block">Approved Letters</span>
                <span className="font-serif text-2xl font-bold text-olive-900">
                  {status?.approvedLetters || 0}
                </span>
                <span className="text-[10px] text-olive-600 font-mono block mt-1">SEALED LETTERS</span>
              </div>

              <div className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-300">
                <span className="text-xs text-olive-600 block">Interviews</span>
                <span className="font-serif text-2xl font-bold text-olive-900">
                  {status?.completedInterviews || 0}
                </span>
                <span className="text-[10px] text-olive-600 font-mono block mt-1">REFLECTIONS</span>
              </div>

              <div className="p-3.5 rounded-xl bg-terracotta-50 border border-terracotta-200">
                <span className="text-xs text-terracotta-700 block">Exorcised Items</span>
                <span className="font-serif text-2xl font-bold text-terracotta-800">
                  {status?.exorciseItems || 0}
                </span>
                <span className="text-[10px] text-terracotta-600 font-mono block mt-1">EXCLUDED FROM VAULT</span>
              </div>
            </div>

            {status?.unassignedItems > 0 && (
              <div className="p-3 rounded-xl bg-marigold-50 border border-marigold-200 text-xs text-marigold-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-marigold-600 shrink-0" />
                <span>
                  Notice: You still have <strong>{status.unassignedItems} unassigned items</strong>. They will NOT be preserved unless triaged into KEEP or RELEASE.
                </span>
              </div>
            )}
          </div>

          {/* Encryption Passphrase Form */}
          <form onSubmit={handleSealArchive} className="rounded-3xl bg-olive-900 text-parchment-50 p-8 shadow-elevated border border-olive-800 space-y-6">
            <div className="border-b border-olive-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-marigold-400 font-bold block mb-1">
                Zero-Knowledge Key Derivation
              </span>
              <h3 className="font-serif text-2xl font-bold text-parchment-50">
                Set Estate Vault Passphrase
              </h3>
              <p className="text-xs text-parchment-300 mt-1 leading-relaxed">
                Choose a strong passphrase. It is fed into PBKDF2 (100,000 rounds) to derive an AES-256 key. 
                Because this software has zero backdoors, <strong>if this key is forgotten, the archive cannot be recovered.</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-sage-300 tracking-wider mb-1 font-semibold">
                  Secret Passphrase *
                </label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Min 6 characters..."
                  className="w-full px-4 py-2.5 bg-olive-950 border border-olive-700 rounded-xl text-sm text-parchment-50 focus:outline-none focus:ring-2 focus:ring-marigold-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-sage-300 tracking-wider mb-1 font-semibold">
                  Confirm Passphrase *
                </label>
                <input
                  type="password"
                  value={confirmPassphrase}
                  onChange={(e) => setConfirmPassphrase(e.target.value)}
                  placeholder="Repeat passphrase..."
                  className="w-full px-4 py-2.5 bg-olive-950 border border-olive-700 rounded-xl text-sm text-parchment-50 focus:outline-none focus:ring-2 focus:ring-marigold-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-sage-300 tracking-wider mb-1 font-semibold">
                Memory Hint (Printed on Physical Recovery Sheet only)
              </label>
              <input
                type="text"
                value={passphraseHint}
                onChange={(e) => setPassphraseHint(e.target.value)}
                placeholder="e.g. Abuela birthday year and city"
                className="w-full px-4 py-2 bg-olive-950 border border-olive-700 rounded-xl text-sm text-parchment-50 focus:outline-none focus:ring-2 focus:ring-marigold-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-olive-800">
              <div className="flex items-center gap-2 text-xs text-parchment-300">
                <Lock className="w-4 h-4 text-marigold-400" />
                <span>Zero telemetry • Authenticated encryption with HMAC/GCM tags</span>
              </div>

              <button
                type="submit"
                disabled={isSealing}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-400 hover:to-marigold-500 text-olive-950 font-bold rounded-xl text-sm shadow-md transition-all active:scale-98 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-olive-950" />
                <span>{isSealing ? 'Encrypting & Deriving Key...' : 'Encrypt & Seal Ofrenda'}</span>
              </button>
            </div>
          </form>

          {/* Success Download Banner if sealed */}
          {sealedArchive && (
            <div className="rounded-2xl bg-sage-50 border border-sage-300 p-6 shadow-soft-card space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-sage-600 shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-lg text-olive-900">
                    Ofrenda Vault Successfully Sealed & Encrypted!
                  </h4>
                  <p className="text-xs text-olive-700">
                    File: <code className="font-mono bg-sage-100 px-1 py-0.5 rounded">{sealedArchive.fileName}</code>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={sealedArchive.downloadUrl}
                  download={sealedArchive.fileName}
                  className="flex items-center gap-2 px-5 py-2.5 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-xs font-semibold shadow-md transition-all"
                >
                  <Download className="w-4 h-4 text-marigold-400" />
                  <span>Download .ofrenda Package File</span>
                </a>

                <button
                  onClick={() => setShowRecoverySheet(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-parchment-200 hover:bg-parchment-300 text-olive-900 border border-parchment-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Printer className="w-4 h-4 text-olive-700" />
                  <span>Print Emergency Key Recovery Sheet</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: VERIFY ARCHIVE */
        <div className="space-y-6">
          <div className="rounded-2xl bg-parchment-100 border border-parchment-300 p-6 shadow-soft-card space-y-4">
            <h3 className="font-serif text-lg font-bold text-olive-900">
              Test & Verify Sealed Archive Integrity
            </h3>
            <p className="text-xs text-olive-700 leading-relaxed">
              Verify that an <code className="font-mono text-xs">.ofrenda</code> container decrypts authentic contents and that zero bytes were tampered with since sealing.
            </p>

            <form onSubmit={handleVerifyUploaded} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-2">
                  Select .ofrenda Archive File
                </label>
                <input
                  type="file"
                  accept=".ofrenda,application/json"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-olive-900 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-olive-900 file:text-parchment-50 hover:file:bg-olive-800 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-olive-900 uppercase tracking-wider mb-1">
                  Decryption Passphrase *
                </label>
                <input
                  type="password"
                  value={verifyPassphrase}
                  onChange={(e) => setVerifyPassphrase(e.target.value)}
                  placeholder="Enter vault passphrase..."
                  className="w-full px-4 py-2.5 bg-parchment-50 border border-parchment-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-marigold-500 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="flex items-center gap-2 px-6 py-2.5 bg-olive-900 hover:bg-olive-800 text-parchment-50 rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4 text-marigold-400" />
                <span>{isVerifying ? 'Verifying HMAC & Decrypting...' : 'Verify Archive Authenticity'}</span>
              </button>
            </form>
          </div>

          {/* Verification Results */}
          {verifyError && (
            <div className="p-4 rounded-2xl bg-terracotta-100 border border-terracotta-300 text-xs text-terracotta-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-terracotta-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-terracotta-900">Decryption Failed</h4>
                <p>{verifyError}</p>
              </div>
            </div>
          )}

          {verificationResult && (
            <div className="rounded-2xl bg-parchment-100 border border-sage-300 p-6 shadow-soft-card space-y-6">
              {verificationResult.isValid ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-sage-50 border border-sage-200">
                    <CheckCircle2 className="w-7 h-7 text-sage-600 shrink-0" />
                    <div>
                      <h4 className="font-serif font-bold text-lg text-sage-900">
                        Archive Verified Authentic • 100% Integrity
                      </h4>
                      <p className="text-xs text-sage-800">
                        AES-256-GCM authentication tags match. All {verificationResult.integrityDetails.verifiedItemsCount} digital items passed SHA-256 checksums with 0 tampering.
                      </p>
                    </div>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-3 gap-4 text-xs font-mono text-olive-800">
                    <div>
                      <span className="text-olive-600 block">ARCHIVE ID:</span>
                      <span className="font-bold">{verificationResult.archiveId}</span>
                    </div>
                    <div>
                      <span className="text-olive-600 block">OWNER:</span>
                      <span className="font-bold">{verificationResult.ownerName}</span>
                    </div>
                    <div>
                      <span className="text-olive-600 block">CREATED AT:</span>
                      <span className="font-bold">{new Date(verificationResult.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Decrypted items breakdown */}
                  {verificationResult.payload && (
                    <div className="space-y-2 pt-2 border-t border-parchment-300">
                      <h5 className="font-serif font-bold text-sm text-olive-900">
                        Decrypted Possessions Inside Vault ({verificationResult.payload.approvedItems.length})
                      </h5>
                      <div className="space-y-1.5 max-h-56 overflow-y-auto">
                        {verificationResult.payload.approvedItems.map((item: any) => (
                          <div key={item.id} className="p-2.5 rounded-lg bg-parchment-50 border border-parchment-200 text-xs flex items-center justify-between">
                            <span className="font-semibold text-olive-900">{item.title}</span>
                            <span className="font-mono text-sage-700 uppercase font-bold text-[10px]">
                              {item.triageStatus} • {item.recipient || 'Preserved'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-terracotta-100 border border-terracotta-300 text-xs text-terracotta-800">
                  <p className="font-bold text-sm text-terracotta-900">Integrity Check Failed</p>
                  <p>{verificationResult.errorMessage || 'Unknown error occurred.'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Emergency Recovery Key Sheet Modal */}
      <KeyRecoveryModal
        isOpen={showRecoverySheet}
        onClose={() => setShowRecoverySheet(false)}
        archiveId={sealedArchive?.archive.archiveId}
        ownerName="Marisol Hernandez"
        passphraseHint={passphraseHint}
      />
    </div>
  );
};
