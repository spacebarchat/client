import { BaseEditor, BaseRange, Descendant } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

export type EmptyText = {
	text: string;
};

export type CustomText = {
	bold?: boolean;
	italic?: boolean;
	code?: boolean;
	text: string;
};

export type ParagraphElement = {
	type: "paragraph";
	align?: string;
	children: Descendant[];
};

type CustomElement = ParagraphElement;
export type CustomEditor = BaseEditor &
	ReactEditor &
	HistoryEditor & {
		nodeToDecorations?: Map<Element, Range[]>;
	};

declare module "slate" {
	interface CustomTypes {
		Editor: CustomEditor;
		Element: CustomElement;
		Text: CustomText | EmptyText;
		Range: BaseRange & {
			[key: string]: unknown;
		};
	}
}
