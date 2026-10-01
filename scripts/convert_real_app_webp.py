import os
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')
TEMP_DIR = os.path.join(BASE_DIR, 'temp_apk_assets')

TARGET_SIZE = (824, 1830)

def convert_to_webp(src_path, dest_path, resize=True):
    print(f"Converting {src_path} -> {dest_path}")
    img = Image.open(src_path).convert('RGB')
    if resize and img.size != TARGET_SIZE:
        img = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
    img.save(dest_path, 'WEBP', quality=95, method=6)
    print(f"Saved: {dest_path} ({img.size})")

def main():
    # 1. Loading screen from app boot capture
    boot_png = os.path.join(TEMP_DIR, 'app_boot_capture.png')
    loading_webp = os.path.join(ASSETS_DIR, 'loading_screenshot.webp')
    convert_to_webp(boot_png, loading_webp)

    # 2. Home screen (already captured directly to home_screenshot.webp from real app)
    home_webp = os.path.join(ASSETS_DIR, 'home_screenshot.webp')
    img = Image.open(home_webp)
    if img.size != TARGET_SIZE:
        convert_to_webp(home_webp, home_webp)
    else:
        print(f"Home screenshot already verified: {home_webp} ({img.size})")

    # 3. Search screen from real search capture
    search_png = os.path.join(TEMP_DIR, 'real_search_capture.png')
    search_webp = os.path.join(ASSETS_DIR, 'explore_search_screenshot.webp')
    convert_to_webp(search_png, search_webp)

    # 4. Live TV screen from real Live TV capture
    livetv_png = os.path.join(TEMP_DIR, 'real_livetv_capture.png')
    livetv_webp = os.path.join(ASSETS_DIR, 'livetv_screenshot.webp')
    convert_to_webp(livetv_png, livetv_webp)

    # 5. Player screen from real player screenshot
    player_png = os.path.join(ASSETS_DIR, 'player_screenshot.png')
    player_webp = os.path.join(ASSETS_DIR, 'player_screenshot.webp')
    convert_to_webp(player_png, player_webp)

    # 6. Security scan screen from play protect capture
    protect_png = os.path.join(TEMP_DIR, 'play_protect_screen.png')
    protect_webp = os.path.join(ASSETS_DIR, 'security_scan_screenshot.webp')
    convert_to_webp(protect_png, protect_webp)

    print("ALL 6 REAL APP SCREENSHOTS SUCCESSFULLY CONVERTED TO WEBP!")

if __name__ == '__main__':
    main()
