const axios = require('axios');

const initiateAadhaarOTP = async (aadhaarNumber) => {
  try {
    const response = await axios.post(
      'https://sandbox.karza.in/v2/aadhaar-otp',
      {
        aadhaar: aadhaarNumber,
      },
      {
        headers: {
          'x-karza-key': 'aHNDiZ5fj52HXscBQMBEJwdG3BBNjBNNaeCyKt5ff4DL6RmO',
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Response:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ Error Response:', error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
};

(async () => {
  await initiateAadhaarOTP('256367567052'); // Use string to preserve leading 0s if any
})();
