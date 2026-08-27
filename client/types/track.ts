export type Track = {
	trackId: string;
	trackName: string;
	artistNames: string;
	albumArtUrl: string | null;
	_count?: { trackId: number };
};