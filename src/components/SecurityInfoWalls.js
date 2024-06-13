import React, { useMemo } from "react";
import { useStore } from "../store/StoreProvider";
import styled from "styled-components";
import useSecurityCoefficient from "../hooks/useControlSecurity";

const SecurityInfoWallsWrapper = styled.div`
	display: flex;
	width: 450px;
	justify-content: space-between;
`;

const SecurityInfoWallsWrapperEl = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const ProgressWrapper = styled.div`
	display: flex;
	width: 200px;
	justify-content: space-between;
	align-items: center;
	gap: 5px;
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
	right: 0%;
	background: white;
	border-radius: 0 7px 7px 0;
	left: ${(props) => props.percent}%;
`;

export const SecurityInfoWallsItem = ({ percent, name }) => {
	return (
		<div>
			<ProgressWrapper>
				<div>{name}</div>
				<ProgressLine>
					<Progress percent={percent} />
				</ProgressLine>
				<div>{percent}%</div>
			</ProgressWrapper>
		</div>
	);
};

export const SecurityInfoWalls = () => {
	const { state } = useStore();
	// percentProgress
	const baseRes = useSecurityCoefficient();

	const secRes = useMemo(() => {
		return state.wallsKoffSecurDevice;
	}, [state.wallsKoffSecurDevice]);

	const checkPercent = (x) => {
		const x1 = state.securityData.insideNoise;
		const x2 = state.securityData.scammerNoise;

		const res = (1 - (x1 - x2 - x) / (x1 - x2)) * 100;

		return res > 100 ? 100 : res;
	};

	const progressSecurity = useMemo(() => {
		const data = [];
		if (baseRes.length && secRes.length) {
			for (let i = 0; i < baseRes.length; i++) {
				data.push({
					res: checkPercent(
						parseFloat(baseRes[i].percentProgress) +
							parseFloat(secRes[i].averageIsolation),
					),
					name: baseRes[i].wallName,
				});
			}
		}
		return data;
	}, [baseRes, secRes]);

	console.log(secRes, "progressSecurityprogressSecurityprogressSecurity");

	return (
		<SecurityInfoWallsWrapper>
			{progressSecurity.map((item, index) => {
				if (index % 2 === 0) {
					return (
						<SecurityInfoWallsWrapperEl key={index}>
							<SecurityInfoWallsItem
								percent={progressSecurity[index].res.toFixed(1)}
								name={progressSecurity[index].name}
							/>
							{progressSecurity[index + 1] && (
								<SecurityInfoWallsItem
									percent={progressSecurity[index + 1].res.toFixed(1)}
									name={progressSecurity[index + 1].name}
								/>
							)}
						</SecurityInfoWallsWrapperEl>
					);
				}
				return null;
			})}
		</SecurityInfoWallsWrapper>
	);
};
