import useLogger from "@hooks/useLogger";
import { Globals, REST, RouteSettings } from "@utils";
import React, { useEffect } from "react";
import { FieldPath, FieldValues, UseFormClearErrors, UseFormSetError } from "react-hook-form";

const getValidURL = (url: string) => {
	try {
		return new URL(url);
	} catch (e) {
		return undefined;
	}
};

export function useInstanceValidation<T extends FieldValues>(
	setError: UseFormSetError<T>,
	clearErrors: UseFormClearErrors<T>,
	instanceField: FieldPath<T> = "instance" as FieldPath<T>,
) {
	const logger = useLogger("InstanceValidation");
	const [debounce, setDebounce] = React.useState<NodeJS.Timeout | null>(null);
	const [isCheckingInstance, setCheckingInstance] = React.useState(false);

	const handleInstanceChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			clearErrors(instanceField);
			setCheckingInstance(false);

			// Clear existing debounce
			if (debounce) clearTimeout(debounce);

			const doRequest = async () => {
				const url = getValidURL(e.target.value);
				if (!url) return;
				setCheckingInstance(true);

				let endpoints: RouteSettings;
				try {
					endpoints = await REST.getEndpointsFromDomain(url);
				} catch (e) {
					setCheckingInstance(false);
					return setError(instanceField, {
						type: "manual",
						message: (e instanceof Error && e.message) || "Instance could not be resolved",
					} as any);
				}

				logger.debug(`Instance lookup has set routes to`, endpoints);
				Globals.routeSettings = endpoints;
				Globals.save();
				setCheckingInstance(false);
			};

			setDebounce(setTimeout(doRequest, 500));
		},
		[debounce, setError, clearErrors, instanceField, logger],
	);

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			if (debounce) clearTimeout(debounce);
		};
	}, [debounce]);

	return {
		handleInstanceChange,
		isCheckingInstance,
	};
}
