import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useStore } from "../store/StoreProvider";

const RoomWrapper = styled.div`
	position: relative;
	width: ${(props) => props.width}px;
	height: ${(props) => props.height}px;
	background-color: ${(props) =>
		props.material === "wood" ? "#deb887" : "#d3d3d3"};
	border: 2px solid black;
`;

const Wall = styled.div`
	position: absolute;
	width: ${(props) => (props.isHorizontal ? `${props.length}px` : `5px`)};
	height: ${(props) => (props.isHorizontal ? `5px` : `${props.length}px`)};
	top: ${(props) =>
		props.isHorizontal
			? props.start[1]
			: props.start[1] - props.thickness / 2}px;
	left: ${(props) =>
		props.isHorizontal
			? props.start[0] - props.thickness / 2
			: props.start[0]}px;
	transform: ${(props) =>
		props.isHorizontal ? "translateY(-50%)" : "translateX(-50%)"};
`;

const Window = styled.div`
	position: absolute;
	background-color: #87cefa;
	z-indedx: 2;
	width: ${(props) => (props.orientation === "horizontal" ? "100px" : "10px")};
	height: ${(props) => (props.orientation === "horizontal" ? "10px" : "100px")};
	top: ${(props) =>
		props.orientation === "horizontal"
			? props.position[1] - 5
			: props.position[1]}px;
	left: ${(props) =>
		props.orientation === "horizontal"
			? props.position[0]
			: props.position[0] - 5}px;
`;

const Door = styled.div`
	position: absolute;
	background-color: #ff6347;
	z-indedx: 2;
	width: ${(props) => (props.orientation === "horizontal" ? "80px" : "10px")};
	height: ${(props) => (props.orientation === "horizontal" ? "10px" : "80px")};
	top: ${(props) =>
		props.orientation === "horizontal"
			? props.position[1] - 5
			: props.position[1]}px;
	left: ${(props) =>
		props.orientation === "horizontal"
			? props.position[0]
			: props.position[0] - 5}px;
`;

const Room = ({ room }) => {
	const { roomDataUpdate, hoveredElementDataUpdate } = useStore();
	const roomRef = useRef(null);

	useEffect(() => {
		if (roomRef.current !== room) {
			roomRef.current = room;
			roomDataUpdate(room);
		}
	}, [room, roomDataUpdate]);

	const handleMouseEnter = (elem, text, type) => {
		hoveredElementDataUpdate({ ...elem, text, type });
	};

	return (
		<RoomWrapper
			width={room.width}
			height={room.height}
			material={room.material}
		>
			{room.walls.map((wall, index) => {
				const length = Math.sqrt(
					Math.pow(wall.end[0] - wall.start[0], 2) +
						Math.pow(wall.end[1] - wall.start[1], 2),
				);
				return (
					<React.Fragment key={index}>
						<Wall
							start={wall.start}
							length={length}
							thickness={wall.thickness}
							isHorizontal={wall.orientation === "horizontal"}
							onMouseEnter={() =>
								handleMouseEnter(
									{ ...wall, length, index },
									"Информация о стене",
									"wall",
								)
							}
						/>
					</React.Fragment>
				);
			})}
			{room.windows.map((window, index) => (
				<React.Fragment key={index}>
					<Window
						position={window.position}
						length={window.length}
						orientation={window.orientation}
						onMouseEnter={() =>
							handleMouseEnter(
								{ ...window, index },
								"Информация об окне",
								"window",
							)
						}
					/>
				</React.Fragment>
			))}
			{room.doors.map((door, index) => (
				<React.Fragment key={index}>
					<Door
						position={door.position}
						length={door.length}
						orientation={door.orientation}
						onMouseEnter={() =>
							handleMouseEnter({ ...door, index }, "Информация о двери", "door")
						}
					/>
				</React.Fragment>
			))}
		</RoomWrapper>
	);
};

export default Room;
