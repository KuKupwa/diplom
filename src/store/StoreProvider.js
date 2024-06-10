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
		securityInfo: {},
		devices: {},
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
			hoveredElementData: hoveredElementData,
		}));
	};

	const securityDataUpdate = (securityData) => {
		setState((prevState) => ({
			...prevState,
			securityData: securityData,
		}));
	};

	const devicesDataUpdate = (devicesData) => {
		setState((prevState) => ({
			...prevState,
			devices: devicesData,
		}));
	};

	return (
		<StoreContext.Provider
			value={{
				state,
				roomDataUpdate,
				materialDataUpdate,
				hoveredElementDataUpdate,
				securityDataUpdate,
				devicesDataUpdate,
			}}
		>
			{children}
		</StoreContext.Provider>
	);
};

export const useStore = () => useContext(StoreContext);
