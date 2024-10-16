// adapted from https://github.com/revoltchat/revite/blob/master/src/controllers/modals/ModalController.tsx

import {
	AddServerModal,
	BanMemberModal,
	CreateChannelModel,
	CreateInviteModal,
	CreateServerModal,
	DeleteMessageModal,
	ErrorModal,
	ImageViewerModal,
	JoinServerModal,
	KickMemberModal,
	LeaveServerModal,
	SettingsModal,
} from "@components/modals";
import { action, computed, makeObservable, observable } from "mobx";
import { Modal } from "./types";

function randomUUID() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		// eslint-disable-next-line no-bitwise
		const r = (Math.random() * 16) | 0;
		// eslint-disable-next-line no-bitwise, no-mixed-operators
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Components = Record<string, React.FC<any>>;

/**
 * Handles layering and displaying modals to the user.
 */
class ModalController<T extends Modal> {
	stack: T[] = [];
	components: Components;

	constructor(components: Components) {
		this.components = components;

		makeObservable(this, {
			stack: observable,
			push: action,
			pop: action,
			remove: action,
			rendered: computed,
			isVisible: computed,
		});

		this.close = this.close.bind(this);
		this.closeAll = this.closeAll.bind(this);
	}

	/**
	 * Display a new modal on the stack
	 * @param modal Modal data
	 */
	push(modal: T) {
		this.stack = [
			...this.stack,
			{
				...modal,
				key: randomUUID(), // TODO:
			},
		];
	}

	/**
	 * Remove the top modal from the screen
	 * @param signal What action to trigger
	 */
	pop(signal: "close" | "confirm" | "force") {
		this.stack = this.stack.map((entry, index) => (index === this.stack.length - 1 ? { ...entry, signal } : entry));
	}

	/**
	 * Close the top modal
	 */
	close() {
		this.pop("close");
	}

	/**
	 * Close all modals on the stack
	 */
	closeAll() {
		this.stack = [];
	}

	/**
	 * Remove the keyed modal from the stack
	 */
	remove(key: string) {
		this.stack = this.stack.filter((x) => x.key !== key);
	}

	/**
	 * Render modals
	 */
	get rendered() {
		return (
			<>
				{this.stack.map(({ key, ...rest }) => {
					const Component = this.components[rest.type];
					if (!Component) return null;
					return <Component key={key} {...rest} onClose={() => this.remove(key!)} />;
				})}
			</>
		);
	}

	/**
	 * Whether a modal is currently visible
	 */
	get isVisible() {
		return this.stack.length > 0;
	}
}

/**
 * Modal controller with additional helpers.
 */
class ModalControllerExtended extends ModalController<Modal> {
	/**
	 * Write text to the clipboard
	 * @param text Text to write
	 */
	writeText(text: string) {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(text);
		} else {
			this.push({
				type: "clipboard",
				text,
			});
		}
	}
}

export const modalController = new ModalControllerExtended({
	add_server: AddServerModal,
	// add_friend: AddFriend,
	ban_member: BanMemberModal,
	// changelog: Changelog,
	// channel_info: ChannelInfo,
	// clipboard: Clipboard,
	// leave_group: ConfirmLeave,
	// close_dm: Confirmation,
	leave_server: LeaveServerModal,
	// delete_server: Confirmation,
	// delete_channel: Confirmation,
	// delete_bot: Confirmation,
	// block_user: Confirmation,
	// unfriend_user: Confirmation,
	// create_category: CreateCategory,
	create_channel: CreateChannelModel,
	// create_group: CreateGroup,
	create_invite: CreateInviteModal,
	// create_role: CreateRole,
	create_server: CreateServerModal,
	join_server: JoinServerModal,
	// create_bot: CreateBot,
	// custom_status: CustomStatus,
	delete_message: DeleteMessageModal,
	error: ErrorModal,
	image_viewer: ImageViewerModal,
	kick_member: KickMemberModal,
	// link_warning: LinkWarning,
	// mfa_flow: MFAFlow,
	// mfa_recovery: MFARecovery,
	// mfa_enable_totp: MFAEnableTOTP,
	// modify_account: ModifyAccount,
	// onboarding: OnboardingModal,
	// out_of_date: OutOfDate,
	// pending_friend_requests: PendingFriendRequests,
	// server_identity: ServerIdentity,
	// server_info: ServerInfo,
	// show_token: ShowToken,
	// signed_out: SignedOut,
	// sign_out_sessions: SignOutSessions,
	// user_picker: UserPicker,
	// user_profile: UserProfile,
	// report: ReportContent,
	// report_success: ReportSuccess,
	// modify_displayname: ModifyDisplayname,
	// changelog_usernames: ChangelogUsernames,
	settings: SettingsModal,
});
