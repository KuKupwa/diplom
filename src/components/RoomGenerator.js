import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import Devices from "./Devices";
import { useDrop } from "react-dnd";
import useDevices from "../hooks/useDevices";
import RoomComponent from "./Room";
import { useStore } from "../store/StoreProvider";
import { useMaterialsGet } from "../hooks/useMaterialsGet";
import OutputInfo from "./OutputInfo";
import useCoverage from "../hooks/useCoverage";

import low from "../img/low.svg";
import medium from "../img/medium.svg";
import heigh from "../img/high.svg";

const Button = styled.div`
	padding: 10px;
	background: ${(props) => (props.isActive ? "#00ff0057" : "#80808080")};
	border: 1px white solid;
	border-radius: 8px;
	text-align: center;
	cursor: pointer;
	transition: 0.2s;

	&:hover {
		background: grey;
		transition: 0.2s;
	}
`;

const Instruments = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;
`;

const RoomContainer = styled.div`
	display: flex;
	flex-direction: row;
	gap: 20px;
	width: 100%;
	justify-content: center;
	align-items: center;

	@media (min-width: 1921px) {
		height: 1000px;
	}
`;

const Room = styled.div`
	width: 1000px;
	height: 600px;
	justify-content: right;
	display: flex;
`;

const RoomContent = styled.div`
	width: max-content;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const Device = styled.div`
	position: absolute;
	width: 40px;
	height: 40px;
	background-size: cover;
	background-image: ${(props) =>
		props.type === "sensor"
			? `url(${low})`
			: props.type === "block"
			? `url(${medium})`
			: `url(${heigh})`};
	cursor: pointer;
	z-index: 2;
`;

const DeleteButton = styled.button`
	position: absolute;
	top: -3px;
	right: -3px;
	background-color: white;
	color: white;
	border: none;
	cursor: pointer;
	width: 12px;
	height: 12px;
	border-radius: 90px;
`;

const DeleteButtonIcon = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: 90px;
	top: 0;
	left: 0.5px;
	& > svg {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 8px;
		height: 8px;
	}
`;

const rippleEffect = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

const rippleEffect1 = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(5);
    opacity: 0;
  }
`;

const CoverageCircle = styled.div`
	position: absolute;
	width: 200px;
	height: 200px;
	pointer-events: none;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	transform-origin: center;
	z-index: 10;
	border-radius: 50%;
`;

const CoverageCircleСCh1 = styled.div`
	position: absolute;
	width: 100px;
	height: 100px;
	top: 50px;
	border: 1px white solid;
	border-color: ${(props) =>
		props.type === "sensor" ? `blue` : props.type === "block" ? `lime` : `red`};
	border-radius: 90px;
	left: 50px;
	animation: ${rippleEffect} 2s infinite;
`;

const CoverageCircleСCh2 = styled.div`
	position: absolute;
	width: 50px;
	height: 50px;
	top: 75px;
	border: 1px white solid;
	border-color: ${(props) =>
		props.type === "sensor" ? `blue` : props.type === "block" ? `lime` : `red`};
	border-radius: 90px;
	left: 75px;
	animation: ${rippleEffect1} 2s infinite;
`;

const randomInt = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const generatePositions = (length, wallLength) => {
	const positions = [];
	for (let pos = 50; pos <= wallLength - length - 50; pos += 150) {
		positions.push(pos);
	}
	return positions;
};

const getBigSquareCoords = (x1, y1, side1, side2) => {
	// Находим центр маленького квадрата
	const centerX = x1 + side1 / 2;
	const centerY = y1 + side1 / 2;

	// Находим верхний левый угол большого квадрата
	const bigX1 = centerX - side2 / 2;
	const bigY1 = centerY - side2 / 2;

	// Координаты всех углов большого квадрата
	const topLeft = [bigX1, bigY1];
	const topRight = [bigX1 + side2, bigY1];
	const bottomLeft = [bigX1, bigY1 + side2];
	const bottomRight = [bigX1 + side2, bigY1 + side2];

	// Возвращаем координаты в формате x1y1 x2y2 x3y3 x4y4
	return [...topLeft, ...topRight, ...bottomLeft, ...bottomRight];
};

