
// IMPORTANT: This key should be kept secret and ideally stored in an environment variable.
const VAPI_SERVER_API_KEY = 'f5d50e73-73af-40e8-8a66-3b5663f4486d';

const VAPI_API_URL = 'https://api.vapi.ai/call/phone';

/**
 * Initiates a callback to a given phone number using the Vapi API.
 * @param phoneNumber The user's phone number to call.
 */
export const requestCallback = async (phoneNumber: string): Promise<void> => {
  const payload = {
    assistantId: "b0ee7332-a899-40b7-9812-167d043c2db7",
    phoneNumberId: "7b666eeb-5855-4553-8c34-5c069afd3d9a",
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
