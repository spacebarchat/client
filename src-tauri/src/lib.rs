#[cfg(desktop)]
use tauri::Manager;

#[cfg(desktop)]
#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }

    // Show main window
    window.get_window("main").unwrap().show().unwrap();
}

#[cfg(mobile)]
#[tauri::command]
async fn close_splashscreen() {
    // just a dummy function for mobile
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![close_splashscreen])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
