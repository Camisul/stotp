const assert = require('assert');
const totp = require('../totp');
/* eslint-disable */
describe('Fixed time point tests', () => {
  it('Computed code should match', () => {
    Date.prototype.valueOf = () => 0;
    const secret = Buffer.from('d4c33396a5c2b829e8d46a251e07ac2773823cbf', 'hex');
    const res = totp(secret);
    assert.equal(res, '449463');
  });
  it('Computed code should match, testing secret parser', () => {
    Date.prototype.valueOf = () => 0;
    const secret = 'd4c33396a5c2b829e8d46a251e07ac2773823cbf';
    const res = totp(secret);
    assert.equal(res, '449463');
  });

});