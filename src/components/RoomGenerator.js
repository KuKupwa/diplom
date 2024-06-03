import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Devices from "./Devices";
import { useDrop } from "react-dnd";
import useDevices from "../hooks/useDevices";
import RoomComponent from "./Room";

const RoomContainer = styled.div`
	display: flex;
	flex-direction: row;
	gap: 200px;
	margin: 0 auto;
	margin-top: 200px;
	width: 100%;
	justify-content: center;
`;

const Room = styled.div`
	width: 1000px;
	height: 600px;
	justify-content: right;
	display: flex;
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

const generatePositions = (length, wallLength) => {
	const positions = [];
	for (let pos = 50; pos <= wallLength - length - 50; pos += 150) {
		positions.push(pos);
	}
	return positions;
};

const generateRandomRoom = () => {
	const maxWidth = 800;
	const maxHeight = 500;
	const width = randomInt(300, maxWidth);
	const height = randomInt(300, maxHeight);
	const material = Math.random() > 0.5 ? "wood" : "concrete";

	const walls = [
		{ start: [0, 0], end: [width, 0], orientation: "horizontal" },
		{ start: [width, 0], end: [width, height], orientation: "vertical" },
		{ start: [width, height], end: [0, height], orientation: "horizontal" },
		{ start: [0, height], end: [0, 0], orientation: "vertical" },
	];

	const windows = [];
	const doors = [];

	const horizontalPositions = generatePositions(100, width);
	const verticalPositions = generatePositions(100, height);

	const numberOfWindows = randomInt(1, 3);
	const numberOfDoors = randomInt(1, 2);

	const addWindowOrDoor = (array, isWindow, isMandatory = false) => {
		const length = isWindow ? 100 : 80;
		let positions, orientation;
		let added = false;
		let attempts = 0;
		const maxAttempts = 100;

		while (!added && attempts < maxAttempts) {
			if (Math.random() > 0.5) {
				positions = horizontalPositions;
				orientation = "horizontal";
			} else {
				positions = verticalPositions;
				orientation = "vertical";
			}

			if (positions.length === 0) {
				if (isMandatory) {
					attempts = 0; // Reset attempts to ensure mandatory addition
				} else {
					return;
				}
			}

			const positionIndex = randomInt(0, positions.length - 1);
			const position = positions.splice(positionIndex, 1)[0];

			const validDistance = (pos, length, array) =>
				array.every((item) => {
					if (item.orientation !== orientation) return true;
					const itemPosStart =
						item.position[orientation === "horizontal" ? 0 : 1];
					const itemPosEnd = itemPosStart + item.length;
					const posEnd = pos + length;
					return pos >= itemPosEnd + 50 || posEnd <= itemPosStart - 50;
				});

			if (validDistance(position, length, array)) {
				array.push({
					position:
						orientation === "horizontal" ? [position, 0] : [0, position],
					length,
					orientation,
				});
				added = true;
			}

			attempts++;
		}
	};

	// Ensure at least one window and one door
	addWindowOrDoor(windows, true, true);
	addWindowOrDoor(doors, false, true);

	// Add additional windows and doors
	for (let i = 1; i < numberOfWindows; i++) {
		addWindowOrDoor(windows, true);
	}

	for (let i = 1; i < numberOfDoors; i++) {
		addWindowOrDoor(doors, false);
	}

	return { width, height, material, walls, windows, doors };
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
			let x = delta.x;
			let y = delta.y;

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
				<Room>
					<div ref={combineRefs} style={{ width: "max-content" }}>
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
				</Room>
			)}
			<div>
				<button onClick={() => setRoom(generateRandomRoom())}>
					Generate New Room
				</button>
				<Devices addDevice={addDevice} moveDevice={moveDevice} />
				<button onClick={toggleCoverage}>Toggle Coverage</button>
				<div>Total Cost: ${cost}</div>
			</div>
		</RoomContainer>
	);
};

export default RoomGenerator;
