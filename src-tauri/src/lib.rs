use tauri::RunEvent;
#[cfg(desktop)]
use tauri::{AppHandle, Env, Manager};
use tauri_plugin_log::{Target, TargetKind, WEBVIEW_TARGET};

#[macro_use]
mod tray;
mod updater;

#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    #[cfg(desktop)]
    {
        // Close splashscreen
        if let Some(splashscreen) = window.get_window("splashscreen") {
            splashscreen.close().unwrap();
        }

        // Show main window
        let main_window = window.get_window("main").unwrap();
        main_window.show().unwrap();
        // Open the dev tools automatically when debugging the application
        #[cfg(debug_assertions)]
        main_window.open_devtools();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    std::env::set_var("RUST_BACKTRACE", "1");
    std::env::set_var("RUST_LOG", "debug");

    let mut context = tauri::generate_context!();

    let config = context.config_mut();

    let mut app = tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        // Add logging plugin
        .plugin(
            tauri_plugin_log::Builder::default()
                .clear_targets()
                .targets([
                    Target::new(TargetKind::Webview),
                    Target::new(TargetKind::LogDir {
                        file_name: Some("webview".into()),
                    })
                    .filter(|metadata| metadata.target() == WEBVIEW_TARGET),
                    Target::new(TargetKind::LogDir {
                        file_name: Some("rust".into()),
                    })
                    .filter(|metadata| metadata.target() != WEBVIEW_TARGET),
                ])
                .format(move |out, message, record| {
                    out.finish(format_args!(
                        "{} [{}] {}",
                        chrono::Local::now().format("%Y-%m-%d %H:%M:%S"),
                        record.level(),
                        message
                    ));
                })
                .level(log::LevelFilter::Info)
                .build(),
        );

    if config.tauri.bundle.updater.active {
        app = app.plugin(tauri_plugin_updater::Builder::new().build());
    }

    let app = app
        .setup(move |app| {
            #[cfg(desktop)]
            {
                // Tray
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
        .invoke_handler(tauri::generate_handler![
            close_splashscreen,
            updater::check_for_updates,
            updater::download_update,
            updater::install_update,
            updater::clear_update_cache
        ])
        .build(context)
        .expect("error while running tauri application");

    #[cfg(desktop)]
    app.run(|app_handle, e| match e {
        RunEvent::Ready => {
            #[cfg(any(target_os = "macos", debug_assertions))]
            let window = app_handle.get_window("main").unwrap();

            #[cfg(debug_assertions)]
            window.open_devtools();

            println!("App is ready");
        }
        _ => {}
    });
}
