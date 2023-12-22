use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{Manager, Runtime};
use tauri_plugin_updater::{Update, UpdaterExt};
use url::Url;

static UPDATE_INFO: Mutex<Option<Update>> = Mutex::new(None);

#[derive(Deserialize, Debug)]
struct Release {
    assets: Vec<Asset>,
    prerelease: bool,
}

#[derive(Deserialize, Debug)]
struct Asset {
    name: String,
    browser_download_url: String,
}

#[derive(Serialize, Debug, Clone)]
struct UpdateAvailable {
    version: String,
    body: Option<String>,
}

// ignore_version: String
#[tauri::command]
pub fn check_for_updates<R: Runtime>(ignore_prereleases: bool, window: tauri::Window<R>) {
    let handle = window.app_handle().clone();

    if !handle.config().tauri.bundle.updater.active {
        return;
    }

    match window.emit("CHECKING_FOR_UPDATE", Some(serde_json::json!({}))) {
        Ok(_) => {}
        Err(e) => {
            println!("[Updater] Failed to emit update checking event: {:?}", e);
        }
    }

    let package_path = handle
        .path()
        .app_local_data_dir()
        .unwrap()
        .join("update.sbcup");

    // if we already have an update package, remove it
    if package_path.exists() {
        clear_update_cache(window.clone());
    }

    tauri::async_runtime::spawn(async move {
        println!("[Updater] Searching for update file on github.");
        // Custom configure the updater.
        let github_releases_endpoint = "https://api.github.com/repos/spacebarchat/client/releases";
        let github_releases_endpoint = match Url::parse(github_releases_endpoint) {
            Ok(url) => url,
            Err(e) => {
                println!(
                    "[Updater] Failed to parse url: {:?}. Failed to check for updates",
                    e
                );
                emit_update_error(window, format!("Failed to parse url: {:?}", e));
                return;
            }
        };
        let client = reqwest::Client::new();
        let req = client
            .get(github_releases_endpoint.clone())
            .header("Content-Type", "application/json")
            // If this is not set you will get a 403 forbidden error.
            .header("User-Agent", "spacebar-client");
        let response = match req.send().await {
            Ok(response) => response,
            Err(e) => {
                println!(
                    "[Updater] Failed to send request: {:?}. Failed to check for updates",
                    e
                );
                emit_update_error(window, format!("Failed to send request: {:?}", e));
                return;
            }
        };

        if response.status() != reqwest::StatusCode::OK {
            println!(
                "[Updater] Non OK status code: {:?}. Failed to check for updates",
                response.status()
            );
            emit_update_error(
                window,
                format!("Non OK status code: {:?}", response.status()),
            );
            return;
        }
        let releases = match response.json::<Vec<Release>>().await {
            Ok(releases) => releases,
            Err(e) => {
                println!(
                    "[Updater] Failed to parse response: {:?}. Failed to check for updates",
                    e
                );
                emit_update_error(window, format!("Failed to parse response: {:?}", e));
                return;
            }
        };

        // check if there are any releases
        if releases.len() == 0 {
            println!("[Updater] No releases found. Failed to check for updates");
            match window.emit("UPDATE_NOT_AVAILABLE", Some({})) {
                Ok(_) => {}
                Err(e) => {
                    println!(
                        "[Updater] Failed to emit update not available event: {:?}",
                        e
                    );
                }
            }
            return;
        }

        // if ignore_prereleases is true, find first release that is not a prerelease, otherwise get the first release
        let latest_release = if ignore_prereleases {
            releases.iter().find(|release| !release.prerelease).unwrap()
        } else {
            releases.get(0).unwrap()
        };

        // Find an asset named "latest.json".
        let tauri_release_asset = latest_release
            .assets
            .iter()
            .find(|asset| asset.name == "latest.json");

        // If we found the asset, set it as the updater endpoint.
        let tauri_release_asset = match tauri_release_asset {
            Some(tauri_release_asset) => tauri_release_asset,
            None => {
                println!("[Updater] Failed to find latest.json asset. Failed to check for updates\n\nFound Assets are:");
                // Print a list of the assets found
                for asset in latest_release.assets.iter() {
                    println!("  {:?}", asset.name);
                }
                emit_update_error(
                    window,
                    format!("Failed to find latest.json asset. Failed to check for updates"),
                );
                return;
            }
        };

        let tauri_release_endpoint = match Url::parse(&tauri_release_asset.browser_download_url) {
            Ok(url) => url,
            Err(e) => {
                println!(
                    "[Updater] Failed to parse url: {:?}. Failed to check for updates",
                    e
                );
                emit_update_error(window, format!("Failed to parse url: {:?}", e));
                return;
            }
        };
        let updater_builder = match handle
            .updater_builder()
            .version_comparator(|current_version, latest_version| {
                println!("[Updater] Current version: {}", current_version);
                println!(
                    "[Updater] Latest version: {}",
                    latest_version.version.clone()
                );

				// if the current build is 00 then its a dev environment and we should not update
				if current_version.build.to_string() == "00" {
					println!("[Updater] Build ID is 00, looks like a development environment, not updating.");
					return false;
				}

				// upgrade
                if latest_version.version > current_version {
                    println!("[Updater] An update is available.");
                    return true;
                }

				// downgrade
                if latest_version.version < current_version {
                    println!("[Updater] The installed version is newer than the latest version. A little odd, but ok.");
                    return true;
                }

                return false;
            })
            .endpoints(vec![tauri_release_endpoint])
            .header("User-Agent", "spacebar-client")
        {
            Ok(updater_builder) => updater_builder,
            Err(e) => {
                println!(
                    "[Updater] Failed to build updater builder: {:?}. Failed to check for updates",
                    e
                );
                emit_update_error(window, format!("Failed to build updater builder: {:?}", e));
                return;
            }
        };

        let updater = match updater_builder.build() {
            Ok(updater) => updater,
            Err(e) => {
                println!(
                    "[Updater] Failed to build updater: {:?}. Failed to check for updates",
                    e
                );
                emit_update_error(window, format!("Failed to build updater: {:?}", e));
                return;
            }
        };

        println!("[Updater] Checking for updates");

        let response = updater.check().await;

        println!("[Updater] Update check response: {:?}", response);

        match response {
            Ok(Some(update)) => {
                // if ignore_version == update.version {
                //     println!("Ignoring update as user has asked to ignore this version.");
                //     return;
                // }
                UPDATE_INFO.lock().unwrap().replace(update.clone());

                // otherwise emit the update available event
                match window.emit("UPDATE_AVAILABLE", Some({})) {
                    Ok(_) => {}
                    Err(e) => {
                        println!("[Updater] Failed to emit update available event: {:?}", e);
                    }
                }

                return download_update(window).await;
            }
            Ok(None) => {
                println!("[Updater] No update available");
                match window.emit("UPDATE_NOT_AVAILABLE", Some({})) {
                    Ok(_) => {}
                    Err(e) => {
                        println!(
                            "[Updater] Failed to emit update not available event: {:?}",
                            e
                        );
                    }
                }
            }
            Err(e) => {
                println!("[Updater] Failed to check for updates: {:?}.", e);
                match window.emit("UPDATE_ERROR", Some(format!("{:?}", e))) {
                    Ok(_) => {}
                    Err(e) => {
                        println!("[Updater] Failed to emit update error event: {:?}", e);
                    }
                }
            }
        }
    });
}

