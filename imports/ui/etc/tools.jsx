import React from 'react';
export const FaSvgIcon = ({ faIcon, ...rest }) => {
	const { width, height, svgPathData } = faIcon;
	return (
		<svg {...rest} viewBox={`0 0 ${width} ${height}`} fill="currentColor">
			<path d={svgPathData}></path>
		</svg>
	);
};

export const PaginateArr = (array, limit, currPage) => {
	return array.slice((currPage - 1) * limit, currPage * limit);
};

export const toBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
