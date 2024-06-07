import { useCallback, useEffect, useMemo, useState } from "react";

export const useMaterialsGet = () => {
	const [characteristicsRoomElData, setCharacteristicsRoomElData] = useState(
		[],
	);

	useEffect(() => {
		fetch("/characteristicsRoomEl.json")
			.then((response) => response.json())
			.then((data) => setCharacteristicsRoomElData(data))
			.catch((error) => console.error("Ошибка получения данных:", error));
	}, []);

	const randomMaterialIndex = (max) => {
		return Math.floor(Math.random() * (max + 1));
	};

	const wallData = useMemo(() => {
		if (characteristicsRoomElData[0]) {
			return characteristicsRoomElData[0].materials;
		}
	}, [characteristicsRoomElData]);

	const doorData = useMemo(() => {
		if (characteristicsRoomElData[2]) {
			return characteristicsRoomElData[2].materials;
		}
	}, [characteristicsRoomElData]);

	const windowsData = useMemo(() => {
		if (characteristicsRoomElData[1]) {
			return characteristicsRoomElData[1].materials;
		}
	}, [characteristicsRoomElData]);

	const getWallCharacteristick = useCallback(() => {
		const i = randomMaterialIndex(1);
		const j = randomMaterialIndex(2);
		console.log("a", wallData);
		if (wallData) {
			const material = wallData[i];
			const haracteristics = material.haracteristicks[j];

			return {
				material: material.name,
				haracteristics: haracteristics,
			};
		}
		return {};
	}, [wallData, characteristicsRoomElData]);

	const getDoorsCharacteristick = useCallback(() => {
		const i = randomMaterialIndex(1);
		const j = randomMaterialIndex(2);
		if (doorData) {
			const material = doorData[i];
			const haracteristics = material.haracteristicks[j];

			return {
				material: material.name,
				haracteristics: haracteristics,
			};
		}
		return {};
	}, [doorData, characteristicsRoomElData]);

	const getWindowsCharacteristick = useCallback(() => {
		const i = randomMaterialIndex(1);
		const j = randomMaterialIndex(2);
		if (windowsData) {
			const material = windowsData[i];
			const haracteristics = material.haracteristicks[j];

			return {
				material: material.name,
				haracteristics: haracteristics,
			};
		}
		return {};
	}, [windowsData, characteristicsRoomElData]);

	return {
		getWallCharacteristick,
		getDoorsCharacteristick,
		getWindowsCharacteristick,
	};
};
