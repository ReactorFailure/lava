export interface SpawnConfig {
	enabled?: boolean;
	cats?: string[];
	cap?: number;
	cd?: number;
	bl?: string[];
}

const cats = [
	'691416705917780000',
	'691595121866571776',
	'791576124185378817',
	'724618509958774886',
]

const bl = [
	'791659327148261406', // Public
	'801471120192438312',
	'801413467080622120',
	'692923254872080395',
	'756101559938449449',
	'796019885775126560',
	'691597490411012137',
	'691594488103305216', // Dank
	'692547222017015828',
	'691595376524001290',
	'694697159848886343',
]

export const spawnConfig: SpawnConfig = {
	enabled: true,
	cats, bl,
	cap: 10000000,
	cd: 60
}