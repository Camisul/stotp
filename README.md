# ```Stotp```
Pretty simple Time-based one-time password algorithm implementation
using Buffers
### Usage
1. Require it in
```javascript
const totp = require('totp');
```
2. Use with secret key of your desire
  (currently supporting only hex strings or buffer objects)  
```javascript
const code = totp('414141');
// or
const secret = Buffer.from('QUFB','base64');
const code = totp(secret);
```
3. Done

## TODO
- [ ] publish to npm