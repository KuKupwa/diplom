import React, { startTransition, useMemo } from "react";
import styled from "styled-components";
import { useStore } from "../store/StoreProvider";

const OutputInfoContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 250px;
`;

const OutputInfoElement = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
`;

const OutputInfo = () => {
	const { state } = useStore();

	const elementData = state.hoveredElementData || state.lastHoveredElementData;

	const widthRoom = useMemo(() => {
		return (state.roomData.width / 100).toFixed(2);
	}, [state]);

	const heightRoom = useMemo(() => {
		return (state.roomData.height / 100).toFixed(2);
	}, [state]);

	const heightRoomWall = useMemo(() => {
		return state.roomData.roomLen;
	}, [state]);

	const characteristickElem = useMemo(() => {
		if (!elementData) {
			return null;
		}
		if (elementData.type == "wall") {
			return state.materialsData.wallCharacteristick;
		}
		if (elementData.type == "window") {
			return state.materialsData.windowsCharacteristick;
		}
		if (elementData.type == "door") {
			return state.materialsData.doorsCharacteristick;
		}
	}, [elementData, state]);

	return (
		<OutputInfoContainer>
			{state.roomData && (
				<>
					<OutputInfoElement>
						<h3>Общая информация об комнате</h3>
						<div>Ширина: {state.roomData.roomWidth} М</div>
						<div>Длина: {state.roomData.roomLen} М</div>
						<div>Высота: {state.roomData.roomHeight} М</div>
						<div>Площадь: {state.roomData.s_room} М2</div>
					</OutputInfoElement>
					{elementData && (
						<OutputInfoElement>
							<h3>
								{elementData.text.charAt(0).toUpperCase() +
									elementData.text.slice(1)}
							</h3>
							<>
								<div>
									{elementData.type == "window" ? "Тип" : "Материал"}:{" "}
									{characteristickElem.material}
								</div>
								<div>
									Толщина: {characteristickElem.haracteristics.thickness} М
								</div>
								<div>
									Коэф. звукоизол.: {characteristickElem.haracteristics.r_w}
								</div>
								<div>Высота: {elementData.height} М</div>
								<div>Ширина: {elementData.length} М</div>
								<div>Площадь: {elementData.s} М2</div>
							</>
						</OutputInfoElement>
					)}
				</>
			)}
		</OutputInfoContainer>
	);
};

export default OutputInfo;
