import { useMemo } from "react";
import { useStore } from "../store/StoreProvider";

const useSecurityCoefficient = () => {
	const { state } = useStore();

	// Константа для уровня звука в помещении
	const ROOM_NOISE_LEVEL = useMemo(() => {
		return state?.securityData?.insideNoise || 0;
	}, [state]);

	console.log(ROOM_NOISE_LEVEL, "ROOM_NOISE_LEVEL");

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
		return parseFloat(
			(materialsData?.windowsCharacteristick?.haracteristics?.r_w || 1).toFixed(
				2,
			),
		);
	}, [materialsData]);

	const doorRw = useMemo(() => {
		return parseFloat(
			(materialsData?.doorsCharacteristick?.haracteristics?.r_w || 1).toFixed(
				2,
			),
		);
	}, [materialsData]);

	const wallRw = useMemo(() => {
		return parseFloat(
			(materialsData?.wallCharacteristick?.haracteristics?.r_w || 1).toFixed(2),
		);
	}, [materialsData]);

	/**
	 * Расчет эффективной звукоизоляции для стены с учетом окон и дверей.
	 * @param {Object} wall - Объект стены, содержащий окна и двери.
	 * @returns {parseFloat} - Эффективная звукоизоляция стены.
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
			}, 0) || 0;

		// Расчет звукоизоляции дверей
		const doorInsulation =
			wall.doors?.reduce((acc, door) => {
				return acc + (door.s / wallArea) * doorRw;
			}, 0) || 0;

		// Расчет звукоизоляции стены без учета окон и дверей
		const wallInsulation = (effectiveWallArea / wallArea) * wallRw;

		const totalInsulation = wallInsulation + windowInsulation + doorInsulation;

		return parseFloat(totalInsulation.toFixed(2));
	};

	const calculateSecurityCoefficient = () => {
		return walls.map((wall) => {
			const wallInsulation = calculateEffectiveInsulation(wall); // Эффективная звукоизоляция стены
			const requiredInsulation =
				ROOM_NOISE_LEVEL - state.securityData.scammerNoise; // Необходимая звукоизоляция (дБ)
			const insulationPercentage = requiredInsulation
				? (wallInsulation / requiredInsulation) * 100
				: 0; // Процент звукоизоляции относительно требуемой (%)

			return {
				wallName: wall.name,
				insulationPercentage: insulationPercentage.toFixed(2), // %
				securityCoefficient: wallInsulation.toFixed(2), // дБ
				percentProgress: wallInsulation,
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
