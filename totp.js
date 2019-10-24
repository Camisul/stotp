// STUPID TOTP Author: Camisul
// ============================
// 10-18-19 12:15 AM
// ============================
// TODO: BIG REFACTORING ✔ (10-18-19 20:20 PM)
// TODO: Move towards using buffers as much as possible? ✔ (10-18-19 20:20 PM)
//       - Still thinking about this decision
// TODO: Module and linting ✔ (10-22-19 22:02 PM)
// TODO: Tests??? ✔ (10-24-19 20:47 PM)
const crypto = require('crypto');

function getTimestamp() {
  return Math.floor(+new Date() / 1000);
}

function parseSecret(secret) {
  if (typeof secret === 'string') {
    const temp = Buffer.from(secret, 'hex');
    if (temp.length) {
      return temp;
    }
  } else if (Buffer.isBuffer(secret)) {
    return secret;
  }
  return new Error('Cant parse secret key');
}

/**
 * @description Time based one time password function
 * @param {string | Buffer} secret key
 * @returns {string} generated code
 */

function totp(secret) {
  const parsedSecret = parseSecret(secret);
  /* RFC 6238
   * Message = (Current Unix time - T0) / X, where the
   * default floor function is used in the computation.
   * For example, with T0 = 0 and Time Step X = 30
   *
   * The implementation of this algorithm MUST support a time value T
   * larger than a 32-bit integer when it is beyond the year 2038.
   *
   * Explains all the weirdness of preMessage value
   */
  const preMessage = Math.floor(getTimestamp() / 30)
    .toString(16)
    .padStart(16, '0');
  const message = Buffer.from(preMessage, 'hex');
  // Generating hmac according to the RFC
  const hmac = crypto.createHmac('sha1', parsedSecret);
  hmac.update(message);
  const hmacResult = Buffer.from(hmac.digest('hex'), 'hex');

  /* RFC 4226
   * Generate Dynamic Truncation offset
   * Dynamic truncation is when the last 4
   * bits of the last byte of the MAC are
   * used to determine the start offset.
  */
  const offset = hmacResult.readUIntBE(hmacResult.length - 1, 1) & 0x0F;
  // Clearing 32'nd bit of mac
  const truncated = hmacResult.readUIntBE(offset, 4) & 0x7FFFFFFF;
  // Compute an HOTP value
  // Implementations MUST extract a 6-digit code at a minimum
  const code = truncated % (10 ** 6);
  // If HTOP value is less than 6 digits left pad it with zeroes
  return code.toString().padStart(6, '0');
}

module.exports = totp;
