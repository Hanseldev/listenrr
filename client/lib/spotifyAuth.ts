import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";

const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID!;
const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";

const SCOPES = [
	"user-read-email",
	"user-read-private",
	"user-top-read",
	"user-read-recently-played",
	"user-library-read"
];

// 
export function useSpotifyAuthRequest() {
	const redirectUri = AuthSession.makeRedirectUri({});

    console.log('Spotify redirect URI:', redirectUri);
	const discovery = {
		authorizationEndpoint: SPOTIFY_AUTH_ENDPOINT,
	};

	const [request, response, promptAsync] = AuthSession.useAuthRequest(
		{
			clientId: SPOTIFY_CLIENT_ID,
			scopes: SCOPES,
			redirectUri,
			responseType: AuthSession.ResponseType.Code,
			usePKCE: true,
		},
		discovery
	);

    return {request, response, promptAsync, redirectUri}
}
