import React from "react";
import styled from "styled-components";

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
	background-color: #8b4513;
	width: ${(props) =>
		props.isHorizontal ? `${props.length}px` : `${props.thickness}px`};
	height: ${(props) =>
		props.isHorizontal ? `${props.thickness}px` : `${props.length}px`};
	top: ${(props) =>
		props.isHorizontal
			? props.start[1]
			: props.start[1] - props.thickness / 2}px;
	left: ${(props) =>
		props.isHorizontal
			? props.start[0] - props.thickness / 2
			: props.start[0]}px;
`;

const Window = styled.div`
	position: absolute;
	background-color: #87cefa;
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

const Door = styled.div`
	position: absolute;
	background-color: #ff6347;
	width: ${(props) => (props.orientation === "horizontal" ? "50px" : "10px")};
	height: ${(props) => (props.orientation === "horizontal" ? "10px" : "50px")};
	top: ${(props) =>
		props.orientation === "horizontal"
			? props.position[1] - 5
			: props.position[1]}px;
	left: ${(props) =>
		props.orientation === "horizontal"
			? props.position[0]
			: props.position[0] - 5}px;
`;

const RoomComponent = ({ room }) => (
	<RoomWrapper width={room.width} height={room.height} material={room.material}>
		{room.walls.map((wall, index) => (
			<Wall
				key={index}
				start={wall.start}
				length={Math.sqrt(
					Math.pow(wall.end[0] - wall.start[0], 2) +
						Math.pow(wall.end[1] - wall.start[1], 2),
				)}
				thickness={wall.thickness}
				isHorizontal={wall.orientation === "horizontal"}
			/>
		))}
		{room.windows.map((window, index) => (
			<div>
				<Window
					key={index}
					position={window.position}
					length={window.length}
					orientation={window.orientation}
				/>
			</div>
		))}
		{room.doors.map((door, index) => (
			<Door
				key={index}
				position={door.position}
				length={door.length}
				orientation={door.orientation}
			/>
		))}
	</RoomWrapper>
);

export default RoomComponent;
