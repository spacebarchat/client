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

    tauri::async_runtime::spawn(async move {
        println!("Searching for update file on github.");
        // Custom configure the updater.
        let github_releases_endpoint = "https://api.github.com/repos/spacebarchat/client/releases";
        let github_releases_endpoint = match Url::parse(github_releases_endpoint) {
            Ok(url) => url,
            Err(e) => {
                println!("Failed to parse url: {:?}. Failed to check for updates", e);
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
                    "Failed to send request: {:?}. Failed to check for updates",
                    e
                );
                return;
            }
        };

        if response.status() != reqwest::StatusCode::OK {
            println!(
                "Non OK status code: {:?}. Failed to check for updates",
                response.status()
            );
            return;
        }
        let releases = match response.json::<Vec<Release>>().await {
            Ok(releases) => releases,
            Err(e) => {
                println!(
                    "Failed to parse response: {:?}. Failed to check for updates",
                    e
                );
                return;
            }
        };

        // check if there are any releases
        if releases.len() == 0 {
            println!("No releases found. Failed to check for updates");
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
                println!("Failed to find latest.json asset. Failed to check for updates\n\nFound Assets are:");
                // Print a list of the assets found
                for asset in latest_release.assets.iter() {
                    println!("  {:?}", asset.name);
                }
                return;
            }
        };

        let tauri_release_endpoint = match Url::parse(&tauri_release_asset.browser_download_url) {
            Ok(url) => url,
            Err(e) => {
                println!("Failed to parse url: {:?}. Failed to check for updates", e);
                return;
            }
        };
        let updater_builder = match handle
            .updater_builder()
            .version_comparator(|current_version, latest_version| {
                println!("Current version: {}", current_version);
                println!("Latest version: {}", latest_version.version.clone());

                if latest_version.version > current_version {
                    println!("Latest version is greater than current version. ");
                    return true;
                }

                if latest_version.version < current_version {
                    println!("Latest version is lower than current version. ");
                    return false;
                }

                return latest_version.version.build > current_version.build;
            })
            .endpoints(vec![tauri_release_endpoint])
            .header("User-Agent", "spacebar-client")
        {
            Ok(updater_builder) => updater_builder,
            Err(e) => {
                println!(
                    "Failed to build updater builder: {:?}. Failed to check for updates",
                    e
                );
                return;
            }
        };

        let updater = match updater_builder.build() {
            Ok(updater) => updater,
            Err(e) => {
                println!(
                    "Failed to build updater: {:?}. Failed to check for updates",
                    e
                );
                return;
            }
        };

        println!("Checking for updates");

        let response = updater.check().await;

        println!("Update check response: {:?}", response);

        match response {
            Ok(Some(update)) => {
                // if ignore_version == update.version {
                //     println!("Ignoring update as user has asked to ignore this version.");
                //     return;
                // }
                UPDATE_INFO.lock().unwrap().replace(update.clone());

                match window.emit(
                    "UPDATE_AVAILABLE",
                    Some(UpdateAvailable {
                        version: update.version,
                        body: update.body,
                    }),
                ) {
                    Ok(_) => {}
                    Err(e) => {
                        println!("Failed to emit update available event: {:?}", e);
                    }
                }
            }
            _ => {}
        }
    });
}

#[tauri::command]
pub async fn install_update<R: Runtime>(_window: tauri::Window<R>) {
    println!("Downloading and installing update!");

    let update = match UPDATE_INFO.lock().unwrap().clone() {
        Some(update) => update,
        None => {
            println!("No update found to install");
            return;
        }
    };

    let install_response = update.download_and_install(|_, _| {}, || {}).await;
    if let Err(e) = install_response {
        println!("Failed to install update: {:?}", e);
    } else {
        println!("Update installed");
    }
}
