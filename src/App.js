// src/App.js
import React from "react";
import RoomGenerator from "./components/RoomGenerator";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { StoreProvider } from "./store/StoreProvider";
import { SecurityInfoWalls } from "./components/SecurityInfoWalls";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

const Wrapper = styled.div`
	margin: 0 auto;
	margin-top: 100px;
	width: calc(100% - 100px);
	display: flex;
	flex-direction: column;
	gap: 40px;
	align-items: center;
	color: white;
`;

const Warning = styled.div`
	width: max-content;
	background: white;
	height: max-content;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 20px;
	border-radius: 8px;
	font-weight: 700;
`;

const WarningWrapper = styled.div`
	width: 100vw;
	height: 100vh;
	position: relative;
`;

const App = () => {
	return (
		<>
			{!isMobile ? (
				<DndProvider backend={HTML5Backend}>
					<Wrapper>
						<StoreProvider>
							<RoomGenerator />
							<SecurityInfoWalls />
						</StoreProvider>
					</Wrapper>
				</DndProvider>
			) : (
				<WarningWrapper>
					<Warning>Устройство не поддерживается</Warning>
				</WarningWrapper>
			)}
		</>
	);
};

export default App;
