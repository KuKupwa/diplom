import React from "react";
import { useStore } from "../store/StoreProvider";
import styled from "styled-components";

const SecurityInfoWallsWrapper = styled.div`
	display: flex;
	width: 400px;
	justify-content: space-between;
`;

const SecurityInfoWallsWrapperEl = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const ProgressWrapper = styled.div`
	display: flex;
	width: 180px;
	justify-content: space-between;
	align-items: center;
`;

const ProgressLine = styled.div`
	position: relative;
	width: 120px;
	height: 30px;
	background: linear-gradient(90deg, red 0%, yellow 50%, #09fb09 100%);
	border: 1px solid gray;
	border-radius: 8px;
`;

const Progress = styled.div`
	position: absolute;
	top: 0%;
	bottom: 0%;
	left: 60%;
	right: 0%;
	background: white;
	border-radius: 0 7px 7px 0;
`;

export const SecurityInfoWallsItem = () => {
	return (
		<div>
			<ProgressWrapper>
				<div>1</div>
				<ProgressLine>
					<Progress />
				</ProgressLine>
				<div>60%</div>
			</ProgressWrapper>
		</div>
	);
};

export const SecurityInfoWalls = () => {
	const { state } = useStore();

	return (
		<SecurityInfoWallsWrapper>
			<SecurityInfoWallsWrapperEl>
				<SecurityInfoWallsItem />
				<SecurityInfoWallsItem />
			</SecurityInfoWallsWrapperEl>
			<SecurityInfoWallsWrapperEl>
				<SecurityInfoWallsItem />
				<SecurityInfoWallsItem />
			</SecurityInfoWallsWrapperEl>
		</SecurityInfoWallsWrapper>
	);
};
