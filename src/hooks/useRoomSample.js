import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Devices from "./Devices";
import { useDrop } from "react-dnd";
import useDevices from "../hooks/useDevices";
import RoomComponent from "./Room";

const RoomContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Device = styled.div`
	position: absolute;
	width: 50px;
	height: 50px;
	background-color: ${(props) =>
		props.type === "sensor"
			? "#ff6347"
			: props.type === "block"
			? "#4682b4"
			: "#8a2be2"};
	cursor: pointer;
	border: ${(props) => (props.showCoverage ? "2px solid yellow" : "none")};
`;

const DeleteButton = styled.button`
	position: absolute;
	top: 0;
	right: 0;
	background-color: red;
	color: white;
	border: none;
	cursor: pointer;
`;

const CoverageCircle = styled.div`
	position: absolute;
	width: ${(props) => props.coverage_area * 2}px;
	height: ${(props) => props.coverage_area * 2}px;
	border: 2px solid yellow;
	border-radius: 50%;
	pointer-events: none;
	top: ${(props) => props.top}px;
	left: ${(props) => props.left}px;
`;

const randomInt = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomRoom = () => {
	const maxWidth = 800;
	const maxHeight = 500;
	const size = randomInt(400, Math.min(maxWidth, maxHeight));
	const material = Math.random() > 0.5 ? "wood" : "concrete";
	const thickness = randomInt(5, 5);

	const walls = [
		{ start: [0, 0], end: [size, 0], thickness, orientation: "horizontal" },
		{ start: [size, 0], end: [size, size], thickness, orientation: "vertical" },
		{
			start: [0, size],
			end: [0, 0],
			thickness,
			orientation: "horizontal",
		},
		{
			start: [0, 0],
			end: [0, size],
			thickness,
			orientation: "vertical",
		},
	];

	const windows = [];
	const doors = [];
	console.log(windows);
	console.log(doors);
	console.log(3333);
	console.log(123333333);

	const numberOfWindows = randomInt(1, 3);
	const numberOfDoors = randomInt(1, 2);

	const addWindowOrDoor = (array, isWindow) => {
		let added = false;
		while (!added) {
			const wall = walls[randomInt(0, walls.length - 1)];
			const length = isWindow ? 100 : 80;
			const position = randomInt(50, size - length - 50);

			const validDistance = (pos, length, array) =>
				array.every(
					(item) =>
						item.orientation !== wall.orientation ||
						Math.abs(item.position[0] - pos) >= length + 50 ||
						Math.abs(item.position[1] - pos) >= length + 50,
				);

			if (wall.orientation === "horizontal") {
				if (
					array.some(
						(item) =>
							item.orientation === "horizontal" &&
							Math.abs(item.position[0] - position) < length,
					) ||
					!validDistance(position, length, array)
				) {
					continue;
				}
				array.push({
					position: [position, wall.start[1]],
					length,
					orientation: "horizontal",
				});
			} else {
				if (
					array.some(
						(item) =>
							item.orientation === "vertical" &&
							Math.abs(item.position[1] - position) < length,
					) ||
					!validDistance(position, length, array)
				) {
					continue;
				}
				array.push({
					position: [wall.start[0], position],
					length,
					orientation: "vertical",
				});
			}
			added = true;
		}
	};

	for (let i = 0; i < numberOfWindows; i++) {
		addWindowOrDoor(windows, true);
	}

	for (let i = 0; i < numberOfDoors; i++) {
		addWindowOrDoor(doors, false);
	}

	return { width: size, height: size, material, walls, windows, doors };
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
		showCoverage,
		toggleCoverage,
	} = useDevices();
	const [cost, setCost] = useState(0);

	useEffect(() => {
		setCost(calculateCost(devices));
	}, [devices]);

	const [, drop] = useDrop({
		accept: "DEVICE",
		drop: (item, monitor) => {
			const delta = monitor.getClientOffset();
			const offset = roomRef.current.getBoundingClientRect();
			const x = delta.x;
			const y = delta.y;
			addDevice({ ...item.device, id: Date.now() }, x, y);
		},
	});

	const combineRefs = (element) => {
		roomRef.current = element;
		drop(element);
	};

	return (
		<RoomContainer>
			{room && (
				<div ref={combineRefs}>
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
									X
								</DeleteButton>
							</Device>
							{showCoverage && (
								<CoverageCircle
									coverage_area={device.coverage_area}
									top={device.y - device.coverage_area}
									left={device.x - device.coverage_area}
								/>
							)}
						</React.Fragment>
					))}
				</div>
			)}
			<button onClick={() => setRoom(generateRandomRoom())}>
				Generate New Room
			</button>
			<Devices addDevice={addDevice} moveDevice={moveDevice} />
			<button onClick={toggleCoverage}>Toggle Coverage</button>
			<div>Total Cost: ${cost}</div>
		</RoomContainer>
	);
};

export default RoomGenerator;
