import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDrag } from "react-dnd";

const DeviceContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Device = styled.div`
	width: 50px;
	height: 50px;
	background-color: ${(props) =>
		props.type === "sensor"
			? "#ff6347"
			: props.type === "block"
			? "#4682b4"
			: "#8a2be2"};
	margin: 10px;
	cursor: pointer;
`;

const DraggableDevice = ({ device }) => {
	const [{ isDragging }, drag] = useDrag({
		type: "DEVICE",
		item: { device },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	return (
		<Device
			ref={drag}
			type={device.type}
			style={{ opacity: isDragging ? 0.5 : 1 }}
		>
			{device.name}
		</Device>
	);
};

const Devices = ({ addDevice }) => {
	const [deviceData, setDeviceData] = useState([]);

	useEffect(() => {
		fetch("/devices.json")
			.then((response) => response.json())
			.then((data) => setDeviceData(data))
			.catch((error) => console.error("Error fetching devices data:", error));
	}, []);

	return (
		<DeviceContainer>
			{deviceData.map((device) => (
				<DraggableDevice
					key={device.id}
					device={device}
					onClick={() => addDevice(device)}
				/>
			))}
		</DeviceContainer>
	);
};

export default Devices;
