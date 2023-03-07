// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use photon_rs;
use std::fs;
#[derive(serde::Deserialize, Debug)]
struct Data<'a> {
    height: u32,
    width: u32,
    name: &'a str,
    raw_data: &'a str,
    extension: &'a str,
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![final_resizer_images])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn final_resizer_images(data: Data) -> String {
    let current_directory = std::env::current_dir().unwrap().display().to_string();
    let final_image = photon_rs::transform::resize(
        &photon_rs::base64_to_image(data.raw_data),
        data.height,
        data.width,
        photon_rs::transform::SamplingFilter::Nearest,
    );

    if !std::path::Path::new("image_store").exists() {
        fs::create_dir("image_store").unwrap();
    }
    if data.extension.is_empty() {
        photon_rs::native::save_image(final_image, &format!("image_store/{}.png", data.name));
    } else {
        photon_rs::native::save_image(
            final_image,
            &format!("image_store/{}{}", data.name, data.extension),
        );
    }
    format!("{current_directory}/image_store/")
}
