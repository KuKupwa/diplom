import React, { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { useStore } from "../store/StoreProvider";
import useSecurityCoefficient from "../hooks/useControlSecurity";

const RoomWrapper = styled.div`
	position: relative;
	width: ${(props) => props.width}px;
	height: ${(props) => props.height}px;
	background-color: #deb887;
	border: 3px solid #8b4513;
`;

const Wall = styled.div`
	position: absolute;
	width: ${(props) => (props.isHorizontal ? `${props.length * 100}px` : `5px`)};
	height: ${(props) =>
		props.isHorizontal ? `5px` : `${props.length * 100}px`};
	top: ${(props) =>
		props.isHorizontal
			? `${props.start[1]}px`
			: `${props.start[1] - props.thickness / 2}px`};
	left: ${(props) =>
		props.isHorizontal
			? `${props.start[0] - props.thickness / 2}px`
			: `${props.start[0]}px`};
	transform: ${(props) =>
		props.isHorizontal ? "translateY(-50%)" : "translateX(-50%)"};
	background-color: #8b4513;
`;

const Window = styled.div`
	position: absolute;
	background-color: #87cefa;
	z-index: 2;
	width: ${(props) => (props.orientation === "horizontal" ? "50px" : "10px")};
	height: ${(props) => (props.orientation === "horizontal" ? "10px" : "50px")};
	top: ${(props) =>
		props.orientation === "horizontal"
			? `${props.position[1] - 5}px`
			: `${props.position[1]}px`};
	left: ${(props) =>
		props.orientation === "horizontal"
			? `${props.position[0]}px`
			: `${props.position[0] - 5}px`};
`;

const Door = styled.div`
	position: absolute;
	background-color: #ff6347;
	z-index: 2;
	width: ${(props) => (props.orientation === "horizontal" ? "40px" : "10px")};
	height: ${(props) => (props.orientation === "horizontal" ? "10px" : "40px")};
	top: ${(props) =>
		props.orientation === "horizontal"
			? `${props.position[1] - 5}px`
			: `${props.position[1]}px`};
	left: ${(props) =>
		props.orientation === "horizontal"
			? `${props.position[0]}px`
			: `${props.position[0] - 5}px`};
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
		console.log({ ...elem, text, type }, "{ ...elem, text, type }");
		hoveredElementDataUpdate({ ...elem, text, type });
	};

	const calculateWallLabel = useCallback((wall) => {
		if (wall.orientation === "horizontal") {
			if (wall.start[0] < 1) {
				return (
					<div
						style={{
							position: "absolute",
							left: "50%",
							top: "-50px",
							transform: "translateX(-50%)",
						}}
					>
						{wall.name}
					</div>
				);
			} else {
				return (
					<div
						style={{
							position: "absolute",
							left: "50%",
							bottom: "-50px",
							transform: "translateX(-50%)",
						}}
					>
						{wall.name}
					</div>
				);
			}
		} else {
			if (wall.end[0] < 1) {
				return (
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: "-50px",
							transform: "translateY(-50%)",
						}}
					>
						{wall.name}
					</div>
				);
			} else {
				return (
					<div
						style={{
							position: "absolute",
							top: "50%",
							right: "-50px",
							transform: "translateY(-50%)",
						}}
					>
						{wall.name}
					</div>
				);
			}
		}
	}, []);

	return (
		<RoomWrapper
			width={room.width}
			height={room.height}
			material={room.material}
		>
			{room.walls.map((wall, index) => {
				return (
					<React.Fragment key={index}>
						<Wall
							start={wall.start}
							end={wall.end}
							length={wall.length}
							thickness={wall.thickness}
							name={wall.name}
							isHorizontal={wall.orientation === "horizontal"}
							onMouseEnter={() =>
								handleMouseEnter({ ...wall }, "Информация о стене", "wall")
							}
						>
							{calculateWallLabel(wall)}
						</Wall>
						{wall.windows.map((window, idx) => (
							<Window
								key={idx}
								position={window.position}
								length={window.length}
								orientation={window.orientation}
								onMouseEnter={() =>
									handleMouseEnter(
										{ ...window },
										"Информация об окне",
										"window",
									)
								}
							/>
						))}
						{wall.doors.map((door, idx) => (
							<Door
								key={idx}
								position={door.position}
								length={door.length}
								orientation={door.orientation}
								onMouseEnter={() =>
									handleMouseEnter({ ...door }, "Информация о двери", "door")
								}
							/>
						))}
					</React.Fragment>
				);
			})}
		</RoomWrapper>
	);
};

export default Room;
