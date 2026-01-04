const API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  throw new Error('API URL is not configured. Please check your environment variables.');
}

export const fetchBalanceChanges = async (balanceId, force = false) => {
  try {
    const response = await fetch(`${API_BASE_URL}/track/watch/mono/${balanceId}?force=${force}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error('API request was not successful');
    }
    return data.watch;
  } catch (error) {
    console.error('Error fetching balance changes:', error);
    throw error;
  }
};
