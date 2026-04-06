const { sendToTelegram, formatLog } = require('./api.js');

// यहाँ अपनी कमांड या लॉजिक लिखें
const testData = { ip: '1.1.1.1', url: '/test', method: 'GET' };
const message = formatLog(testData);
sendToTelegram(message);
