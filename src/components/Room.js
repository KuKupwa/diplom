import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Label from "./Label";

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
	width: ${(props) => (props.isHorizontal ? `${props.length}px` : `20px`)};
	height: ${(props) => (props.isHorizontal ? `20px` : `${props.length}px`)};
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

const Room = ({ room }) => {
	const [hoveredElement, setHoveredElement] = useState(null);
	const [visibleElement, setVisibleElement] = useState(null);
	const [hideTimeout, setHideTimeout] = useState(null);

	const handleMouseEnter = (index, type) => {
		if (hideTimeout) {
			clearTimeout(hideTimeout);
			setHideTimeout(null);
		}
		setHoveredElement(`${type}-${index}`);
		setVisibleElement(`${type}-${index}`);
	};

	const handleMouseLeave = () => {
		const timeout = setTimeout(() => {
			setVisibleElement(null);
		}, 1000);
		setHideTimeout(timeout);
		setHoveredElement(null);
	};

	useEffect(() => {
		return () => {
			if (hideTimeout) {
				clearTimeout(hideTimeout);
			}
		};
	}, [hideTimeout]);

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
							onMouseEnter={() => handleMouseEnter(index, "wall")}
							onMouseLeave={handleMouseLeave}
						/>
						<Label
							elem={wall}
							size={Math.round(length)}
							index={index}
							hoveredElement={visibleElement}
							type={"wall"}
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
						onMouseEnter={() => handleMouseEnter(index, "window")}
						onMouseLeave={handleMouseLeave}
					/>
					<Label
						elem={window}
						size={window.length}
						index={index}
						hoveredElement={visibleElement}
						type={"window"}
					/>
				</React.Fragment>
			))}
			{room.doors.map((door, index) => (
				<React.Fragment key={index}>
					<Door
						position={door.position}
						length={door.length}
						orientation={door.orientation}
						onMouseEnter={() => handleMouseEnter(index, "door")}
						onMouseLeave={handleMouseLeave}
					/>
					<Label
						elem={door}
						size={door.length}
						index={index}
						hoveredElement={visibleElement}
						type={"door"}
					/>
				</React.Fragment>
			))}
		</RoomWrapper>
	);
};

export default Room;