const generateRandomRoom = () => {
	const maxWidth = 700;
	const maxHeight = 450;
	const width = randomInt(300, maxWidth);
	const height = randomInt(300, maxHeight);

	const roomHeight = parseFloat((randomInt(250, 350) / 100).toFixed(2));
	const roomWidth = parseFloat((width / 100).toFixed(2));
	const roomLen = parseFloat((height / 100).toFixed(2));
	const realRoomLen = parseFloat((roomLen * 3).toFixed(2));
	const realRoomWidth = parseFloat((roomWidth * 3).toFixed(2));
	const s_room = parseFloat((realRoomLen * realRoomWidth).toFixed(2));

	const insideNoise = randomInt(80, 100);
	const scammerNoise = 60;

	const windowHeight = parseFloat(
		(roomHeight > 3 ? roomHeight - 2 : roomHeight - 1.5).toFixed(2),
	);

	const doorHeight = parseFloat((roomHeight - 0.5).toFixed(2));

	const walls = [
		{
			start: [0, 0],
			end: [width, 0],
			orientation: "horizontal",
			coord: [0, 0, width, 0, width, 5, 0, 5],
			length: roomWidth,
			height: roomHeight,
			realW: roomWidth * 3,
			s: parseFloat((roomWidth * 3 * roomHeight).toFixed(2)),
			windows: [],
			doors: [],
			name: "1",
		},
		{
			start: [width, 0],
			end: [width, height],
			orientation: "vertical",
			coord: [width, 0, width, height, width - 5, height, width - 5, 0],
			length: roomLen,
			height: roomHeight,
			realW: roomLen * 3,
			s: parseFloat((roomLen * 3 * roomHeight).toFixed(2)),
			windows: [],
			doors: [],
			name: "2",
		},
		{
			start: [width, height],
			end: [0, height],
			orientation: "horizontal",
			coord: [width, height, 0, height, 0, height - 5, width, height - 5],
			length: roomWidth,
			height: roomHeight,
			realW: roomWidth * 3,
			s: parseFloat((roomWidth * 3 * roomHeight).toFixed(2)),
			windows: [],
			doors: [],
			name: "3",
		},
		{
			start: [0, height],
			end: [0, 0],
			orientation: "vertical",
			coord: [0, height, 0, 0, 5, 0, 5, height],
			length: roomLen,
			height: roomHeight,
			realW: roomLen * 3,
			s: parseFloat((roomLen * 3 * roomHeight).toFixed(2)),
			windows: [],
			doors: [],
			name: "4",
		},
	];

	const horizontalPositions = generatePositions(100, width);
	const verticalPositions = generatePositions(100, height);

	const numberOfWindows = randomInt(1, 3);
	const numberOfDoors = randomInt(1, 2);

	const addWindowOrDoor = (wall, isWindow) => {
		const length = isWindow ? 100 : 80;
		const positions =
			wall.orientation === "horizontal"
				? horizontalPositions
				: verticalPositions;
		const orientation = wall.orientation;

		if (positions.length === 0) {
			return;
		}

		if (
			positions.length === 0 ||
			wall.windows.length + wall.doors.length >= 3
		) {
			return;
		}

		const positionIndex = randomInt(0, positions.length - 1);
		const position = positions.splice(positionIndex, 1)[0];

		const newElement = {
			position: orientation === "horizontal" ? [position, 0] : [0, position],
			length: parseFloat((length / 100).toFixed(2)),
			orientation,
			height: parseFloat(length < 100 ? windowHeight : doorHeight),
			s:
				length < 100
					? parseFloat((windowHeight * (length / 100)).toFixed(2))
					: parseFloat((doorHeight * (length / 100)).toFixed(2)),
		};

		if (isWindow) {
			wall.windows.push(newElement);
		} else {
			wall.doors.push(newElement);
		}
	};

	// Ensure at least one window and one door
	addWindowOrDoor(walls[0], true);
	addWindowOrDoor(walls[0], false);

	// Add additional windows and doors
	for (let i = 1; i < numberOfWindows; i++) {
		addWindowOrDoor(walls[randomInt(0, 3)], true);
	}

	for (let i = 1; i < numberOfDoors; i++) {
		addWindowOrDoor(walls[randomInt(0, 3)], false);
	}

	return {
		width,
		height,
		walls,
		roomLen,
		roomWidth,
		windowHeight,
		doorHeight,
		roomHeight,
		s_room,
		insideNoise,
		scammerNoise,
		realRoomLen,
		realRoomWidth,
	};
};

const calculateCost = (devices) => {
	return devices.reduce((total, device) => total + device.cost, 0);
};

