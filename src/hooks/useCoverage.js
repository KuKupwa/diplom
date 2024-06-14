import { useEffect, useMemo } from "react";
import { useStore } from "../store/StoreProvider";

// Функция для суммирования уровней шума в дБ
const sumNoiseLevels = (levels) => {
	if (levels.length === 0) return 0;
	const totalLinear = levels.reduce(
		(acc, level) => acc + Math.pow(10, level / 10),
		0,
	);
	return 10 * Math.log10(totalLinear);
};

// Преобразование координат в прямоугольники
const toRect = (coords) => {
	const xs = [coords[0], coords[2], coords[4], coords[6]];
	const ys = [coords[1], coords[3], coords[5], coords[7]];
	const x1 = Math.min(...xs);
	const x2 = Math.max(...xs);
	const y1 = Math.min(...ys);
	const y2 = Math.max(...ys);
	return {
		x1: Math.floor(x1),
		x2: Math.ceil(x2),
		y1: Math.floor(y1),
		y2: Math.ceil(y2),
	};
};

// Функция для проверки пересечения двух прямоугольников
const isOverlapping = (rect1, rect2) => {
	return !(
		rect1.x2 <= rect2.x1 ||
		rect1.x1 >= rect2.x2 ||
		rect1.y2 <= rect2.y1 ||
		rect1.y1 >= rect2.y2
	);
};

// Функция для привязки устройств к стенам
const assignDevicesToWalls = (walls, devices) => {
	return walls.map((wall) => {
		const wallRect = toRect(wall.coord);
		const wallDevices = devices.filter((device) => {
			const deviceRect = toRect(device.coord);
			return isOverlapping(wallRect, deviceRect);
		});
		return { wallRect, wallDevices };
	});
};

// Основная функция для вычисления уровня шума и покрытия для каждой стены
const useCoverage = () => {
	const { state, wallsKoffSecurDeviceDataUpdate } = useStore();

	// Получаем координаты стен из store
	const coordsWalls = useMemo(() => {
		if (state?.roomData?.walls?.length) {
			return state.roomData.walls.map((wall) => ({
				coord: wall.coord,
				name: wall.name,
			}));
		}
		return [];
	}, [state.roomData.walls]);

	const devices = useMemo(() => {
		if (state?.devices?.length) {
			return state.devices.map((dev) => ({
				coord: dev.coord,
				noiseLevel: dev.k, // Уровень шума устройства
			}));
		}
		return [];
	}, [state.devices]);

	const coverageData = useMemo(() => {
		const assignedDevices = assignDevicesToWalls(coordsWalls, devices);

		return coordsWalls.map((wall, wallIndex) => {
			const { wallRect, wallDevices } = assignedDevices[wallIndex];
			const wallArea =
				(wallRect.x2 - wallRect.x1) * (wallRect.y2 - wallRect.y1);
			let coveredArea = 0;
			const coveredGrid = new Set();
			const noiseLevels = [];

			wallDevices.forEach(({ coord, noiseLevel }) => {
				const deviceRect = toRect(coord);
				if (isOverlapping(wallRect, deviceRect)) {
					const overlapX1 = Math.max(wallRect.x1, deviceRect.x1);
					const overlapY1 = Math.max(wallRect.y1, deviceRect.y1);
					const overlapX2 = Math.min(wallRect.x2, deviceRect.x2);
					const overlapY2 = Math.min(wallRect.y2, deviceRect.y2);

					for (let x = overlapX1; x <= overlapX2; x++) {
						for (let y = overlapY1; y <= overlapY2; y++) {
							const key = `${x},${y}`;
							if (!coveredGrid.has(key)) {
								coveredGrid.add(key);
								coveredArea++;
							}
						}
					}
					noiseLevels.push(noiseLevel);
				}
			});

			const coveragePercent = (coveredArea / wallArea) * 100;
			const totalNoiseLevel = sumNoiseLevels([...noiseLevels, 0]);

			return { wallName: wall.name, coveragePercent, totalNoiseLevel };
		});
	}, [coordsWalls, devices, state.roomData.walls]);

	useEffect(() => {
		wallsKoffSecurDeviceDataUpdate(coverageData);
	}, []);

	return coverageData;
};

export default useCoverage;
