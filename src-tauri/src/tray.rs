use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, Runtime,
};

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let branding = MenuItem::with_id(app, "name", "Spacebar", false, None::<String>)?;
    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<String>)?;
    let menu1 = Menu::with_items(app, &[&branding, &quit_i])?;

    let _ = TrayIconBuilder::with_id("main")
        .tooltip("Spacebar")
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu1)
        .menu_on_left_click(false)
        .on_menu_event(move |app, event| match event.id.as_ref() {
            "quit" => {
                app.exit(0);
            }

            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .build(app);

    Ok(())
}
