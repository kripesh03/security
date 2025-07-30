const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = Buffer.from(process.env.GOOGLE_ID_ENCRYPTION_KEY, "utf8"); // if using string directly
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

function decrypt(text) {
  try {
    const [ivHex, encryptedText] = text.split(":");
    if (!ivHex || !encryptedText) throw new Error("Malformed encrypted text");

    const iv = Buffer.from(ivHex, "hex");
    if (iv.length !== 16) throw new Error("Invalid IV length");

    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Decryption failed:", err.message);
    return null;
  }
}

module.exports = { encrypt, decrypt };
