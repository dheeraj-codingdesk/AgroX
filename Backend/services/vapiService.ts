
// IMPORTANT: This key should be kept secret and ideally stored in an environment variable.
const VAPI_SERVER_API_KEY = 'api key';

const VAPI_API_URL = 'https://api.vapi.ai/call/phone';

/**
 * Initiates a callback to a given phone number using the Vapi API.
 * @param phoneNumber The user's phone number to call.
 */
export const requestCallback = async (phoneNumber: string): Promise<void> => {
  const payload = {
    assistantId: "assitant id",
    phoneNumberId: "phone number id",
    customer: {
      number: phoneNumber,
    },
  };

  try {
    const response = await fetch(VAPI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_SERVER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown API error' }));
      console.error('Vapi API Error:', errorData);
      throw new Error(`Failed to initiate callback. Status: ${response.status}`);
    }

    // The call was successfully queued.
    console.log('Callback requested successfully.');

  } catch (error) {
    console.error('Error requesting callback:', error);
    throw new Error('An unexpected error occurred while requesting the callback.');
  }
};
