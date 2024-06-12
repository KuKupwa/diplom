import { useMemo } from "react";
import { useStore } from "../store/StoreProvider";

const useSecurityCoefficient = () => {
	const { state } = useStore();

	// Мемоизация данных о стенах для избежания лишних рендеров
	const walls = useMemo(
		() => state.roomData.walls || [],
		[state.roomData.walls],
	);

	// Мемоизация данных о коэффициентах безопасности устройств
	const wallsKoffSecurDevice = useMemo(
		() => state.wallsKoffSecurDevice || [],
		[state.wallsKoffSecurDevice],
	);

	// Мемоизация данных о материалах
	const materialsData = useMemo(
		() => state.materialsData || {},
		[state.materialsData],
	);

	// Проверка наличия характеристик материалов
	const windowRw = useMemo(() => {
		return Number(
			(materialsData?.windowsCharacteristick?.haracteristics?.r_w || 1).toFixed(
				2,
			),
		);
	}, [materialsData]);

	const doorRw = useMemo(() => {
		return Number(
			(materialsData?.doorsCharacteristick?.haracteristics?.r_w || 1).toFixed(
				2,
			),
		);
	}, [materialsData]);

	const wallRw = useMemo(() => {
		return Number(
			(materialsData?.wallCharacteristick?.haracteristics?.r_w || 1).toFixed(2),
		);
	}, [materialsData]);

	console.log(windowRw, "windowRw");
	console.log(doorRw, "doorRw");
	console.log(wallRw, "wallRw");

	/**
	 * Расчет эффективной звукоизоляции для стены с учетом окон и дверей.
	 * @param {Object} wall - Объект стены, содержащий окна и двери.
	 * @returns {Number} - Эффективная звукоизоляция стены.
	 */
	const calculateEffectiveInsulation = (wall) => {
		const wallArea = wall.s || 1; // Площадь стены (m²), защита от деления на 0
		const totalWindowArea =
			wall.windows?.reduce((acc, window) => acc + (window.s || 0), 0) || 0; // Общая площадь окон (m²)
		const totalDoorArea =
			wall.doors?.reduce((acc, door) => acc + (door.s || 0), 0) || 0; // Общая площадь дверей (m²)
		const effectiveWallArea = (
			wallArea -
			totalWindowArea -
			totalDoorArea
		).toFixed(2); // Эффективная площадь стены без окон и дверей (m²)

		// Расчет звукоизоляции окон
		const windowInsulation =
			wall.windows?.reduce((acc, window) => {
				return acc + (window.s / wallArea) * windowRw;
			}, 0) || 1;

		// Расчет звукоизоляции дверей
		const doorInsulation =
			wall.doors?.reduce((acc, door) => {
				return acc + (door.s / wallArea) * doorRw;
			}, 0) || 1;

		// Расчет звукоизоляции стены без учета окон и дверей
		const wallInsulation = (effectiveWallArea / wallArea) * wallRw;

		console.log(totalWindowArea, "aaa");

		const a = wallInsulation + windowInsulation + doorInsulation;

		return Number(a.toFixed(2));
	};

	/**
	 * Расчет коэффициента защищенности.
	 * @returns {Array} - Массив объектов с информацией о звукоизоляции стен.
	 */
	const calculateSecurityCoefficient = () => {
		return walls.map((wall) => {
			const wallInsulation = calculateEffectiveInsulation(wall); // Эффективная звукоизоляция стены
			const requiredInsulation =
				state.securityData.insideNoise - state.securityData.scammerNoise + 1; // Необходимая звукоизоляция (дБ)
			const insulationPercentage = requiredInsulation
				? (1 - wallInsulation / requiredInsulation) * 100
				: 0; // Процент звукоизоляции относительно требуемой (%)

			return {
				wallName: wall.name,
				insulationPercentage: insulationPercentage.toFixed(2), // %
				securityCoefficient: wallInsulation.toFixed(2), // дБ
			};
		});
	};

	// Мемоизация данных о коэффициентах безопасности
	const securityData = useMemo(
		() => (materialsData ? calculateSecurityCoefficient() : null),
		[walls, wallsKoffSecurDevice, materialsData, state.securityData],
	);

	return securityData;
};

export default useSecurityCoefficient;
