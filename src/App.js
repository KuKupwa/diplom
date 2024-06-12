// src/App.js
import React from "react";
import RoomGenerator from "./components/RoomGenerator";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { StoreProvider } from "./store/StoreProvider";
import { SecurityInfoWalls } from "./components/SecurityInfoWalls";
import styled from "styled-components";

const Wrapper = styled.div`
	margin: 0 auto;
	margin-top: 100px;
	width: calc(100% - 100px);
	display: flex;
	flex-direction: column;
	gap: 20px;
	align-items: center;
	color: white;
`;

const App = () => {
	return (
		<DndProvider backend={HTML5Backend}>
			<Wrapper>
				<StoreProvider>
					<RoomGenerator />
					<SecurityInfoWalls />
				</StoreProvider>
			</Wrapper>
		</DndProvider>
	);
};

export default App;
