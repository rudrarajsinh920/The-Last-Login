# Cryptography & Key Recovery Technical Specification

## 1. Cryptographic Architecture & Parameter Evaluation

The Last Login uses authenticated symmetric cryptography to ensure both confidentiality and integrity for estate archives:

* **Symmetric Cipher:** AES-256-GCM (Galois/Counter Mode, 256-bit key)
* **Authenticated Tag:** 16-byte (128-bit) GCM authentication tag
* **Key Derivation Function (KDF):** PBKDF2 with HMAC-SHA256
* **PBKDF2 Iteration Count:** 100,000 iterations (default, with backwards compatibility check)
* **Salt:** 32 cryptographically secure random bytes (`crypto.randomBytes(32)`)
* **Initialization Vector (IV):** 12 cryptographically secure random bytes (`crypto.randomBytes(12)`)
* **Integrity Checksums:** SHA-256 hash calculated individually on every asset and verified against the archive manifest

### PBKDF2 Security Evaluation & Tradeoffs:
1. **Security vs. Usability:** 100,000 rounds of PBKDF2-HMAC-SHA256 requires ~250–350ms of computation time on modern desktop hardware. This prevents interactive freezing during UI operations while offering robust resistance against offline dictionary and brute-force attacks.
2. **Backward Compatibility:** All `.ofrenda` archives store their iteration count (`iterations: 100000`). When decrypting, `verifyAndDecryptArchive` reads `archiveData.iterations || 100000`, ensuring existing archives remain decryptable without format breaking.
3. **DoS Protection:** Iteration counts from imported archive files are bounded between `10,000` and `2,000,000` rounds to prevent resource exhaustion attacks from maliciously crafted archive headers.

---

## 2. Sealed Ofrenda Container Format (`.ofrenda`)

The exported `.ofrenda` package is an encrypted JSON structure:

```json
{
  "version": "1.0.0",
  "createdAt": "2026-10-30T12:00:00.000Z",
  "archiveId": "ofrenda_1793343388_a1b2c3d4",
  "ownerName": "Marisol Hernandez",
  "salt": "hex string (64 characters = 32 bytes)",
  "iv": "hex string (24 characters = 12 bytes)",
  "authTag": "hex string (32 characters = 16 bytes)",
  "ciphertext": "base64 encoded ciphertext",
  "manifestSummary": {
    "totalItems": 6,
    "totalLetters": 2,
    "totalInterviews": 3,
    "iterations": 100000,
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
