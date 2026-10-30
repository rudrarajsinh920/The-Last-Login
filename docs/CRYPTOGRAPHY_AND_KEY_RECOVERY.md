# Cryptography & Key Recovery Guide

## 1. Cryptographic Architecture

The Last Login uses established, authenticated symmetric cryptography:

- **Algorithm:** AES-256-GCM (Galois/Counter Mode)
- **Key Derivation Function (KDF):** PBKDF2 with HMAC-SHA256
- **Iteration Count:** 100,000 rounds
- **Salt:** 32 cryptographically random bytes (`crypto.randomBytes(32)`)
- **Initialization Vector (IV):** 12 bytes (`crypto.randomBytes(12)`)
- **Authentication Tag:** 16-byte GCM authentication tag
- **Integrity Checksums:** SHA-256 hash calculated on every item individually and stored in the manifest

---

## 2. Container Format (`.ofrenda`)

The exported `.ofrenda` package is an encrypted JSON structure:

```json
{
  "version": "1.0.0",
  "createdAt": "2026-10-30T12:00:00.000Z",
  "archiveId": "ofrenda_1793343388_a1b2c3d4",
  "ownerName": "Marisol Hernandez",
  "salt": "hex string (64 chars)",
  "iv": "hex string (24 chars)",
  "authTag": "hex string (32 chars)",
  "ciphertext": "base64 encoded ciphertext",
  "manifestSummary": {
    "totalItems": 6,
    "totalLetters": 2,
    "totalInterviews": 3,
    "checksumSha256": "overall sha256 checksum"
  }
}
```

---

## 3. Strict Exclusion of Exorcised Possessions

When a vault is sealed:
1. Only possessions marked **KEEP** and **RELEASE** are included.
2. Possessions marked **EXORCISE** (or pending exorcism) are **STRICTLY EXCLUDED** from the encrypted payload.
3. This ensures that sensitive documents, private grief journals, or temporary tax files marked for exclusion will never be shared or decrypted by recipients.

---

## 4. Key Recovery & Limitations Notice

> [!WARNING]
> **Zero-Knowledge Architecture:**  
> The Last Login does not store user passphrases or master encryption keys on any remote server.
> If the user forgets their passphrase, **the encrypted archive cannot be recovered or decrypted.**

### Best Practices for Physical Escrow:
1. Use the **"Print Emergency Key Recovery Sheet"** button in the Sealed Ofrenda screen.
2. Write the passphrase by hand on the printed paper sheet.
3. Place the recovery sheet in a fireproof physical safe, safe deposit box, or with a trusted estate attorney.
