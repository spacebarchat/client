#[cfg(desktop)]
use tauri::Manager;

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
        .invoke_handler(tauri::generate_handler![close_splashscreen,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
