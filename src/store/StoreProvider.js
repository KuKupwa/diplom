import { createContext, useContext, useState } from "react";

/**
 * RoomData - содержит информацию о основных размерах комнаты
 * MaterialsData - содержит информацию о материалах
 */

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
	const [state, setState] = useState({
		roomData: {},
		materialsData: {},
		hoveredElementData: null,
	});

	const roomDataUpdate = (roomInfo) => {
		setState((prevState) => ({
			...prevState,
			roomData: roomInfo,
		}));
	};

	const materialDataUpdate = (materialsInfo) => {
		setState((prevState) => ({
			...prevState,
			materialsData: materialsInfo,
		}));
	};

	const hoveredElementDataUpdate = (hoveredElementData) => {
		setState((prevState) => ({
			...prevState,
			hoveredElementData,
		}));
	};

	return (
		<StoreContext.Provider
			value={{
				state,
				roomDataUpdate,
				materialDataUpdate,
				hoveredElementDataUpdate,
			}}
		>
			{children}
		</StoreContext.Provider>
	);
};

export const useStore = () => useContext(StoreContext);