#[tauri::command]
pub async fn download_update<R: Runtime>(window: tauri::Window<R>) {
    println!("[Updater] Downloading update package");

    let update = match UPDATE_INFO.lock().unwrap().clone() {
        Some(update) => update,
        None => {
            println!("[Updater] No update found to download");
            emit_update_error(window, format!("No update found to download"));
            return;
        }
    };

    // emit UPDATE_DOWNLOADING
    match window.emit("UPDATE_DOWNLOADING", Some({})) {
        Ok(_) => {}
        Err(e) => {
            println!("[Updater] Failed to emit update downloading event: {:?}", e);
        }
    }

    let on_chunk = |size: usize, progress: Option<u64>| {
        println!(
            "[Updater] Received chunk: size={}, progress={:?}",
            size, progress
        );
    };

    let on_download_finish = || {
        println!("[Updater] Download finished!");
    };

    let download_response = update.download(on_chunk, on_download_finish).await;

    if let Err(e) = download_response {
        println!("[Updater] Failed to download update: {:?}", e);
        emit_update_error(window, format!("Failed to download update: {:?}", e));
        return;
    } else {
        println!("[Updater] Update downloaded");

        let handle = window.app_handle().clone();
        let package_path = handle
            .path()
            .app_local_data_dir()
            .unwrap()
            .join("update.sbcup");
        println!("[Updater] Saving update package to {:?}", package_path);

        // store download_response bytes to a file
        match std::fs::write(package_path.clone(), download_response.unwrap()) {
            Ok(_) => {}
            Err(e) => {
                println!("[Updater] Failed to save update package: {:?}", e);
                emit_update_error(window, format!("Failed to save update package: {:?}", e));
                return;
            }
        }
    }

    match window.emit(
        "UPDATE_DOWNLOADED",
        Some(UpdateAvailable {
            version: update.version.clone(),
            body: update.body.clone(),
        }),
    ) {
        Ok(_) => {}
        Err(e) => {
            println!("[Updater] Failed to emit update downloaded event: {:?}", e);
        }
    }
}

