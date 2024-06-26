import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDrag } from "react-dnd";
import { useStore } from "../store/StoreProvider";
import useCoverage from "../hooks/useCoverage";

import low from "../img/low.svg";
import medium from "../img/medium.svg";
import heigh from "../img/high.svg";

const DeviceContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const DeviceWrapper = styled.div`
	display: flex;
	flex-direction: row;
	gap: 10px;
	justify-content: left;
	text-align: left;
	white-space: nowrap;
	width: 100%;
	align-items: center;
`;

const Device = styled.div`
	width: 40px;
	height: 40px;
	background-size: cover;
	background-image: ${(props) =>
		props.type === "sensor"
			? `url(${low})`
			: props.type === "block"
			? `url(${medium})`
			: `url(${heigh})`};
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
		<DeviceWrapper>
			<Device
				ref={drag}
				type={device.type}
				style={{ opacity: isDragging ? 0.5 : 1 }}
			></Device>
			{device.name}
		</DeviceWrapper>
	);
};

const Devices = ({ addDevice }) => {
	const { wallsKoffSecurDeviceDataUpdate } = useStore();

	const [deviceData, setDeviceData] = useState([]);

	const res = useCoverage();

	console.log(res, "шумы генераторов");

	// wallsKoffSecurDeviceDataUpdate(res);

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
