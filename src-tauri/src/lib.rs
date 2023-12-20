#[cfg(desktop)]
use tauri::Manager;
mod tray;

#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    #[cfg(desktop)]
    {
        // Close splashscreen
        if let Some(splashscreen) = window.get_window("splashscreen") {
            splashscreen.close().unwrap();
        }

        // Show main window
        window.get_window("main").unwrap().show().unwrap();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    std::env::set_var("RUST_BACKTRACE", "1");
    std::env::set_var("RUST_LOG", "debug");

    tauri::Builder::default()
        .setup(move |app| {
            #[cfg(desktop)]
            {
                let handle = app.handle();
                tray::create_tray(handle)?;
            }

            Ok(())
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![close_splashscreen,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
