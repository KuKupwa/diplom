import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Devices from "./Devices";
import { useDrop } from "react-dnd";
import useDevices from "../hooks/useDevices";
import RoomComponent from "./Room";
import { useStore } from "../store/StoreProvider";
import { useMaterialsGet } from "../hooks/useMaterialsGet";
import OutputInfo from "./OutputInfo";
import useCoverage from "../hooks/useCoverage";
import useSecurityCoefficient from "../hooks/useControlSecurity";

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
	width: 25px;
	height: 25px;
	background-color: ${(props) =>
		props.type === "sensor"
			? "#ff6347"
			: props.type === "block"
			? "#4682b4"
			: "#8a2be2"};
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

const CoverageCircle = styled.div`
	position: absolute;
	width: ${(props) => props.coverage_area}px;
	height: ${(props) => props.coverage_area}px;
	background-color: #ff03;
	pointer-events: none;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
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
	const maxWidth = 800;
	const maxHeight = 500;
	const width = randomInt(300, maxWidth);
	const height = randomInt(300, maxHeight);

	const roomHeight = Number((randomInt(250, 350) / 100).toFixed(2));
	const roomWidth = Number((width / 100).toFixed(2));
	const roomLen = Number((height / 100).toFixed(2));
	const s_room = Number((roomWidth * roomLen).toFixed(2));

	const insideNoise = randomInt(80, 100);
	const scammerNoise = 60;

	const windowHeight = Number(
		(roomHeight > 3 ? roomHeight - 2 : roomHeight - 1.5).toFixed(2),
	);

	const doorHeight = Number((roomHeight - 0.5).toFixed(2));

	const walls = [
		{
			start: [0, 0],
			end: [width, 0],
			orientation: "horizontal",
			coord: [0, 0, width, 0, width, 5, 0, 5],
			length: roomWidth,
			height: roomHeight,
			s: Number(roomWidth * roomHeight).toFixed(2),
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
			s: Number(roomHeight * roomLen).toFixed(2),
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
			s: Number(roomWidth * roomHeight).toFixed(2),
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
			s: Number(roomLen * roomHeight).toFixed(2),
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
			length: Number((length / 100).toFixed(2)),
			orientation,
			height: Number(length < 100 ? windowHeight : doorHeight),
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

	console.log(state, "state");

	useEffect(() => {
		const wallCharacteristickX = getWallCharacteristick();
		const doorsCharacteristickX = getDoorsCharacteristick();
		const windowsCharacteristickX = getWindowsCharacteristick();

		materialDataUpdate({
			wallCharacteristick: wallCharacteristickX,
			doorsCharacteristick: doorsCharacteristickX,
			windowsCharacteristick: windowsCharacteristickX,
			roomHeight: room.roomHeight,
			roomWidth: room.roomWidth,
			roomLen: room.roomLen,
		});
		roomDataUpdate(room);
		securityDataUpdate({
			insideNoise: room.insideNoise,
			scammerNoise: room.scammerNoise,
		});
		wallsKoffSecurDeviceDataUpdate(res);
	}, [
		room,
		state.materialData,
		getWallCharacteristick,
		getDoorsCharacteristick,
		getWindowsCharacteristick,
		res,
	]);

	console.log(useSecurityCoefficient(), "useSecurityCoefficient");

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
										/>
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
				<div>Total Cost: ${cost}</div>
			</Instruments>
		</RoomContainer>
	);
};

export default RoomGenerator;
