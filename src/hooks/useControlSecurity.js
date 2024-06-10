// import { useStore } from "@react-three/fiber";

// const useControlSecurity = () => {
// 	const { state } = useStore();

// 	// Функция для вычисления площади элемента
// 	const calculateArea = (length, height) => {
// 		return length * height;
// 	};

// 	// Функция для вычисления суммарного индекса звукоизоляции с учетом защиты
// 	const calculateTotalRw = (elements) => {
// 		let totalArea = elements.reduce((total, el) => total + el.area, 0);

// 		let sum = elements.reduce((total, el) => {
// 			let rwWithProtection = el.rw + (el.protection || 0); // Учитываем защиту
// 			return (
// 				total + (el.area / totalArea) * Math.pow(10, -rwWithProtection / 10)
// 			);
// 		}, 0);

// 		let R_total = -10 * Math.log10(sum);
// 		return R_total;
// 	};

// 	// Функция для вычисления уровня звука за пределами помещения
// 	const calculateExternalNoiseLevel = (internalNoiseLevel, R_total) => {
// 		return internalNoiseLevel - R_total;
// 	};

// 	// Функция для оценки защищенности
// 	const assessSecurity = (elements, internalNoiseLevel, threshold) => {
// 		let R_total = calculateTotalRw(elements);

// 		elements.forEach((el) => {
// 			el.externalNoiseLevel = calculateExternalNoiseLevel(
// 				internalNoiseLevel,
// 				R_total,
// 			);
// 			el.isSecure = el.externalNoiseLevel < threshold;
// 		});

// 		return elements;
// 	};

// 	let internalNoiseLevel = 70; // Уровень шума внутри помещения (в дБ)
// 	let threshold = 30; // Порог чувствительности перехватывающего устройства (в дБ)

// 	let assessedElements = assessSecurity(
// 		elements,
// 		internalNoiseLevel,
// 		threshold,
// 	);

// 	// Вывод результатов
// 	assessedElements.forEach((el) => {
// 		console.log(`Тип: ${el.type}`);
// 		console.log(`Материал: ${el.material}`);
// 		console.log(
// 			`Длина: ${el.length} м, Высота: ${el.height} м, Толщина: ${el.thickness} м`,
// 		);
// 		console.log(`Площадь: ${el.area.toFixed(2)} м²`);
// 		console.log(`Rw: ${el.rw} дБ`);
// 		console.log(
// 			`Уровень звука за пределами: ${el.externalNoiseLevel.toFixed(1)} дБ`,
// 		);
// 		console.log(
// 			`Защищенность: ${
// 				el.isSecure ? "Угроза отсутствует" : "Возможна утечка информации"
// 			}`,
// 		);
// 		console.log("---");
// 	});
// };
import React from "react";
import { useStore } from "../store/StoreProvider";

export const useControlSecurity = () => {
	const { state } = useStore();

	return {};
};