#[tauri::command]
pub async fn install_update<R: Runtime>(window: tauri::Window<R>) {
    println!("[Updater] Installing update package");

    let update = match UPDATE_INFO.lock().unwrap().clone() {
        Some(update) => update,
        None => {
            println!("[Updater] No update found to install");
            emit_update_error(window, format!("No update found to install"));
            return;
        }
    };

    let handle = window.app_handle().clone();
    let package_path = handle
        .path()
        .app_local_data_dir()
        .unwrap()
        .join("update.sbcup");

    // check if the update package exists
    if !package_path.exists() {
        println!("[Updater] No pending update found to install");
        emit_update_error(window, format!("No pending update found to install"));
        return;
    }

    // read in the update package bytes
    let bytes = match std::fs::read(package_path.clone()) {
        Ok(bytes) => bytes,
        Err(e) => {
            println!("[Updater] Failed to read update package: {:?}", e);
            emit_update_error(window, format!("Failed to read update package: {:?}", e));
            return;
        }
    };

    let install_response = update.install(bytes);

    if let Err(e) = install_response {
        println!("[Updater] Failed to install update: {:?}", e);
        emit_update_error(window, format!("Failed to install update: {:?}", e));
    } else {
        println!("[Updater] Update installed");

        // remove the update package
        match std::fs::remove_file(package_path) {
            Ok(_) => {}
            Err(e) => {
                println!("[Updater] Failed to remove update package: {:?}", e);
                emit_update_error(window, format!("Failed to remove update package: {:?}", e));
            }
        }
    }
}

#[tauri::command]
pub fn clear_update_cache<R: Runtime>(window: tauri::Window<R>) {
    let handle = window.app_handle().clone();
    let package_path = handle
        .path()
        .app_local_data_dir()
        .unwrap()
        .join("update.sbcup");

    // check if the update package exists
    if !package_path.exists() {
        println!("[Updater] No pending update found to clear");
        return;
    }

    // remove the update package
    match std::fs::remove_file(package_path) {
        Ok(_) => {}
        Err(e) => {
            println!("[Updater] Failed to remove update package: {:?}", e);
            emit_update_error(window, format!("Failed to remove update package: {:?}", e));
        }
    }
}

// utility function to emit UPDATE_ERROR
fn emit_update_error<R: Runtime>(window: tauri::Window<R>, error: String) {
    match window.emit("UPDATE_ERROR", Some(error)) {
        Ok(_) => {}
        Err(e) => {
            println!("[Updater] Failed to emit update error event: {:?}", e);
        }
    }
}
