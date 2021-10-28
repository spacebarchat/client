// -----------------------------------------------------------------------------

import { PixelRatio } from "react-native";

const RE_MEDIA_QUERY = /^(?:(only|not)?\s*([_a-z][_a-z0-9-]*)|(\([^\)]+\)))(?:\s*and\s*(.*))?$/i,
	RE_MQ_EXPRESSION = /^\(\s*([_a-z-][_a-z0-9-]*)\s*(?:\:\s*([^\)]+))?\s*\)$/,
	RE_MQ_FEATURE = /^(?:(min|max)-)?(.+)/,
	RE_LENGTH_UNIT = /(em|rem|px|cm|mm|in|pt|pc)?\s*$/,
	RE_RESOLUTION_UNIT = /(dpi|dpcm|dppx)?\s*$/;

export function matchQuery(mediaQuery, values) {
	return parseQuery(mediaQuery).some(function (query) {
		var inverse = query.inverse;

		// Either the parsed or specified `type` is "all", or the types must be
		// equal for a match.
		var typeMatch = query.type === "all" || values.type === query.type;

		// Quit early when `type` doesn't match, but take "not" into account.
		if ((typeMatch && inverse) || !(typeMatch || inverse)) {
			return false;
		}

		var expressionsMatch = query.expressions.every(function (expression) {
			var feature = expression.feature,
				modifier = expression.modifier,
				expValue = expression.value,
				value = values[feature];

			// Missing or falsy values don't match.
			if (!value) {
				return false;
			}

			switch (feature) {
				case "any-hover":
				case "any-pointer":
				case "prefers-color-scheme":
				case "prefers-contrast":
				case "prefers-reduced-data":
				case "prefers-reduced-motion":
				case "prefers-reduced-transparency":
				case "hover":
				case "inverted-colors":
				case "pointer":
				case "display-mode":
				case "orientation":
				case "scan":
					return value.toLowerCase() === expValue.toLowerCase();

				case "width":
				case "height":
				case "device-width":
				case "device-height":
					expValue = toPx(expValue);
					value = toPx(value);
					break;

				case "resolution":
					expValue = toDpi(expValue);
					value = toDpi(value);
					break;

				case "aspect-ratio":
				case "device-aspect-ratio":
				case /* Deprecated */ "device-pixel-ratio":
					expValue = toDecimal(expValue);
					value = toDecimal(value);
					break;

				case "grid":
				case "color":
				case "color-index":
				case "monochrome":
					expValue = parseInt(expValue, 10) || 1;
					value = parseInt(value, 10) || 0;
					break;
			}

			switch (modifier) {
				case "min":
					return value >= expValue;
				case "max":
					return value <= expValue;
				default:
					return value === expValue;
			}
		});

		return (expressionsMatch && !inverse) || (!expressionsMatch && inverse);
	});
}

export function parseQuery(mediaQuery) {
	return mediaQuery.split(",").map(function (query) {
		query = query.trim();

		var captures = query.match(RE_MEDIA_QUERY);

		// Media Query must be valid.
		if (!captures) {
			throw new SyntaxError('Invalid CSS media query: "' + query + '"');
		}

		var modifier = captures[1],
			type = captures[2],
			expressions = ((captures[3] || "") + (captures[4] || "")).trim(),
			parsed = {};

		parsed.inverse = !!modifier && modifier.toLowerCase() === "not";
		parsed.type = type ? type.toLowerCase() : "all";

		// Check for media query expressions.
		if (!expressions) {
			parsed.expressions = [];
			return parsed;
		}

		// Split expressions into a list.
		expressions = expressions.match(/\([^\)]+\)/g);

		// Media Query must be valid.
		if (!expressions) {
			throw new SyntaxError('Invalid CSS media query: "' + query + '"');
		}

		parsed.expressions = expressions.map(function (expression) {
			var captures = expression.match(RE_MQ_EXPRESSION);

			// Media Query must be valid.
			if (!captures) {
				throw new SyntaxError('Invalid CSS media query: "' + query + '"');
			}

			var feature = captures[1].toLowerCase().match(RE_MQ_FEATURE);

			return {
				modifier: feature[1],
				feature: feature[2],
				value: captures[2],
			};
		});

		return parsed;
	});
}

// -- Utilities ----------------------------------------------------------------

function toDecimal(ratio) {
	var decimal = Number(ratio),
		numbers;

	if (!decimal) {
		numbers = ratio.match(/^(\d+)\s*\/\s*(\d+)$/);
		decimal = numbers[1] / numbers[2];
	}

	return decimal;
}

function toDpi(resolution) {
	var value = parseFloat(resolution),
		units = String(resolution).match(RE_RESOLUTION_UNIT)[1];

	switch (units) {
		case "dpcm":
			return value / 2.54;
		case "dppx":
			return value * 96;
		default:
			return value;
	}
}

export function toPx(length) {
	var value = parseFloat(length);
	if (isNaN(value)) return;
	var units = String(length).match(RE_LENGTH_UNIT)[1];

	switch (units) {
		case "em":
			return value * 16;
		case "rem":
			return value * 16;
		case "cm":
			return (value * 96) / 2.54;
		case "mm":
			return (value * 96) / 2.54 / 10;
		case "in":
			return value * 96;
		case "pt":
			return value * 72;
		case "pc":
			return (value * 72) / 12;
		default:
			return value;
	}
}
