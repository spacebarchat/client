function SkeletonLoader() {
	return (
		<svg
			role="img"
			width="560"
			height="66"
			aria-labelledby="loading-aria"
			viewBox="0 0 560 66"
			preserveAspectRatio="none"
			fill="#121212"
		>
			<title id="loading-aria">Loading...</title>
			<rect x="0" y="0" width="100%" height="100%" clip-path="url(#clip-path)"></rect>
			<defs>
				<clipPath id="clip-path">
					<circle cx="32" cy="18" r="16" />
					<rect x="60" y="10" rx="4" ry="4" width="90" height="7" />
					<rect x="160" y="10" rx="4" ry="4" width="110" height="7" />
					<rect x="60" y="31" rx="3" ry="3" width="400" height="6" />
					<rect x="60" y="42" rx="3" ry="3" width="270" height="6" />
				</clipPath>
			</defs>
		</svg>
	);
}

export default SkeletonLoader;
