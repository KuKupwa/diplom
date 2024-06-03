import React from "react";
import styled from "styled-components";

const LabelContainer = styled.div`
	position: absolute;
	background-color: white;
	padding: 2px 5px;
	border: 1px solid black;
	font-size: 12px;
	transform: translate(-50%, -50%);
	z-index: 10;
	width: 200px;
	visibility: ${(props) => (props.visible ? "visible" : "hidden")};
`;

const Label = ({ elem, size, index, hoveredElement, type }) => {
	console.log(elem);
	return (
		<LabelContainer
			style={
				elem.start
					? {
							left:
								elem.orientation === "horizontal"
									? `${(elem.start[0] + elem.end[0]) / 2}px`
									: `${elem.start[0] + elem.thickness}px`,
							top:
								elem.orientation === "horizontal"
									? `${elem.start[1] + elem.thickness}px`
									: `${(elem.start[1] + elem.end[1]) / 2}px`,
					  }
					: {
							left:
								elem.orientation === "horizontal"
									? `${(elem.position[0] + elem.position[0]) / 2}px`
									: `${elem.position[0] + elem.thickness}px`,
							top:
								elem.orientation === "horizontal"
									? `${elem.position[1] + elem.thickness}px`
									: `${(elem.position[1] + elem.position[1]) / 2}px`,
					  }
			}
			visible={hoveredElement === `${type}-${index}`}
		>
			{size} px
		</LabelContainer>
	);
};

export default Label;
