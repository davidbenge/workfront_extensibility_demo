import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

class AuthTokenManager {
    constructor() {
        this.baseToken = null;
        this.decodedToken = null;
    }

    /**
     * Initialize the auth token manager with a base token
     * @param {string} baseToken - The initial authentication token
     */
    initialize(baseToken) {
        this.baseToken = baseToken;
        this.decodedToken = this.decodeToken(baseToken);
        // Set the token as a cookie
        document.cookie = `ims_sid=${baseToken}; path=/`;
    }

    /**
     * Decode a JWT token and return a structured object
     * @param {string} token - The JWT token to decode
     * @returns {Object} The structured decoded token data
     */
    decodeToken(token) {
        try {
            const decoded = jwtDecode(token);
            return {
                id: decoded.jti || '',
                type: decoded.typ || 'access_token',
                client_id: decoded.client_id || '',
                user_id: decoded.sub || '',
                state: decoded.state || '',
                as: decoded.as || '',
                sid: decoded.sid || '',
                expires_in: decoded.expires_in || '',
                scope: decoded.scope || '',
                created_at: decoded.iat ? (decoded.iat * 1000).toString() : ''
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    /**
     * Get the decoded token data
     * @returns {Object} The decoded token data
     */
    getDecodedTokenData() {
        return this.decodedToken;
    }

    /**
     * Exchange the current token for a new one with different scope
     * @param {Object} params - The parameters for token exchange
     * @param {string} params.newScope - The new scope to exchange for
     * @param {string} params.targetClientId - The target client ID
     * @param {string} params.targetScope - The target scope
     * @returns {Promise<string>} The new token
     */
    async exchangeToken({ newClientId, newScope }) {
        try {
            if (!this.decodedToken || !this.decodedToken.client_id) {
                throw new Error('No valid token or client_id found');
            }

            const response = await axios.post('https://adobeid-na1.services.adobe.com/ims/check/v6/token', {
                client_id: this.decodedToken.client_id,
                scope: this.decodedToken.scope,
                target_client_id: newClientId,
                target_scope: newScope,
                token: this.baseToken
            });

            if (response.data && response.data.access_token) {
                this.baseToken = response.data.access_token;
                this.decodedToken = this.decodeToken(this.baseToken);
                // Update the cookie with the new token
                document.cookie = `ims_sid=${this.baseToken}; path=/`;
                return this.baseToken;
            }

            throw new Error('Invalid response from token exchange');
        } catch (error) {
            console.error('Error exchanging token:', error);
            throw error;
        }
    }
}

// Create and export a singleton instance
const authTokenManager = new AuthTokenManager();
export default authTokenManager;