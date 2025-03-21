// Token storage and management
interface AuthToken {
  token_type: string
  access_token: string
  expires_in: number
  timestamp: number // When the token was received
}

// In-memory token storage (in a real app, use a more persistent solution)
let authToken: AuthToken | null = null

// Authentication credentials
const AUTH_CREDENTIALS = {
  companyName: "goMart",
  clientID: "37bd943c-73d3-47ea-8675-21f66ef9b735",
  clientSecret: "HVIQbVqbmTGemaED",
  ownerName: "Rahul",
  ownerEmail: "rahul@abc.edu",
  rollNo: "1",
}

// API base URL
const API_BASE_URL = "http://20.244.56.144/test"

// Get a valid token (fetch new one if needed)
export async function getAuthToken(): Promise<string> {
  // If we have a token and it's not expired, return it
  if (authToken) {
    const currentTime = Math.floor(Date.now() / 1000)
    // Check if token is still valid (with 60 seconds buffer)
    if (authToken.expires_in > currentTime + 60) {
      return `${authToken.token_type} ${authToken.access_token}`
    }
  }

  // Otherwise, fetch a new token
  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(AUTH_CREDENTIALS),
    })

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`)
    }

    const data = await response.json()

    // Store the token with current timestamp
    authToken = {
      ...data,
      timestamp: Math.floor(Date.now() / 1000),
    }

    return `${authToken.token_type} ${authToken.access_token}`
  } catch (error) {
    console.error("Error obtaining auth token:", error)
    console.error("Request body:", JSON.stringify(AUTH_CREDENTIALS))
    throw new Error("Failed to authenticate with the API")
  }
}

// Function to make authenticated API requests
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    const token = await getAuthToken()

    // Add authorization header to the request
    const authOptions: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token,
      },
    }

    const response = await fetch(url, authOptions)
    console.log("Response status:", response.status)
    console.log("Response body:", await response.text())

    // If unauthorized, try to refresh token and retry once
    if (response.status === 401) {
      // Force token refresh
      authToken = null
      const newToken = await getAuthToken()

      // Retry with new token
      const retryOptions: RequestInit = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: newToken,
        },
      }

      return fetch(url, retryOptions)
    }

    return response
  } catch (error) {
    console.error("Error in fetchWithAuth:", error)
    throw error
  }
}
