import { useMemo } from "react";
import { useStore } from "../store/StoreProvider";

/**
 * Функция для вычисления процента покрытия и звукоизоляции.
 * @returns {Array} - массив объектов с процентом покрытия и звукоизоляцией для каждой стены
 */
const useCoverage = () => {
	const { state } = useStore();

	// Получаем координаты стен из store
	const coordsWalls = useMemo(() => {
		if (state?.roomData?.walls?.length) {
			return state.roomData.walls.map((wall) => wall.coord);
		}
		return [];
	}, [state.roomData.walls]);

	const devices = useMemo(() => {
		if (state?.devices?.length) {
			return state.devices.map((dev) => ({
				coord: dev.coord,
				k: dev.k,
			}));
		}
		return [];
	}, [state.devices]);

	// Преобразуем координаты в прямоугольники
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

	// Вычисляем пересечения и площадь покрытия для каждой стены
	const coverageData = useMemo(() => {
		return coordsWalls.map((wallCoords) => {
			const wallRect = toRect(wallCoords);
			const wallArea =
				(wallRect.x2 - wallRect.x1) * (wallRect.y2 - wallRect.y1);
			let coveredArea = 0;
			const coveredGrid = new Set();
			const isolationGrid = {};

			devices.forEach(({ coord, k }) => {
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
							if (!isolationGrid[key]) {
								isolationGrid[key] = 1; // Начальное значение звукоизоляции 1
							}
							isolationGrid[key] += k; // Учитываем коэффициент звукоизоляции устройства
						}
					}
				}
			});

			const coveragePercent = (coveredArea / wallArea) * 100;

			let totalIsolation = 0;
			let count = 0;

			for (let x = wallRect.x1; x <= wallRect.x2; x++) {
				for (let y = wallRect.y1; y <= wallRect.y2; y++) {
					const key = `${x},${y}`;
					if (isolationGrid[key]) {
						totalIsolation += isolationGrid[key];
					} else {
						totalIsolation += 1; // Ячейка не покрыта, звукоизоляция равна 1
					}
					count++;
				}
			}

			const averageIsolation = count > 0 ? totalIsolation / count : 1;

			return { wallCoords, coveragePercent, averageIsolation };
		});
	}, [coordsWalls, devices]);

	return coverageData;
};

export default useCoverage;
