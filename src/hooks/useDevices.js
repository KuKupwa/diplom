import { useState } from "react";

const useDevices = () => {
	const [devices, setDevices] = useState([]);
	const [showCoverage, setShowCoverage] = useState(false);

	const addDevice = (device, x, y) => {
		const newDevice = { ...device, id: Date.now(), x, y };
		setDevices([...devices, newDevice]);
	};

	const moveDevice = (id, x, y) => {
		setDevices(
			devices.map((device) =>
				device.id === id ? { ...device, x, y } : device,
			),
		);
	};

	const removeDevice = (id) => {
		setDevices(devices.filter((device) => device.id !== id));
	};

	const toggleCoverage = () => {
		setShowCoverage(!showCoverage);
	};

	return {
		devices,
		addDevice,
		moveDevice,
		removeDevice,
		showCoverage,
		toggleCoverage,
	};
};

export default useDevices;
