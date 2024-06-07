// src/App.js
import React from "react";
import RoomGenerator from "./components/RoomGenerator";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { StoreProvider } from "./store/StoreProvider";

const App = () => {
	return (
		<DndProvider backend={HTML5Backend}>
			<div>
				<StoreProvider>
					<RoomGenerator />
				</StoreProvider>
			</div>
		</DndProvider>
	);
};

export default App;
