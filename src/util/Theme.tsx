// TODO: check if theme has correct structure
export function normalizeTheme<T extends any>(theme: T): T {
	const t = theme as any;
	if (!theme) return theme;
	if (!t.components) t.components = {};
	t.components.KeyboardAvoidingView = t.components.View;
	t.components.Box = t.components.View;

	return theme;
}
