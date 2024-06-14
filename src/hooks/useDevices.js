import { useState } from "react";
import { useStore } from "../store/StoreProvider";

const useDevices = () => {
	const [devices, setDevices] = useState([]);
	const { devicesDataUpdate } = useStore();
	console.log(devices);
	const [showCoverage, setShowCoverage] = useState(true);

	const addDevice = (device, x, y) => {
		const newDevice = { ...device, id: Date.now(), x, y };
		setDevices([...devices, newDevice]);
		devicesDataUpdate([...devices, newDevice]);
	};

	const moveDevice = (id, x, y) => {
		setDevices(
			devices.map((device) =>
				device.id === id ? { ...device, x, y } : device,
			),
		);
		devicesDataUpdate(
			devices.map((device) =>
				device.id === id ? { ...device, x, y } : device,
			),
		);
	};

	const removeDevice = (id) => {
		setDevices(devices.filter((device) => device.id !== id));
		devicesDataUpdate(devices.filter((device) => device.id !== id));
	};

	const clearDevices = () => {
		setDevices([]);
		devicesDataUpdate([]);
	};

	const toggleCoverage = () => {
		setShowCoverage(!showCoverage);
	};

	return {
		devices,
		addDevice,
		moveDevice,
		removeDevice,
		clearDevices,
		showCoverage,
		toggleCoverage,
	};
};

export default useDevices;
