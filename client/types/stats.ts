export type TrendPoint = {
	value: number;
	label: string;
};

export type StatsSummary = {
	totalPlaysThisMonth: number;
	hoursListened: {
		lastMonthHoursListened: string;
		currentMonthHoursListened: string;
	};
	listeningTrend: TrendPoint[];
	avgReleaseYear: number;
	longestStreak: number;
};