const RoomGenerator = () => {
	const [room, setRoom] = useState(generateRandomRoom);
	const roomRef = useRef(null);
	const {
		devices,
		addDevice,
		moveDevice,
		removeDevice,
		clearDevices,
		showCoverage,
		toggleCoverage,
	} = useDevices();
	const [cost, setCost] = useState(0);

	const {
		materialDataUpdate,
		roomDataUpdate,
		state,
		securityDataUpdate,
		wallsKoffSecurDeviceDataUpdate,
	} = useStore();

	const {
		getWallCharacteristick,
		getDoorsCharacteristick,
		getWindowsCharacteristick,
	} = useMaterialsGet();

	const res = useCoverage();

	// Первоначальная загрузка данных материалов
	useEffect(() => {
		const wallCharacteristickX = getWallCharacteristick();
		const doorsCharacteristickX = getDoorsCharacteristick();
		const windowsCharacteristickX = getWindowsCharacteristick();

		materialDataUpdate({
			wallCharacteristick: wallCharacteristickX,
			doorsCharacteristick: doorsCharacteristickX,
			windowsCharacteristick: windowsCharacteristickX,
		});
	}, [
		getWallCharacteristick,
		getDoorsCharacteristick,
		getWindowsCharacteristick,
	]);

	// Обновление данных при генерации новой комнаты
	useEffect(() => {
		roomDataUpdate(room);
		securityDataUpdate({
			insideNoise: room.insideNoise,
			scammerNoise: room.scammerNoise,
		});
		wallsKoffSecurDeviceDataUpdate(res);
	}, [room, res]);

	useEffect(() => {
		setCost(calculateCost(devices));
	}, [devices]);

	const [, drop] = useDrop({
		accept: "DEVICE",
		drop: (item, monitor) => {
			const delta = monitor.getClientOffset();
			const offset = roomRef.current.getBoundingClientRect();
			const x = delta.x - offset.left;
			const y = delta.y - offset.top;

			const coord = getBigSquareCoords(x, y, 25, item.device.coverage_area);
			addDevice({ ...item.device, id: Date.now(), coord }, x, y);
		},
	});

	const combineRefs = (element) => {
		roomRef.current = element;
		drop(element);
	};

	const handleGenerateNewRoom = () => {
		clearDevices();
		setRoom(generateRandomRoom());
		const wallCharacteristickX = getWallCharacteristick();
		const doorsCharacteristickX = getDoorsCharacteristick();
		const windowsCharacteristickX = getWindowsCharacteristick();

		materialDataUpdate({
			wallCharacteristick: wallCharacteristickX,
			doorsCharacteristick: doorsCharacteristickX,
			windowsCharacteristick: windowsCharacteristickX,
		});
	};

	return (
		<RoomContainer>
			<OutputInfo />
			{room && (
				<Room>
					<RoomContent ref={combineRefs}>
						<RoomComponent room={room} />
						{devices.map((device) => (
							<React.Fragment key={device.id}>
								<Device
									type={device.type}
									style={{ left: device.x - 25, top: device.y - 25 }}
									showCoverage={showCoverage}
									onMouseDown={(e) => e.stopPropagation()}
								>
									<DeleteButton onClick={() => removeDevice(device.id)}>
										<DeleteButtonIcon>
											<svg
												width="5"
												height="5"
												viewBox="0 0 5 5"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g transform="rotate(45 2.5 2.5)">
													<rect x="2" y="0" width="1" height="5" fill="red" />
													<rect x="0" y="2" width="5" height="1" fill="red" />
												</g>
											</svg>
										</DeleteButtonIcon>
									</DeleteButton>
									{showCoverage && (
										<CoverageCircle
											coverage_area={device.coverage_area}
											top={device.y - device.coverage_area}
											left={device.x - device.coverage_area}
										>
											<CoverageCircleСCh1 type={device.type} />
											<CoverageCircleСCh2 type={device.type} />
										</CoverageCircle>
									)}
								</Device>
							</React.Fragment>
						))}
					</RoomContent>
				</Room>
			)}
			<Instruments>
				<Button onClick={handleGenerateNewRoom}>Сгенерировать комнату</Button>
				<Devices addDevice={addDevice} moveDevice={moveDevice} />
				<Button onClick={toggleCoverage} isActive={showCoverage}>
					Показ. обл. действия средств ТЗИ
				</Button>
				<div>Стоимость: {cost} Руб</div>
			</Instruments>
		</RoomContainer>
	);
};

export default RoomGenerator;
