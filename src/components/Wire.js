// src/components/Wire.js
import React from "react";
import styled from "styled-components";

const WireLine = styled.div`
	position: absolute;
	width: ${(props) => props.length}px;
	height: 5px;
	background-color: ${(props) => (props.connected ? "green" : "red")};
	transform: rotate(${(props) => props.angle}deg);
`;

const Wire = ({ start, end, length, connected }) => {
	const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);

	return (
		<WireLine
			length={length}
			style={{ left: start.x, top: start.y }}
			angle={angle}
			connected={connected}
		/>
	);
};

export default Wire;
